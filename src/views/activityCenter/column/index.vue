<template>
  <div class="activity-wrapper app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item>
        <el-button type="primary" @click="createHandler">
          <i class="fs-13 el-icon-plus mr-5"></i>新建栏目
        </el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @edit="editHandler"
      @delete="deleteHandler"
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import column from '@/api/activityCenter/column';
  import { parseTime } from '@/utils';

  export default {
    name: 'index',
    components: {
      customElTable
    },
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 120
          },
          {
            label: '栏目名称',
            prop: 'name'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            label: '权重',
            prop: 'weight',
            max: 100,
            options: {
              type: 'edit'
            }
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'edit',
                label: '编辑'
              },
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              {
                type: 'activityWeight',
                label: '活动权重'
              },
              'del'
            ]
          }
        ],
        form: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        column.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              status_name: Number(item.status) === 1 ? '启用' : '禁用',
              old_weight: item.weight,
              create_time: parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      createHandler() {
        this.$router.push({ name: 'activityColumnCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'activityColumnModify', params: { id: info.id }});
      },
      popoverHandler(scope, value) {
        if (Number(value) < 0) {
          this.$message({
            type: 'error',
            message: `最小只能输入0`
          });
          return;
        }
        const params = {
          id: scope.row.id,
          weight: value,
          type: 1
        };

        column.weight(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getData();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      },
      deleteHandler(info) {
        this.$confirm(`确认删除栏目 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          column.change_status({
            id: info.id,
            status: 3
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
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
          this.$confirm(`确认立即${title}栏目 <b>${info.name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            column.change_status({
              id: info.id,
              status: info.status * 1 === 1 ? 2 : 1
            }).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'activityWeight') {
          this.$router.push({ name: 'columnActivityWeight', params: { id: info.id }});
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
