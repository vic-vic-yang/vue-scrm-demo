<template>
    <div class="relation-content">
      <h4>选择账号</h4>
      <el-row>
        <el-col :span="11" class="account-h border">
          <div class="header">
            <el-form :inline="true" class="account-form" ref="searchQueryFrm" :model="searchQueryFrm">
              <el-form-item prop="search_input" label="账号名/姓名">
                <el-input placeholder="账号名/姓名" v-model="searchQueryFrm.search_input" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="content">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                label="">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.check" @change="accountChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                label="账号名">
              </el-table-column>
              <el-table-column
                prop="realname"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="department_name"
                label="部门">
              </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              @current-change="currentChange"
              :total="totalCount">
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="2" class="account-h account-arrow">
          <div class="arrow">
              <i class="el-icon-back"></i>
              <i class="el-icon-right"></i>
          </div>
        </el-col>
        <el-col :span="11" class="account-h border">
          <div class="header header-right">
            已选择 (<b style="text-indent:0">{{accountData.length}}</b>)
          </div>
          <div class="content">
            <el-table
              :data="accountData"
              style="width: 100%">
              <el-table-column
                prop="username"
                label="账号名">
              </el-table-column>
              <el-table-column
                prop="realname"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="department_name"
                label="部门">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-close" @click="delHandler(scope.row)"></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div class="account-footer">
        <el-button type="primary" @click="saveAccount">保存</el-button>
      </div>
    </div>
</template>

<script>
  import WORKFLOW from '@/api/configure/workflow';
  import _ from 'lodash';

  export default {
    name: 'relation',
    props: ['show', 'relationData'],
    data() {
      return {
        searchQueryFrm: {
          search_input: ''
        },
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        query: null,
        accountData: []
      };
    },
    watch: {
      show(val) {
        if (val) {
          this.accountData = JSON.parse(this.relationData) || [];
          this.setAccountData();
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        WORKFLOW.account.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              department_name: this.setDepartmentName(item.department),
              check: false
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          this.setAccountData();
        });
      },
      setDepartmentName(data) {
        let department = '';
        data.map((item, index) => {
          department += index > 0 ? ' - ' + item.name : item.name;
        });
        return department;
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      currentChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.getData();
      },
      saveAccount() {
        this.$emit('accountHandler', this.accountData);
      },
      accountChange(row) {
        if (row.check) {
          this.accountData.push(row);
        } else {
          var accountIndex = this.accountData.findIndex(item => item.id === row.id);
          this.accountData.splice(accountIndex, 1);
        }
      },
      delHandler(row) {
        var accountIndex = this.accountData.findIndex(item => item.id === row.id);
        var index = this.tableData.findIndex(item => item.id === row.id);
        this.accountData.splice(accountIndex, 1);
        this.tableData[index].check = false;
      },
      setAccountData() {
        this.tableData.map(item => {
          item.check = false;
          this.accountData.map(val => {
            if (item.id === val.id) {
              item.check = true;
            }
          });
        });
      }
    }
  };
</script>

<style scoped>
  .account-h{
    min-height: 600px;
  }
  .header{
    height: 120px;
  }
  .header-right{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-indent: 20px;
  }
  .content{
    width: 90%;
    margin: 0 auto;
    height: 500px;
    overflow: scroll;
  }
  .account-arrow{
    display: flex;
    justify-content: center;;
    align-items: center;
    flex-wrap: wrap;
  }
  .account-arrow i {
    width: 100%;
    font-size: 24px;
    display: block;;
    font-weight: bold;
  }
  .arrow{
    text-align: center;
  }
  .account-footer{
    text-align: center;
    margin-top: 30px;
  }
  .border{
    border: 1px solid #eee;
  }
  .account-form{
    padding: 10px;
  }
  .el-icon-close{
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }
</style>
