<template>
  <div class="app-container" v-loading="tabLoading">
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @edit="editHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import templateMsg from '@/api/templateMsg/index';

  export default {
    name: 'selectSmallProcedures',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: 80
          },
          {
            label: '小程序名称',
            prop: 'nick_name'
          },
          {
            label: '消息推送状态',
            prop: 'status_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
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
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        templateMsg.mini().then(res => {
          this.tableData = (res || []).map(item => {
            return {
              ...item,
              status_name: item.message_status * 1 === 1 ? '启用' : '禁用'
            };
          });
          this.totalCount = res.totalCount * 1 || 0;
          this.tabLoading = false;
        });
      },
      editHandler(info) {
        this.$store.commit('SET_MINI_PROGRAM', info);
        this.$emit('small_procedures_handler', false);
      },
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          var disableMessage = `确认${title} <b>${info.nick_name}</b> 消息推送吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            templateMsg.mini_status({
              id: info.id
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
        const status = item.message_status * 1;
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

</style>
