<template>
  <div class="app-container">
    <div class="control-group">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>添加任务
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
  import { mapState } from 'vuex';

  export default {
    name: 'gameList',
    components: {
      customElTable
    },
    data() {
      return {
        stageId: this.$route.params.stageId,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '任务序号',
            prop: 'num',
            width: 80
          },
          {
            label: '任务名称',
            prop: 'mission_name'
          },
          {
            label: '参与人数',
            prop: 'players'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            className: 'ph-6'
          },
          {
            label: '任务状态',
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
                type: 'moveTopTask',
                options: this.getTaskTopBtnInfo,
                disableds: this.ifTopDisabled
              },
              {
                type: 'moveButtomTask',
                options: this.getTasButtomkBtnInfo,
                disableds: this.ifButtomDisabled
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        // tabLoading: true,
        tabLoading: false,
        query: null,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      };
    },
    created() {
      this.getData();
    },
    computed: {
      ...mapState({
        matchModeOptions: state => state.game.matchMode,
        matchTypeOptions: state => state.game.matchType
      })
    },
    methods: {
      getData() {
        this.tabLoading = true;
        Activity.task.list(this.stageId, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          data.result.forEach((item, index) => {
            item.create_time = parseTime(item.create_time);
            item.status_cn = item.status - 0 === 0 ? '禁用' : item.status_cn;
            item.stageType = item.status_cn === '已结束' ? 1 : item.status_cn === '进行中' ? 3 : 0;
            item.num = index + 1;
            item.ifTopDisabled = false;
            item.ifButtomDisabled = false;
            if (index === 0) {
              item.ifTopDisabled = true;
            } else if (index === data.result.length - 1) {
              item.ifButtomDisabled = true;
            }
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createGame() {
        this.$router.push({ name: 'voteNewStage' });
      },
      editHandler(info) {
        this.$router.push({ name: 'voteEditorTask', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除任务 <b>${info.mission_name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Activity.task.del(this.stageId, info.id)
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
          this.$confirm(`确认${title}任务 <b>${info.mission_name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Activity.task.status(this.stageId, info.id)
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
        } else if (type === 'detail') {
          this.$router.push({
            name: 'gameDetail',
            params: {
              gameId: info.id
            }
          });
        } else if (type === 'moveTopTask') {
          Activity.task.sort(this.stageId, info.id, 2)
            .then(() => {
              this.getData();
            });
        } else if (type === 'moveButtomTask') {
          Activity.task.sort(this.stageId, info.id, 1)
            .then(() => {
              this.getData();
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
      getTaskTopBtnInfo(item) { // 操作按钮的样式
        if (!item) {
          return {
            btn: 'primary',
            label: '上移'
          };
        }
        return {
          btn: 'primary',
          label: '上移'
        };
      },
      getTasButtomkBtnInfo(item) { // 操作按钮的样式
        if (!item) {
          return {
            btn: 'primary',
            label: '下移'
          };
        }
        return {
          btn: 'primary',
          label: '下移'
        };
      },
      ifTopDisabled(item) { // 是否禁用上移
        if (!item) {
          return false;
        }
        return item.ifTopDisabled;
      },
      ifButtomDisabled(item) { // 是否禁用下移
        if (!item) {
          return false;
        }
        return item.ifButtomDisabled;
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