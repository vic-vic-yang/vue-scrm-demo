<template>
  <div class="upload-container">
    <el-upload
      v-show="!isUploadLoading"
      :style="uploadStyle"
      class="single-image__uploader"
      :action="$store.state.uploadImgUrl"
      :show-file-list="false"
      :multiple="false"
      :http-request="uploadActionFile"
      :before-upload="beforeImageUpload">
      <template  v-if="previewImg">
        <img
          @mouseover="showImageDel=true"
          @mouseout="showImageDel=false"
          :src="previewImg"
          class="preview-img"/>
        <a
          v-if="showDelImage"
          @click.stop.prevent="delImageHandler"
          class="del"
          @mouseover="showImageDel=true"
          @mouseout="showImageDel=false"
          v-show="showImageDel">
          <i class="el-icon-close"></i>
        </a>
      </template>
      <i v-else :class="['el-icon-plus', 'single-uploader__icon', size]"></i>
      <div slot="tip" class="el-upload__tip text-danger m-0">{{tips}}</div>
    </el-upload>
    <el-progress v-show="isUploadLoading" type="circle" :percentage="uploadPercent"></el-progress>
  </div>
</template>

<script>
  import Upload from '@/api/upload';
  import { compressImage } from '@/utils';
  // import lrz from 'lrz';

  export default {
    name: 'singleImageUpload',
    model: {
      prop: 'imageUrl',
      event: 'change'
    },
    props: {
      size: {
        type: String,
        default: 'middle'
      },
      imageId: {
        type: [String, Number],
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      sizeOptions: {
        type: Object,
        default() {
          return {
            size: 1024 * 1024 * 5,
            tips: '图片大小不能超过5MB,请重新上传'
          };
        }
      },
      tips: {
        type: String
      },
      showDelImage: {
        type: Boolean,
        default: false
      },
      sizeCompress: {// 图片超过多少size被压缩，及压缩提示语
        type: Object,
        default() {
          return {
            size: 1024 * 1024 * 2,
            tips: '图片大小超过2MB,将会被压缩,有透明度的图片会被加上黑色背景'
          };
        }
      }
    },
    data() {
      return {
        isUploadLoading: false,
        uploadPercent: 0,
        showImageDel: false
      };
    },
    methods: {
      uploadAction(res) {
        /**
         *图片压缩
         * width number 图片最大的宽度。默认为原图的宽度
         * height number 图片最大的高度，默认为原图的高度
         * quality number  图片压缩质量，取值0-1，默认为0.7
         * filedName string 后端接收的字段名，默认为 'file
         */
        // lrz(res.file, {
        //   quality: 0.5
        // }).then(rst => {
        //   var data = this.convertBase64UrlToBlob(rst.base64, res.file.name);
        //   this.uploadActionFile(data);
        //   // 成功时执行
        // }).catch(error => {
        //   console.log(error);
        //   this.$message({
        //     message: error,
        //     type: 'error'
        //   });
        //   // 失败时执行
        // }).always(function() {
        //   // 不管成功或失败，都会执行
        // });
        if (res.file.size > this.sizeCompress.size) { // 超过2m会压缩
          this.$confirm('是否确定压缩图片，有透明的图片会加上黑色背景；点击确定才会被压缩。', '图片压缩', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            compressImage(res.file, res.file.type, 0.5, data => {
              var src = this.convertBase64UrlToBlob(data, res.file.name);
              this.uploadActionFile(src);
            });
          }).catch(() => {
            this.uploadActionFile(res.file);
          });
        } else {
          this.uploadActionFile(res.file);
        }
      },
      uploadActionFile(res) {
        this.isUploadLoading = true;
        Upload.img(res.file, 'file', e => {
          this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
        })
          .then(res => {
            this.previewImg = res.url;
            this.isUploadLoading = false;
            this.uploadPercent = 100;
            this.$emit('success', res);
            console.log(res);
            res.id && this.$emit('update:imageId', res.id);
          })
          .catch(() => {
            this.isUploadLoading = false;
            this.uploadPercent = 0;
          });
      },
      beforeImageUpload(file) {
        if (this.sizeOptions && this.sizeOptions.size) {
          const sizeValue = this.sizeOptions.size;
          if (file.size > sizeValue) {
            this.$message({
              type: 'error',
              message: this.sizeOptions.tips
            });
            return Promise.reject(false);
          }
        }
        const vm = this;
        const _URL = window.URL || window.webkitURL;
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = function() {
            if (vm.sizeOptions && vm.sizeOptions.width && vm.sizeOptions.height) {
              const imgWidth = this.width;
              const imgHeight = this.height;
              const limitWidth = vm.sizeOptions.width;
              const limitHeight = vm.sizeOptions.height;
              if (limitWidth && limitHeight && (imgHeight !== limitHeight || imgWidth !== limitWidth)) {
                vm.$message({
                  type: 'error',
                  message: vm.sizeOptions.tips
                });
                return reject(false);
              }
            }
            resolve(true);
          };
          img.src = _URL.createObjectURL(file);
        });
      },
      delImageHandler() {
        this.$emit('del');
      },
      convertBase64UrlToBlob(dataurl, filename) {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
    },
    computed: {
      previewImg: {
        set(url) {
          this.$emit('change', url);
        },
        get() {
          return this.imageUrl;
        }
      },
      uploadStyle() {
        if (this.width && this.height) {
          return {
            width: this.width,
            height: this.height
          };
        }
        return {};
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .upload-container {
    position: relative;
    width: 100%;
    line-height: 0;
  }

  .single-image__uploader {
    max-width: 300px;
  }

  .single-image__uploader .el-upload {
    position: relative;
    min-width: 120px;
    min-height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }

  .single-image__uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .single-uploader__icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .single-uploader__icon.middle {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }

  .single-uploader__icon.small {
    width: 78px;
    height: 78px;
    line-height: 78px;
  }

  .preview-img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .preview-img + a.del{
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: rgba(0,0,0,.6);
    cursor: pointer;
    > i{
      position: absolute;
      top:50%;
      left: 50%;
      text-align: center;
      transform: translate(-50%,-50%);
      color: #ffffff;
      font-size: 16px;
    }
  }
</style>
