<template>
  <div class="app-container">
    <div class="control-group" style="padding: 0 0 20px">
      <el-form :inline="true" ref="dataQueryFrm" :model="dataQueryFrm">
        <el-form-item prop="search_input">
          <el-input
            placeholder="请输入内容"
            v-model="dataQueryFrm.search_input"
            class="input-with-select">
            <el-select style="width: 126px"
                       v-model="dataQueryFrm.search_type"
                       @change="searchTypeChange"
                       slot="prepend"
                       placeholder="请选择">
              <el-option
                v-for="item in conditionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="active_name" label="活动名称">
          <el-input placeholder="活动名称" v-model="dataQueryFrm.active_name"></el-input>
        </el-form-item>
        <el-form-item prop="prize_name" label="奖品名称">
          <el-input placeholder="奖品名称" v-model="dataQueryFrm.prize_name"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="完成时间">
          <el-date-picker
            :editable="false"
            v-model="dataQueryFrm.time"
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
          <el-button @click="resetForm('dataQueryFrm')" icon="el-icon-refresh">重置</el-button>
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
  import _ from 'lodash';
  import dataView from '@/api/integralMall/data';
  import { parseTime } from '@/utils';

  export default {
    name: 'activity_list',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '活动名称',
            prop: 'active_name',
            width: 300
          },
          {
            label: '用户ID',
            prop: 'user_id'
          },
          {
            label: '昵称',
            prop: 'nick_name'
          },
          {
            label: '联系用户名',
            prop: 'user_name'
          },
          {
            label: '手机号码',
            prop: 'phone'
          },
          {
            label: '奖品等级',
            prop: 'prize_level_name'
          },
          {
            label: '奖品名称',
            prop: 'prize_name'
          },
          {
            label: '完成时间',
            prop: 'create_time',
            sortable: true
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        dataQueryFrm: {
          search_type: 1,
          search_input: '',
          active_name: '',
          prize_name: '',
          time: []
        },
        conditionOptions: [
          {
            value: 1,
            label: '用户ID'
          },
          {
            value: 2,
            label: '用户名'
          },
          {
            value: 3,
            label: '昵称'
          },
          {
            value: 4,
            label: '手机号'
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
        dataView.activity_data({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 === 0 ? '--' : parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchOrderList() {
        this.query = _.cloneDeep(this.dataQueryFrm);
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
        this.$set(this.dataQueryFrm, 'search_input', '');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
