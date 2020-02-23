<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-16 14:37:18
 * @LastEditTime: 2019-12-03 09:24:05
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="orderQueryFrm" :model="orderQueryFrm">
        <el-form-item prop="search_input">
          <el-input
            placeholder="请输入内容"
            v-model="orderQueryFrm.search_input"
            class="input-with-select" clearable>
            <el-select style="width: 126px" v-model="orderQueryFrm.search_type" @change="searchTypeChange" slot="prepend" placeholder="请选择">
              <el-option
                v-for="item in conditionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="supplier" label="供应商">
          <el-select placeholder="全部" clearable v-model="orderQueryFrm.supplier_id">
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="!isSupplier" prop="supplier" label="供应商">
          <el-input placeholder="供应商名称" v-model="orderQueryFrm.supplie"></el-input>
        </el-form-item> -->
        <el-form-item prop="goods_name" label="商品名称">
          <el-input placeholder="商品名称" v-model="orderQueryFrm.goods_name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="status" label="订单状态">
          <el-select placeholder="全部" clearable v-model="orderQueryFrm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="商品类型">
          <el-select placeholder="全部" clearable v-model="orderQueryFrm.goods_type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="下单时间">
          <el-date-picker
            :editable="false"
            v-model="orderQueryFrm.time"
            type="datetimerange"
            unlink-panels
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
          <el-button v-if="isSupplier" @click="exportOrderList" >导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Order from '@/api/fightGroup/order';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  import { getAuthType } from '@/utils/auth';
  import SuppliersApi from '@/api/integralMall/suppliers';
  export default {
    name: 'orderOverview',
    components: {
      customElTable
    },
    data() {
      return {
        isSupplier: getAuthType(),
        orderQueryFrm: {
          search_type: 1,
          search_input: '',
          goods_name: '',
          status: '',
          time: [],
          goods_type: 0,
          supplier_id: ''
        },
        exportDialogShow: false,
        tableOptions: [
          {
            label: '订单号',
            prop: 'order_number'
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
            label: '买家',
            prop: 'user_info',
            options: {
              type: 'html'
            }
          },
          {
            label: '下单时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '订单状态',
            prop: 'status_name'
          },
          {
            label: '付款金额',
            prop: 'pay_price'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'details',
                label: '查看详情'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        conditionOptions: [
          {
            value: 1,
            label: '订单号'
          },
          {
            value: 2,
            label: '买家姓名'
          },
          {
            value: 3,
            label: '买家手机号'
          },
          {
            value: 4,
            label: '手机号后四位'
          }
        ],
        conditionType: 'order_number',
        statusOptions: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '待付款'
          },
          {
            value: 2,
            label: '已支付'
          },
          {
            value: 3,
            label: '待发货'
          },
          {
            value: 4,
            label: '已发货'
          },
          {
            value: 5,
            label: '已完成'
          }
        ],
        typeOptions: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '实物商品'
          },
          {
            value: 2,
            label: '虚拟商品'
          }
        ],
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
        query: null,
        supplierOptions: []
      };
    },
    created() {
      this.getData();
      this.getSupplier();
    },
    methods: {
      getSupplier() {
        SuppliersApi.list({
          page_index: 1,
          page_size: 10000
        }).then(res => {
          this.supplierOptions = res.result || [];
        });
      },
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        if (getAuthType()) {
          Order.supplier_list({
            page_index: this.pageIndex,
            page_size: this.pageSize,
            ...query
          }).then(data => {
            this.tableData = (data.result || []).map(item => {
              const pic = (item.pic && item.pic.length) ? item.pic[0] : null;
              return {
                ...item,
                goods: `<p>${item.goods_name}</p>` + (pic ? `<img width="120" height="120" src="${pic.file_path}" />` : ''),
                price_num: `${item.active_price}(元)/${item.num}件`,
                user_info: `${item.user_name}<br/>${item.phone}`,
                create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
                status_name: item.status_name.status_name,
                pay_price: `${item.total_money}(元)`
              };
            });
            this.totalCount = data.totalCount * 1;
            this.tabLoading = false;
          }).catch(() => {
            this.tabLoading = false;
          });
        } else {
          Order.list({
            page_index: this.pageIndex,
            page_size: this.pageSize,
            ...query
          }).then(data => {
            this.tableData = (data.result || []).map(item => {
              const pic = (item.pic && item.pic.length) ? item.pic[0] : null;
              return {
                ...item,
                goods: `<p>${item.goods_name}</p>` + (pic ? `<img width="120" height="120" src="${pic.file_path}" />` : ''),
                price_num: `${item.active_price}(元)/${item.num}件`,
                user_info: `${item.user_name}<br/>${item.phone}`,
                create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
                status_name: item.status_name.status_name,
                pay_price: `${item.total_money}(元)`
              };
            });
            this.totalCount = data.totalCount * 1;
            this.tabLoading = false;
          }).catch(() => {
            this.tabLoading = false;
          });
        }
      },
      searchOrderList() {
        this.query = _.cloneDeep(this.orderQueryFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', time[0] || '');
        this.$set(this.query, 'end_time', time[1] || '');
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
      searchTypeChange() {
        this.$set(this.orderQueryFrm, 'search_input', '');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      exportOrderList() {
        const params = {
          export: 1,
          merchant_id: this.$store.state.user.userInfo.merchant_id,
          supplier_id: this.$store.state.user.userInfo.user_id,
          ...this.orderQueryFrm
        };
        let str = '';
  
        params['start_time'] = params.time[0] || '';
        params['end_time'] = params.time[1] || '';
        delete params.time;
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            const item = params[key];
            str += `&${key}=${item}`;
          }
        }
        str = str.substring(str.length - 1, 1);
        console.log(`${process.env.BASE_API}/groupBuy/v1/supplier/order/export-list?${str}`);
        window.open(
          `${process.env.BASE_API}/groupBuy/v1/supplier/order/export-list?${str}`
        );
        this.closeDialog();
      },
      closeDialog() {
        this.exportDialogShow = false;
      },
      actionHandler(type, info) {
        if (type === 'details') {
          this.$router.push({
            name: 'orderDetails',
            params: {
              id: info.id
            }
          });
        }
      }
    }
  };
</script>
