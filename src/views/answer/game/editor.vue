/* eslint-disable space-before-function-paren */
<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 14:20:38
 * @LastEditTime: 2019-10-19 20:40:29
 * @LastEditors: shao bo
 -->
<template>
  <div class="app-container"
       v-loading="pageLoading">
    <el-steps :active="activeStep"
              finish-status="success"
              simple
              class="mb-30">
      <el-step title="基本设置"></el-step>
      <!-- <el-step title="界面样式"></el-step> -->
      <el-step title="比赛说明"></el-step>
    </el-steps>
    <el-form :model="gameFrm"
             :rules="frmRules"
             class="from-style"
             ref="gameFrm"
             label-width="120px">
      <template v-if="activeStep===0">
        <el-form-item prop="matchName"
                      label="比赛名称">
          <el-input v-model="gameFrm.matchName"
                    name="name"
                    class="p-width"
                    :clearable="true"
                    :maxlength="25"
                    placeholder="请输入比赛名称"></el-input>
          <small>比赛名称只能输入25个字符</small>
        </el-form-item>
        <el-form-item prop="matchMode"
                      label="游戏模式">
          <el-select placeholder="请选择游戏模式"
                     v-model="gameFrm.matchMode">
            <el-option v-for="item in matchModeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="matchType"
                      label="比赛模式">
          <el-select placeholder="请选择比赛模式"
                     v-model="gameFrm.matchType">
            <el-option v-for="item in matchTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="question_type"
                      label="题库类型">
          <el-select placeholder="请选择题库类型"
                     @change="selectGroup"
                     v-model="gameFrm.question_type">
            <el-option v-for="item in questionTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="gameFrm.question_type == 2">
          <el-form-item prop="group_json"
                        label="比赛题库">
            <div v-for="(item, index) in gameFrm.group_json"
                 :key="index"
                 style="margin-bottom: 15px;">
              <div class="random-groups-items">
                <label>比赛题库</label>
                <el-select placeholder="请选择比赛题库"
                           style="width:180px"
                           v-model="item.groupId">
                  <el-option v-for="val in questionGroupsOptions"
                             :key="val.id"
                             :label="val.title"
                             :value="val.id"></el-option>
                </el-select>
              </div>
              <div class="random-groups-items">
                <label>题库出现数量</label>
                <el-input-number v-model="item.number"
                                 style="width: 150px"
                                 :clearable="true"
                                 :maxlength="25"
                                 placeholder="请输入题库出现数量"></el-input-number>
              </div>
              <div class="random-groups-items">
                <i @click="addGroup(index)"
                   class="el-icon-plus"></i>
                <i v-if="gameFrm.group_json.length > 1"
                   @click="delGroup(index)"
                   class="el-icon-delete"></i>
                <small style="display: inline-block"
                       v-if="index === gameFrm.group_json.length - 1">题库出现数量之和需等于题目总数</small>
              </div>
            </div>
            <small style="color:#f56c6c"
                   v-if="group_json_msg">{{group_json_msg}}</small>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item prop="groups"
                        label="比赛题库">
            <el-select placeholder="请选择比赛题库"
                       multiple
                       v-model="gameFrm.groups">
              <el-option v-for="item in questionGroupsOptions"
                         :key="item.id"
                         :label="item.title"
                         :value="item.id * 1"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item prop="questionNum"
                      label="题目总数">
          <el-input-number v-model="gameFrm.questionNum"
                           :min="1"
                           name="questionNum"
                           placeholder="题目总数"></el-input-number>
        </el-form-item>
        <el-form-item v-if="gameFrm.matchMode==1"
                      prop="answerTime"
                      label="每题时长">
          <el-input-number v-model="gameFrm.answerTime"
                           :min="1"
                           name="answerTime"
                           placeholder="每题时长"></el-input-number>
          <small class="ml-5 text-999">(S)</small>
        </el-form-item>
        <el-form-item prop="score"
                      label="单题得分">
          <el-input-number v-model="gameFrm.score"
                           :min="1"
                           name="score"
                           placeholder="单题得分"></el-input-number>
          <small class="ml-5 text-999"></small>
        </el-form-item>
        <el-form-item v-if="gameFrm.matchType*1 === 2"
                      prop="memberLimit"
                      label="团队人数上限"
                      label-width="auto">
          <el-input-number v-model="gameFrm.memberLimit"
                           :min="1"
                           :max="200"
                           name="memberLimit"></el-input-number>
          <small class="ml-5 text-999">(人)</small>
        </el-form-item>
        <el-form-item v-if="gameFrm.matchMode!=1"
                      class="rel"
                      label="知识背景">
          <el-tooltip class="item abs"
                      effect="dark"
                      content="用户选错答案时，弹出提示框，提示框内容为题目说明"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.show_back"
                          style="width:500px">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="show_find_answer"
                      label="是否开启看答案入口"
                      label-width="auto">
          <el-tooltip class="item abs"
                      style="left:-17px"
                      effect="dark"
                      content="答题结束是否开启看答案入口"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.show_find_answer"
                          style="width:500px">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="rel"
                      label="正确答案告知"
                      label-width="auto">
          <el-tooltip class="item abs"
                      style="left:-17px"
                      effect="dark"
                      content="答案选择错误时，是否提示正确答案"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.show_answer"
                          style="width:500px">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="rel"
                      prop="show_end_time"
                      label="展示比赛倒计时"
                      label-width="auto">
          <el-tooltip class="item abs"
                      style="left:-17px"
                      effect="dark"
                      content="是否展示比赛倒计时"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.show_end_time"
                          style="width:500px">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="time"
                      label="比赛时间">
          <el-date-picker :editable="false"
                          v-model="gameFrm.time"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          unlink-panels
                          align="left"></el-date-picker>
        </el-form-item>
        <el-form-item class="rel"
                      label="比赛次数"
                      label-width="auto">
          <el-tooltip class="item abs"
                      style="left:-17px"
                      effect="dark"
                      content="选择用户比赛次数初始值的方式"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.limit_type">
            <el-radio :label="2">按比赛</el-radio>
            <el-radio :label="1">按日</el-radio>
          </el-radio-group>
          <!-- <el-radio-group v-model="dailyMatchRadio" @change="dailyMatchLimitChange">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">限制
              <el-input
                style="width: 60px"
                type="num"
                v-model="gameFrm.dailyMatchLimit"
                name="host"
                :min="1"
                size="mini"
                :disabled="dailyMatchRadio===0">
              </el-input>
              次
            </el-radio>
          </el-radio-group>-->
        </el-form-item>
        <el-form-item>
          <div v-if="gameFrm.limit_type===2">
            每位用户在该比赛一共有
            <el-input style="width: 60px"
                      type="num"
                      v-model="gameFrm.dailyMatchLimit"
                      name="host"
                      :min="1"
                      size="mini"></el-input>次答题机会
          </div>
          <div v-else>
            <el-radio-group v-model="dailyMatchRadio"
                            @change="dailyMatchLimitChange">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">
                限制
                <span style="color:#000">
                  &nbsp;&nbsp;&nbsp;每天可参加
                  <el-input style="width: 60px"
                            type="num"
                            v-model="gameFrm.dailyMatchLimit"
                            name="host"
                            :min="1"
                            size="mini"
                            :disabled="dailyMatchRadio===0"></el-input>次
                </span>
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item class="rel"
                      prop="shareReward"
                      label="分享奖励">
          <el-tooltip class="item abs"
                      effect="dark"
                      content="用户分享成功得到的比赛次数"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.reward_type"
                          style="width:500px">
            <el-radio :label="1">整数</el-radio>
            <el-radio :label="2">小数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div v-if="gameFrm.reward_type==1">
            可获得答题次数
            <el-input style="width: 60px"
                      type="num"
                      v-model="gameFrm.shareReward"
                      name="host"
                      :min="1"
                      size="mini"></el-input>
          </div>
          <div v-else>
            可获得答题次数
            <el-input style="width: 60px"
                      type="num"
                      v-model="gameFrm.reward_start"
                      name="host"
                      :min="1"
                      size="mini"></el-input>~
            <el-input style="width: 60px"
                      type="num"
                      v-model="gameFrm.reward_end"
                      name="host"
                      :min="1"
                      size="mini"></el-input>
          </div>
        </el-form-item>
        <el-form-item class="rel"
                      label="任务">
          <el-tooltip class="item abs"
                      style="left:-55px"
                      effect="dark"
                      content="选择该比赛是否开启任务"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.mission_switch">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="missions"
                      v-if="gameFrm.mission_switch==1"
                      label="选择任务">
          <!--<el-select v-if="gameFrm.mission_switch==1" placeholder="请选择" multiple v-model="gameFrm.missions" style="display: block;width:250px;">-->
          <!--<el-option v-for="item in tasks" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
          <!--</el-select>-->
          <select-task v-model="gameFrm.missions"
                       :multiple="true" />
        </el-form-item>
        <!--签到-->
        <el-form-item label="签到奖励"
                      v-if="false">
          <el-tooltip class="item abs"
                      effect="dark"
                      content="用户每日签到，获取签到积分"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.daily_sign_status">
            <el-radio :label="2">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="gameFrm.daily_sign_status == 1">
          <el-form-item prop="daily_sign_integral"
                        label="每日签到获得">
            <el-input style="width: 120px"
                      type="num"
                      v-model="gameFrm.daily_sign_integral"
                      name="integral"
                      :min="1"
                      size="mini"></el-input>积分
          </el-form-item>
          <el-form-item prop="daily_sign_continuous_status"
                        label="每日签到获得">
            <el-radio-group v-model="gameFrm.daily_sign_continuous_status">
              <el-radio :label="2">关</el-radio>
              <el-radio :label="1">开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="gameFrm.daily_sign_continuous_status == 1"
                        label>
            连续签到
            <el-input style="width: 60px"
                      type="num"
                      v-model="gameFrm.daily_sign_continuous_days"
                      name="day"
                      :min="1"
                      size="mini"></el-input>天，可额外获得
            <el-input style="width: 100px"
                      type="num"
                      v-model="gameFrm.daily_sign_continuous_days_integral"
                      name="integral"
                      :min="1"
                      size="mini"></el-input>积分
          </el-form-item>
        </template>
        <el-form-item class="rel"
                      prop="dailyShareLimit"
                      label="最大分享奖励"
                      label-width="auto">
          <el-tooltip class="item abs"
                      effect="dark"
                      style="left:-17px"
                      content="通过分享额外获得的次数"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input-number v-model="gameFrm.dailyShareLimit"
                           :min="0"
                           name="dailyShareLimit"
                           placeholder="请输入用户每天最多分享次数"></el-input-number>
        </el-form-item>
        <el-form-item prop="imageUrl"
                      label="比赛配图">
          <upload-prize-avatar v-model="gameFrm.imageUrl"></upload-prize-avatar>
        </el-form-item>
        <el-form-item label="背景音乐">
          <el-upload
            class="upload-demo"
            action="/api/v1/fileUpload/file-upload/file-upload"
            accept=".m4a, .aac, .mp3, .wav"
            :headers="headers"
            :on-remove="onFileRemove"
            :on-success="uploadSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">上传音频</el-button>
            <div slot="tip" class="el-upload__tip">请上传答题比赛背景音乐</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="open_bmg" label="背景音乐开关">
          <el-switch
            v-model="gameFrm.open_bmg"
            active-text="开"
            :active-value="1"
            inactive-text="关"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item prop="share_poster"
                      label="分享海报（选填）">
          <upload-prize-avatar v-model="gameFrm.share_poster"></upload-prize-avatar>
          <el-button v-if="gameFrm.share_poster"
                     @click="deleteImg(1)"
                     type="danger">删除图片</el-button>
        </el-form-item>
        <el-form-item prop="status"
                      label="状态">
          <el-select placeholder="请选择"
                     v-model="gameFrm.status">
            <el-option v-for="item in statusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ranking_pattern"
                      label="排行榜展示模式">
          <el-radio-group v-model="gameFrm.ranking_pattern">
            <el-radio :label="0">通用</el-radio>
            <el-radio :label="1">表单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="gameFrm.ranking_pattern == 1"
                      prop="show_from">
          <el-checkbox-group v-model="gameFrm.show_from"
                             :max="2">
            <el-checkbox v-for="item in rankingFrom"
                         :key="item"
                         :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
          <br />
          <small>排行榜表单模式，只能勾选两项显示再排行榜信息栏中</small>
        </el-form-item>
        <el-form-item prop="notice"
                      label="公告信息">
          <el-input class="p-width"
                    v-model="gameFrm.notice"
                    type="textarea"
                    rows="3"
                    :autosize="true"
                    name="notice"
                    :clearable="true"
                    placeholder="请输入公告信息"></el-input>
          <small>不输入公告信息，c端就不会显示公告；公告信息超过18个字会滚动显示</small>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary"
                     @click.prevent.stop="goToStep(1)">下一步</el-button>
        </el-form-item>
      </template>
      <!-- <template v-else-if="activeStep===1">
        <el-form-item label="比赛首页背景图" class="rel" label-width="auto">
          <el-radio-group v-model="gameFrm.home_type">
            <el-radio :label="1">默认</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="gameFrm.home_type == 2">
          <el-form-item label="IphoneX" class="rel" label-width="auto">
            <upload-prize-avatar v-model="gameFrm.home_img"></upload-prize-avatar>
          </el-form-item>
          <el-form-item label="非IphoneX" class="rel" label-width="auto">
            <upload-prize-avatar v-model="gameFrm.home_img_other"></upload-prize-avatar>
          </el-form-item>
        </template>
        <el-form-item prop="share_desc" label="分享文案">
          <el-input
            v-model="gameFrm.share_desc"
            name="share_desc"
            :clearable="true"
            placeholder="请输入分享文案">
          </el-input>
        </el-form-item>
        <el-form-item prop="share_img" label="分享配图（选填）">
          <upload-prize-avatar v-model="gameFrm.share_img"></upload-prize-avatar>
          <el-button v-if="gameFrm.share_img" @click="deleteImg(2)" type="danger">删除图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click.prevent.stop="goToStep(0)">上一步</el-button>
          <el-button @click.prevent.stop="goToStep(2)">下一步</el-button>
        </el-form-item>
      </template>-->
      <template v-else-if="activeStep===1">
        <el-form-item prop="desc"
                      label="比赛说明模式">
          <el-select placeholder="请选择比赛说明模式"
                     @change="selectGroup"
                     v-model="gameFrm.desc_type">
            <el-option v-for="item in descTypeOptions"
                       :key="item.id"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="gameFrm.desc_type == 2">
          <el-form-item prop="desc"
                        label="比赛说明链接">
            <el-input v-model="gameFrm.desc_link"
                      name="name"
                      class="p-width"
                      :clearable="true"
                      placeholder="请输入比赛说明链接"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item prop="desc"
                        label="比赛说明">
            <tinymce placeholder="请输入比赛说明"
                     :height="300"
                     v-model="gameFrm.desc" />
          </el-form-item>
        </template>
        <el-form-item label="高分攻略"
                      class="rel">
          <el-tooltip class="item abs"
                      effect="dark"
                      content="高分秘籍在排行榜中显示"
                      placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="gameFrm.strategy_switch">
            <el-radio :label="0">隐藏</el-radio>
            <el-radio :label="1">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="strategy_content">
          <tinymce v-if="gameFrm.strategy_switch==1"
                   placeholder="请输入高分攻略"
                   :height="300"
                   v-model="gameFrm.strategy_content" />
        </el-form-item>
        <el-form-item>
          <el-button @click.prevent.stop="goToStep(0)">上一步</el-button>
          <el-button type="primary"
                     @click.prevent.stop="save">保存</el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import Game from '@/api/answer/game';
import Question from '@/api/answer/question';
import Tinymce from '@/components/Tinymce';
import { mapState } from 'vuex';
import uploadPrizeAvatar from '@/components/Upload/singleImage';
import { parseTime } from '@/utils';
import _ from 'lodash';
import Task from '@/api/task/index';
import selectTask from '@/components/task/index';
const TokenKey = 'access_token';
export default {
  name: 'gameEditor',
  components: {
    Tinymce,
    uploadPrizeAvatar,
    selectTask
  },
  data() {
    return {
      headers: {
        'X-ACCESS-TOKEN': Cookies.get(TokenKey)
      },
      fileList: [],
      gameId: this.$route.params.id,
      action: this.$route.params.id ? 'modify' : 'add',
      gameFrm: {
        open_bmg: 0, // 背景音乐开关， 0关， 1开
        bgm_url: '', // 背景url
        matchName: '',
        matchMode: '',
        matchType: '',
        show_end_time: 1,
        answerTime: 10, // 答题时长
        question_type: 1, // 题库类型
        groups: '',
        group_json: [],
        time: [],
        dailyMatchLimit: 0,
        shareReward: 0, // 分享奖励整数
        dailyShareLimit: '',
        imageUrl: '',
        share_poster: '', // 任务分享海报图
        share_img: '', // 比赛分享卡片图
        share_desc: '', // 比赛分享卡片标题
        desc: '',
        desc_type: 1, // 比赛说明类型
        desc_link: '', // 比赛说明H5链接
        notice: '', // 公告
        strategy_switch: 0, // 高分攻略开关
        strategy_content: '', // 高分攻略
        questionNum: 10,
        memberLimit: 200,
        status: 1,
        limit_type: 2, // 1 按天，2 按比赛
        reward_type: 1, // 1是整数2是小数
        reward_start: '', // 分享奖励小数开始
        reward_end: '', // 分享奖励小数结束
        mission_switch: 0, // 是否开启任务
        missions: [], // 选中任务
        score: 10, // 单题得分
        show_back: 0, // 是否展示背景知识
        show_answer: 0, // 正确答案告知
        show_find_answer: 0, // 答题结束是否开启看答案入口
        award_switch: 0, // 是否开启预估奖励
        home_type: 1, // 选择比赛背景配图
        home_img: '', // 比赛背景图路径 IphoneX
        home_img_other: '', // 比赛背景图路径 非IphoneX
        daily_sign_integral: '', // 每日签到获得积分
        daily_sign_status: 2, // 是否开启每日签到.1=开启,2=关闭
        daily_sign_continuous_status: 2, // 是否开启连续签到签到.1=开启,2=关闭
        daily_sign_continuous_days: '', // 连续签到天数
        daily_sign_continuous_days_integral: '', // 连续签到额外获得积
        ranking_pattern: 0,
        show_from: []
      },
      group_json_msg: '',
      frmRules: {
        matchName: [
          {
            required: true,
            message: '比赛名称必填'
          }
        ],
        matchMode: [
          {
            required: true,
            message: '请选择游戏模式'
          }
        ],
        matchType: [
          {
            required: true,
            message: '请选择比赛模式'
          }
        ],
        answerTime: [
          {
            required: true,
            message: '答题时长必填'
          }
        ],
        question_type: [
          {
            required: true,
            message: '请选择题库类型'
          }
        ],
        score: [
          {
            required: true,
            message: '单题得分必填'
          }
        ],
        groups: [
          {
            required: true,
            message: '请选择比赛题库'
          }
        ],
        time: [
          {
            required: true,
            message: '请选择比赛时间'
          }
        ],
        imageUrl: [
          {
            required: true,
            message: '请上传比赛配图'
          }
        ],
        desc: [
          {
            required: true,
            message: '请输入比赛说明'
          }
        ],
        share_desc: [
          {
            required: true,
            message: '请输入分享文案'
          }
        ],
        daily_sign_integral: [
          {
            required: true,
            message: '请输入每日签到获得积分'
          }
        ],
        daily_sign_continuous_status: [
          {
            required: true,
            message: '请选择开启或者关闭连续签到奖励'
          }
        ],
        group_json: [
          {
            required: true,
            message: '请设置比赛题库'
          }
        ]
      },
      activeStep: 0,
      dailyMatchRadio: 0,
      questionGroupsOptions: [],
      tasks: [],
      pageLoading: true,
      imgSizeOptions: {
        size: 500 * 1024,
        width: 640,
        height: 244,
        tips: '只能上传尺寸640px*244px，且不超过500kb的图片'
      },
      statusOptions: [
        {
          label: '禁用',
          value: 0
        },
        {
          label: '启用',
          value: 1
        },
        {
          label: '隐藏',
          value: 2
        }
      ],
      questionTypeOptions: [
        {
          label: '全随机',
          value: 1
        },
        {
          label: '按比例随机',
          value: 2
        }
      ],
      descTypeOptions: [
        {
          label: '富文本',
          value: 1
        },
        {
          label: 'h5',
          value: 2
        }
      ],
      rankingFrom: []
    };
  },
  created() {
    Promise.all([
      Question.group.list({ pageIndex: 1, pageSize: 100000000 }),
      this.getData(),
      Task.getTasks({ page_index: 1, page_size: 100000000 })
    ])
      .then(res => {
        this.questionGroupsOptions = _.filter(res[0].items, item => item.status === 'enable');
        this.tasks = res[2].result;
        this.pageLoading = false;
      })
      .catch(err => {
        console.log('game editor get data error : ', err);
        this.pageLoading = false;
      });
    if (!this.$route.params.id) {
      this.gameFrm.group_json.push({
        groupId: '',
        number: ''
      });
    }
  },
  computed: {
    ...mapState({
      matchModeOptions: state => state.game.matchMode,
      matchTypeOptions: state => state.game.matchType
    })
  },
  methods: {
    uploadSuccess(res) {
      if (res && res.code === 200) {
        this.gameFrm.bgm_url = res.data.url;
      }
    },
    onFileRemove() {
      this.gameFrm.bgm_url = '';
      this.gameFrm.open_bmg = 0;
    },
    getData() {
      if (!this.gameId) return Promise.resolve();
      return Game.get(this.gameId).then(res => {
        this.gameFrm = {
          ...res,
          status: res.status * 1,
          award_switch: res.award_switch - 0,
          mission_switch: res.mission_switch - 0,
          strategy_switch: res.strategy_switch - 0,
          groups: (res.groups || []).map(groupId => groupId * 1),
          time: [parseTime(res.startTime), parseTime(res.endTime)],
          ranking_pattern: res.quiz_match_extend.ranking_pattern || 0,
          show_from: res.quiz_match_extend.show_from || [],
          bgm_url: '',
          open_bmg: 0
        };
        if (res.quiz_match_extend && res.quiz_match_extend.bgm_url) {
          this.fileList = [{name: '音频', url: res.quiz_match_extend.bgm_url }];
          this.gameFrm.bgm_url = res.quiz_match_extend.bgm_url;
          this.gameFrm.open_bmg = res.quiz_match_extend.open_bmg;
        }
        this.rankingFrom = res.quiz_match_extend.from || [];
        this.gameFrm.home_type = res.home_type - 0;
        // this.gameFrm.missions = this.gameFrm.missions.map(item => {
        //   return parseInt(item, 10);
        // });
        (this.gameFrm.group_json || []).map(item => {
          item.groupId = item.groupId * 1;
        });
        // 选中的前置条件，前置中没有，就删除选中的
        this.setShowFrom();

        this.dailyMatchRadio = res.dailyMatchLimit * 1 === 0 ? 0 : 1; // 比赛次数类型
        return res;
      });
    },
    setShowFrom() {
      this.gameFrm.show_from.forEach((item, index) => {
        if (this.rankingFrom.indexOf(item) === -1) {
          this.gameFrm.show_from.splice(index, 1);
          this.setShowFrom();
        }
      });
    },
    selectGroup() {
      if (this.gameFrm.question_type === 1) {
        if (!this.gameFrm.group_json) {
          this.gameFrm.group_json = [];
        }
        if (this.gameFrm.group_json.length === 0) {
          this.gameFrm.group_json.push({
            groupId: '',
            number: ''
          });
        }
      }
    },
    addGroup(index) {
      const obj = {
        groupId: '',
        number: ''
      };
      if (this.verify(this.gameFrm.group_json[index], true).status) {
        this.gameFrm.group_json.push(obj);
      }
    },
    delGroup(index) {
      this.gameFrm.group_json.splice(index, 1);
    },
    verify(obj, showError = false) {
      let tips = '';
      if (!obj.groupId || !obj.number) {
        tips = '请检查比赛题库否配置正确';
        if (showError) {
          this.$message.error(tips);
        }
        return { status: false, tips: tips };
      }
      return { status: true };
    },
    goToStep(step) {
      if (step > this.activeStep) {
        this.$refs.gameFrm.validate(valid => {
          if (valid) {
            this.activeStep = step;
            this.$refs.gameFrm.clearValidate();
          }
        });
      } else {
        this.activeStep = step;
        this.$refs.gameFrm.clearValidate();
      }
    },
    save() {
      this.$refs.gameFrm.validate(valid => {
        if (valid) {
          const frmData = Object.assign({}, this.gameFrm);
          frmData.home_img =
            frmData.home_type * 1 === 1
              ? 'https://scrm-pic.cdn.buerkongjian.com/4d13/28de/4d1328de5cd1c9b398a1cabf291e8a7c.jpg'
              : frmData.home_img;
          frmData.home_img_other =
            frmData.home_type * 1 === 1
              ? 'https://scrm-pic.cdn.buerkongjian.com/4d13/28de/4d1328de5cd1c9b398a1cabf291e8a7c.jpg'
              : frmData.home_img_other;
          this.group_json_msg = '';
          if (frmData.question_type === 2) {
            var num = 0;
            var isEnd = false;
            frmData.group_json.map(item => {
              num += item.number;
              if (!item.groupId || !item.number) {
                isEnd = true;
              }
            });
            if (num !== frmData.questionNum) {
              this.group_json_msg = '题库题目总数设置有误，请重新设置';
              this.$message('题库按比例随机得题目总数与设置题目总数不一致');
              return false;
            } else if (isEnd) {
              this.group_json_msg = '题库按比例随机,比赛题库或者题库出现数量未设置，请完善';
              this.$message('题库按比例随机,比赛题库或者题库出现数量未设置，请完善 ');
              return false;
            }
          }
          if (frmData.time) {
            const timeArr = frmData.time;
            frmData.startTime = timeArr[0];
            frmData.endTime = timeArr[1];
            delete frmData.time;
          }
          if (this.action === 'modify') {
            frmData.id = this.gameId;
          }
          (this.action === 'modify' ? Game.edit(frmData) : Game.add(frmData)).then(() => {
            this.$router.back();
          });
        }
      });
    },
    dailyMatchLimitChange(val) {
      if (val === 0) {
        this.$set(this.gameFrm, 'dailyMatchLimit', 0);
      }
    },
    deleteImg(type) {
      if (type === 2) {
        this.gameFrm.share_img = '';
        return;
      }
      this.gameFrm.share_poster = '';
    },
    addAnswer() {
      this.gameFrm.award_data.push({
        start: '',
        end: '',
        award: ''
      });
    },
    deleteAnswer(index) {
      if (this.gameFrm.award_data.length > 1) {
        this.gameFrm.award_data.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
.rel {
  position: relative;
}
.abs {
  position: absolute;
  left: -80px;
  top: 10px;
}
label {
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
small {
  display: block;
  color: #999999;
}
.p-width {
  width: 500px;
}
.from-style {
  display: block;
  width: 100%;
  max-width: 100% !important;
}
.random-groups-items {
  display: inline-block;
  width: 280px;
}
.random-groups-items i {
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
