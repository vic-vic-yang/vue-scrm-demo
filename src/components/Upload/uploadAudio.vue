<template>
  <div>
    <template v-if="previewAudio">
      <div class="vdo" :style="width? `width:${width}px` :'width: 300px'" @mouseover="showVdoDel=true" @mouseout="showVdoDel=false">
        <audio :src="previewAudio" controls @canplay="audioCanplay($event)"></audio>
        <a
          @click.stop.prevent="delAudio"
          class="del"
          @mouseover="showVdoDel=true"
          @mouseout="showVdoDel=false"
          v-show="showVdoDel">
          <i class="el-icon-close"></i>
        </a>
      </div>
    </template>
    <template v-else>
      <el-progress v-show="isUploadLoading"  type="circle" :percentage="uploadPercent"></el-progress>
      <el-button v-show="!isUploadLoading" type="primary" @click="add_audio" plain>上传音频</el-button>
      <input type="file" name="file" id="inputer" ref="inputer" accept="audio/*" multiple @change="new_upload_audio" class="el-upload__input">
    </template>
  </div>
</template>

<script>
import Upload from '@/api/upload';
export default {
  data() {
    return {
      isUploadLoading: false,
      showVdoDel: false,
      uploadPercent: 0
    };
  },
  model: {
    prop: 'audioUrl',
    event: 'change'
  },
  props: ['audioUrl', 'width', 'height'],
  computed: {
    previewAudio: {
      set(url) {
        this.$emit('change', url);
      },
      get() {
        return this.audioUrl;
      }
    }
  },
  methods: {
    add_audio() {
      var file = this.$refs.inputer;
      file.click();
    },
    new_upload_audio(e) {
      var file = e.target.files[0];
      this.isUploadLoading = true;
      Upload.img(file, 'file', e => {
        this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
      })
        .then(res => {
          this.previewAudio = res.url;
          this.$emit('setAudio', res.url);
          this.isUploadLoading = false;
        })
        .catch(() => {
          this.isUploadLoading = false;
          this.uploadPercent = 0;
        });
    },
    audioCanplay(event) {
      this.$emit('getAudioMsg', event.target);
    },
    delAudio() {
      this.$emit('delAudio');
    }
  }
};
</script>

<style scoped>
.vdo{
  position: relative;
  height: auto;
  width: auto;
}
.del{
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(0,0,0,0.6);
  color: #ffffff;
}
</style>

