<template>
  <div class="app-container task-list">
    <div class="header">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="grid-content bg-purple" style="padding-left: 10px;">
            <div style="font-size: 16px;margin-top: 10px;" class="task-btn">积分任务</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="10">
          <div class="grid-content bg-purple" style="text-align: right;">
            <!--<el-button class="task-btn" @click="createActivity">创建任务</el-button>-->
            <el-button class="task-btn" @click="go_task_details">任务数据</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
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
  import integralTask from '@/api/integralMall/task';
  import { parseTime } from '@/utils';

  export default {
    name: 'taskOverview',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '任务名称',
            prop: 'name'
          },
          {
            label: '任务条件',
            prop: 'condition'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            width: 300,
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
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        integralTask.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      createActivity() {
        this.$router.push({ name: 'integralTaskCreate' });
      },
      editHandler(info) {
        if (info.type * 1 === 200) {
          this.$router.push({ name: 'integralAwardTaskCreate', query: { aId: info.id }});
        } else if (info.type * 1 === 2) {
          this.$router.push({ name: 'integralArticleAddCreate', query: { aId: info.id }});
        } else if (info.type * 1 === 201) {
          this.$router.push({ name: 'marketingActivityList' });
        } else {
          this.$router.push({ name: 'integralTaskModify', params: { id: info.id }});
        }
      },
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          var disableMessage = `确认${title}任务 <b>${info.name}</b> 吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            integralTask.status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            }).then(res => {
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
      go_task_details() {
        this.$router.push({ name: 'integralTaskDetails' });
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
            label: '关闭'
          };
        }
        const status = item.status * 1;
        return status === 1
          ? {
            btn: 'danger',
            label: '关闭'
          }
          : {
            btn: 'primary',
            label: '开启'
          };
      }
    }
  };
</script>


<style scoped>
  .header{
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  .task-btn{
    color: #000;
  }

  .pagination-wrapper {
    margin: 20px 0;
  }
</style>
