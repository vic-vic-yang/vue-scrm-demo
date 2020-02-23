<template>
  <div class="app-container order-list">
      <div class="control-group">
        <el-form :inline="true" ref="orderQueryFrm" :model="orderQueryFrm">
          <el-form-item prop="card_number" label="兑换编码">
            <el-input placeholder="兑换编码" v-model="orderQueryFrm.card_number"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码">
            <el-input placeholder="手机号码" v-model="orderQueryFrm.phone"></el-input>
          </el-form-item>
          <el-form-item prop="user_name" label="用户名">
            <el-input placeholder="用户名" v-model="orderQueryFrm.user_name"></el-input>
          </el-form-item>
          <el-form-item prop="goods_name" label="商品名称">
            <el-input placeholder="商品名称" v-model="orderQueryFrm.goods_name"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="兑换时间">
            <el-date-picker
              :editable="false"
              v-model="orderQueryFrm.time"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchOrderList" icon="el-icon-search">查询</el-button>
            <el-button @click="resetForm('orderQueryFrm')" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <custom-el-table
        v-loading="tabLoading"
        v-model="pageIndex"
        :tableData="tableData"
        :tableOptions="tableOptions"
        :total="totalCount"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import exchange from '@/api/integralMall/exchange';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'orderList',
    components: {
      customElTable
    },
    data() {
      return {
        orderQueryFrm: {
          search_type: 1,
          card_number: '',
          phone: '',
          user_name: '',
          goods_name: '',
          time: []
        },
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '商品',
            prop: 'goods',
            options: {
              type: 'html'
            }
          },
          {
            label: '单价/数量',
            prop: 'price_num'
          },
          {
            label: '兑换积分',
            prop: 'pay_price'
          },
          {
            label: '兑换时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            label: '买家信息',
            prop: 'user_info',
            options: {
              type: 'html'
            }
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        conditionType: 'order_number',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        query: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        exchange.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              goods: `<div class="goods-info" style="display: flex;justify-content: flex-start;align-items: center;">
                    <div class="img"><img width="96px" height="80px" src="${item.goods_info.pic[0].file_path}" alt=""/></div>
                    <div class="content" style="margin-left: 30px; text-align: left;display: flex;flex-direction: column;justify-content: space-between;">
                      <p>兑换码：${item.card_info.card_number || ''}</p>
                      <p>${item.goods_info.name || ''}</p>
                    </div>
                  <div>`,
              price_num: `${item.order_goods_info.integral} / ${item.order_goods_info.num}`,
              pay_price: item.integral,
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time),
              user_info: item.user_name || item.nick_name
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
        setTimeout(() => {
          this.tabLoading = false;
        }, 1500);
      },
      searchOrderList() {
        this.query = _.cloneDeep(this.orderQueryFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'order_start_time', time[0] || '');
        this.$set(this.query, 'order_end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
