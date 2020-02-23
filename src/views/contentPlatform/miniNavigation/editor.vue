<template>
  <el-dialog
    title="添加栏目"
    :visible.sync="showColumn"
    width="65%"
    top="3vh"
    @close="closed">
    <el-row>
      <el-col :span="11" class="account-h border">
        <div class="header">
          <el-form :inline="true" class="account-form" ref="searchQueryFrm" :model="searchQueryFrm">
            <el-form-item prop="name" label="栏目名称">
              <el-input placeholder="栏目名称" v-model="searchQueryFrm.name" style="width: 160px;" clearable></el-input>
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
              prop="name"
              label="栏目名称">
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
              prop="name"
              label="栏目名称">
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="closed">取 消</el-button>
      <el-button type="primary" @click="addColumnHandler">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import _ from 'lodash';
  import { parseTime } from '@/utils';
  import MININAVIGATION from '@/api/contentPlatform/miniNavigation';

  export default {
    name: 'editor',
    props: ['show', 'relationData', 'id'],
    data() {
      return {
        showColumn: false,
        searchQueryFrm: {
          name: ''
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
        this.showColumn = val;
        if (val) {
          // this.accountData = JSON.parse(this.relationData) || [];
          // this.setAccountData();
          this.accountData = [];
          this.getData();
        }
      }
    },
    created() {
      // this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        MININAVIGATION.column({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          id: this.id || 1,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
              status_name: item.status * 1 === 1 ? '启用' : '禁用',
              weight: item.weight || 0,
              check: false
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          // this.setAccountData();
        }).catch(() => {
          this.tabLoading = false;
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
      addColumnHandler() {
        this.$emit('addColumnHandler', this.accountData);
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
      },
      closed() {
        this.$emit('closed');
      }
    }
  };
</script>

<style scoped>
  .account-h{
    min-height: 600px;
  }
  .header{
    height: 80px;
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
