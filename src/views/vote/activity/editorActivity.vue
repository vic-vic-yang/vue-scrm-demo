<template>
  <div class="app-container" v-loading="pageLoading">
    <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 15px;">
      <el-step title="基本信息"></el-step>
      <el-step title="活动信息"></el-step>
    </el-steps>
    <el-form :model="groupFrm"
             class="code-add__frm"
             :rules="frmRules"
             ref="groupFrm"
             label-width="140px">
      <template v-if="activeStep === 0">
        <el-form-item prop="activity_name"
                      label="活动标题">
          <el-input v-model="groupFrm.activity_name"
                    name="matchName"
                    :maxlength="18"
                    :clearable="true"
                    placeholder="请输入活动标题(限18字)">
          </el-input>
        </el-form-item>
        <el-form-item prop="description"
                      label="活动说明">
          <tinymce placeholder="请输入活动说明"
                   :height="300"
                   v-model="groupFrm.description" />
        </el-form-item>
        <el-form-item prop="intro"
                      label="活动简介">
          <el-input v-model="groupFrm.intro"
                    name="matchIntro"
                    :clearable="true"
                    :maxlength="58"
                    placeholder="请输入活动简介(限58字符)">
          </el-input>
        </el-form-item>
        <el-form-item prop="rank_rule_desc"
                      label="排名规则说明">
          <tinymce placeholder="请输入排名规则说明"
                   :height="300"
                   v-model="groupFrm.rank_rule_desc" />
        </el-form-item>
        <el-form-item prop="time"
                      label="活动时间">
          <el-date-picker :editable="false"
                          v-model="groupFrm.time"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          align="left"
                          unlink-panels>
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="groupFrm.award_type === 2"
                      prop="award_rich"
                      label="奖项设置">
          <tinymce placeholder="请输入比赛说明"
                   :height="300"
                   v-model="groupFrm.award_rich" />
        </el-form-item>
        <el-form-item v-if="false"
                      style="width:900px"
                      prop='award'
                      label='奖项设置'>
          <el-row :class="{'mb-20': index!==groupFrm.award.length-1}"
                  v-for='(item,index) in groupFrm.award'
                  :key='index'>
            <template>
              <el-col :span='6'>
                奖项名称：
                <el-input v-model='item.awardName'
                          style='width:100px;margin-right:18px'
                          :name="'answerTitle'+index"
                          :clearable='true'
                          label='元'
                          placeholder='请输入奖项名称'>
                </el-input>
              </el-col>
              <el-col :span='6'>
                奖项内容：
                <el-input v-model='item.awardConter'
                          style='width:100px;margin-right:18px'
                          :name="'answerTitle'+index"
                          :clearable='true'
                          placeholder='请输入奖项内容'>
                </el-input>
              </el-col>
              <el-col :span='6'>
                获奖人数：
                <el-input v-model='item.awardNum'
                          style='width:100px;margin-right:18px'
                          :name="'answerTitle'+index"
                          :clearable='true'
                          placeholder='请输入获奖人数'>
                </el-input>
              </el-col>
            </template>
            <el-col :span='6'>
              <template v-if='index===groupFrm.award.length-1'>
                <el-button type='text'
                           icon='el-icon-plus'
                           @click='addAward'>添加</el-button>
                <el-button v-if='groupFrm.award.length>1'
                           type='text'
                           icon='el-icon-delete'
                           @click='deleteAward(index)'>删除</el-button>
              </template>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item 
                      label="活动列表配图">
          <upload-prize-avatar v-model="groupFrm.img"></upload-prize-avatar>
          <small style="color: #999">建议尺寸700*390</small>
          <!-- <img-cropper :pic="images" @get_pic="get_pic" type="only" :width="335" :height="415"></img-cropper> -->
        </el-form-item>
        <el-form-item prop="view_img" label="活动详情页短图">
          <upload-prize-avatar v-model="groupFrm.view_img"></upload-prize-avatar>
          <small style="color: #999">建议尺寸750*578，手机端展示</small>
          <!-- <img-cropper :pic="view_images" @get_pic="get_piv" type="only" :width="375" :height="270"></img-cropper> -->
        </el-form-item>
        <el-form-item prop="pc_view_img" label="活动详情页长图">
          <upload-prize-avatar v-model="groupFrm.pc_view_img"></upload-prize-avatar>
          <small style="color: #999">建议尺寸1440*600，pc端展示</small>
          <!-- <img-cropper :pic="view_images" @get_pic="get_piv" type="only" :width="375" :height="270"></img-cropper> -->
        </el-form-item>
        <el-form-item prop="share_img"
                      label="活动分享配图">
          <upload-prize-avatar v-model="groupFrm.share_img"></upload-prize-avatar>
          <small style="color: #999">建议尺寸630*454</small>
          <!-- <img-cropper :pic="share_images" @get_pic="get_pis" type="only" :width="375" :height="400"></img-cropper> -->
        </el-form-item>
        <el-form-item prop="share_desc"
                      label="活动分享语">
          <el-input v-model="groupFrm.extend.share_desc"
                    name="share_desc"
                    :maxlength="40"
                    :clearable="true"
                    placeholder="请输入活动分享语，不填默认取活动名称(限40字)">
          </el-input>
        </el-form-item>
        <el-form-item prop="composition_share"
                      label="作品分享语">
          <el-input v-model="groupFrm.extend.composition_share"
                    name="composition_share"
                    :maxlength="40"
                    :clearable="true"
                    placeholder="请输入作品分享语，不填默认取作品名称(限40字)">
          </el-input>
        </el-form-item>
        <el-form-item prop="mission_switch"
                      label="有奖任务">
          <el-switch
            v-model="groupFrm.extend.mission_switch">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="groupFrm.extend.mission_switch" label="选择任务">
          <!--<el-select placeholder="请选择任务类型" multiple style="width: 500px;" v-model.num="groupFrm.extend.missions">-->
          <!--<el-option-->
          <!--v-for="item in prizeTask"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <select-task v-model="groupFrm.extend.missions" :multiple="true"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary"
                     @click.prevent.stop="nextStep(1)">下一步</el-button>
        </el-form-item>
      </template>
      <template v-if="activeStep === 1">
        <!--<el-form-item prop='award_type'-->
                      <!--label='奖项类型'>-->
          <!--<el-switch v-model="groupFrm.award_type"-->
                     <!--active-text="列表展示"-->
                     <!--inactive-text="富文本展示"-->
                     <!--:active-value="1"-->
                     <!--:inactive-value="2">-->
          <!--</el-switch>-->
        <!--</el-form-item>-->
        <el-form-item prop="adv"
                      v-if="false"
                      label="广告封面图"
                      label-width="90px">
          <upload-prize-avatar v-model="groupFrm.adv"></upload-prize-avatar>
        </el-form-item>
        <el-form-item prop="allow_upload"
                      label="用户作品上传">
          <div>
            <el-radio-group v-model="groupFrm.allow_upload">
              <el-radio :label="0">关</el-radio>
              <el-radio :label="1">开</el-radio>
            </el-radio-group>
          </div>
          <small class="text-999">是否允许用户在小程序端参赛并且上传作品</small>
        </el-form-item>
        <el-form-item prop="allow_upload_max"
                      v-if="groupFrm.allow_upload == 1"
                      label="相同任务中上传作品数">
          <el-input v-model="groupFrm.allow_upload_max" type="number" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item v-if="groupFrm.allow_upload == 1"
                      prop="entry_conditions"
                      label="报名要求">
          <el-checkbox-group v-model="groupFrm.entry_conditions"
                             class="switch-flex"
                             @change="changeExamine('entry_conditions')">
            <el-checkbox v-for="(item, index) in signGroupsOptions"
                         :key="index"
                         :label="item" :disabled="vote_condition_selected==='doc_condition'">
            </el-checkbox>
          </el-checkbox-group>
          <small class="text-999">多选为所有规则都需要满足才能报名，不选则为没有限制</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="groupFrm.doc_condition" :disabled="vote_condition_selected==='entry_conditions'">
            需要用户填写档案
          </el-checkbox>
        </el-form-item>
        <el-form-item v-if="groupFrm.allow_upload == 1"
                      prop="manual_check"
                      label="报名审核">
          <el-radio-group v-model="groupFrm.manual_check">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="vote_conditions"
                      label="投票要求">
          <el-checkbox-group v-model="groupFrm.vote_conditions"
                             class="switch-flex"
                             @change="changeExamine('vote_conditions')">
            <el-checkbox v-for="(item,index) in voteGroupsOptions"
                         :key="index"
                         :label="item">
            </el-checkbox>
          </el-checkbox-group>
          <small class="text-999">多选为所有规则都需要满足才能投票，不选则为没有限制</small>
        </el-form-item> -->
        <template v-if="wp_img_show">
          <el-form-item prop="wp_img"
                        label="公众号配图"
                        label-width="90px">
            <upload-prize-avatar v-model="groupFrm.wp_img"></upload-prize-avatar>
          </el-form-item>
          <el-form-item prop="authorizer_appid" label="请选择公众号">
            <el-select placeholder="请选择公众号" v-model.number="groupFrm.authorizer_appid">
              <el-option
                v-for="(item, index) in mpOptions"
                :key="index"
                :label="item.nick_name"
                :value="item.authorizer_appid">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item prop="ticket_type"
                      label="投票数">
          <el-radio-group v-model="groupFrm.ticket_type"
                          style="width:500px">
            <el-radio :label="1">活动期间只有一票</el-radio>
            <el-radio :label="2">活动期间可投多票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="groupFrm.ticket_type == 2">
          <div class="editor-item">
            <div>
              活动期间系统每天赠送
              <el-input v-model="groupFrm.daily_tickets"
                        name="matchName"
                        style="width:60px;">
              </el-input>
              票
            </div>
            <div>
              每人每天可为同一作品投
              <el-input v-model="groupFrm.daily_com_tickets"
                        name="matchName"
                        style="width:60px;">
              </el-input>
              票
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="vote_time_type"
                      label="投票时间">
          <el-radio-group v-model="groupFrm.vote_time_type">
            <el-radio :label="1">用户作品提交成功后即可开始投票</el-radio>
            <el-radio :label="2">活动各阶段开始
              <el-input v-model="groupFrm.vote_time"
                        name="matchName"
                        style="width:60px;"
                        :disabled="groupFrm.vote_time_type==1">
              </el-input>小时后可开始投票
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="groupFrm.allow_upload == 1"
                      prop="unlock_type"
                      label="任务解锁规则"
                      style="width:860px">
          <el-radio-group v-model="groupFrm.unlock_type">
            <el-radio :label="1">上一任务解锁时间达到
              <el-input v-model="groupFrm.unlock_hour"
                        name="matchName"
                        style="width:60px;"
                        :disabled="groupFrm.unlock_type==2">
              </el-input>小时后解锁下一任务
            </el-radio>
            <el-radio :label="2">当用户完成上一任务时间达到
              <el-input v-model="groupFrm.next_unlock_hour"
                        name="matchName"
                        style="width:60px;"
                        :disabled="groupFrm.unlock_type==1">
              </el-input>小时后解锁下一任务
            </el-radio>
          </el-radio-group>
          <small class="text-999">填0即为所有任务默认开启</small>
        </el-form-item>

        <el-form-item prop="is_show_rolling" label="是否开启活动详情页顶部提示框">
          <el-radio-group v-model="groupFrm.extend.is_show_rolling">
            <el-radio :label="2">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="rolling_text" label="活动详情页顶部提示框文案" v-if="groupFrm.extend.is_show_rolling == 1">
          <el-input v-model="groupFrm.extend.rolling_text"
                    name="share_desc"
                    :maxlength="40"
                    :clearable="true"
                    placeholder="请输入活动详情页顶部提示框文案(限40字)">
          </el-input>
        </el-form-item>
        <el-form-item prop="is_show_alert" label="是否开启活动首次投票提示框">
          <el-radio-group v-model="groupFrm.extend.is_show_alert">
            <el-radio :label="2">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="alert_text" label="活动首次投票提示框文案" v-if="groupFrm.extend.is_show_alert == 1">
          <el-input v-model="groupFrm.extend.alert_text"
                    name="alert_text"
                    :maxlength="20"
                    :clearable="true"
                    placeholder="请输入活动首次投票提示框文案(限20字)">
          </el-input>
        </el-form-item>
        <el-form-item v-if="groupFrm.allow_upload == 1"
                      prop="content_safe"
                      label="智能审核">
          <el-radio-group v-model="groupFrm.content_safe">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="groupFrm.allow_upload == 1 && groupFrm.content_safe == 0"
                      prop="audit_type"
                      label="审核方式">
          <el-radio-group v-model="groupFrm.audit_type">
            <el-radio :label="1">先发后审</el-radio>
            <el-radio :label="2">先审后发</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="allow_vote_self"
                      label="作者为作品投票">
          <el-radio-group v-model="groupFrm.extend.allow_vote_self">
            <el-radio :label="1">关</el-radio>
            <el-radio :label="2">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="nextStep(0)">上一步</el-button>
          <el-button type="primary"
                     @click.prevent.stop="save">保存</el-button>
        </el-form-item>
      </template>
    </el-form>

    <!--退出提示-->
    <el-dialog
      title="提示"
      top="10vh"
      :visible.sync="dialogVisible"
      width="30%">
      <span>是否确认退出{{action === 'modify' ? '编辑' : '新增'}}活动，点击确认，现填写内容将不会保存,返回至活动列表页。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Activity from '@/api/vote/activity';
import Task from '@/api/task/index';
import Tinymce from '@/components/Tinymce';
import uploadPrizeAvatar from '@/components/Upload/singleImage';
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import { parseTime } from '@/utils';
import customElTable from '@/components/customElTable';
import _ from 'lodash';
import selectTask from '@/components/task/index';

export default {
  name: 'groupEditor',
  components: {
    customElTable,
    Tinymce,
    uploadPrizeAvatar,
    imgCropper,
    selectTask
  },
  data() {
    return {
      dialogVisible: false,
      dialogTableVisible: false,
      groupId: this.$route.params.id,
      action: this.$route.params.id ? 'modify' : 'add',
      images: [], // 裁剪图片
      view_images: [],
      share_images: [],
      vote_condition_selected: '',
      groupFrm: {
        activity_name: '', // 活动标题
        time: [], // 活动时间
        award_type: 1, // 奖项配置
        award: [{
          awardName: '',
          awardConter: '',
          awardNum: ''
        }], // 奖项设置
        award_rich: '', // 奖项设置富文本
        description: '', // 活动说明
        ranking_rule: '', // 排名规则
        intro: '', // 活动简介
        // share_desc: '', // 活动分享文案
        // composition_share: '', // 作品分享文案
        // mission_switch: 0, // 有奖任务开关
        // missions: [], // 选择的有奖任务
        img: '', // 活动配图
        view_img: '', // 活动详情页配图
        pc_view_img:'',// 活动详情页宽图
        share_img: '', // 分享配图
        wp_img: '', // 公众号配图
        allow_upload: 1, // 是否允许用户上传内容
        allow_upload_max: 1,
        entry_conditions: [], // 报名要求
        entry_condition: [], // 报名要求
        enroll_conditions: [],
        enroll_condition: '',
        doc_condition: false,
        manual_check: 0, // 报名审核
        vote_conditions: [], // 投票要求
        vote_condition: [], // 投票要求
        ticket_type: 1, // 投票数
        vote_time_type: 1, // 投票时间
        unlock_type: 1, // 任务解锁规则
        unlock_hour: '0', // 解锁后达到几小时解锁
        next_unlock_hour: '0', // 完成后达到几小时解锁
        content_safe: 1, // 是否开启智能审核：0否，1是
        audit_type: 1, // 审核要求： 1先发后审 2先审后发
        daily_tickets: '0', // 每天可投几票
        daily_com_tickets: '0', // 每天每人可为同一作品投几票
        vote_time: '0', // 活动开始后什么阶段开始投票
        adv: '',
        rank_rule_desc: '',
        authorizer_appid: '',
        extend: {
          activity_id: this.$route.params.id || 0,  //活动id
          share_desc: '', // 活动分享文案
          composition_share: '', // 作品分享文案
          mission_switch: '', // 任务开关：1开，0关
          missions: [],// 任务ids
          rank_rule_desc: '',// 排名规则介绍
          allow_vote_self: 1, // 是否允许作者给自己的作品投票1：不允许 2允许
          is_show_rolling:2,
          rolling_text: '上传作品赢取现金大奖',
          is_show_alert: 2,
          alert_text: '上传作品赢取现金大奖'
        }
      },
      wp_img_show: false, // 公众号配图显示
      activeStep: 0,
      judges_list: [],
      prizeTask: null, // 有奖任务列表
      frmRules: {
        activity_name: [
          {
            required: true, message: '请输入活动标题'
          }
        ],
        allow_upload_max: [
          {
            required: true, message: '请输入用户在相同务中可上传的作品数'
          }
        ],
        intro: [
          {
            required: true, message: '请输入活动简介'
          }
        ],
        time: [
          {
            required: true, message: '请输入活动时间'
          }
        ],
        rank_rule_desc: [
          {
            required: true, message: '请输入排名规则描述'
          }
        ],
        // share_desc: [
        //   {
        //     required: true, message: '请输入活动分享语'
        //   }
        // ],
        // composition_share: [
        //   {
        //     required: true, message: '请输入作品分享语'
        //   }
        // ],
        award_type: [
          {
            required: true, message: '请选择奖项类型'
          }
        ],
        award: [
          {
            required: true, message: '请输入奖项设置'
          }
        ],
        img: [
          {
            required: true, message: '请上传活动列表页配图'
          }
        ],
        view_img: [
          {
            required: true, message: '请上传活动详情页配图'
          }
        ],
        pc_view_img: [
          {
            required: true, message: '请上传活动详情页长图'
          }
        ],
        share_img: [
          {
            required: true, message: '请上传活动分享配图'
          }
        ],
        wp_img: [
          {
            required: true, message: '请上传公众号配图'
          }
        ],
        allow_upload: [
          {
            required: true, message: '请选择是否限制上传作品'
          }
        ],
        ticket_type: [
          {
            required: true, message: '请选择投票数'
          }
        ],
        manual_check: [
          {
            required: true, message: '请选择是否开启报名审核'
          }
        ],
        vote_time_type: [
          {
            required: true, message: '请选择投票时间'
          }
        ],
        unlock_type: [
          {
            required: true, message: '请选择解锁规则'
          }
        ],
        content_safe: [
          {
            required: true, message: '请选择智能审核'
          }
        ],
        audit_type: [
          {
            required: true, message: '请选择审核要求'
          }
        ],
        description: [
          {
            required: true, message: '请输入活动描述'
          }
        ]
      },
      signGroupsOptions: [
        '需要选手验证手机号',
        '需要选手验证实名信息',
        '需要选手关注指定公众号',
        '需要选手填写姓名',
        '需要选手填写学校信息',
        '需要选手填写地区信息',
        '需要选手填写详细地址'
      ],
      voteGroupsOptions: [
        '需要选手验证手机号',
        '需要选手验证实名信息',
        '需要选手关注指定公众号',
        '需要选手填写姓名',
        '需要选手填写学校信息'
      ],
      matchModeOptions: [
        {
          value: 0,
          label: '默认'
        },
        {
          value: 1,
          label: '初赛'
        },
        {
          value: 2,
          label: '复赛'
        },
        {
          value: 3,
          label: '决赛'
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pageLoading: true
    };
  },
  computed: {
    entryConditions() {
      return this.groupFrm.entry_conditions;
    },
    docCondition() {
      return this.groupFrm.doc_condition;
    }
  },
  watch: {
    entryConditions(val) {
      this.checkCondition();
    },
    docCondition(val) {
      this.checkCondition();
    }
  },
  created() {
    this.getPrizeTask();
    this.getMp();
    this.getData();
  },
  methods: {
    getData() {
      if (this.action === 'add') return (this.pageLoading = false);
      Activity.activity.get(this.groupId).then(res => {
        res.time = [parseTime(res.start_time), parseTime(res.end_time)];
        res.entry_conditions = [];
        res.vote_conditions = [];
        res.entry_condition.forEach(item => {
          if (item - 0 === 1) {
            res.entry_conditions.push('需要选手验证手机号');
          } else if (item - 0 === 2) {
            res.entry_conditions.push('需要选手验证实名信息');
          } else if (item - 0 === 3) {
            res.entry_conditions.push('需要选手关注指定公众号');
          } else if (item - 0 === 4) {
            res.entry_conditions.push('需要选手填写姓名');
          } else if (item - 0 === 5) {
            res.entry_conditions.push('需要选手填写学校信息');
          } else if (item - 0 === 6) {
            res.entry_conditions.push('需要选手填写地区信息');
          } else if (item - 0 === 7) {
            res.entry_conditions.push('需要选手填写详细地址');
          }
        });
        res.vote_condition.forEach(item => {
          if (item - 0 === 1) {
            res.vote_conditions.push('需要选手验证手机号');
          } else if (item - 0 === 2) {
            res.vote_conditions.push('需要选手验证实名信息');
          } else if (item - 0 === 3) {
            res.vote_conditions.push('需要选手关注指定公众号');
          } else if (item - 0 === 4) {
            res.vote_conditions.push('需要选手填写姓名');
          } else if (item - 0 === 5) {
            res.vote_conditions.push('需要选手填写学校信息');
          }
        });

        res.extend.mission_switch = Boolean(res.extend.mission_switch * 1); // 有奖任务开关
        res.rank_rule_desc = res.extend && res.extend.rank_rule_desc || '';
        if (res.extend && res.extend.eval_stage * 1 === 1) {
          res.extend.eval_time_front = res.extend.eval_time || '';
        } else {
          res.extend.eval_time_out = res.extend.eval_time || '';
        }

        this.groupFrm = res;
        if (!this.groupFrm.award || this.groupFrm.award.length < 1) {
          this.groupFrm.award = [{
            awardName: '',
            awardConter: '',
            awardNum: ''
          }];
        }
        this.images = [{
          file_path: this.groupFrm.img
        }];
        this.view_images = [{
          file_path: this.groupFrm.view_img
        }];
        this.share_images = [{
          file_path: this.groupFrm.share_img
        }];
        const enroll_conditions = (this.groupFrm.enroll_condition + '').split(',');
        this.groupFrm.enroll_conditions = enroll_conditions;
        for (let i = 0; i < enroll_conditions.length; i++) {
          if (parseInt(enroll_conditions[i]) === 2) {
            this.$set(this.groupFrm, 'doc_condition', true)
          }
        }
        this.changeExamine();
        this.pageLoading = false;
      }).catch((e) => {
        this.pageLoading = false;
        console.log('error:', e);
      });
    },
    getMp() {
      Activity.judges.getMp().then(res => {
        this.mpOptions = res;
      });
    },
    changeExamine() {
      var entry = this.groupFrm.entry_conditions.find(item => {
        return item === '需要选手关注指定公众号';
      });
      var vote =  this.groupFrm.vote_conditions.find(item => {
        return item === '需要选手关注指定公众号';
      });
      if (entry || vote) {
        this.wp_img_show = true;
        this.frmRules.wp_img[0].required = true;
      } else {
        this.wp_img_show = false;
        this.frmRules.wp_img[0].required = false;
      }
    },
    getPrizeTask() {
      Task.getTasks({
        page_index: 1,
        page_size: 500
      }).then(data => {
        this.prizeTask = data.result;
      });
    },
    cancel() {
      this.dialogVisible = true;
    },
    sure() {
      this.$router.back();
    },
    save() {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          const groupFrm = Object.assign({}, this.groupFrm);
          groupFrm.description = groupFrm.description.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
          groupFrm.rank_rule_desc = groupFrm.rank_rule_desc.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
          groupFrm.award_rich = groupFrm.award_rich.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
          groupFrm.start_time = this.groupFrm.time[0];
          groupFrm.end_time = this.groupFrm.time[1];
          groupFrm.entry_condition = [];
          groupFrm.entry_conditions.forEach(item => {
            if (item === '需要选手验证手机号') {
              groupFrm.entry_condition.push(1);
            } else if (item === '需要选手验证实名信息') {
              groupFrm.entry_condition.push(2);
            } else if (item === '需要选手关注指定公众号') {
              groupFrm.entry_condition.push(3);
            } else if (item === '需要选手填写姓名') {
              groupFrm.entry_condition.push(4);
            } else if (item === '需要选手填写学校信息') {
              groupFrm.entry_condition.push(5);
            } else if (item === '需要选手填写地区信息') {
              groupFrm.entry_condition.push(6);
            } else if (item === '需要选手填写详细地址') {
              groupFrm.entry_condition.push(7);
            }
          });
          groupFrm.vote_condition = [];
          groupFrm.vote_conditions.forEach(item => {
            if (item === '需要选手验证手机号') {
              groupFrm.vote_condition.push(1);
            } else if (item === '需要选手验证实名信息') {
              groupFrm.vote_condition.push(2);
            } else if (item === '需要选手关注指定公众号') {
              groupFrm.vote_condition.push(3);
            } else if (item === '需要选手填写姓名') {
              groupFrm.vote_condition.push(4);
            } else if (item === '需要选手填写学校信息') {
              groupFrm.vote_condition.push(5);
            }
          });
          groupFrm.extend.rank_rule_desc = groupFrm.rank_rule_desc;
          delete groupFrm.rank_rule_desc;

          this.enrollCondition(groupFrm);

          (this.action === 'modify'
            ? Activity.activity.edit(groupFrm)
            : Activity.activity.add(groupFrm)).then(res => {
            if (this.action === 'modify') {
              this.$router.replace({ name: 'voteActivity' });
              return;
            }
            this.$confirm('添加活动成功，是否开始配置阶段？', '确认信息', {
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              confirmButtonText: '是',
              cancelButtonText: '否'
            }).then((action) => {
              this.$router.replace({ name: 'newStage', params: { activityId: res.data.id } });
            }).catch(action => {
              this.$router.replace({ name: 'voteActivity' });
            });
          });
        }
      });
    },
    get_pic(data) {
      this.images = data;
      this.groupFrm.img = data[0] && data[0].file_path ? data[0].file_path : '';
    },
    get_piv(data) {
      this.view_images = data;
      this.groupFrm.view_img = data[0] && data[0].file_path ? data[0].file_path : '';
    },
    get_pis(data) {
      this.share_images = data;
      this.groupFrm.share_img = data[0] && data[0].file_path ? data[0].file_path : '';
    },
    addAward() {
      this.groupFrm.award.push({
        awardName: '',
        awardConter: '',
        awardNum: ''
      });
    },
    deleteAward(index) {
      if (this.groupFrm.award.length > 1) {
        this.groupFrm.award.splice(index, 1);
      }
    },
    nextStep(data) {
      if (data > this.activeStep) {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            this.activeStep = data;
            this.$refs.groupFrm.clearValidate();
          }
        });
      } else {
        this.activeStep = data;
        this.$refs.groupFrm.clearValidate();
      }
    },
    enrollCondition(groupFrm) {
      const enroll_conditions = groupFrm.enroll_conditions.filter(item => {
        if (parseInt(item) === 2) {
          return groupFrm.doc_condition;
        }
        return true;
      });
      if (groupFrm.doc_condition) {
        if (enroll_conditions.indexOf('2') < 0) {
          enroll_conditions.push('2');
        }
      }
      groupFrm.enroll_condition = enroll_conditions.join(',');
    },
    checkCondition() {
      if (this.groupFrm.entry_conditions && this.groupFrm.entry_conditions.length > 0) {
        this.vote_condition_selected = 'entry_conditions';
        return;
      }
      if (this.groupFrm.doc_condition) {
        this.vote_condition_selected = 'doc_condition';
        return;
      }
      this.vote_condition_selected = '';
    },
  }
};
</script>

<style scoped>
.editor-item {
  display: flex;
  width: 470px;
  justify-content: space-between;
}
.switch-flex {
  width: 700px;
}
.switch-flex .el-checkbox:nth-child(4) {
  margin: 0;
}
</style>
