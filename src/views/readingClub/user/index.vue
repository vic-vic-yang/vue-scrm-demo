<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="userQueryFrm" :model="userQueryFrm">
        <el-form-item prop="user_name" label="用户名">
          <el-input placeholder="用户名" v-model="userQueryFrm.user_name"></el-input>
        </el-form-item>
        <el-form-item prop="user_id" label="用户ID">
          <el-input placeholder="用户ID" v-model="userQueryFrm.user_id"></el-input>
        </el-form-item>
        <el-form-item prop="phone_number" label="手机号">
          <el-input placeholder="手机号" v-model="userQueryFrm.phone_number"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            :editable="false"
            v-model="userQueryFrm.time"
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
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('userQueryFrm')" icon="el-icon-refresh">重置</el-button>
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
    <el-dialog
      title="详情"
      top="10vh"
      :visible.sync="dialogVisible"
      width="60%">
        <user-detail :user_id="user_id"/>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import user from '@/api/readingClub/user';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  import userDetail from './detail';

  export default {
    name: 'interpretationList',
    components: {
      customElTable,
      userDetail
    },
    data() {
      return {
        dialogVisible: false,
        tableOptions: [
          {
            label: '编号',
            prop: 'index',
            width: 80
          },
          {
            label: '用户ID',
            prop: 'user_id'
          },
          {
            label: '用户名',
            prop: 'user_name'
          },
          {
            label: '用户头像',
            prop: 'avatar',
            options: {
              type: 'html'
            }
          },
          {
            label: '手机号',
            prop: 'phone_number'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'detail',
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
        userQueryFrm: {
          user_name: '',
          user_id: '',
          phone_number: '',
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
        },
        user_id: ''
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        user.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.records || []).map((item, index) => {
            return {
              ...item,
              avatar: `<img style="width: 60px;;height: 60px;" src="${item.avatar}">`,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--',
              index: this.pageSize * (this.pageIndex - 1) + index + 1
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchActivityList() {
        this.query = _.cloneDeep(this.userQueryFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', this.timestamp(time[0]) || '');
        this.$set(this.query, 'end_time', this.timestamp(time[1]) || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      timestamp(date) {
        if (date) {
          var dateTmp = date.replace(/-/g, '/');
          return Date.parse(dateTmp) / 1000;
        } else {
          return '';
        }
      },
      actionHandler(type, info) {
        if (type === 'detail') {
          this.user_id = info.user_id;
          this.dialogVisible = true;
        }
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
