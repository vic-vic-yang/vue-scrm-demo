<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="userListQueryFrm">
        <el-form-item label="姓名">
          <el-input placeholder="姓名" v-model="userListQueryFrm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input placeholder="身份证号" v-model="userListQueryFrm.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部" clearable v-model="userListQueryFrm.status">
            <el-option
              v-for="item in matchTypeOptions"
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
      @page-change="pageChangeHandler"
      @cell-click="tabCellClickHandler">
    </custom-el-table>
    <el-dialog
      title="查看"
      :visible.sync="dialogImg"
      width="30%">
      <div class="dlItem">
        <img class="dlImg" :src="dlImg[0]" alt="身份证">
        <img class="dlImg" :src="dlImg[1]" alt="身份证">
      </div>
    </el-dialog>
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
  import User from '@/api/vote/user';
  // import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'voteUser',
    components: {
      customElTable
    },
    data() {
      return {
        activityId: this.$route.params.id,
        ifUserDetails: false,
        ifReason: false,
        reason: '',
        auditId: null,
        userListQueryFrm: {
          name: '',
          cardNum: '',
          status: ''
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
            prop: 'name'
          },
          {
            label: '性别',
            prop: 'gender',
            width: 100
          },
          {
            label: '身份证号',
            prop: 'id_card'
          },
          {
            label: '身份证照片',
            prop: 'identityImgs',
            width: 450,
            options: {
              type: 'html'
            }
          },
          {
            label: '状态',
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
                options: this.getStatusBtnInfo,
                disableds: this.ifDisabled
              },
              {
                label: '拉入黑名单',
                type: 'blacklist'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 1,
        tabLoading: true,
        dialogImg: false,
        dlImg: [],
        userDetailInfo: {},
        matchTypeOptions: [
          {
            label: '未审核',
            value: '0'
          },
          {
            label: '已过审',
            value: '1'
          },
          {
            label: '未过审',
            value: '2'
          }
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        User.examine({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          activityId: this.activityId,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.gender = !item.gender ? '保密' : item.gender - 0 === 1 ? '男' : '女';
            item.status = item.status - 0 === 2 ? 0 : item.status - 0 === 1 ? 1 : 2;
            if (item.black - 0 === 1) {
              item.status = 2;
              item.status_cn = '黑名单';
            }
            item.identityImgs = !item.card_front || !item.card_back ? '暂无照片' : `<div style="display:flex;justify-content: space-around"><img style="width:180px;height:120px" src='${item.card_front}' /><img style="width:180px;height:120px" src='${item.card_back}' /></div>`;
          });
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
          this.ifUserDetails = true;
          this.auditId = info.id;
        } else if (type === 'blacklist') {
          if (info.status - 0 === 4) return;
          this.$confirm(`确认将 ${info.name} 拉入黑名单吗？`, '黑名单', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            User.black(info.id).then(() => {
              this.getData();
              this.$message({
                type: 'info',
                message: `已拉黑`
              });
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消`
            });
          });
        }
      },
      getStatusBtnInfo() {
        return {
          btn: 'primary',
          label: `审核`
        };
      },
      ifDisabled(item) {
        if (!item) {
          return false;
        }
        if (item.black - 0 === 1) return true;
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
        User.audit(this.auditId, params).then(() => {
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
      },
      tabCellClickHandler(item, index) {
        if (item === 'identityImgs') {
          if (!index.card_front && !index.card_back) return;
          this.dlImg[0] = index.card_front;
          this.dlImg[1] = index.card_back;
          this.dialogImg = true;
        }
      }
    }
  };
</script>
<style scoped>
.dlItem{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
.dlImg{
  width: 450px;
  height: auto;
  margin: 10px 0;
}
.work-btn{
  width: 50%;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}
</style>