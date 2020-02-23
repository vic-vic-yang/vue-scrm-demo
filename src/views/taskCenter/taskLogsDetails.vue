<template>
  <div class="app-container">
    <el-form :inline="true" ref="taskFrm" :model="taskFrm">
      <el-form-item prop="search_input">
        <el-input placeholder="请输入内容" v-model="taskFrm.search_input" class="input-with-select" clearable>
          <el-select v-model="taskFrm.search_type" slot="prepend" placeholder="请选择" style="width: 126px;" @change="searchTypeChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item prop="mission_name" label="任务名称">
        <el-input v-model="taskFrm.mission_name" placeholder="任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item prop="time" label="活动时间">
        <el-date-picker
          :editable="false"
          v-model="taskFrm.time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchCommodityList" icon="el-icon-search">查询</el-button>
        <el-button plain icon="el-icon-refresh" @click="resetForm('taskFrm')">重置</el-button>
      </el-form-item>
    </el-form>
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
  import TASK_API from '@/api/task/index';
  import _ from 'lodash';

  export default {
    name: 'taskAddEdit',
    data() {
      return {
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '用户ID',
            prop: 'user_id'
          },
          {
            label: '昵称',
            prop: 'nickname'
          },
          {
            label: '联系用户名',
            prop: 'name',
            className: 'ph-6'
          },
          {
            label: '手机号码',
            prop: 'phone'
          },
          {
            label: '获取奖励',
            prop: 'prize'
          },
          {
            label: '完成时间',
            prop: 'create_time'
          },
          {
            label: '任务名称',
            prop: 'mission_name'
          }
        ],
        tableData: [],
        taskFrm: {
          search_type: '',
          search_input: '',
          mission_name: '',
          time: []
        },
        options: [
          {
            value: 1,
            label: '用户ID'
          }
          // {
          //   value: 2,
          //   label: '用户昵称'
          // },
          // {
          //   value: 3,
          //   label: '用户名'
          // },
          // {
          //   value: 4,
          //   label: '手机号码'
          // }
        ],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: {},
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
    components: {
      customElTable
    },
    watch: {
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        TASK_API.getLogsDetails({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              prize: item.prize_name + ' -- ' + item.prize_value
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchTypeChange() {
        this.$set(this.taskFrm, 'search_input', '');
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.taskFrm);
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

<style lang="scss" scoped>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
