<template>
  <el-form-item :label="label">
    <el-radio
      v-model="resourceEnable"
      :label="0">默认
    </el-radio>
    <el-radio
      v-model="resourceEnable"
      :label="1">自定义
    </el-radio>
    <template v-if="resourceEnable === 1">
      <el-upload
        class="activity-upload-item"
        @on-preview="preview"
        :action="$store.state.uploadFileUrl"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :file-list="fileList"
        :http-request="uploadAction"
        :before-upload="beforeAvatarUpload">
        <el-button type="text">点击上传</el-button>
        <template v-if="resource">
          <template v-if="type==='img'">
            <el-button type="text" @click.stop="preview">预览</el-button>
          </template>
          <template v-if="type==='audio'">
            <el-button type="text" @click.stop="playAudio" v-if="!audioIsPlaying">播放</el-button>
            <el-button type="text" @click.stop="stopAudio" v-else>暂停</el-button>
          </template>
        </template>
      </el-upload>
      <template v-if="type==='img'">
        <el-dialog
          class="preview-dialog"
          :title="previewDialogTitle"
          :visible.sync="preViewDialogVisible">
          <div class="preview-wrapper mb-30">
            <div class="preview-box">
              <img :src="resource"/>
            </div>
          </div>
        </el-dialog>
      </template>
      <template v-else-if="type==='audio'">
        <div class="preview-audio-wrapper">
          <audio controls :src="resource" @ended="audioEnded" ref="audio"></audio>
        </div>
      </template>
    </template>
  </el-form-item>
</template>

<script>
  import Upload from '@/api/upload';

  export default {
    name: 'activityResourceItem',
    model: {
      prop: 'resVal',
      event: 'change'
    },
    props: {
      resVal: {},
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'img'
      }
    },
    data() {
      return {
        resourceEnable: 0,
        fileList: [],
        preViewDialogVisible: false,
        previewDialogTitle: '',
        audioIsPlaying: false,
        uploadingFile: null
      };
    },
    computed: {
      resource: {
        get() {
          this.resourceEnable = !!this.resVal >> 0;
          return this.resVal;
        },
        set(res) {
          this.$emit('change', res);
        }
      }
    },
    watch: {
      resource(val) {
        if (val) {
          this.fileList = [{ name: val, status: 'success', url: val }];
        } else {
          this.fileList = [];
        }
      }
    },
    methods: {
      handleRemove(file, fileList) {
        this.resourceEnable = 0;
        this.resource = '';
        this.fileList = [];
      },
      uploadAction(info) {
        this.uploadingFile = info.file;
        return (Upload[this.type])(info.file, 'file', this.uploadProgress).then(res => {
          this.resource = res.url;
          const newSource = { name: res.url, status: 'success', url: res.url };
          if (this.fileList[0]) {
            this.$set(this.fileList, 0, newSource);
          } else {
            this.fileList = [newSource];
          }
          this.uploadingFile = null;
          return info.file;
        }).catch(err => {
          this.fileList = [];
          this.resource = '';
          return Promise.reject(err);
        });
      },
      beforeAvatarUpload(file) {
        const validFileSize = (limit = 5) => {
          const isLtM = file.size / 1024 / 1024 < limit;
          if (!isLtM) {
            this.$message.error(`上传文件大小不能超过 ${limit}MB!`);
          }
          return isLtM;
        };
        if (this.type === 'img') {
          return validFileSize(5);
        } else if (this.type === 'audio') {
          return validFileSize(2);
        }
      },
      beforeRemove() {
        if (this.fileList[0]) {
          return this.$confirm(`确定移除自定义${this.label}？`);
        }
        return true;
      },
      preview() {
        this.preViewDialogVisible = true;
        this.previewDialogTitle = this.label;
      },
      playAudio() {
        const audioEl = this.$refs.audio;
        audioEl && audioEl.play();
        this.audioIsPlaying = true;
      },
      stopAudio() {
        const audioEl = this.$refs.audio;
        audioEl && audioEl.pause();
        this.audioIsPlaying = false;
      },
      audioEnded() {
        this.audioIsPlaying = false;
      },
      uploadProgress(ev) {
        this.fileList = [{
          name: this.uploadingFile.name,
          url: this.uploadingFile.url,
          status: 'uploading',
          percentage: Math.min(parseInt((ev.loaded / ev.total) * 100, 10), 99)
        }];
      }
    }
  };
</script>

<style>
  .preview-dialog .el-dialog {
    max-width: 800px;
  }

  .preview-dialog .el-dialog__header {
    padding: 10px 20px;
    background-color: #f5f5f5;
    box-shadow: 0 1px 2px #eaeaea;
  }

  .preview-dialog .el-dialog__body {
    background-color: #e2e2e2;
  }
</style>
<style scoped>
  .activity-upload-item{
    margin-left: 108px;
  }

  .preview-dialog .preview-box {
    padding: 20px;
    line-height: 0;
    text-align: center;
  }

  .preview-dialog .preview-box img {
    max-width: 100%;
  }

  .preview-audio-wrapper{
    display: none!important;
  }
</style>
