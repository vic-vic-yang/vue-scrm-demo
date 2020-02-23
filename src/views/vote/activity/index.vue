 /* eslint-disable */
<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true"
               :model="activityListQueryFrm">
        <el-form-item label="活动名称">
          <el-input placeholder="活动名称"
                    v-model="activityListQueryFrm.activityName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动阶段">
          <el-select placeholder="全部" clearable filterable allow-create v-model="activityListQueryFrm.matchMode">
            <el-option
              v-for="item in matchModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="活动状态">
          <el-select placeholder="全部"
                     clearable
                     v-model="activityListQueryFrm.status">
            <el-option v-for="item in matchTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker :editable="false"
                          v-model="activityListQueryFrm.time"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="searchGameList"
                     icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table v-loading="tabLoading"
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
// import { mapState } from 'vuex';
// import _ from 'lodash';

export default {
  name: 'gameList',
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
          label: '活动名称',
          prop: 'activity_name'
        },
        {
          label: '活动阶段',
          prop: 'stage'
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
          label: '开始时间',
          prop: 'start_time',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          label: '结束时间',
          prop: 'end_time',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          label: '活动状态',
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
              type: 'ranking',
              label: '查看排名'
            },
            {
              type: 'stageList',
              label: '查看阶段'
            },
            {
              type: 'userMatch',
              label: '报名审核'
            },
            {
              type: 'judges',
              label: '评委评分'
            }
          ]
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      activityListQueryFrm: {
        activityName: '',
        matchMode: '',
        matchType: '',
        status: '',
        time: ''
      },
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
      },
      // matchModeOptions: [
      //   {
      //     value: '初赛',
      //     label: '初赛'
      //   },
      //   {
      //     value: '复赛',
      //     label: '复赛'
      //   },
      //   {
      //     value: '决赛',
      //     label: '决赛'
      //   }
      // ],
      matchTypeOptions: [
        {
          value: 1,
          label: '进行中'
        },
        {
          value: 2,
          label: '未开始'
        },
        {
          value: 3,
          label: '已结束'
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  computed: {
    // ...mapState({
    //   matchModeOptions: state => state.game.matchMode,
    //   matchTypeOptions: state => state.game.matchType
    // })
  },
  methods: {
    getData() {
      const query = this.query || {};
      this.tabLoading = true;
      Activity.activity.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...query
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
      })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    searchGameList() {
      this.query = {
        activityName: this.activityListQueryFrm.activityName ? this.activityListQueryFrm.activityName : '',
        startTime: this.activityListQueryFrm.time ? this.activityListQueryFrm.time[0] : '',
        endTime: this.activityListQueryFrm.time ? this.activityListQueryFrm.time[1] : '',
        status: this.activityListQueryFrm.status ? this.activityListQueryFrm.status : ''
      };
      this.pageIndex = 1;
      this.getData();
    },
    createGame() {
      this.$router.push({ name: 'addActivity' });
    },
    editHandler(info) {
      this.$router.push({name: 'modifyActivity', params: { id: info.id }});
    },
    deleteHandler(info) {
      this.$confirm(`确认删除活动 <b>${info.activity_name}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Activity.activity.del(info.id)
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
        this.$confirm(`确认${title}比赛 <b>${info.activity_name}</b> 吗？`, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Activity.activity.status(info.id)
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
      } else if (type === 'name') {
        this.$router.push({
          name: 'gameNameList',
          params: {
            gameId: info.id
          }
        });
      } else if (type === 'detail') {
        this.$router.push({
          name: 'gameDetail',
          params: {
            gameId: info.id
          }
        });
      } else if (type === 'stageList') {
        this.$router.push({
          name: 'stageList',
          params: {
            id: info.id
          }
        });
      } else if (type === 'userMatch') {
        this.$router.push({
          name: 'userExamine',
          params: {
            id: info.id
          }
        });
      } else if (type === 'ranking') {
        this.$router.push({
          name: 'voteActivityRankink',
          params: {
            id: info.id
          }
        });
      } else if (type === 'judges') {
        this.$router.push({
          name: 'judgesScore',
          params: {
            id: info.id
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
