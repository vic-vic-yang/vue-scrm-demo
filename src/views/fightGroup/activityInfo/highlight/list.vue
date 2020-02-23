<template>
  <div class="app-container">
    <div class="control-group">
      <div style="float: right">
        <el-button type="primary" plain @click="createCover">
          <i class="fs-13 el-icon-picture mr-5"></i>设置封面
        </el-button>
        <el-button type="primary" @click="createActivity">
          <i class="fs-13 el-icon-plus mr-5"></i>新建活动
        </el-button>
      </div>
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
  import activityInfo from '@/api/fightGroup/activityInfo';

  export default {
    name: 'highlightList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '发布时间',
            prop: 'time',
            sortable: true
          },
          {
            label: '内容',
            prop: 'content',
            width: 660,
            options: {
              type: 'html'
            }
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del'
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
        this.tabLoading = true;
        activityInfo.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.data.result || []).map(item => {
            return {
              ...item,
              status_name: item.status * 1 === 1 ? '启用' : '禁用'
            };
          });
          this.totalCount = res.data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createCover() {
        this.$router.push({ name: 'activityHighlightCover' });
      },
      createActivity() {
        this.$router.push({ name: 'activityHighlightCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'activityHighlightModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除这条内容吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          activityInfo.del(info)
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
          this.$confirm(`确认立即${title}这条内容吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            activityInfo.status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            }).then(() => {
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
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          }
          : {
            btn: 'primary',
            label: '启用'
          };
      }
    }
  };
</script>

<style scoped>
.control-group{
  margin-bottom: 20px;
  overflow: hidden;
}
</style>
