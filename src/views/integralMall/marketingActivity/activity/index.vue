<template>
  <div class="app-container">
    <div class="control-group" style="padding: 0 0 20px">
      <el-button type="primary" @click="createCommodity">
        <i class="fs-13 el-icon-plus mr-5"></i>新增活动
      </el-button>
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
  import Clipboard from 'clipboard';
  import customElTable from '@/components/customElTable';
  import activity from '@/api/integralMall/activity';
  import { parseTime } from '@/utils';

  export default {
    name: 'activity_list',
    components: {
      customElTable
    },
    data() {
      return {
        copyValue: '',
        dialogCopyBtn: false,
        dialogVisible: false,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '活动名称',
            prop: 'name',
            width: 300
          },
          {
            label: '活动条件',
            prop: 'integral'
          },
          {
            label: '抽奖规则',
            prop: 'rule_name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true
          },
          {
            label: '活动状态',
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
    mounted() {
      this.copyValue = 'hello world';
    },
    methods: {
      getData() {
        this.tabLoading = true;
        activity.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              status_name: item.status * 1 === 1 ? '启用' : '禁用',
              create_time: item.create_time * 1 === 0 ? '--' : parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createCommodity() {
        this.$router.push({ name: 'marketingActivityCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'marketingActivityModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除活动 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          activity.del({ id: info.id })
            .then(() => {
              this.$message({
                type: 'success',
                message: `已删除活动${info.name}`
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
      copyVal() {
        this.copyBtn = new Clipboard('.mybtn');
      },
      actionHandler(type, info) {
        if (type === 'link') {
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.dialogCopyBtn = true;
          });
        }
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          this.$confirm(`确认立即${title}活动 <b>${info.name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            activity.status({
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
      getLinkBtnInfo() {
        return {
          btn: 'primary',
          label: '地址'
        };
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
