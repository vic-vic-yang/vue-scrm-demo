<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="accountQueryFrm">
        <el-form-item label="账号名称">
          <el-input placeholder="账号名称" v-model="accountQueryFrm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部" clearable v-model="accountQueryFrm.status">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAccount" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createAccount">
            <i class="fs-13 el-icon-plus mr-5"></i>添加账号
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @edit="editHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Configure from '@/api/contentPlatform/configure';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'contentAccount',
    components: {
      customElTable
    },
    data() {
      return {
        accountQueryFrm: {
          nickname: '',
          status: ''
        },
        query: null,
        stateOptions: [ // 状态
          {
            value: 10,
            label: '已启用'
          },
          {
            value: 0,
            label: '已禁用'
          }
        ],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '账号名称',
            prop: 'nickname'
          },
          {
            label: '账号',
            prop: 'username'
          },
          {
            label: '账号角色',
            prop: 'roles'
          },
          {
            label: '创建时间',
            prop: 'created_at',
            sortable: true,
            width: 210,
            className: 'ph-6'
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
                type: 'editor',
                options: this.getTaskEditBtnInfo,
                disableds: this.ifDisabled
              },
              {
                type: 'status',
                options: this.getStatusBtnInfo,
                disableds: this.ifDisabled
              },
              {
                type: 'delete',
                options: this.getTaskDelBtnInfo,
                disableds: this.ifDisabled
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
      editHandler(info) {
        this.$router.push({
          name: 'contentEditorAccount',
          params: {
            id: info.id
          }
        });
      },
      deleteHandler(info) {
        this.$confirm(`确认删除账号 <b>${info.username}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Configure.account.del(info.id)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Configure.account.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.created_at = item.created_at * 1 > 0 ? parseTime(item.created_at) : '--';
            item.status_cn = item.status - 0 === 0 ? '禁用' : '启用';
            item.status = item.status - 0 === 0 ? 0 : 1;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchAccount() { // 查询
        this.query = _.cloneDeep(this.accountQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createAccount() { // 新增
        this.$router.push({ name: 'contentAddAccount' });
      },
      actionHandler(type, info) {
        if (type === 'status') { // 启用禁用
          this.$confirm(`确认${info.status === 1 ? '禁用' : '启用'}账号 <b>${info.nickname}</b> 吗？`, `${info.status === 1 ? '禁用' : '启用'}`, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Configure.account.status(info.id)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else if (type === 'editor') { // 修改
          this.$router.push({
            name: 'contentEditorAccount',
            params: {
              id: info.id
            }
          });
        } else if (type === 'delete') { // 删除
          this.$confirm(`确认删除账号 <b>${info.nickname}</b> 吗？`, '删除', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Configure.account.del(info.id)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      getTaskEditBtnInfo() { // 操作按钮的样式
        return {
          btn: 'primary',
          label: '编辑'
        };
      },
      getTaskDelBtnInfo() { // 操作按钮的样式
        return {
          btn: 'danger',
          label: '删除'
        };
      },
      getStatusBtnInfo(item) { // 自定义按钮样式
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        return {
          btn: status === 0 ? 'primary' : 'danger',
          label: status === 0 ? '启用' : '禁用'
        };
      },
      ifDisabled(item) { // 是否禁用
        if (!item) {
          return true;
        }
        return item.is_super;
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
