<template>
  <div class="app-container" v-loading="tabLoading">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="130px"
    >
      <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 15px;">
        <el-step title="基本信息"></el-step>
        <el-step title="活动信息"></el-step>
      </el-steps>
      <template v-if="activeStep === 1">
        <el-form-item prop="name" label="活动标题">
          <el-input
            v-model="groupFrm.name"
            name="name"
            maxlength="40"
            :clearable="true"
            placeholder="请输入活动标题-长度限制40字"
          />
        </el-form-item>
        <el-form-item prop="time" label="创建活动时间">
          <el-date-picker
            :editable="false"
            v-model="groupFrm.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="share_desc" label="活动分享语">
          <el-input
            v-model="groupFrm.share_desc"
            name="share_desc"
            :clearable="true"
            placeholder="请输入活动分享语"
          />
          <small style="color: #999;display: block">活动分享语默认取活动标题</small>
        </el-form-item>
        <el-form-item prop="description" label="活动说明">
          <tinymce placeholder="请输入活动说明" :height="300" v-model="groupFrm.description" />
        </el-form-item>
        <el-form-item prop="list_img" label="活动列表页配图">
          <img-cropper :pic="images[0]" @get_pic="get_pic0" type="only" :width="1065" :height="600"></img-cropper>
          <small style="display: block; color: rgb(153, 153, 153);">建议尺寸：1065 * 600</small>
        </el-form-item>
        <el-form-item prop="view_img" label="活动说明页配图">
          <img-cropper :pic="images[1]" @get_pic="get_pic1" type="only" :width="1125" :height="630"></img-cropper>
          <small style="display: block; color: rgb(153, 153, 153);">建议尺寸：1125 * 660</small>
        </el-form-item>
        <el-form-item prop="share_img" label="转发给好友配图">
          <img-cropper :pic="images[2]" @get_pic="get_pic2" type="only" :width="1125" :height="630"></img-cropper>
          <small style="display: block; color: rgb(153, 153, 153);">建议尺寸：1125 * 660</small>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary" @click.prevent.stop="nextStep(2)">下一步</el-button>
        </el-form-item>
      </template>
      <template v-if="activeStep === 2">
        <template v-if="false">
          <el-form-item class="rel" prop="join_activity_limit" label="参与活动限制">
            <el-tooltip class="item abs" style="position: relative;left:-10px" effect="dark" content="选择该活动是否活动限制" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-radio-group v-model="groupFrm.join_activity_limit">
              <el-radio :label="0">关</el-radio>
              <el-radio :label="1">开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="groupFrm.join_activity_limit==1" prop="missionsArr" label="">
            <!--<el-select placeholder="请选择" multiple v-model="groupFrm.missionsArr" style="display: block;width:250px;">-->
              <!--<el-option v-for="item in tasks" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
            <!--</el-select>-->
            <select-task v-model="groupFrm.missionsArr" :multiple="true"/>
          </el-form-item>
        </template>
        <el-form-item prop="type" label="打卡类型">
          <el-select placeholder="状态" v-model="groupFrm.type">
            <el-option label="自由打卡" value="1" />
            <el-option label="闯关打卡" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="punch_condition" label="打卡要求">
          <el-checkbox-group v-model="groupFrm.punch_condition">
            <el-checkbox label="1">看完整个视频</el-checkbox>
            <el-checkbox label="2" disabled>发表内容</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="allow_reissue" label="允许用户补卡">
          <el-switch
            v-model="groupFrm.allow_reissue"
            :active-value="1"
            :inactive-value="0"
            active-text="允许"
            inactive-text="禁止"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="groupFrm.allow_reissue == 1" prop="reissue_condition" label="补卡要求">
          <el-checkbox-group v-model="groupFrm.reissue_condition">
            <el-checkbox label="1">邀请好友参加活动</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="is_show_calendar" label="打卡日历展示">
          <el-switch
            v-model="groupFrm.is_show_calendar"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </el-form-item>
        <el-form-item prop="is_change_button" label="固底按钮开关">
          <el-switch
            v-model="groupFrm.is_change_button"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </el-form-item>
        <el-form-item prop="button_name" v-if="groupFrm.is_change_button == 1" label="固底按钮名称">
          <el-input
            v-model="groupFrm.button_name"
            name="name"
            :maxlength="4"
            :minlength="1"
            :clearable="true"
            placeholder="请输入固底按钮名称-最少1个字，最多4个字，建议长度限制2-4字"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="nextStep(1)">上一步</el-button>
          <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import API from '@/api/readingClub/activityManagement';
import Task from '@/api/task/index';
import { parseTime } from '@/utils';
import selectTask from '@/components/task/index';

const missionsCheck = (rule, value, callback) => {
  if (value.length === 0) {
    return callback(new Error('请至少选择一个任务'));
  }
  callback();
};
export default {
  components: {
    Tinymce,
    imgCropper,
    selectTask
  },
  data() {
    return {
      activeStep: 1,
      tabLoading: false,
      groupFrm: {
        name: '',
        description: '',
        list_img: '', // 列表页配图
        view_img: '', // 说明页配图
        share_img: '', // 分享海报配图
        share_desc: '',
        time: [],
        missionsArr: [], // 选中任务
        type: '1',
        punch_condition: ['2'],
        allow_reissue: 1,
        reissue_condition: [],
        app_type: 7, // app类型：1答题，2拼团，3积分，4投票，5内容，6读书会，7打卡,
        join_activity_limit: 0, // 参与活动限制
        is_show_calendar: 1, // '打卡日历是否展示0:不展示 1展示',
        is_change_button: 1, // 是否修改底部按钮名字0关闭 1:开启',
        button_name: '立即打卡' // ''按钮名字',
      },
      images: [[], [], []],
      tasks: [],
      frmRules: {
        // 验证规则
        name: [{ required: true, message: '请输入标题' }],
        description: [{ required: true, message: '请输入活动说明' }],
        list_img: [{ required: true, message: '请上传配图' }],
        view_img: [{ required: true, message: '请上传配图' }],
        share_img: [{ required: true, message: '请上传海报' }],
        share_desc: [{ required: false, message: '请输入活动分享语' }],
        time: [{ required: true, message: '请输入创建活动时间' }],
        type: [{ required: true, message: '请选择打卡类型' }],
        punch_condition: [{ required: true, message: '请勾选打卡要求' }],
        reissue_condition: [{required: false, message: '请选择补卡要求' }],
        missionsArr: [{required: missionsCheck, message: '请至少选择一个任务' }]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    Task.getTasks({ page_index: 1, page_size: 100000000 }).then(res => {
      this.tasks = res.result;
    });
    if (!this.$route.query.id) {
      return;
    }
    // http...
    API.activityDetail({ id: this.$route.query.id }).then(res => {
      res.time = [parseTime(res.start_time), parseTime(res.end_time)];

      // 展开extend属性
      res = Object.assign(res.extend, res);
      delete res.extend;

      res.missionsArr = res.missions;
      res.allow_reissue = Number(res.allow_reissue);
      res.join_activity_limit = Number(res.join_activity_limit);
      res.is_show_calendar = Number(res.is_show_calendar);
      res.is_change_button = Number(res.is_change_button);
      this.groupFrm = res;
      this.images[0] = [
        {
          // 裁剪组件内img数据格式
          file_path: res.list_img
        }
      ];
      this.images[1] = [
        {
          // 裁剪组件内img数据格式
          file_path: res.view_img
        }
      ];
      this.images[2] = [
        {
          // 裁剪组件内img数据格式
          file_path: res.share_img
        }
      ];
    });
  },
  methods: {
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
    save() {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            // 修改
            var groupFrm = Object.assign({}, this.groupFrm);
            groupFrm.description = groupFrm.description.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
            API.editActivity({
              queryId: this.$route.query.id,
              ...groupFrm,
              missions: this.groupFrm.missionsArr.toString(),
              start_time: this.groupFrm.time[0],
              end_time: this.groupFrm.time[1]
            }).then(res => {
              this.successMsg('保存成功', this.$route.query.id);
            });
          } else {
            // 新增
            API.addActivity({
              ...this.groupFrm,
              missions: this.groupFrm.missionsArr.toString(),
              start_time: this.groupFrm.time[0],
              end_time: this.groupFrm.time[1]
            }).then(res => {
              this.successMsg('保存成功', res.id);
            });
          }
        }
      });
    },
    successMsg(msg, id) {
      this.$message({
        message: msg,
        type: 'success'
      });
      if (this.$route.query.id) {
        setTimeout(() => {
          this.$router.back();
        }, 1000);
      } else {
        this.$confirm('配置活动成功，去添加主题吧', '提示', {
          confirmButtonText: '立即添加',
          cancelButtonText: '暂不添加',
          type: 'success',
          closeOnClickModal: false
        }).then(() => {
          this.$router.push({name: 'readTaskList', query: {id, type: 'activity'}});
        }).catch(() => {
          this.$router.back();
        });
      }
    },
    get_pic0(data) {
      this.images[0] = data;
      this.groupFrm.list_img =
        data[0] && data[0].file_path ? data[0].file_path : '';
    },
    get_pic1(data) {
      this.images[1] = data;
      this.groupFrm.view_img =
        data[0] && data[0].file_path ? data[0].file_path : '';
    },
    get_pic2(data) {
      this.images[2] = data;
      this.groupFrm.share_img =
        data[0] && data[0].file_path ? data[0].file_path : '';
    }
  }
};
</script>
