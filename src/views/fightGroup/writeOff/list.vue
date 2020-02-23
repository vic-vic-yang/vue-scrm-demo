<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="recordQueryFrm" :model="recordQueryFrm">
        <el-form-item prop="check_user_name" label="核销员">
          <el-input placeholder="核销员名称" v-model="recordQueryFrm.check_user_name"></el-input>
        </el-form-item>
        <el-form-item prop="card_number" label="卡券序列号">
          <el-input placeholder="卡券序列号" v-model="recordQueryFrm.card_number"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="核销时间">
          <el-date-picker
            :editable="false"
            v-model="recordQueryFrm.time"
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
          <el-button type="primary" @click="searchRecordList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('recordQueryFrm')" icon="el-icon-refresh">重置</el-button>
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
  import WriteOff from '@/api/fightGroup/writeOff';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'writeOffList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '序列号',
            prop: 'card_number'
          },
          {
            label: '商品名',
            prop: 'goods_name'
          },
          {
            label: '价格',
            prop: 'goods_price'
          },
          {
            label: '用户',
            prop: 'nickname'
          },
          {
            label: '下单日期',
            prop: 'order_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '有效期',
            prop: 'validate_time',
            width: 145
          },
          {
            label: '核销日期',
            prop: 'check_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '核销人',
            prop: 'check_user_name'
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        recordQueryFrm: {
          check_user_name: '',
          card_number: '',
          time: []
        },
        query: null,
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
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        WriteOff.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              ...item.goods_info,
              ...item.user_info,
              order_time: parseTime(item.create_time),
              validate_time: parseTime(item.start_time) + '-' + parseTime(item.end_time),
              check_time: item.check_time > 0 ? parseTime(item.check_time) : '--'
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      searchRecordList() {
        this.query = _.cloneDeep(this.recordQueryFrm);
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>
</style>
