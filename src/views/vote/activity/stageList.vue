<template>
  <div class="app-container">
    <div class="control-group">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>添加阶段
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
  import Activity from '@/api/vote/activity';
  import { parseTime } from '@/utils';

  export default {
    name: 'gameList',
    components: {
      customElTable
    },
    data() {
      return {
        activityId: this.$route.params.id,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '活动阶段',
            prop: 'stage_name'
          },
          {
            label: '任务数',
            prop: 'missions'
          },
          {
            label: '参与人数',
            prop: 'players'
          },
          {
            label: '创建时间',
            prop: 'start_time',
            sortable: true,
            className: 'ph-6'
          },
          {
            label: '阶段状态',
            prop: 'status_cn',
            options: {
              type: 'tag',
              prop: 'stageType'
            }
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del',
              {
                type: 'taskList',
                label: '查看任务'
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
        Activity.stage.list(this.activityId, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          data.result.forEach(item => {
            item.start_time = parseTime(item.start_time);
            item.end_time = parseTime(item.end_time);
            item.status_cn = item.status - 0 === 0 ? '禁用' : item.status_cn;
            item.stageType = item.status_cn === '已结束' ? 1 : item.status_cn === '进行中' ? 3 : 0;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createGame() {
        this.$router.push({ name: 'newStage', params: { activityId: this.activityId }});
      },
      editHandler(info) {
        this.$router.push({ name: 'editStage', params: { activityId: this.activityId, id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除比赛 <b>${info.stage_name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Activity.stage.del(this.activityId, info.id)
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
          const title = this.$store.getters.getStatusTxt(!(info.status * 1));
          this.$confirm(`确认${title}阶段吗？ <b>${info.stage_name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Activity.stage.status(this.activityId, info.id)
              .then(() => {
                this.getData();
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'taskList') {
          this.$router.push({
            name: 'voteTaskList',
            params: {
              stageId: info.id
            }
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
        return {
          btn: status === 0 ? 'primary' : 'danger',
          label: this.$store.getters.getStatusTxt(!status)
        };
      }
    }
  };
</script>

<style scoped>
</style>