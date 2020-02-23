<template>
  <div class="app-container" v-loading="tabLoading">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="130px"
    >
      <el-form-item prop="name" label="主题名称">
        <el-input
          v-model="groupFrm.name"
          name="name"
          maxlength="40"
          :clearable="true"
          placeholder="请输入活动标题-长度限制40字"
        />
      </el-form-item>
      <el-form-item prop="description" label="主题说明">
        <el-input
          v-model="groupFrm.description"
          name="description"
          maxlength="40"
          :clearable="true"
          placeholder="请输入活动标题-长度限制40字"
        />
      </el-form-item>
      <el-form-item prop="img" label="主题配图">
        <img-cropper :pic="images" @get_pic="get_pic" type="only" :width="825" :height="462"></img-cropper>
        <small style="display: block; color: rgb(153, 153, 153);">建议尺寸：825 * 462</small>
      </el-form-item>
      <h3 style="width: 130px;text-align: right;margin-top: 40px;">主题内容</h3>
      <el-form-item prop="content" label="添加文稿">
        <tinymce placeholder="请输入文稿内容" :height="300" v-model="groupFrm.content" />
      </el-form-item>
      <el-form-item prop="video" label="添加视频">
        <upload-video v-model="groupFrm.video" @setVdo="setVdo" coverAt="10000" uploadToOss="true" @delVdo="delVdo" />
      </el-form-item>
      <el-form-item prop="audio" label="添加音频">
        <upload-audio
          :audio="groupFrm.audio"
          @setAudio="setAudio"
          @getAudioMsg="getAudioMsg"
          @delAudio="delAudio"
        />
      </el-form-item>
      <el-form-item v-if="groupFrm.audio" prop="audio_name" label="音频名称">
        <el-input
          v-model="groupFrm.audio_name"
          maxlength="10"
          :clearable="true"
          placeholder="请输入音频名称-长度限制10字"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import uploadVideo from '@/components/Upload/uploadVideo.vue';
import uploadAudio from '@/components/Upload/uploadAudio.vue';
import API from '@/api/readingClub/activityManagement';
export default {
  components: {
    Tinymce,
    imgCropper,
    uploadVideo,
    uploadAudio
  },
  data() {
    return {
      tabLoading: false,
      groupFrm: {
        name: '',
        content: '',
        description: '',
        img: '',
        video: '',
        video_cover: '',
        audio: '',
        audio_name: '',
        duration: ''
      },
      images: [],
      frmRules: {
        // 验证规则
        name: [{ required: true, message: '请输入主题名称' }],
        description: [{ required: true, message: '请输入主题说明' }],
        img: [{ required: true, message: '请输上传主题配图' }],
        content: [{ required: true, message: '请输入文稿内容' }],
        audio_name: [{ required: true, message: '请输音频名称' }]
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      API.taskDetail({
        activityId: this.$route.query.activityId,
        id: this.$route.query.id
      }).then(res => {
        this.groupFrm = res;
        this.images = [
          {
            // 裁剪组件内img数据格式
            file_path: res.img
          }
        ];
      });
    }
  },
  methods: {
    save() {
      // if (!groupFrm.content && !groupFrm.video && !groupFrm.audio) {
      //   this.$message.error('请至少填写一种主题内容');
      //   return;
      // }
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          // 检查是否必须视频
          this.checkActivityConfig().then(() => {
            if (!this.$route.query.id) {
              API.addTask({
                activityId: this.$route.query.activityId,
                ...this.groupFrm
              }).then(() => {
                this.successMsg('保存成功');
              });
            } else {
              API.editTask({
                activityId: this.$route.query.activityId,
                id: this.$route.query.id,
                ...this.groupFrm
              }).then(() => {
                this.successMsg('保存成功');
              });
            }
          });
        }
      });
    },
    checkActivityConfig() {
      return new Promise((resolve, reject) => {
        API.activityDetail({ id: this.$route.query.activityId }).then(
          res => {
            if (
              res.extend.punch_condition.indexOf('1') !== -1 &&
              this.groupFrm.video === ''
            ) {
              this.$message.error(
                '当前活动的打卡要求需要观看视频，当前主题需要上传视频'
              );
              return;
            } else {
              resolve();
            }
          }
        );
      });
    },
    successMsg(msg) {
      this.$message({
        message: msg,
        type: 'success'
      });
      setTimeout(() => {
        this.$router.back();
      }, 1800);
    },
    get_pic(data) {
      this.images = data;
      this.groupFrm.img = data[0] && data[0].file_path ? data[0].file_path : '';
    },
    setVdo(url, cover) {
      this.groupFrm.video = url;
      this.groupFrm.video_cover = cover;
    },
    delVdo() {
      this.groupFrm.video = '';
    },
    setAudio(url) {
      this.groupFrm.audio = url;
    },
    getAudioMsg(audio) {
      this.groupFrm.duration = parseInt(audio.duration);
    },
    delAudio() {
      this.groupFrm.audio = '';
    }
  }
};
</script>
