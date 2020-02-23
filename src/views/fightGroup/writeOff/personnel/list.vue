<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="personnelQueryFrm">
        <el-form-item label="核销员">
          <el-input placeholder="核销员名称" v-model="personnelQueryFrm.check_user_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchPersonnelList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createPersonnel">
            <i class="fs-13 el-icon-plus mr-5"></i>新建核销人员
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
      @edit="editHandler"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import WriteOff from '@/api/fightGroup/writeOff';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'personnel',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '序列号',
            prop: 'id'
          },
          {
            label: '昵称',
            prop: 'nickname'
          },
          {
            label: '用户名',
            prop: 'user_name'
          },
          {
            label: '电话',
            prop: 'phone'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'edit',
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        personnelQueryFrm: {
          check_user_name: ''
        },
        query: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        WriteOff.personnel_list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              status_name: item.status * 1 === 1 ? '启用' : '禁用',
              phone: item.phone ? item.phone : '',
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchPersonnelList() {
        this.query = _.cloneDeep(this.personnelQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createPersonnel() {
        this.$router.push({ name: 'personnelManagementCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'personnelManagementModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除核销人员 <b>${info.nickname}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          WriteOff.personnel_del({ id: info.id })
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
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          this.$confirm(`确认立即${title}核销人员 <b>${info.nickname}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            WriteOff.personnel_status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            })
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
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
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        if (status === 3) return false;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          } : {
            btn: 'primary',
            label: '启用'
          };
      }
    }
  };
</script>

<style scoped>

</style>
