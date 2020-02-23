<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="userListQueryFrm" :model="userListQueryFrm">
        <el-form-item prop="userName" label="用户名称">
          <el-input placeholder="用户名称" v-model="userListQueryFrm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="teamName" label="所属团队">
          <el-input placeholder="团队名称" v-model="userListQueryFrm.teamName"></el-input>
        </el-form-item>
        <el-form-item prop="matchCount" label="比赛总数">
          <el-input style="width: 80px" v-model.number="userListQueryFrm.matchCount[0]"></el-input>
          <span class="mh-5">-</span>
          <el-input style="width: 80px" v-model.number="userListQueryFrm.matchCount[1]"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('userListQueryFrm')" icon="el-icon-search">重置</el-button>
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
    <user-detail-modal :detail="userDetailInfo" :show.sync="userDetailDialog"></user-detail-modal>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import userDetailModal from './userDetailModal';
  import UserManagement from '@/api/answer/userManagement';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'userList',
    components: {
      customElTable,
      userDetailModal
    },
    data() {
      return {
        userListQueryFrm: {
          userName: '',
          teamName: '',
          matchCount: []
        },
        query: null,
        tableOptions: [
          {
            label: '编号',
            prop: 'userId',
            width: 80
          },
          {
            label: '用户名称',
            prop: 'userName'
          },
          {
            label: '比赛总数',
            prop: 'playTotalCount'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '查看详情',
                type: 'detail'
              },
              {
                label: '比赛记录',
                type: 'record'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        userDetailDialog: false,
        userDetailInfo: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        UserManagement.user.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              createTime: parseTime(item.createTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchUser() {
        this.query = _.cloneDeep(this.userListQueryFrm);
        const matchCount = this.userListQueryFrm.matchCount;
        this.$set(this.query, 'matchCountLow', matchCount[0]);
        this.$set(this.query, 'matchCountHigh', matchCount[1]);
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'detail') {
          this.userDetailInfo = info;
          this.userDetailDialog = true;
        } else if (type === 'record') {
          this.$router.push({ name: 'userMatchRecord', params: { id: info.userId }});
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
