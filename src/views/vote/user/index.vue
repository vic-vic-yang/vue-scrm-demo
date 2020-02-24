<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="userListQueryFrm">
        <el-form-item label="姓名">
          <el-input placeholder="姓名" v-model="userListQueryFrm.userName"></el-input>
        </el-form-item>
        <el-form-item label="微信昵称">
          <el-input placeholder="微信昵称" v-model="userListQueryFrm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input placeholder="手机号" v-model="userListQueryFrm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
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
  import User from '@/api/vote/user';
  import _ from 'lodash';

  export default {
    name: 'voteUser',
    components: {
      customElTable
    },
    data() {
      return {
        userListQueryFrm: {
          userName: '',
          phone: '',
          nickname: ''
        },
        query: null,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 120
          },
          {
            label: '姓名',
            prop: 'name'
          },
          {
            label: '微信昵称',
            prop: 'nickname'
          },
          {
            label: '手机号码',
            prop: 'phone'
          },
          {
            label: '地址',
            prop: 'address',
            width: 440
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '查看详情',
                type: 'detail'
              }
            ]
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
        User.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchUser() {
        this.query = _.cloneDeep(this.userListQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'detail') {
          this.$router.push({ name: 'voteUserDetails', params: { id: info.id }});
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
      }
    }
  };
</script>
