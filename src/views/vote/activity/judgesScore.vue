<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form :model="groupFrm"
             class="code-add__frm"
             :rules="frmRules"
             ref="groupFrm"
             label-width="140px">
      <el-form-item prop="allow_judge_vote"
                    label="特权评委投票">
        <el-radio-group v-model="groupFrm.allow_judge_vote">
          <el-radio :label="1">关</el-radio>
          <el-radio :label="2">开</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="groupFrm.allow_judge_vote == 2">
        <el-form-item label="添加评委">
          <el-radio v-model="add_judges_status" :label="1">生成邀请码</el-radio>
          <el-radio v-model="add_judges_status" :label="2">手动添加</el-radio>
        </el-form-item>
        <el-form-item v-if="add_judges_status === 1">
          <el-select v-model="appId" placeholder="请选择小程序">
            <el-option
              v-for="item in miniOptions"
              :key="item.authorizer_appid"
              :label="item.nick_name"
              :value="item.authorizer_appid">
            </el-option>
          </el-select>
          <el-button type="primary" @click="generateQrCode">生成邀请码</el-button>
        </el-form-item>
        <el-form-item v-if="add_judges_status === 2">
          <el-button type="primary" @click="manualAddition">添加评委</el-button>
        </el-form-item>
        <el-form-item label="评委">
          <div v-for="tag in judges_list" :key="tag.id" style="position:relative;margin-bottom:10px;">
            <el-tag
              style="margin: 0 5px;"
              closable
              type="success"
              @close="closeTag(tag)">
              {{tag.nickname}}
            </el-tag>
            
            <div style="position: absolute;left:200px;top:0;">
              评分作品排名
              <el-input style="width: 60px" v-model="tag.min_judge"></el-input>
              &nbsp;&nbsp;至&nbsp;&nbsp;
              <el-input style="width: 60px" v-model="tag.max_judge"></el-input>&nbsp;&nbsp;名
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="eval_stage" label="评分时间">
          <div>
            <el-radio :label="1" v-model="groupFrm.eval_stage" :disabled="groupFrm.vote_time_type == 1">
              各阶段投票开始前
              <el-input style="width: 60px" :disabled="groupFrm.vote_time_type == 1" v-model="groupFrm.eval_time_front"></el-input> 小时
            </el-radio>
            <small style="display: block;color: #999">注：需要选择投票时间为各阶段开始x小时后</small>
          </div>
          <el-radio :label="2" v-model="groupFrm.eval_stage">
            各阶段投票结束后
            <el-input style="width: 60px" v-model="groupFrm.eval_time_out"></el-input> 小时
          </el-radio>
        </el-form-item>
        <el-form-item prop="eval_number" label="受评作品量" v-if="groupFrm.eval_stage === 2">
          排行榜前 <el-input v-model="groupFrm.eval_number"
                         name="eval_number"
                         style="width:60px;">
        </el-input> 名
          <small style="display: block;color: #999">注: 填0为全选</small>
        </el-form-item>
        <el-form-item prop="eval_judge_percent" label="评委分数占比">
          <el-input-number v-model="groupFrm.eval_judge_percent"
                           :min="1"
                           :max="99"
                           name="fractional_proportion"
                           style="width:140px;">
          </el-input-number>
          <small style="display: block;color: #999">例: 评委分数占70，小程序端用户投票就为30</small>
        </el-form-item>
        <el-form-item prop="allow_change_eval" label="允许修改评委评分">
          <el-radio-group v-model="groupFrm.allow_change_eval">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>

    <!--手动添加评委-->
    <el-dialog title="添加评委" width="80%" top="5vh" :visible.sync="dialogTableVisible">
      <div class="control-group">
        <el-form :inline="true" :model="userListQueryFrm">
          <el-form-item label="姓名">
            <el-input placeholder="姓名" v-model="userListQueryFrm.name"></el-input>
          </el-form-item>
          <el-form-item label="微信昵称">
            <el-input placeholder="微信昵称" v-model="userListQueryFrm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input placeholder="手机号" v-model="userListQueryFrm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <custom-el-table
        v-loading="tabLoading"
        v-model="pageIndex"
        :tableData="tableData"
        :tableOptions="tableOptions"
        :total="totalCount"
        @action="actionHandler"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
    </el-dialog>

    <!--二维码展示-->
    <el-dialog
      title="二维码(可右键另存为)"
      :visible.sync="dialogVisibleCode"
      width="35%">
      <div style="width: 200px;margin: 60px auto">
        <img :src="qr_code" style="width: 200px;height: auto" alt="qr-code"/>
      </div>
      <div style="text-align: right;" v-if="false">
        <el-link v-if="qr_code" target="_blank" type="primary" :href="qr_code" download="qr-code">下载二维码</el-link>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Activity from '@/api/vote/activity';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import { parseTime } from '@/utils';
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';

  export default {
    name: 'judgesScore',
    components: {
      uploadPrizeAvatar,
      customElTable
    },
    data() {
      return {
        pageLoading: true,
        dialogTableVisible: false,
        groupFrm: {
          activity_id: this.$route.params.id,
          allow_judge_vote: 1, // 是否开启特权评委投票1：关闭2：开启
          eval_stage: 1, // 评委评分阶段：1：投票开始前2：投票结束后
          eval_number: '', // 受评作品量 0表所有'
          eval_judge_percent: '', // 评委评分占比
          allow_change_eval: 1, // 是否允许修改评委评分1：不允许2：允许
          eval_time_front: '', // 评分时间
          eval_time_out: '', // 评分时间
          vote_time_type: 1
        },
        frmRules: {

        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        userListQueryFrm: {
          name: '',
          phone: '',
          nickname: ''
        },
        query: null,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 120
          },
          {
            label: '姓名',
            prop: 'user_name'
          },
          {
            label: '微信昵称',
            prop: 'nickname'
          },
          {
            label: '手机号码',
            prop: 'phone_number'
          },
          {
            label: '地址',
            prop: 'address',
            width: 440
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '添加',
                type: 'add'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        add_judges_status: 1,
        miniOptions: [],
        appId: '',
        dialogVisibleCode: false,
        qr_code: '',
        judges_list: []
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        Activity.judges.judges_score({
          activity_id: this.groupFrm.activity_id
        }).then(res => {
          res.allow_change_eval = Number(res.allow_change_eval);
          res.allow_judge_vote = Number(res.allow_judge_vote);
          res.eval_stage = Number(res.eval_stage);
          res.vote_time_type = res.vote_time_type * 1 === 2 ? false : true;
          if(res.eval_stage === 1) {
            res.eval_time_front = res.eval_time;
          } else {
            res.eval_time_out = res.eval_time;
          }
          this.groupFrm = res;
          this.pageLoading = false;
          this.getJudges();
          this.get_mini_list();
        }).catch(() =>{
          this.pageLoading = false;
        })
      },
      get_mini_list() {
        Activity.judges.mini().then(res => {
          this.miniOptions = res.data;
        });
      },
      getUserData() {
        const query = this.query || {};
        this.tabLoading = true;
        Activity.judges.user({
          activity_id: this.groupFrm.activity_id || 0,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchUser() {
        this.query = _.cloneDeep(this.userListQueryFrm);
        this.pageIndex = 1;
        this.getUserData();
      },
      actionHandler(type, info) {
        if (type === 'add') {
          Activity.judges.add({
            user_id: info.id,
            activity_id: this.groupFrm.activity_id
          }).then(res => {
            this.getJudges();
            this.dialogTableVisible = false;
          });
        }
      },
      closeTag(info) {
        this.$confirm(`确认删除评委 <b>${info.nickname}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Activity.judges.del({
            id: info.id
          })
            .then(() => {
              this.getJudges();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getJudges() {
        Activity.judges.list({
          activity_id: this.groupFrm.activity_id
        }).then(res => {
          this.judges_list = res;
        });
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getUserData();
      },
      generateQrCode() {
        if (this.action === 'add') {
          this.message('新建活动成功后，才能手动添加评委');
          return;
        }
        Activity.judges.code({
          activity_id: this.groupFrm.activity_id,
          appId: this.appId,
          path: 'pages-vote/pages-vote/score/works'
          // path: 'pages-vote/pages-vote/vote-item/index'
        }).then(res => {
          this.qr_code = res.data.qr_code;
          this.dialogVisibleCode = true;
        });
      },
      manualAddition() {
        if (this.action === 'add') {
          this.message('新建活动成功后，才能手动添加评委');
          return;
        }
        this.dialogTableVisible = true;
        this.getUserData();
      },
      save() {
        console.log(this.judges_list,this.$route.params);
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            const groupFrm = {};
            groupFrm.activity_id = this.groupFrm.activity_id;
            groupFrm.extend = this.groupFrm;
            delete groupFrm.extend.activity_id;
            if(groupFrm.extend.eval_stage === 1) {
              groupFrm.extend.eval_time = groupFrm.extend.eval_time_front;
            } else {
              groupFrm.extend.eval_time = groupFrm.extend.eval_time_out;
            }

            // 保存评委排名
            let judgesArr = [],activity_id = groupFrm.activity_id;
            this.judges_list.forEach(item => {
              judgesArr.push({
                "activity_id" : activity_id, // 活动id
                "user_id": item.user_id, // 评委id
                "min_judge": item.min_judge, //最小值
                "max_judge": item.max_judge // 最大值
              });
            });
            // 提交评委排名
            Activity.judges.editJudge(judgesArr).then(res => {
              // 提交数据
              Activity.judges.edit_judges_score(groupFrm).then(res => {
                this.$router.back();
              });
            });
            
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
