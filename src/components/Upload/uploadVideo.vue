<!--
 * @Description:
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-09-16 14:37:18
 -->
<template>
  <div>
    <template v-if="previewVideo">
      <div class="vdo" :style="width? `width:${width}px` :'width: 600px'" @mouseover="showVdoDel=true" @mouseout="showVdoDel=false">
        <video :src="previewVideo" preload="meta" controls="controls" :width="width?width+'px':'600px'" :height="height?height+'px':'380px'" style="object-fit: initial;width: 100%;"></video>
        <a
          @click.stop.prevent="delVdo"
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
      <el-button v-show="!isUploadLoading" type="primary" @click="add_vdo" plain>上传视频</el-button>
      <input type="file" name="file" id="inputer" ref="inputer" accept="video/*" multiple @change="upload_video_to_server" class="el-upload__input">
    </template>
  </div>
</template>

<script>
import Upload from '@/api/upload';
import axios from 'axios';
import { createUniqueString } from '@/utils';

export default {
  data() {
    return {
      isUploadLoading: false,
      showVdoDel: false,
      uploadPercent: 0,
      uploadData: null,
      coverAtDefault: 1000,
      coverHeightDefault: 500
    };
  },
  model: {
    prop: 'videoUrl',
    event: 'change'
  },
  props: ['videoUrl', 'width', 'height', 'uploadToOss', 'coverAt', 'coverHeight'],
  computed: {
    previewVideo: {
      set(url) {
        this.$emit('change', url);
      },
      get() {
        return this.videoUrl;
      }
    }
  },
  methods: {
    add_vdo() {
      const file = this.$refs.inputer;
      file.click();
    },
    upload_video_to_server(e) {
      const file = e.target.files[0];
      if (this.uploadToOss) {
        this.upload_to_oss(file, createUniqueString() + createUniqueString());
      } else {
        this.new_upload_video(file);
      }
    },
    new_upload_video(file) {
      this.isUploadLoading = true;
      Upload.img(file, 'file', e => {
        this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
      })
        .then(res => {
          this.previewVideo = res.url;
          this.$emit('success', res);
          this.setVdo(res.url, res.cover);
          this.isUploadLoading = false;
        })
        .catch(() => {
          this.isUploadLoading = false;
          this.uploadPercent = 0;
        });
    },
    upload_to_oss(file, fileName) {
      this.getWebUpload(file, fileName);
    },
    getWebUpload(file, fileName) {
      Upload.webUpload().then(res => {
        this.uploadData = res.data;
        this.sendWebUpload(file, fileName);
      });
    },
    sendWebUpload(file, fileName) {
      const pos = file.name.lastIndexOf('.');
      const extName = file.name.substring(pos, file.name.length);
      const req = new FormData();
      const data = this.uploadData;
      console.log('this.uploadData', this.uploadData);
      const imgPath = data.dir + fileName + extName;
      req.append('OSSAccessKeyId', data.accessid);
      req.append('policy', data.policy);
      req.append('signature', data.signature);
      req.append('key', imgPath);
      req.append('success_action_status', '200');
      // req.append('callback', data.callback);
      req.append('name', new Date().getTime() + '_' + fileName);
      req.append('file', file);
      this.isUploadLoading = true;
      this.uploadPercent = 0;
      // oss直传的http接口没有返回数据，返回码200即表示成功
      // axios.post(data.host, req).
      axios({
        url: data.host,
        method: 'post',
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = Math.floor((progressEvent.loaded * 100.0) / progressEvent.total);
            this.uploadPercent = percent < 100 ? percent : 99;
          }
        },
        data: req
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '上传成功'
          });
          const url = 'https://scrm-file.cdn.buerkongjian.com/' + imgPath;
          const coverAt = this.coverAt ? this.coverAt : this.coverAtDefault;
          const coverHeight = this.coverHeight ? this.coverHeight : this.coverHeightDefault;
          const cover = url + '?x-oss-process=video/snapshot,t_' + coverAt + ',f_jpg,w_' + coverHeight + ',h_0';
          this.uploadCover(url, cover);
        } else {
          this.$message({
            type: 'info',
            message: '上传失败'
          });
          this.isUploadLoading = false;
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '上传失败'
        });
        this.isUploadLoading = false;
      });
    },
    uploadCover(url, cover) {
      Upload.img_url(cover).then((res2) => {
        if (res2.code === 200) {
          console.log(res2.data.url);
          this.previewVideo = res2.data.url;
          this.setVdo(url, res2.data.url);
        } else {
          this.previewVideo = cover;
          this.setVdo(url, cover);
        }
        this.isUploadLoading = false;
      }).catch((e) => {
        console.log('下载失败', e);
        this.isUploadLoading = false;
      });
    },
    setVdo(url, cover) {
      this.$emit('setVdo', url, cover);
    },
    delVdo() {
      this.$emit('delVdo');
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

