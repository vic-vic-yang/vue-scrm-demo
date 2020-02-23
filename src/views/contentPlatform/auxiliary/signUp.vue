<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="activityQueryFrm">
        <el-form-item label="审核状态">
          <el-select placeholder="全部" clearable v-model="activityQueryFrm.status">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
    <el-dialog title="选择审核状态为？" width="30%" :visible.sync="ifUserDetails">
      <el-dialog
      width="30%"
      title="原因"
      :visible.sync="ifReason"
      append-to-body>
      <el-input v-model="reason" placeholder="请输入未过审原因"></el-input>
      <div class="work-btn" style="margin-top: 20px"> 
        <el-button style="margin:auto" type="primary" @click="submitReason">提交</el-button>
      </div>
      </el-dialog>
      <div class="work-btn">
        <el-button type="danger" @click="workPass(2)">审核未过</el-button>
        <el-button type="primary" @click="workPass(1)">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Auxiliary from '@/api/contentPlatform/auxiliary';
  import _ from 'lodash';

  export default {
    name: 'contentSignUp',
    components: {
      customElTable
    },
    data() {
      return {
        ifUserDetails: false,
        ifReason: false,
        reason: '', // 审核未通过原因
        auditId: null,
        activityQueryFrm: {
          status: ''
        },
        query: null,
        stateOptions: [ // 状态
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 1,
            label: '已审核'
          },
          {
            value: 2,
            label: '未审核'
          }
        ],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '活动标题',
            prop: 'activity_name'
          },
          {
            label: '用户名称',
            prop: 'name'
          },
          {
            label: '联系电话',
            prop: 'phone'
          },
          {
            label: '身份证号',
            prop: 'id_card'
          },
          {
            label: '取号码',
            prop: 'ticket'
          },
          {
            label: '审核状态',
            prop: 'status_cn',
            width: 120,
            options: {
              type: 'tag',
              prop: 'status'
            }
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '审核',
                type: 'detail',
                options: this.getStatusBtnInfo
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
        query.id = this.$route.params.id;
        console.log(query);
        this.tabLoading = true;
        Auxiliary.signUp.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.status_cn = item.status - 0 === 2 ? '未过审' : item.status - 0 === 1 ? '已过审' : '未审核';
            item.status = item.status - 0 === 2 ? 0 : item.status - 0 === 1 ? 1 : 2;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchUser() { // 查询
        this.query = _.cloneDeep(this.activityQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      getStatusBtnInfo(item) { // 审核按钮
        return {
          btn: 'primary',
          label: `审核`
        };
      },
      actionHandler(type, info) {
        if (type === 'detail') { // 审核
          this.ifUserDetails = true;
          this.auditId = info.id;
        }
      },
      workPass(type) { // 提交审核
        if (type === 1) {
          this.submitReason(type);
        } else {
          this.ifReason = true;
        }
      },
      submitReason(type) { // 提交审核未过原因
        const params = {};
        params.status = type && type === 1 ? 1 : 2;
        params.reason = type && type === 1 ? '' : this.reason;
        const obj = {
          id: this.auditId,
          ...params
        };
        Auxiliary.signUp.status(obj).then(() => {
          this.ifUserDetails = false;
          this.ifReason = false;
          this.getData();
        });
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
<style scoped>
.work-btn{
  width: 50%;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}
</style>
