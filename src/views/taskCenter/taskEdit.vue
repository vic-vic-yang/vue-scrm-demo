<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:36:22
 * @LastEditTime: 2019-11-05 21:42:11
 * @LastEditors: shao bo
 -->
<template>
  <div class="app-container task-list" style="width:80%">
    <el-form
      class="commodity-edit__form"
      :model="taskFm"
      :rules="frmRules"
      ref="taskFm"
      label-width="160px">
      <!-- 裂变涨粉 -->
      <div class="step-title" v-if="taskFm.task_type * 1 === 2">
        <el-steps :active="active" finish-status="success">
          <el-step title="基本设置"></el-step>
          <el-step title="提醒设置"></el-step>
        </el-steps>
      </div>
      <!--基本设置-->
      <header>基本信息</header>
      <div v-if="active === 0">
        <el-form-item prop="name" label="任务名称" style="width:50%">
          <el-input
            v-model="taskFm.name"
            placeholder="任务名称"
            :maxlength="50"
            name="name"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="pic" label="任务图标">
          <upload-prize-avatar v-model="taskFm.pic" style="margin: 0;" @update:imageId="getPicId"></upload-prize-avatar>
        </el-form-item>
        <el-form-item prop="desc" label="任务描述">
          <el-input
            v-model="taskFm.desc"
            placeholder="任务描述"
            :maxlength="50"
            name="desc"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="deadline" label="任务有效期">
          <el-date-picker
            v-model="taskFm.deadline"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <header>类型条件</header>
        <el-form-item prop="task_type" label="任务类型">
          <el-select v-model="taskFm.task_type" placeholder="任务类型" @change="typeChange">
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="用户完成任务选择" v-if="taskFm.task_type === 8 || taskFm.task_type === 6">
          <el-select v-model="taskFm.type" placeholder="请选择用户完成任务" @change="typeSmallChange">
            <el-option
              v-for="item in finshTaskSelect"
              :key="item.value"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="循环签到" v-if="taskFm.type === 7">
          <el-tooltip class="item abs" effect="dark" content="开启签到循环周期后，系统将按照设定的天数进行签到周期循环" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio-group v-model="taskFm.cycle_status">
            <el-radio label="0">关闭</el-radio>
            <el-radio label="1">开启</el-radio>
          </el-radio-group>
          <el-form-item v-if="taskFm.cycle_status == 1" label="固定循环周期为：">
            <el-input-number style="width: 250px;" v-model="taskFm.cycle_day" :min="1"/>
            天
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="taskFm.type === 1 || taskFm.type === 3 || taskFm.type === 4 || taskFm.type === 5 || taskFm.task_type === 2"
                      prop="app_id"
                      label="选择公众号">
          <el-select v-model="taskFm.app_id" placeholder="公众号">
            <el-option
              v-for="(item, index) in mpList"
              :key="index"
              :label="item.nick_name"
              :value="item.authorizer_appid">
              <span style="float: left">{{ item.nick_name }}</span>
              <span style="float: right; margin-left: 25px; color: #8492a6; font-size: 13px">{{ item.authorizer_appid }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="app_pic" label="公众号配图" v-if="false">
          <upload-prize-avatar v-model="taskFm.app_pic" style="margin: 0;" @update:imageId="getAppPicId"></upload-prize-avatar>
          <small style="color: #999">用户在小程序内客服对话页面收到的引导关注公众号图片</small>
        </el-form-item>
        <el-form-item prop="key_words" label="任务触发关键词" v-if="taskFm.task_type === 2">
          <el-row v-for="(n, idx) in keyWords" :key="n.id">
            <el-col :span="18"  style="margin-bottom: 10px;">
              <el-input
                v-model="n.keyWords"
                placeholder="用户在公众号输入关键词可开启本次任务活动"
                :maxlength="50"
                name="taskDesc"
                :clearable="true"
                >
              </el-input>
            </el-col>
            <el-col :offset="1" :span="4">
              <i :span="2" class="el-icon-delete" @click.stop="delAreaSelect(n.id)" style="color:#fff;background-color: #f56c6c;padding:10px;border-radius:50%;"></i>
              <i :span="2" v-if="idx === keyWords.length - 1" class="el-icon-plus" @click.stop="addAreaSelect" style="color:#fff;background-color: #409eff;padding:10px;border-radius:50%;"></i>
            </el-col>
          </el-row>
          <!--<small style="margin: 0; color: #999">不填写则默认用户进入公众号自动开启此任务活动</small>-->
        </el-form-item>
        <template v-if="taskFm.task_type === 2 || (taskFm.task_type === 8 && taskFm.type !== 7)">
          <el-form-item :label="this.taskFm.type * 1 === 2?'邀请人奖品选择':'奖品选择'" prop="prize_id">
            <select-gift v-model="taskFm.prize_id" :multiple="true"/>
            <small style="display: block;color: #999" v-if="taskFm.type == 2">暂仅支持选择红包、积分类型奖品</small>
          </el-form-item>
          <el-form-item label="发奖策略选择" prop="strategy_id">
            <el-select v-model="taskFm.strategy_id" style="width: 350px;" placeholder="发奖策略选择" @focus="focusStrategyId" clearable>
              <el-option
                v-for="item in strategyList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addStrategyId">新增发奖策略</el-button>
          </el-form-item>
        </template>
        <template v-else-if="taskFm.type === 7">
          <el-form-item label="日签奖励">
            <el-tooltip class="item abs" effect="dark" content="用户每天签到可固定获得的奖励" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-form-item label="奖品选择" style="margin-left:-80px" prop="prize_id">
              <!--<el-select v-model="taskFm.prize_id" style="width: 350px;margin-bottom:8px" placeholder="奖品选择" @change="dayPrizeChange(taskFm.prize_id)">-->
                <!--<el-option-->
                  <!--v-for="item in awardsList"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
              <div style="width: 350px;margin-bottom:8px">
                <select-gift v-model="taskFm.prize_id" :multiple="false" :parameter="{id: taskFm.prize_id}" @giftSuccess="dayPrizeChange"/>
              </div>
            </el-form-item>
            <el-form-item v-if="taskFm.showActive" :label="taskFm.showActive==='1'?'关联答题活动':'关联投票活动'" style="margin-bottom:22px">
              <el-select v-model="taskFm.active_id" style="width: 270px;" placeholder="奖品关联活动">
                <template  v-if="taskFm.showActive * 1 ===1">
                  <el-option
                    v-for="item in answerActivity"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </template>
                <template  v-else>
                  <el-option
                    v-if
                    v-for="item in voteActivity"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="发奖策略选择" style="margin-left:-80px">
              <el-select v-model="taskFm.strategy_id" style="width: 350px;" placeholder="发奖策略选择" @focus="focusStrategyId" clearable>
                <el-option
                  v-for="item in strategyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addStrategyId">新增发奖策略</el-button>
            </el-form-item>
          </el-form-item>
          <el-form-item label="连签奖励">
            <el-tooltip class="item abs" effect="dark" content="用户在一个周期内连续签到N天获得的奖励；一个周期内同一个连签奖励只能领取一次" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-checkbox
              v-model="taskFm.signIn.status"
              true-label="1"
              false-label="0"
              label="开启">
            </el-checkbox>
            <template v-if="taskFm.signIn.status * 1 === 1">
              <div v-for="(item, index) in taskFm.signIn.config" style="width: 65%;padding: 20px;background: #f5f5f5; margin-bottom: 10px;border-radius: 5px;">
                <el-form-item  label="连续天数设置" style="margin-left:-80px;margin-bottom:6px" :key='index'>
                  <el-input-number style="width: 450px;"
                                   v-model="item.day"
                                   :min="index > 0 ? (taskFm.signIn.config[index-1].day+1) : 0"
                                   :max="taskFm.signIn.config[index+1] ? (taskFm.signIn.config[index+1].day-1) : 10000"/>
                  <i
                    :span="2"
                    class="el-icon-delete"
                    v-if="taskFm.signIn.config.length>1"
                    @click.stop="delSignInLine(index)"
                    style="color:#fff;background-color: #f56c6c;padding:10px;border-radius:50%;margin-left:22px;cursor:pointer;"
                  ></i>
                  <i
                    :span="2"
                    v-if="index === taskFm.signIn.config.length - 1"
                    class="el-icon-plus"
                    @click.stop="addSignInLine"
                    style="color:#fff;background-color: #409eff;padding:10px;border-radius:50%;cursor:pointer;"
                  ></i>
                </el-form-item>
                <template v-for="(n, idx) in item.prizes" >
                  <el-form-item label="奖品选择" style="margin-bottom:22px;justify-content:center" :key='n.id'>
                    <!--<el-select v-model="n.prize_id" style="width: 300px;margin-bottom:6px" placeholder="奖品选择" @change="singinPrizeChange(index,idx,n.prize_id)">-->
                      <!--<el-option-->
                        <!--v-for="item in awardsList"-->
                        <!--:key="item.id"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                      <!--</el-option>-->
                    <!--</el-select>-->
                    <div style="width: 300px;margin-bottom:6px;display: inline-block">
                      <select-gift v-model="n.prize_id"
                                   :multiple="false"
                                   :parameter="{n: index, index: idx, id: n.prize_id}"
                                   @giftSuccess="singinPrizeChange"/>
                    </div>
                    <i
                      :span="2"
                      v-if="item.prizes.length>1"
                      class="el-icon-close"
                      @click.stop="delPriceLine(index,idx)"
                      style="color:#fff;background-color: #f56c6c;padding:5px;border-radius:50%;margin-left:22px;vertical-align:top;cursor:pointer;"
                    ></i>
                    <i
                      :span="2"
                      v-if="idx === item.prizes.length - 1"
                      class="el-icon-plus"
                      @click.stop="addPriceLine(index)"
                      style="color:#fff;background-color: #00A600;padding:5px;border-radius:50%;vertical-align:top;cursor:pointer;"
                    ></i>
                    <el-form-item v-if="n.showActive" :label="n.showActive==='1'?'关联答题活动':'关联投票活动'" style="margin-left:-160px">
                      <el-select v-model="n.active_id" style="width: 300px;" placeholder="奖品关联活动">
                        <template  v-if="n.showActive * 1 ===1">
                          <el-option
                            v-for="item in answerActivity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </template>
                        <template  v-else>
                          <el-option
                            v-if
                            v-for="item in voteActivity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                  </el-form-item>
                </template>
              </div>
              <el-form-item label="发奖策略选择" style="margin-left:-80px" :prop="taskFm.signIn.strategy_id" :rules="strategy_rule">
                <el-select v-model="taskFm.signIn.strategy_id" style="width: 350px;" placeholder="发奖策略选择" @focus="focusStrategyId" clearable>
                  <el-option
                    v-for="item in strategyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addStrategyId">新增发奖策略</el-button>
              </el-form-item>
            </template>

          </el-form-item>
        </template>
        <el-form-item prop="prize_config" label="邀请奖励配置" v-if="taskFm.task_type === 6 || taskFm.task_type === 9">
          <el-col>
            <template v-for="(item,index) of taskFm.Invitation">
              <el-checkbox v-model="item.select" :label="item.name" :key='index'></el-checkbox>
              <template v-if="item.select">
                <el-form-item v-if="taskFm.type_small * 1 === 601 && taskFm.task_type === 6" prop="prize_config" label="奖品配置" style="margin-left:-80px" :key='item.name+0'>
                  <el-select v-model="item.config_id" style="width: 350px;margin-bottom:22px" placeholder="奖品配置" @change="prizeAllocation(item, index)">
                    <el-option
                      v-for="item in configList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-col v-for="(n, idx) in item.core" :key="n.id" style="margin-bottom: 10px;">
                    <el-form-item v-if="item.config_id==1" label="答题正确率" style="margin-left:-80px;margin-bottom:6px" :key='n.id+0'>
                      <el-input-number style="width: 110px;"
                                       v-model="n.core[0]"
                                       :min="idx > 0 ? item.core[idx - 1].core[1] : 0"
                                       :max="100" />% 一
                      <el-input-number style="width: 110px;"
                                       v-model="n.core[1]"
                                       :min="idx > 0 ? n.core[0]: 0"
                                       :max="100" />%
                      <i
                        :span="2"
                        class="el-icon-delete"
                        @click.stop="delLine(index,idx)"
                        style="color:#fff;background-color: #f56c6c;padding:10px;border-radius:50%;margin-left:22px"
                      ></i>
                      <i
                        :span="2"
                        v-if="idx === item.core.length - 1"
                        class="el-icon-plus"
                        @click.stop="addLine(index)"
                        style="color:#fff;background-color: #409eff;padding:10px;border-radius:50%;"
                      ></i>
                    </el-form-item>
                    <el-form-item label="奖品选择" style="margin-left:-80px;margin-bottom:22px" :key='n.id+1' :rules="prize_id_rule">
                      <!--<el-select v-model="n.prize_id" style="width: 270px" placeholder="奖品选择" multiple>-->
                        <!--<el-option-->
                          <!--v-for="item in awardsList"-->
                          <!--:key="item.id"-->
                          <!--:label="item.name"-->
                          <!--:value="item.id">-->
                        <!--</el-option>-->
                      <!--</el-select>-->
                      <select-gift v-model="n.prize_id" :multiple="true"/>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item v-else label="奖品选择" style="margin-left:-80px;margin-bottom:22px" :key='item.name+1' :rules="prize_id_rule">
                  <!--<el-select v-model="item.prize_id" style="width: 350px" placeholder="奖品选择" multiple>-->
                    <!--<el-option-->
                      <!--v-for="item in awardsList"-->
                      <!--:key="item.id"-->
                      <!--:label="item.name"-->
                      <!--:value="item.id">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                  <select-gift v-model="item.prize_id" :multiple="true"/>
                </el-form-item>
                <el-form-item label="发奖策略选择" style="margin-left:-80px" :key='item.name' :rules="strategy_rule">
                  <el-select v-model="item.strategy_id" style="width: 350px;" placeholder="发奖策略选择" @focus="focusStrategyId" clearable>
                    <el-option
                      v-for="item in strategyList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-button type="primary" icon="el-icon-plus" size="small" @click="addStrategyId">新增发奖策略</el-button>
                </el-form-item>
              </template>
            </template>
          </el-col>
        </el-form-item>
        <el-form-item prop="fans_status" label="粉丝增长阈值开关" v-if="taskFm.task_type === 2">
          <el-radio-group v-model="taskFm.fans_status">
            <el-radio :label="2">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
          <div v-if="taskFm.fans_status == 1">
            <el-input style="margin-top: 20px;" placeholder="4000" v-model="taskFm.fans_value" type="number">
            </el-input>
            <small style="color: #999">防止裂变涨粉过快引起的封杀风险，默认每天粉丝上涨上限值为4000</small>
          </div>
        </el-form-item>
        <el-form-item v-if="taskFm.task_type === 2 " prop="name" label="完成任务所需邀请人数">
          <el-input
            v-model="taskFm.need_fans"
            placeholder="完成任务所需邀请人数"
            :maxlength="50"
            name="needFans"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="rule" style="width:850px;" :label="taskFm.type === 5 ? '任务说明' : '任务规则'" v-if="taskFm.type === 5 || taskFm.task_type === 2 || taskFm.type === 7">
          <tinymce placeholder="请输入任务说明" :height="300" v-model="taskFm.rule"/>
        </el-form-item>
        <!-- <el-form-item prop="smallPro" label="选择小程序">
          <el-select v-model="taskFm.smallPro" placeholder="选择小程序" multiple>
            <el-option
              v-for="item in smallProlist"
              :key="item.authorizer_appid"
              :label="item.nick_name"
              :value="item.authorizer_appid">
              <span style="float: left">{{ item.nick_name }}</span>
              <span style="float: right; margin-left: 25px; color: #8492a6; font-size: 13px">{{ item.authorizer_appid }}</span>
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="taskFm.type === 1 || taskFm.task_type === 2 || taskFm.task_type === 9" prop="guide_pic" label="引导流程图">
          <el-tooltip class="item abs" effect="dark" content="用户在点击任务去完成任务时，弹出引导流程图" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <upload-prize-avatar v-model="taskFm.guide_pic" style="margin: 0;" @update:imageId="getGuideId"></upload-prize-avatar>
          <small v-if="taskFm.task_type === 2" style="color: #999">(选填)请上传小程序内此任务的用户引导流程图</small>
        </el-form-item>
        <el-form-item v-if="taskFm.type === 3" prop="guide_pic" label="引导关注公众号流程图">
          <upload-prize-avatar v-model="taskFm.guide_pic" style="margin: 0;" @update:imageId="getGuideId"></upload-prize-avatar>
        </el-form-item>
        <template v-if="taskFm.task_type === 6 && taskFm.type === 4">
          <el-form-item prop="share_poster" label="邀请关注公众号海报">
            <upload-prize-avatar v-model="taskFm.share_poster" style="margin: 0;" @update:imageId="getSharePosterId"></upload-prize-avatar>
            <small style="color: #999">可在手机本地/分享朋友圈时查看此邀请海报</small>
          </el-form-item>
          <el-form-item prop="share_poster_title" label="邀请海报文案">
            <el-input
              v-model="taskFm.share_poster_title"
              placeholder="请输入邀请海报文案"
              :maxlength="50"
              name="invite_title"
              :clearable="true"
              >
            </el-input>
            <small style="color: #999">可在邀请海报上查看此文案</small>
          </el-form-item>
        </template>
        <template v-if="taskFm.task_type === 6 && taskFm.type !== 4">
          <el-form-item  prop="share_poster" label="通过海报分享邀请">
            <upload-prize-avatar v-model="taskFm.share_poster" style="margin: 0;" @update:imageId="getSharePosterId"></upload-prize-avatar>
            <small style="color: #999">可在手机本地/分享朋友圈时查看此邀请海报</small>
          </el-form-item>
          <el-form-item prop="share_poster_title" label="海报分享文案">
            <el-input
              v-model="taskFm.share_poster_title"
              placeholder="请输入邀请海报文案"
              :maxlength="50"
              name="invite_title"
              :clearable="true">
            </el-input>
            <small style="color: #999">可在分享海报上查看此文案</small>
          </el-form-item>
        </template>
        <template v-if="taskFm.task_type === 2">
          <el-form-item  prop="share_poster" label="海报图片">
            <upload-prize-avatar v-model="taskFm.share_poster" style="margin: 0;" @update:imageId="getSharePosterId" :quality="1"></upload-prize-avatar>
            <small style="color: #999">请上传公众号内生成的邀请关注海报图片;建议尺寸：750*1260，大小不超过2M</small>
          </el-form-item>
        </template>
        <template v-if="taskFm.task_type === 6 && taskFm.type !== 4">
          <el-form-item prop="share_pic" label="通过微信分享邀请">
            <upload-prize-avatar v-model="taskFm.share_pic" style="margin: 0;" @update:imageId="getSharePicId"></upload-prize-avatar>
            <small style="color: #999">可在分享微信好友时查看此邀请封面</small>
          </el-form-item>
          <el-form-item prop="share_title" label="">
            <el-input
              v-model="taskFm.share_title"
              placeholder="请添加分享小程序卡片标题"
              :maxlength="50"
              name="shar_title"
              :clearable="true">
            </el-input>
            <small style="color: #999">可在分享小程序卡片看此标题文案</small>
          </el-form-item>
        </template>
        <header>其他设置</header>
        <el-form-item v-if="taskFm.type === 7" label="签到入口">
          <el-checkbox
          v-model="taskFm.sign_status"
          true-label="1"
          false-label="0"
          label="用户每日第1次访问小程序时，出现签到任务页面弹窗"></el-checkbox>
        </el-form-item>
        <el-form-item prop="limit_status" label="任务限制" v-if="taskFm.type != 7">
          <el-radio-group v-model="taskFm.limit_status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
          <div v-if="taskFm.limit_status == 1">
            <el-form-item prop="limit_status" label="该任务可完成的总次数上限" label-width="200px" style="margin-top: 20px;margin-left:20px">
              <el-input-number style="width: 450px;"  v-model="taskFm.mission_user_limit" :min="0" placeholder="该任务可完成的总次数上限"/>
            </el-form-item>
            <el-form-item prop="limit_status" label="单个用户每天可完成该任务的次数上限" label-width="220px" style="margin-top: 20px;">
              <el-input-number style="width: 450px;" v-model="taskFm.day_user_finish_limit" :min="0" placeholder="单个用户每天可完成该任务的次数上限"/>
            </el-form-item>
            <el-form-item prop="limit_status" label="单个用户可完成该任务的总次数上限" label-width="200px" style="margin-top: 20px;margin-left:20px">
              <el-input-number style="width: 450px;" v-model="taskFm.user_finish_limit" :min="0" placeholder="单个用户可完成该任务的总次数上限"/>
            </el-form-item>
            <!-- <el-input style="margin-top: 20px;" placeholder="任务总次数限制" v-model="taskFm.mission_user_limit" type="number">
              <template slot="prepend">该任务可完成的总次数上限</template>
            </el-input>
            <el-input style="margin-top: 20px;" placeholder="单个用户每天限制" v-model="taskFm.day_user_finish_limit" type="number">
              <template slot="prepend">单个用户每天可完成该任务的次数上限</template>
            </el-input>
            <el-input style="margin-top: 20px;" placeholder="单个用户总体限制" v-model="taskFm.user_finish_limit" type="number">
              <template slot="prepend">单个用户可完成该任务的总次数上限</template>
            </el-input> -->
          </div>
        </el-form-item>
        <el-collapse v-model="activeNames" accordion  v-if="taskFm.type === 7" class="el-collapse">
          <el-collapse-item name="1">
            <template slot="title">
              展开更多设置
            </template>
            <el-form-item label="抽奖活动展示">
            <el-form-item  v-for="(item,index) of taskFm.sign_extra_config.active" :key="item.id">
              <el-select v-model="item.active_id" style="width: 350px;margin-bottom:8px" placeholder="请选择活动">
                <el-option
                  v-for="item in lotteryActivity"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <i
                :span="2"
                v-if="taskFm.sign_extra_config.active.length > 1"
                class="el-icon-delete"
                @click.stop="delDrawLine(index)"
                style="color:#fff;background-color: #f56c6c;padding:10px;border-radius:50%;margin-left:22px"
              ></i>
              <i
                :span="2"
                v-if="index === taskFm.sign_extra_config.active.length - 1"
                class="el-icon-plus"
                @click.stop="addDrawLine"
                style="color:#fff;background-color: #409eff;padding:10px;border-radius:50%;"
              ></i>
              <el-form-item label="活动展示BANNER" style="margin-left: -40px;">
                <upload-prize-avatar v-model="item.file_path" style="margin-bottom:22px" @update:imageId="(id)=>getdRAWPicId(id,index)"></upload-prize-avatar>
              </el-form-item>
            </el-form-item>
          </el-form-item>
          <el-form-item label="积分商品展示" >
              <el-select v-model="taskFm.sign_extra_config.commodity" style="width: 350px;" placeholder="积分商品展示" multiple>
                <el-option
                  v-for="item in integralCommodity"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :multiple-limit="4">
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!--提醒设置 active === 1-->
      <fission-powder ref="fission" :active="active" :missionId="taskFm.id"></fission-powder>

      <!--底部按钮-->
      <el-form-item>
        <template v-if="taskFm.task_type === 2">
          <el-button v-if="active > 0 && active <= 1" @click="prev">上一步</el-button>
        </template>
        <el-button v-if="active <= 0" style="margin-top: 12px;" @click.stop="cancel">取消</el-button>
        <template v-if="taskFm.task_type === 2">
          <el-button type="primary" v-if="active >= 0 && active < 1" style="margin-top: 12px;" @click="next">保存并下一步</el-button>
        </template>
        <el-button v-if="(active === 1 && taskFm.task_type === 2) || taskFm.task_type !== 2" type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>

    <!--去编辑文章-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleArticle"
      width="30%">
      <span v-if="taskFm.type === 1">新建 {{taskFm.name}} 任务成功，请去设置公众号文章中跳转小程序的路径参数；参数可保证用户从公众号文章成功跳转小程序签到。</span>
      <span v-else>新建 {{taskFm.name}} 任务成功，请去设置文章吧。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleArticle = false">取 消</el-button>
        <el-button type="primary" @click="goEditArticle()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import TASK_API from '@/api/task/index';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import Tinymce from '@/components/Tinymce';
  import qs from 'qs';
  import customElTable from '@/components/customElTable';
  import Strategies from '@/api/integralMall/strategies';
  import Game from '@/api/answer/game';
  import VoteActivity from '@/api/vote/activity';
  import LotteryActivity from '@/api/integralMall/activity';
  import IntegralCommodity from '@/api/integralMall/commodity';
  import { taskType } from './task';
  import selectGift from '@/components/gift/selectGift';
  import fissionPowder from './components/fissionPowder';

  export default {
    name: 'taskAddEdit',
    components: {
      uploadPrizeAvatar,
      customElTable,
      Tinymce,
      selectGift,
      fissionPowder
    },
    data() {
      return {
        dialogVisibleArticle: false,
        active: 0,
        answerActivity: [],
        voteActivity: [],
        lotteryActivity: [],
        integralCommodity: [],
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        finshTaskSelect: [],
        smallProlist: [],
        mpList: [],
        awardsList: [],
        strategyList: [],
        configList: [
          {
            value: '1',
            label: '根据被邀请用户答题正确率发奖'
          }, {
            value: '0',
            label: '无发送奖品条件'
          }
        ],
        taskTypeOptions: taskType,
        taskFm: {
          id: this.$route.params.id,
          name: '', // 任务类型
          pic: '', // 任务图标
          desc: '', // 任务描述
          deadline: '', // 任务有效期
          task_type: '',
          type: '', // 任务类型
          type_small: '', // 被邀用户完成任务选择
          cycle_status: '0',
          app_id: '', // 公众号
          app_pic: '', // 公众号配图
          prize_id: [], // 奖品
          strategy_id: '', // 发奖策略
          showActive: '', // 是否关联活动  1 答题  2 投票
          active_id: '', // 奖品关联活动
          share_title: '', // 分享标题
          share_pic: '', // 分享图片id
          share_poster_title: '', // 分享海报标题
          share_poster: '', // 分享海报id，逗号隔开
          limit_status: 2, // 限制
          mission_user_limit: '', // 任务参与用户限
          day_user_finish_limit: '', // 用户每天完成任务次数限制
          user_finish_limit: '', // 用户完成该任务次数限制
          guide_pic: '', // 引导图
          rule: '', // 规则
          need_fans: '', // 完成任务所需人数
          fans_status: 2, // 粉丝增长阈值开关
          fans_value: 4000, // 粉丝增长值
          mission_keys: '',
          cycle_day: '0',
          Invitation: [
            {
              name: '邀请人奖励',
              select: false,
              strategy_id: '',
              config_id: '0',
              prize_id: '',
              core: [
                {
                  id: new Date().getTime(),
                  core: [0, 100],
                  prize_id: ''
                }
              ]
            },
            {
              name: '被邀请人奖励',
              select: false,
              strategy_id: '',
              config_id: '0',
              prize_id: '',
              core: [
                {
                  id: new Date().getTime(),
                  core: [0, 100],
                  prize_id: ''
                }
              ]
            }
          ],
          signIn: {
            strategy_id: '',
            status: '0',
            config: [
              {
                id: new Date().getTime(),
                day: '',
                prizes: [
                  {
                    prize_id: '',
                    active_id: '',
                    showActive: ''
                  }
                ]
              }
            ]
          },
          sign_extra_config: {
            active: [
              {
                id: new Date().getTime(),
                active_id: '',
                pic_id: '',
                file_path: ''
              }
            ],
            commodity: ''
          }
        },
        pic_id: '',
        app_pic_id: '',
        guide_pic_id: '',
        share_pic_id: '',
        share_poster_id: '',
        paramsData: null,
        readingListLength: 0,
        strategy_rule: {
          required: false, message: '请选择发奖策略'
        },
        prize_id_rule: {
          required: false, message: '请选择奖品'
        },
        frmRules: {
          task_type: [
            { required: true, message: '请选择任务类型', trigger: 'blur' }
          ],
          strategy_id: [
            {
              required: true, message: '请选择发奖策略'
            }
          ],
          prize_id: [
            {
              required: false, message: '请选择奖品'
            }
          ],
          shar_title: [
            {
              required: true, message: '请填写分享标题'
            }
          ],
          app_pic: [
            {
              required: true, message: '公众号配图'
            }
          ],
          guide_pic: [
            {
              required: true, message: '引导流程图'
            }
          ],
          share_poster_title: [
            {
              required: true, message: '请输入邀请海报文案'
            }
          ],
          share_pic: [
            {
              required: true, message: '通过微信分享邀请'
            }
          ],
          share_poster: [
            {
              required: true, message: '请上传海报'
            }
          ],
          pic: [
            {
              required: true, message: '请上传图片'
            }
          ],
          deadline: [
            {
              required: true, message: '请选择任务有效期'
            }
          ],
          name: [
            {
              required: true, message: '请填写任务名称'
            }
          ],
          app_id: [
            {
              required: true, message: '请选择公众号'
            }
          ],
          type: [
            {
              required: true, message: '请选择任务类型'
            }
          ],
          type_small: [
            {
              required: false, message: '请选择完成任务'
            }
          ]
        },
        startPickerOptions: {
          disabledDate(time) {
            const currentDate = new Date();
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        sellEndPickerOptions: {
          disabledDate: (time) => {
            let currentDate = new Date();
            if (this.taskFm.start_time) {
              const currentStartDate = new Date(this.taskFm.start_time);
              if ((+currentStartDate) > (+currentDate)) {
                currentDate = currentStartDate;
              }
            }
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        prizePageIndex: 1,
        prizePageSize: 10000,
        prizeTotalCount: 0,
        activeNames: [],
        keyWords: [
          {
            id: new Date().getTime(),
            keyWords: ''
          }
        ]
      };
    },
    created() {
      this.getAwards();
      this.getStrategies();
      if (this.$route.params.id) {
        this.taskFm.id = this.$route.params.id;
        this.initForm(this.$route.params.id);
      } else {
        this.tabLoading = false;
      }
      this.getAnswerActiv();
      this.getVoteActivity();
      this.getMiniAppids();
      this.getGZHAppids();
      console.log(this.taskFm.signIn.config);
    },
    methods: {
      prizeAllocation(item, index) {
        if (this.taskFm.Invitation[index].config_id * 1 !== 1) {
          this.taskFm.Invitation[index].core = [
            {
              id: new Date().getTime(),
              core: [0, 100],
              prize_id: ''
            }
          ];
        }
      },
      typeSmallChange() {
        if (this.changeTaskType(this.taskFm.type)) {
          this.taskFm.type_small = this.changeTaskType(this.taskFm.type);
        } else {
          this.taskFm.type_small = '';
        }
      },
      changeTaskType(type) {
        var type_small = [601, 602, 603, 604, 605, 606];
        var item = type_small.find(item => {
          return item === Number(type);
        });
        if (item) {
          return item;
        }
        return '';
      },
      focusStrategyId() {
        if (localStorage.getItem('addStrategy')) {
          this.getStrategies().then(res => {
            localStorage.setItem('addStrategy', false);
          });
        }
      },
      addStrategyId() {
        localStorage.setItem('addStrategy', false);
        const { href } = this.$router.resolve({ name: 'addPlot', query: {type: 'newAdd' }});
        window.open(href, '_blank');
      },
      getStrategies() {
        return Strategies.list({
          page_index: this.prizePageIndex,
          page_size: this.prizePageSize,
          status: 1
        }).then(result => {
          this.strategyList = [];
          for (const item of result.result) {
            if (Number(item.status) === 1) {
              this.strategyList.push(item);
            }
          }
          return result;
        }).catch(() => {
        });
      },
      setFrmRulesMessage() {
        this.frmRules.type_small.required = false;
        switch (this.taskFm.type * 1) {
          case 2:
            this.frmRules.guide_pic[0].message = '(选填)请上传引导流程图';
            this.frmRules.guide_pic[0].required = false;
            this.frmRules.share_poster[0].message = '请上传海报图片';
            break;
          case 6:
            this.frmRules.share_poster[0].message = '通过海报分享邀请';
            this.frmRules.share_pic[0].message = '通过微信分享邀请';
            this.frmRules.type_small[0].required = true;
            break;
          default:
            break;
        }
        switch (this.taskFm.type_small * 1) {
          case 1:
            this.frmRules.guide_pic[0].message = '请上传引导流程图';
            this.frmRules.share_poster[0].message = '请上传海报图片';
            break;
          case 3:
            this.frmRules.guide_pic[0].message = '请上传引导关注公众号流程图';
            break;
          case 4:
            this.frmRules.share_poster[0].message = '请上传邀请关注公众号海报';
            break;
          case 5:
            this.frmRules.guide_pic[0].message = '请上传引导流程图';
            break;
          default:
            break;
        }
      },
      setTypeSmall() {
        taskType.map(item => {
          if (item.value === this.taskFm.task_type) {
            this.finshTaskSelect = item.content || [];
          }
        });
      },
      typeChange() {
        if (this.taskFm.task_type === 2 || this.taskFm.task_type === 9) {
          this.taskFm.type = this.taskFm.task_type;
        }
        this.setTypeSmall();
        this.setFrmRulesMessage();
        this.$refs.taskFm.clearValidate();
        this.taskFm.type = '';
        if (this.taskFm.type * 1 === 7 && this.lotteryActivity.length === 0) {
          this.getlotteryActive();
        }
        if (this.taskFm.type * 1 === 7 && this.integralCommodity.length === 0) {
          this.getIntegralCommodity();
        }
      },
      getPicId(id) {
        this.pic_id = id;
      },
      getAppPicId(id) {
        this.app_pic_id = id;
      },
      getGuideId(id) {
        this.guide_pic_id = id;
      },
      getSharePosterId(id) {
        this.share_poster_id = id;
      },
      getSharePicId(id) {
        this.share_pic_id = id;
      },
      getdRAWPicId(id, index) {
        this.taskFm.sign_extra_config.active[index].pic_id = id;
      },
      prev() {
        if (this.active-- < 0) this.active = 0;
      },
      next() {
        this.$refs.taskFm.validate(valid => {
          if (valid) {
            this.saveData().then((res) => {
              if (this.active++ > 1) this.active = 0;
              this.$refs.taskFm.clearValidate();
              this.$refs.fission.getStatus();
            });
          }
        });
      },
      addAreaSelect() {
        this.keyWords.push({
          id: new Date().getTime(),
          area: ''
        });
      },
      delAreaSelect(id) {
        if (this.keyWords.length > 1) {
          let _idx = -1;
          _idx = this.keyWords.findIndex(item => {
            return item.id === id;
          });
          this.keyWords.splice(_idx, 1);
        }
      },
      setPrize(data) {
        const result = [];
        let prize = {};
        if (data) {
          const params = JSON.parse(data);
          let i = 1;
          for (const item of params) {
            prize = {
              id: (new Date().getTime()) + i,
              core: [item.s, item.e],
              prize_id: item.prize_id.split(',')
            };
            result.push(prize);
            i++;
          }
        }
        return result;
      },
      getSignData(sign_award) {
        let params = '';
        if (this.taskFm.signIn.status * 1 !== 1) {
          sign_award.cycle = {
            status: this.taskFm.signIn.status
          };
          params = JSON.stringify(sign_award);
        } else if (this.taskFm.signIn.config.length > 0 && this.taskFm.signIn.config[0].day !== '' && this.taskFm.signIn.config[0].prizes[0].prize_id) {
          for (const item of this.taskFm.signIn.config) {
            for (const data of item.prizes) {
              if (data.prize_id && data.showActive && !data.active_id) {
                this.$message({
                  message: '请选择奖品对应的活动',
                  type: 'error'
                });
                return false;
              }
            }
          }
          sign_award.cycle = this.taskFm.signIn;

          params = JSON.stringify(sign_award);
        }
        return params;
      },
      setTaskType() {
        var type = Number(this.taskFm.type);
        switch (type) {
          case 1:
          case 3:
          case 5:
          case 7:
            this.taskFm.task_type = 8;
            this.taskFm.type = type;
            break;
          case 4:
            this.taskFm.task_type = 6;
            this.taskFm.type = type;
            break;
          default:
            this.taskFm.task_type = this.taskFm.type;
            this.taskFm.type = type;
            break;
        }
      },
      initForm(id) {
        TASK_API.getTaskDetails(id).then(res => {
          this.pic_id = res.pic && res.pic.length && res.pic[0].id || '';
          res.pic = res.pic && res.pic.length && res.pic[0].file_path || '';
          res.deadline = [res.start_time, res.end_time];
          res.type = Number(res.type);
          res.limit_status = Number(res.limit_status) || 2;
          this.guide_pic_id = res.guide_pic && res.guide_pic.length && res.guide_pic[0].id || '';
          res.guide_pic = res.guide_pic && res.guide_pic.length && res.guide_pic[0].file_path || '';
          this.share_poster_id = res.share_poster && res.share_poster.length && res.share_poster[0].id || '';
          res.share_poster = res.share_poster && res.share_poster.length && res.share_poster[0].file_path || '';
          this.app_pic_id = res.app_pic && res.app_pic.length && res.app_pic[0].id || '';
          res.app_pic = res.app_pic && res.app_pic.length && res.app_pic[0].file_path || '';
          res.fans_status = Number(res.fans_status);
          this.share_pic_id = res.share_pic && res.share_pic.length && res.share_pic[0].id || '';
          res.share_pic = res.share_pic && res.share_pic.length && res.share_pic[0].file_path || '';
          this.taskFm = Object.assign({}, this.taskFm, res);
          if (res.type * 1 === 6 || res.type * 1 === 4 || res.type * 1 === 9) {
            this.taskFm.Invitation[0].select = res.invite_prize_award * 1 === 1;
            this.taskFm.Invitation[1].select = res.prize_award * 1 === 1;
            if (res.type * 1 === 6 && this.taskFm.type_small * 1 === 601) {
              // 答题任务
              this.taskFm.Invitation[0].config_id = res.invite_prize_condition;
              this.taskFm.Invitation[1].config_id = res.prize_condition;
              if (res.invite_prize_condition * 1 === 1) {
                this.taskFm.Invitation[0].core = this.setPrize(res.invite_prize_condition_prize_id);
              } else {
                this.taskFm.Invitation[0].core[0].prize_id = res.invite_prize_id.split(',');
              }
              if (res.prize_condition * 1 === 1) {
                this.taskFm.Invitation[1].core = this.setPrize(res.prize_condition_prize_id);
              } else {
                this.taskFm.Invitation[1].core[0].prize_id = res.prize_id.split(',');
              }
            } else {
              // 被邀请其他任务
              if (res.invite_prize_award * 1 === 1) {
                this.taskFm.Invitation[0].prize_id = res.invite_prize_id.split(',');
              }
              if (res.prize_award * 1 === 1) {
                this.taskFm.Invitation[1].prize_id = res.prize_id.split(',');
              }
            }
            this.taskFm.Invitation[0].strategy_id = res.invite_prize_strategy_id;
            this.taskFm.Invitation[1].strategy_id = res.prize_strategy_id;
          } else if (res.type * 1 === 2) {
            // 裂变涨粉
            this.taskFm.prize_id = res.invite_prize_id.split(',');
            this.taskFm.strategy_id = res.invite_prize_strategy_id;
          } else if (res.type * 1 === 7) {
            // 签到任务
            res.sign_award = JSON.parse(res.sign_award);
            this.taskFm.prize_id = res.sign_award.single.prize_id;
            this.taskFm.strategy_id = res.sign_award.single.strategy_id;
            this.taskFm.active_id = res.sign_award.single.active_id;
            this.taskFm.showActive = res.sign_award.single.showActive;
            if (res.sign_award.cycle.status * 1 === 1) {
              this.taskFm.signIn = res.sign_award.cycle;
            }
            if (res.sign_extra_config) {
              this.taskFm.sign_extra_config = JSON.parse(res.sign_extra_config);
              this.activeNames = ['1'];
            }
            this.getlotteryActive();
            this.getIntegralCommodity();
            // this.taskFm.sign_extra_config =  JSON.parse(res.sign_extra_config)
          } else {
            // 其他任务
            this.taskFm.prize_id = res.prize_id.split(',');
            this.taskFm.strategy_id = res.prize_strategy_id;
          }
          if (res.mission_keys.length) {
            this.keyWords = res.mission_keys.map(key => {
              return {
                keyWords: key,
                id: new Date().getTime() + Math.random()
              };
            });
          } else {
            this.keyWords = [
              {
                keyWords: '',
                id: new Date().getTime() + Math.random()
              }
            ];
          }
          this.setTaskType();
          this.setTypeSmall();
          this.setFrmRulesMessage();
          if (this.taskFm.type_small * 1 && (this.taskFm.task_type === 6 || this.taskFm.task_type === 8)) {
            this.taskFm.type = this.taskFm.type_small;
          }
          console.log(this.taskFm);
        });
      },
      getAwards() {
        TASK_API.getGiftList({
          page_size: this.prizePageSize,
          page_index: this.prizePageIndex,
          status: 1
        }).then(res => {
          this.awardsList = res.result || [];
          this.prizeTotalCount = res.totalCount * 1;
          // this.judgePrize(['206','228']);
        });
      },
      pageChangeHandler(page) {
        this.prizePageIndex = page;
        this.getAwards();
      },
      getMiniAppids() {
        TASK_API.getMiniAppids().then(res => {
          this.smallProlist = res;
        });
      },
      getGZHAppids() {
        TASK_API.getGZHAppids().then(res => {
          this.mpList = res;
        });
      },
      save() {
        this.$refs.taskFm.validate(valid => {
          if (valid) {
            if (this.taskFm.type * 1 === 2) {
              this.cancel();
            } else {
              this.saveData();
            }
          }
        });
      },
      getPrize(data) {
        const result = [];
        let prize = {};
        for (const item of data) {
          if (!this.judgePrize(item.prize_id)) {
            return false;
          }
          prize = {
            s: item.core[0],
            e: item.core[1],
            prize_id: (item.prize_id.map(data => data)).join(',')
          };
          result.push(prize);
        }
        return JSON.stringify(result);
      },
      saveData() {
        if (this.taskFm.radio === '1') {
          if (!this.taskFm.dayLimit || this.taskFm.dayLimit < 1) {
            this.$message({
              message: '请填写每日限定次数',
              type: 'warning'
            });
            return;
          }
          if (!this.taskFm.totalLimit || this.taskFm.totalLimit < 1) {
            this.$message({
              message: '请填写总限定次数',
              type: 'warning'
            });
            return;
          }
        }
        if (!this.prizeVerification()) {
          this.$message({
            type: 'info',
            message: '请选择奖品'
          });
          return;
        }
        // if (this.taskFm.type_small * 1 === 601 && this.taskFm.task_type === 6) {
        //   this.taskFm.Invitation.map(item => {
        //     if (item.select * 1) {
        //       item.core.map(val => {
        //         if (val.config_id * 1 === 1) {
        //
        //         }
        //       });
        //     }
        //   });
        // }
        var params1 = this.setParameter();
        const formData1 = qs.stringify(params1);
        const urls = this.action === 'modify' ? TASK_API.editTask(params1.id, formData1) : TASK_API.addTask(formData1);
        // 添加任务 or 编辑
        return urls.then(res => {
          if (res && res.id) {
            params1.id = res.id;
          }
          if (params1.type === 1 || params1.type === 5) {
            this.dialogVisibleArticle = true;
          } else if (params1.type * 1 === 2) {
            return res;
          } else {
            this.cancel();
          }
        }).catch(e => {
          console.log(e);
          return e;
        });
      },
      cancel() {
        if (this.$route.query && this.$route.query.type === 'newAdd') {
          this.$router.replace({ name: 'taskManage' });
        } else {
          this.$router.back();
        }
      },
      goEditArticle() {
        if (this.taskFm.type * 1 === 5) {
          this.$router.push({name: 'taskArticle', query: {id: this.taskFm.id, name: this.taskFm.name}});
        } else if (this.taskFm.type * 1 === 1) {
          this.$router.push({name: 'taskArticleParameter', query: {id: this.taskFm.id, name: this.taskFm.name}});
        }
      },
      delLine(num, index) {
        if (this.taskFm.Invitation[num].core.length > 1) {
          this.taskFm.Invitation[num].core.splice(index, 1);
        }
      },
      addLine(num) {
        if (this.taskFm.Invitation[num].core[this.taskFm.Invitation[num].core.length - 1].core[1] === 100) {
          this.$message({
            type: 'info',
            message: '答题正确率最大只能是100'
          });
          return;
        }
        this.taskFm.Invitation[num].core.push({
          id: new Date().getTime(),
          core: [0, 100],
          prize_id: ''
        });
      },
      delSignInLine(index) {
        if (this.taskFm.signIn.config.length > 1) {
          this.taskFm.signIn.config.splice(index, 1);
        }
      },
      addSignInLine() {
        console.log('=====');
        this.taskFm.signIn.config.push({
          id: new Date().getTime(),
          day: '',
          prizes: [
            {
              id: new Date().getTime(),
              prize_id: '',
              active_id: '',
              showActive: false
            }
          ]
        });
      },
      delPriceLine(n, index) {
        if (this.taskFm.signIn.config[n].prizes.length > 1) {
          this.taskFm.signIn.config[n].prizes.splice(index, 1);
        }
      },
      addPriceLine(n) {
        this.taskFm.signIn.config[n].prizes.push({
          id: new Date().getTime(),
          prize_id: '',
          active_id: '',
          showActive: false
        });
      },
      delDrawLine(index) {
        if (this.taskFm.sign_extra_config.active.length > 1) {
          this.taskFm.sign_extra_config.active.splice(index, 1);
        }
      },
      addDrawLine() {
        this.taskFm.sign_extra_config.active.push({
          id: new Date().getTime(),
          active_id: '',
          pic_id: '',
          file_path: ''
        });
      },
      singinPrizeChange({ n, index, id }) {
        for (const item of this.awardsList) {
          if (Number(item.id) === Number(id)) {
            this.taskFm.signIn.config[n].prizes[index].showActive = '';
            this.taskFm.signIn.config[n].prizes[index].active_id = '';
            if (item.type * 1 === 4) {
              this.taskFm.signIn.config[n].prizes[index].showActive = '1';
            }
            if (item.type * 1 === 5) {
              this.taskFm.signIn.config[n].prizes[index].showActive = '2';
            }
            return;
          }
        }
      },
      dayPrizeChange({ id }) {
        if (id) {
          this.frmRules.prize_id[0].required = false;
        }
        for (const item of this.awardsList) {
          if (Number(item.id) === Number(id)) {
            this.taskFm.showActive = '';
            this.taskFm.active_id = '';
            if (item.type * 1 === 4) {
              this.taskFm.showActive = '1';
            }
            if (item.type * 1 === 5) {
              this.taskFm.showActive = '2';
            }
            return;
          }
        }
      },
      getVoteActivity() {
        VoteActivity.activity.list({
          pageIndex: 1,
          pageSize: 100
        }).then(res => {
          this.voteActivity = (res.result || []).map(item => {
            return {
              ...item,
              name: item.activity_name
            };
          });
        });
      },
      getAnswerActiv() {
        Game.list({
          pageIndex: 1,
          pageSize: 100
        }).then(res => {
          this.answerActivity = (res.result || []).map(item => {
            return {
              ...item,
              name: item.matchName
            };
          });
        });
      },
      getlotteryActive() {
        this.tabLoading = true;
        LotteryActivity.list({
          page_index: 1,
          page_size: 100
        }).then(res => {
          this.lotteryActivity = res.result || [];
        });
      },
      getIntegralCommodity() {
        IntegralCommodity.list({
          page_index: 1,
          page_size: 100,
          status: 1
        }).then(res => {
          this.integralCommodity = res.result || [];
        });
      },
      // 判断对答题次数和投票次数 奖品是否都选了
      judgePrize(ids) {
        const paramsA = [];
        const paramsB = [];
        for (const item of this.awardsList) {
          if (item.type * 1 === 4) {
            paramsA.push(item.id);
          }
          if (item.type * 1 === 5) {
            paramsB.push(item.id);
          }
        }
        var mixA = paramsA.filter(function(item) {
          return ids.indexOf(item) !== -1;
        });
        var mixB = paramsB.filter(function(item) {
          return ids.indexOf(item) !== -1;
        });
        if (mixA && mixA.length && mixB && mixB.length) {
          this.$message({
            type: 'error',
            message: '不能同时包括答题次数和投票次数奖品'
          });
          return false;
        }
        return true;
      },
      prizeVerification() {
        var type = Number(this.taskFm.type);
        var status = true;
        if (this.taskFm.task_type === 6 || this.taskFm.task_type === 9) {
          if (this.taskFm.type_small * 1 === 601 && this.taskFm.task_type === 6) {
            this.taskFm.Invitation.map(item => {
              if (item.select * 1) {
                item.core.map(val => {
                  if (!val.prize_id) {
                    status = false;
                  }
                });
              }
            });
          } else {
            this.taskFm.Invitation.map(item => {
              if (item.select * 1) {
                if (!item.prize_id || !item.prize_id.length) {
                  status = false;
                }
              }
            });
          }
        } else if (this.taskFm.task_type === 2 || (this.taskFm.task_type === 8 && type !== 7)) {
          if (!this.taskFm.prize_id || !this.taskFm.prize_id.length) {
            status = false;
          }
        } else if (type === 7) {
          if (!this.taskFm.prize_id) {
            status = false;
          }
          if (this.taskFm.signIn.status * 1) {
            this.taskFm.signIn.config.map(item => {
              (item.prizes || []).map(val => {
                if (!val.prize_id) {
                  status = false;
                }
              });
            });
          }
        }
        return status;
      },
      setParameter() {
        var params1 = Object.assign({}, this.taskFm);
        if (params1.task_type === 6 || params1.task_type === 8) {
          if (this.changeTaskType(params1.type)) {
            params1.type_small = this.changeTaskType(params1.type);
            params1.type = params1.task_type;
          } else {
            delete params1.type_small;
          }
        } else {
          delete params1.type_small;
          params1.type = params1.task_type;
        }
        params1.start_time = params1.deadline[0];
        params1.end_time = params1.deadline[1];
        delete params1.deadline;
        delete params1.update_time;
        delete params1.create_time;
        params1.pic = this.pic_id;
        params1.app_pic = this.app_pic_id;
        params1.guide_pic = this.guide_pic_id;
        params1.share_pic = this.share_pic_id;
        params1.share_poster = this.share_poster_id;
        // 邀请用户完成任务
        if (params1.type * 1 === 6 || params1.type * 1 === 4 || params1.type * 1 === 9) {
          params1.invite_prize_award = params1.Invitation[0].select ? 1 : 0;
          params1.prize_award = params1.Invitation[1].select ? 1 : 0;
          if (params1.type * 1 === 6 && params1.type_small * 1 === 601) {
            // 答题任务
            params1.invite_prize_condition = params1.Invitation[0].config_id;
            params1.prize_condition = params1.Invitation[1].config_id;
            if (params1.invite_prize_award === 1) {
              if (params1.invite_prize_condition * 1 === 1) {
                params1.invite_prize_condition_prize_id = this.getPrize(params1.Invitation[0].core);
                if (params1.invite_prize_condition_prize_id === false) return;
              } else {
                if (!this.judgePrize(params1.Invitation[0].core[0].prize_id)) {
                  return;
                }
                params1.invite_prize_id = (params1.Invitation[0].core[0].prize_id.map(data => data)).join(',');
              }
            }
            if (params1.prize_award === 1) {
              if (params1.prize_condition * 1 === 1) {
                params1.prize_condition_prize_id = this.getPrize(params1.Invitation[1].core);
                if (params1.prize_condition_prize_id === false) return;
              } else {
                if (!this.judgePrize(params1.Invitation[1].core[0].prize_id)) {
                  return;
                }
                params1.prize_id = (params1.Invitation[1].core[0].prize_id.map(data => data)).join(',');
              }
            }
          } else {
            // 被邀请其他任务
            if (params1.invite_prize_award === 1) {
              if (!this.judgePrize(params1.Invitation[0].prize_id)) {
                return;
              }
              params1.invite_prize_id = (params1.Invitation[0].prize_id.map(data => data)).join(',');
            }
            if (params1.prize_award === 1) {
              if (!this.judgePrize(params1.Invitation[1].prize_id)) {
                return;
              }
              params1.prize_id = (params1.Invitation[1].prize_id.map(data => data)).join(',');
            }
          }
          if ((params1.invite_prize_award === 1 && !params1.Invitation[0].strategy_id) || (params1.prize_award === 1 && !params1.Invitation[1].strategy_id)) {
            this.$message({
              type: 'error',
              message: '请选择奖品策略'
            });
            return;
          }
          params1.invite_prize_strategy_id = params1.Invitation[0].strategy_id;
          params1.prize_strategy_id = params1.Invitation[1].strategy_id;
          delete params1.sign_extra_config;
        } else if (params1.type * 1 === 2) {
          // 裂变涨粉
          if (!this.judgePrize(params1.prize_id)) {
            return;
          }
          params1.invite_prize_award = 1;
          params1.invite_prize_id = (params1.prize_id.map(priz => priz)).join(',');
          params1.invite_prize_strategy_id = params1.strategy_id;
          delete params1.prize_id;
          delete params1.sign_extra_config;
        } else if (params1.type * 1 === 7) {
          // 签到任务
          if (!this.judgePrize(params1.prize_id)) {
            return;
          }
          // 连续签到天数不能大于循环周期
          if (params1.cycle_status * 1 === 1 && params1.signIn.status * 1 === 1 && params1.cycle_day < params1.signIn.config[params1.signIn.config.length - 1].day) {
            this.$message({
              type: 'error',
              message: '连续签到天数不能大于循环周期'
            });
            return;
          }
          const sign_award = {
            single: {
              prize_id: params1.prize_id,
              strategy_id: params1.strategy_id,
              active_id: params1.active_id,
              showActive: params1.showActive
            },
            cycle: ''
          };
          params1.sign_award = this.getSignData(sign_award);
          params1.sign_extra_config = JSON.stringify(params1.sign_extra_config);
          if (params1.sign_award === false) return;
          delete params1.prize_id;
          delete params1.strategy_id;
        } else {
          // 其他任务
          if (!this.judgePrize(params1.prize_id)) {
            return;
          }
          params1.prize_award = 1;
          params1.prize_id = (params1.prize_id.map(priz => priz)).join(',');
          params1.prize_strategy_id = params1.strategy_id;
          delete params1.sign_extra_config;
        }
        delete params1.strategy_id;
        delete params1.Invitation;
        delete params1.signIn;
        if (params1.type === 2) {
          params1.mission_keys = JSON.stringify(this.keyWords.map(item => {
            return item.keyWords;
          })); // 关键词，数组json后
        }
        if (params1.limit_status * 1 !== 1) {
          delete params1.mission_user_limit;
          delete params1.day_user_finish_limit;
          delete params1.user_finish_limit;
        }
        if (params1.fans_status * 1 !== 1) {
          delete params1.fans_value;
        }
        if (params1.type * 1 !== 6 && params1.type * 1 !== 8) {
          delete params1.type_small;
        }
        if (params1.type * 1 !== 2) {
          delete params1.mission_keys;
        }
        return params1;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .commodity-edit__form{
    max-width: 1200px !important;
  }
  .step-title{
    margin-bottom: 40px;
    margin-left: 160px;
  }
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }

  .el-collapse{
    border:0;
    margin-left:100px;
    .el-collapse{
      border-bottom: 0
    }
  }

</style>
