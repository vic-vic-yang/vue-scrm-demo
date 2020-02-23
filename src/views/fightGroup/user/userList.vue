<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="userListQueryFrm" :model="userListQueryFrm">
        <el-form-item prop="wx_nick_name" label="微信昵称">
          <el-input placeholder="微信昵称" v-model="userListQueryFrm.wx_nick_name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input placeholder="手机号" type="tel" v-model="userListQueryFrm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="user_name" label="姓名">
          <el-input placeholder="姓名" v-model="userListQueryFrm.user_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('userListQueryFrm')" icon="el-icon-refresh">重置</el-button>
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
  import UserManagement from '@/api/fightGroup/user';
  import _ from 'lodash';

  export default {
    name: 'userList',
    components: {
      customElTable
    },
    data() {
      return {
        userListQueryFrm: {
          wx_nick_name: '',
          phone: '',
          user_name: ''
        },
        query: null,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '姓名',
            prop: 'user_name'
          },
          {
            label: '手机号码',
            prop: 'phone_number'
          },
          {
            label: '微信昵称',
            prop: 'nickname'
          },
          {
            label: '地址',
            prop: 'address'
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
        UserManagement.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              address: (item.province + item.city + item.zone + item.detail) || ''
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
        this.pageIndex = 1;
        this.getData();
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'details') {
          this.$router.push({ name: 'userDetails', params: { id: info.id }});
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
