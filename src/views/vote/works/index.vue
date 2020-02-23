<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true"
               :model="userListQueryFrm">
        <el-form-item label="活动名称">
          <el-select placeholder="全部" clearable v-model="userListQueryFrm.activity_id" @change="getStage">
            <el-option
              v-for="item in activeOptions"
              :key="item.id"
              :label="item.activity_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动阶段">
          <el-select placeholder="全部" clearable v-model="userListQueryFrm.stageName" @change="getWorksList">
            <el-option
              v-for="item in stageOptions"
              :key="item.id"
              :label="item.stage_name"
              :value="item.stage_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-select placeholder="全部" clearable v-model="userListQueryFrm.missionName">
            <el-option
              v-for="item in worksOptions"
              :key="item.id"
              :label="item.mission_name"
              :value="item.mission_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作品名称">
          <el-input placeholder="作品名称"
                    v-model="userListQueryFrm.compositionName"></el-input>
        </el-form-item>
        <el-form-item label="作品状态">
          <el-select placeholder="全部"
                     clearable
                     v-model="userListQueryFrm.status">
            <el-option v-for="item in matchTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作品标签">
          <el-select placeholder="全部"
                     clearable
                     filterable
                     remote
                     :remote-method="remoteMethod"
                     v-model="userListQueryFrm.tags">
            <el-option v-for="item in tags"
                       :key="item.value"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="searchUser"
                     icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table v-loading="tabLoading"
                     v-model="pageIndex"
                     :pageSizes="[10, 20, 50, 100]"
                     :tableData="tableData"
                     :tableOptions="tableOptions"
                     :total="totalCount"
                     @cell-click="cellClickHandler"
                     @action="actionHandler"
                     @size-change="sizeChangeHandler"
                     @page-change="pageChangeHandler">
    </custom-el-table>
    <el-dialog v-if="workDetails.workName&&workDetails.workUrl"
               title="作品详情"
               :visible.sync="ifWorkDetails">
      <el-dialog width="30%"
                 title="原因"
                 :visible.sync="ifReason"
                 append-to-body>
        <el-input v-model="reason"
                  placeholder="请输入未过审原因"
                  style="margin-botton:20px;"></el-input>
        <div class="work-btn">
          <el-button style="margin:auto"
                     type="primary"
                     @click="submitReason">提交</el-button>
        </div>
      </el-dialog>
      <div class="item-detail-content">
        <p>作品名称: {{workDetails.workName}}</p>
        <p>描述: {{workDetails.workDescribe}}</p>
        <div class="workItem">
          <p>作品详情:</p>
          <video v-if="workDetails.workType==1&&ifWorkDetails"
                 :src="workDetails.workUrl"
                 controls="controls"
                 width="600px"
                 height="380px"
                 style="margin-left:20px"></video>
          <div class="workImg"
               v-else-if="workDetails.workType==2&&ifWorkDetails">
            <img style="max-width:540px;margin-left:20px"
                 :src="workDetails.workUrl"
                 alt="workDetails">
          </div>
          <audio v-else-if="workDetails.workType==5&&ifWorkDetails"
                 :src="workDetails.workUrl"
                 controls="controls"
                 style="margin-left:20px"></audio>
        </div>
      </div>
      <div class="work-btn">
        <el-button type="danger"
                   @click="workNoPass">审核未过</el-button>
        <el-button type="primary"
                   @click="workPass">审核通过</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="评分"
      top="10vh"
      :visible.sync="showScore"
      width="60%">
      <custom-el-table v-loading="tabLoadingScore"
                       v-model="scorePageIndex"
                       :tableData="scoreTableData"
                       :tableOptions="scoreTableOptions"
                       :total="scoreTotalCount"
                       @edit="coreEditHandler"
                       @delete="coreDeleteHandler"
                       @size-change="scoreSizeChangeHandler"
                       @page-change="scorePageChangeHandler">
      </custom-el-table>
      <el-dialog
        width="30%"
        top="10vh"
        title="评分修改"
        :visible.sync="innerVisible"
        append-to-body>
        <el-input v-model="score" placeholder="请输入评分"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="editScore">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Works from '@/api/vote/works';
import DetailCard from '@/components/DetailCard';
import Activity from '@/api/vote/activity';
import { parseTime } from '@/utils';

export default {
  name: 'voteWorks',
  components: {
    customElTable,
    DetailCard
  },
  data () {
    return {
      showScore: false,
      tags: [],
      userListQueryFrm: {
        activity_id: '',
        stageName: '',
        missionName: '',
        compositionName: '',
        status: '',
        tags: ''
      },
      tableOptions: [
        {
          label: '编号',
          prop: 'id'
        },
        {
          label: '作品名称',
          prop: 'title'
        },
        {
          label: '作品',
          prop: 'cover',
          width: 260,
          options: {
            type: 'html',
          }
        },
        {
          label: '作品标签',
          prop: 'city_name',
        },
        {
          label: '票数',
          prop: 'tickets'
        },
        {
          label: '评委分',
          prop: 'judge_score'
        },
        {
          label: '最终得分',
          prop: 'final_score'
        },
        {
          label: '智能审核状态',
          prop: 'suggestion_cn',
          options: {
            type: 'tag',
            prop: 'aliyun_status'
          }
        },
        {
          label: '状态',
          prop: 'status_cn',
          options: {
            type: 'tag',
            prop: 'platform_status'
          }
        },
        {
          label: '排名',
          prop: 'ranking',
          sortable: true
        },
        {
          label: '用户姓名',
          prop: 'nickname'
        },
        {
          label: '联系电话',
          prop: 'phone'
        },
        {
          label: '上传时间',
          prop: 'create_time',
          sortable: true
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              label: '查看评论',
              type: 'details'
            },
            {
              type: 'examine',
              options: this.getStatusBtnInfo
            },
            {
              type: 'top',
              options: this.getTop
            },
            {
              label: '刷票',
              type: 'brushTicket'
            },
            {
              label: '拉入黑名单',
              type: 'blacklist',
              disableds: this.ifDisabled
            }
            // {
            //   type: 'see_score',
            //   options: this.getSeeScore
            // }
          ]
        }
      ],
      tableData: [],
      reason: '', // 未过审原因
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      ifWorkDetails: false,
      ifReason: false,
      workDetails: { // 作品详情
        id: 1,
        workType: 2,
        workUrl: '',
        workName: '',
        workDescribe: ''
      },
      activeOptions: [],
      stageOptions: [],
      worksOptions: [],
      activity_id: '',
      composition_id: '',
      stageId: '',
      matchTypeOptions: [
        {
          label: '未审核',
          value: '0'
        },
        {
          label: '已过审',
          value: '1'
        },
        {
          label: '未过审',
          value: '2'
        }
      ],
      tabLoadingScore: false,
      scoreTableOptions: [
        {
          label: '编号',
          prop: 'id'
        },
        {
          label: '评委',
          prop: 'nickname'
        },
        {
          label: '评分',
          prop: 'score'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'edit',
            'del'
          ]
        }
      ],
      scoreTableData: [],
      scorePageIndex: 1,
      scorePageSize: 20,
      scoreTotalCount: 0,
      innerVisible: false,
      score: '',
      user_id: ''
    };
  },
  created () {
    Promise.all([this.getActiveList(), this.getData()])
      .then(() => {
        this.pageLoading = false;
      }).catch(() => {
      this.pageLoading = false;
    });
  },
  methods: {
    cellClickHandler(row, column, cell, event) {
      if (column === 'judge_score') {
        this.activity_id = this.tableData[row].activity_id;
        this.composition_id = this.tableData[row].id;
        this.getScoreData(row);
        this.showScore = true;
      }
    },
    getScoreData() {
      this.tabLoadingScore = true;
      Works.judges.list({
        activity_id: this.activity_id,
        composition_id:  this.composition_id
      }).then(res => {
        this.scoreTableData = res.data;
        // this.totalCount = res.totalCount * 1;
        this.tabLoadingScore = false;
      });
    },
    coreEditHandler(info) {
      this.user_id = info.user_id;
      this.innerVisible = true;
    },
    editScore() {
      Works.judges.edit({
        user_id: this.user_id,
        activity_id: this.activity_id,
        composition_id:  this.composition_id,
        score: this.score
      }).then(res => {
        this.score = '';
        this.getScoreData();
        this.innerVisible = false;
      });
    },
    coreDeleteHandler(info) {
      this.$confirm(`确认删评委 <b>${info.nickname}</b>的评分 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Works.judges.del({
          id: info.id
        })
          .then(() => {
            this.getScoreData();
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    scoreSizeChangeHandler (size) {
      this.scorePageSize = size;
      this.scorePageIndex = 1;
      this.getScoreData();
    },
    scorePageChangeHandler (page) {
      this.scorePageIndex = page;
      this.getScoreData();
    },
    getTop (item) {
      if (!item) {
        return {
          btn: 'primary',
          label: '置顶'
        };
      }
      const status = item.top * 1;
      return {
        btn: status === 0 ? 'primary' : 'danger',
        label: status === 0 ? '置顶' : '取消置顶'
      };
    },
    remoteMethod (name) {
      const obj = {
        page_index: 1,
        page_size: 20,
        name: name
      };
      Works.tags(obj)
        .then(res => {
          this.tags = res.result;
        });
    },
    getData () {
      this.tabLoading = true;
      Works.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        activity_id: this.userListQueryFrm.activity_id,
        stageName: this.userListQueryFrm.stageName,
        missionName: this.userListQueryFrm.missionName,
        compositionName: this.userListQueryFrm.compositionName,
        status: this.userListQueryFrm.status,
        tag_id: this.userListQueryFrm.tags
      }).then(data => {
        data.result.forEach(item => {
          item.aliyun_status = 2;
          if (item.tags && item.tags.length) {
            item.tags = item.tags.join(',');
          } else {
            item.tags = '';
          }
          if (item.suggestion_cn === '已过审') {
            item.aliyun_status = 1;
          } else if (item.suggestion_cn === '未过审') {
            item.aliyun_status = 0;
          }
          if (item.platform_status - 0 === 0) {
            item.platform_status = 3;
          } else if (item.platform_status - 0 === 2) {
            item.platform_status = 0;
          }
          // 缩略图直接显示html
          if(item.type * 1 === 1) { // 视频
            item.cover = `<video controls style="width:200px;" src="${item.detail}"></video>`;
          } else if(item.type * 1 === 2){ // 图片
            item.cover = `<img style="width:100px;" src="${item.image_small || item.cover || item.detail}"/>`;
          } else if(item.type * 1 === 5){ // 音频
            item.cover = `<audio controls src="${item.detail}"></audio>`;
          } else { // 图文 - 4 ||  文字 - 3
            item.cover = `<div style="width: 200px;" v-html="${item.detail}"></div>`;
          }
          if (item.black - 0 === 1) {
            item.status_cn = '黑名单';
            item.platform_status = 2;
          }
          item.create_time = item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--';
        });
        this.tableData = data.result;
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      }).catch(() => {
        this.tabLoading = false;
      });
    },
    getActiveList() {
      Activity.activity.list({
        pageIndex: 1,
        pageSize: 1000
      }).then(data => {
        this.activeOptions = data.result;
      })
    },
    getStage(e) {
      // var item = this.activeOptions.find(item => {
      //   return item.activity_name === e;
      // });
      // console.log(e);
      // this.activity_id = e;
      Activity.stage.list(this.userListQueryFrm.activity_id, {
        pageIndex: 1,
        pageSize: 1000
      }).then(data => {
        this.stageOptions = data.result;
      });
    },
    getWorksList(e) {
      var item = this.stageOptions.find(item => {
        return item.stage_name === e;
      });
      this.stageId = item.id;
      Activity.task.list(this.stageId, {
        pageIndex: 1,
        pageSize: 1000
      }).then(data => {
        this.worksOptions = data.result;
      });
    },
    searchUser () {
      this.pageIndex = 1;
      this.getData();
    },
    workPass () { // 审核通过
      Works.status(this.workDetails.id, { status: 1 }).then(() => {
        this.ifWorkDetails = false;
        this.getData();
      });
    },
    workNoPass () { // 审核未过
      this.ifReason = true;
    },
    submitReason () {
      Works.status(this.workDetails.id, { status: 2, reason: this.reason }).then(() => {
        this.ifReason = false;
        this.ifWorkDetails = false;
        this.getData();
      });
    },
    actionHandler (type, info) {
      if (type === 'examine') {
        this.ifWorkDetails = true;
        this.workDetails.id = info.id; // 将点击获取到的数据保存下来，进行详情渲染
        this.workDetails.workType = info.type - 0;
        this.workDetails.workUrl = info.detail;
        this.workDetails.workName = info.title;
        this.workDetails.workDescribe = info.description;
      } else if (type === 'blacklist') {
        if (info.status - 0 === 4) return;
        this.$confirm(`确认将 ${info.nickname} 的作品 ${info.title} 拉入黑名单吗？`, '黑名单', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Works.black(info.id).then(() => {
            this.getData();
            this.$message({
              type: 'info',
              message: `已拉黑`
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消`
          });
        });
      } else if (type === 'details') {
        this.$router.push({ name: 'voteComment', params: { id: info.id } });
      } else if (type === 'top') {
        this.changeTop(info)
      } else if (type === 'brushTicket') {
        this.brushTicket(info)
      }
    },
    brushTicket (info) {
      let that = this
      this.$prompt(`你正在为“${info.title}”刷票,请输入需要刷到的票数`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let obj = {
          activity_id: info.activity_id,
          composition_id: info.id,
          tickets: value
        }
        Works.brushTicket(obj)
          .then(() => {
            that.$message({
              type: 'success',
              message: '刷票成功'
            });
            that.getData();
          })
      })
    },
    changeTop (info) {
      let top
      info.top == 0 ? top = 1 : top = 0
      Works.changeTop(info.id, top)
        .then(() => {
          this.getData()
        })
    },
    getStatusBtnInfo (item) { // 操作按钮的样式
      if (!item) {
        return {
          btn: 'primary',
          label: '审核'
        };
      }
      return {
        btn: 'primary',
        label: '审核'
      };
    },
    getSeeScore(info) {
      // if (info.score){
      return {
        btn: 'primary',
        label: '查看评分'
      };
      // }
    },
    ifDisabled (item) { // 是否禁用
      if (!item) {
        return false;
      }
      if (item.black - 0 === 1) return true;
    },
    sizeChangeHandler (size) {
      this.pageSize = size;
      this.pageIndex = 1;
      this.getData();
    },
    pageChangeHandler (page) {
      this.pageIndex = page;
      this.getData();
    }
  }
};
</script>
<style scoped>
.workItem {
  display: flex;
}
.workImg {
  width: 540px;
  margin: 14px 0 0;
}
.workImg > img {
  display: inline-block;
  height: auto;
  max-width: 100%;
}
.work-btn {
  width: 40%;
  display: flex;
  margin: 30px auto 0;
  justify-content: space-between;
}
</style>

