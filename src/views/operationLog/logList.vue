<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="activityQueryFrm">
        <el-form-item label="姓名">
          <el-input placeholder="姓名" v-model="activityQueryFrm.username"></el-input>
        </el-form-item>
        <el-form-item label="操作描述">
           <el-input placeholder="操作描述" v-model="activityQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            :editable="false"
            v-model="activityQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivity" icon="el-icon-search">查询</el-button>
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
  import optLogApi from '@/api/optLog/index';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  export default {
    name: 'contentActivity',
    components: {
      customElTable
    },
    data() {
      return {
        activityQueryFrm: {
          username: '',
          time: [],
          title: ''
        },
        query: null,
        pickerOptions: { // 时间选择器
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
        stateOptions: [ // 状态
          {
            value: 0,
            label: '已禁用'
          },
          {
            value: 1,
            label: '进行中'
          },
          {
            value: 2,
            label: '未开始'
          },
          {
            value: 3,
            label: '已结束'
          }
        ],
        tableOptions: [
          {
            label: '姓名',
            prop: 'op_nickname'
          },
          {
            label: '账号',
            prop: 'op_username'
          },
          {
            label: '操作描述',
            prop: 'op_description'
          },
          {
            label: '详情',
            prop: 'op_detail'
          },
          {
            label: '操作时间',
            prop: 'create_time',
            sortable: true,
            width: 155,
            className: 'ph-6'
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        optLogApi.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.create_time = parseTime(item.create_time);
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchActivity() { // 查询
        const { title, time, username } = _.cloneDeep(this.activityQueryFrm);
        this.query = {
          title: title,
          username: username,
          start_time: '',
          end_time: ''
        };
        if (time && time.length > 1) {
          this.query.start_time = time[0];
          this.query.end_time = time[1];
        }
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
      }
    }
  };
</script>
