<template>
  <div class="upload-container">
    <div class="el-upload-list el-upload-list--picture-card commodity-pic-ul">
      <draggable :list="picLists" class="dragArea" :options="{group:'article'}">
        <div class="upload-container commodity-pic-sl commodity-pic-li" v-for="(item, index) in picLists" @click="edit_img(item, index)" v-if="picLists.length > 0" :key="index">
          <div class="single-image__uploader single-image-dis">
            <div class="el-upload el-upload--text">
              <template v-if="item">
                <img
                  @mouseover="showImageDel=true"
                  @mouseout="showImageDel=false"
                  :src="item.file_path"
                  class="preview-img"/>
                <a
                  @click.stop.prevent="delImageHandler(item, index)"
                  class="del"
                  @mouseover="showImageDel=true"
                  @mouseout="showImageDel=false"
                  v-show="showImageDel">
                  <i class="el-icon-close"></i>
                </a>
              </template>
            </div>
            <input type="file" :id="'referenceUpload' + index" :ref="'referenceUpload' + index" name="file" @change="edit_upload_img(item, $event)" accept="image/gif,image/jpeg,image/jpg,image/png" multiple class="el-upload__input">
          </div>
          <div class="progress" v-if="item.id === 0 || item.id === edit_pic.id">
            <el-progress v-show="isUploadLoading"  type="circle" :percentage="uploadPercent"></el-progress>
          </div>
        </div>

      </draggable>
      <div v-if="picLists.length < 15 && (type != 'only'|| picLists.length < 1)" class="upload-container commodity-pic-sl" @click="add_img">
        <div class="single-image__uploader">
          <div class="el-upload el-upload--text">
            <i class="el-icon-plus single-uploader__icon"></i>
            <input type="file" name="file" id="inputer" ref="inputer" accept="image/gif,image/jpeg,image/jpg,image/png" multiple @change="new_upload_img" class="el-upload__input">
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="裁剪图片"
      :visible.sync="dialogVisible"
      top="10vh"
      width="80%"
      @close="handleClose"
      :close-on-click-modal="false">
      <p>提示：在裁剪区域滚动滚轮可以缩放图片</p>
      <div class="upload_content">
         <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :autoCrop="option.autoCrop"
          :fixedNumber="option.fixedNumber"
          :fixedBox="option.fixedBox"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
        ></vueCropper>
      </div>
      <div v-if="selected_size >= 0" class="size_select">
        <div v-for="(item, index) of imageSize">
          <el-radio v-model="selected_size" :label="index" style="margin-right: 10px">{{item.name}}</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel_dialogVisible()">取 消</el-button>
        <el-button type="primary" @click="determine_img()">确 定</el-button>
        <el-button type="primary" @click="determine_img(false)">保留尺寸</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleImg"
      title="图片预览"
      top="10vh"
      width=""
      @close="handleClose"
      :close-on-click-modal="true">
      <div class="cover">
        <img :src="dialogVisibleImgSrc" style="max-width: 100%;height: auto;" alt=""/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleImg = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
import _ from 'lodash';
import Upload from '@/api/upload';
import { VueCropper } from 'vue-cropper';
import draggable from 'vuedraggable';
// import lrz from 'lrz';
// import { compressImage, base64Size } from '@/utils';
import { base64Size } from '@/utils';

export default {
  props: ['pic', 'type', 'width', 'height', 'imageSize'],
  data() {
    return {
      picLists: this.pic || [],
      edit_pic: {
        is_edit: false,
        id: 0,
        file_path: ''
      },
      selected_size: -1,
      dialogVisible: false,
      dialogVisibleImg: false,
      dialogVisibleImgSrc: '',
      option: {
        img: '',
        outputSize: 1,
        outputType: 'png',
        autoCrop: true,
        fixedBox: true,
        autoCropWidth: 800,
        autoCropHeight: 760,
        fixedNumber: [1, 1]
      },
      file: '',
      fileName: '',
      fileSize: '',
      fileType: '',
      showImageDel: false,
      isUploadLoading: false,
      uploadPercent: 0,
      is_end: false
    };
  },
  components: {
    draggable,
    VueCropper
  },
  watch: {
    pic(val) {
      this.picLists = this.pic;
    },
    picLists: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.$emit('get_pic', val);
        }
      }
    },
    selected_size(val) {
      console.log('selected_size', val);
      this.option.autoCropWidth = this.imageSize[this.selected_size].width;
      this.option.autoCropHeight = this.imageSize[this.selected_size].height;
    }
  },
  mounted() {
    console.log('mounted', this.imageSize);

    if (this.width && this.height) {
      this.option.autoCropWidth = this.width;
      this.option.autoCropHeight = this.height;
    }
    if (this.imageSize && this.imageSize.length > 0) {
      this.selected_size = '0';
    }
  },
  methods: {
    findUploadPosition(data) {
      return _.findIndex(data, pic => !pic.id && !pic.file_path);
    },
    getPicData(data) {
      data = _.cloneDeep(data);
      return _.filter(data, pic => pic.id && pic.file_path);
    },
    add_img() {
      var file = this.$refs.inputer;
      file.click();
    },
    edit_img(item, index) {
      // var id = 'referenceUpload' + index;
      // var file = document.getElementById(id);
      // file.click();
      this.dialogVisibleImg = false;
      this.dialogVisibleImgSrc = item.file_path;
      this.dialogVisibleImg = true;
    },
    // 删除
    delImageHandler(item, index) {
      this.picLists.splice(index, 1);
      this.$emit('get_pic', this.picLists);
    },
    new_upload_img(e) {
      var that = this;
      var file = e.target.files[0];
      var reader = new FileReader();
      this.dialogVisible = false;
      this.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        that.dialogVisible = true;
        that.option.img = this.result;
      };
      Object.assign(that.edit_pic, { is_edit: false });
      that.picLists.push({ id: 0 });
      e.target.value = '';
    },
    edit_upload_img(item, e) {
      var that = this;
      this.dialogVisible = false;
      var file = e.target.files[0];
      var reader = new FileReader();
      this.fileName = file.name;
      this.fileType = file.type;
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        that.dialogVisible = true;
        that.option.img = this.result;
      };
      Object.assign(this.edit_pic, { is_edit: true, id: item.id, file_path: item.file_path });
      e.target.value = '';
    },
    // 取消
    cancel_dialogVisible() {
      this.dialogVisible = !this.dialogVisible;
      this.delete_picl_list();
      this.is_send = false;
    },
    // 确定
    determine_img(crop = true) {
      this.dialogVisible = !this.dialogVisible;
      this.is_send = true;
      if (!this.edit_pic.is_edit) {
        this.picLists.push({ id: 0 });
      }
      console.log('+++++++++++++++++++++++++', this);
      if (!crop) {
        const blob = this.convertBase64UrlToBlob(this.option.img, this.fileName);
        this.uploadAction(blob);
        return;
      }
      this.$refs.cropper.startCrop();
      this.$refs.cropper.getCropData((res) => {
        // do something
        if (base64Size(res) > 1024 * 1024 * 5) {
          this.$message({
            type: 'error',
            message: '图片大小不能超过5MB,请重新上传'
          });
        } else {
          var blob = this.convertBase64UrlToBlob(res, this.fileName);
          this.uploadAction(blob);
        }
        /**
         *图片压缩
         * width number 图片最大的宽度。默认为原图的宽度
         * height number 图片最大的高度，默认为原图的高度
         * quality number  图片压缩质量，取值0-1，默认为0.7
         * filedName string 后端接收的字段名，默认为 'file
         */
        // lrz(data, {
        //   quality: 1
        // }).then(rst => {
        //   var data = this.convertBase64UrlToBlob(rst.base64, this.fileName);
        //   this.uploadAction(data);
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
        // if (base64Size(res) > 1024 * 1024 * 2) { // 超过2m会压缩
        //   this.$confirm('是否确定压缩图片，有透明的图片会加上黑色背景；点击确定才会被压缩。', '图片压缩', {
        //     distinguishCancelAndClose: true,
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消'
        //   }).then(() => {
        //     compressImage(res, this.fileType, 0.5, data => {
        //       var src = this.convertBase64UrlToBlob(data, this.fileName);
        //       this.uploadAction(src);
        //     });
        //   }).catch(() => {
        //     this.uploadAction(res.file);
        //   });
        // } else {
        //   var blob = this.convertBase64UrlToBlob(res, this.fileName);
        //   this.uploadAction(blob);
        // }
      });
    },
    handleClose() {
      if (!this.is_end) {
        this.delete_picl_list();
      }
    },
    uploadAction(file) {
      this.isUploadLoading = true;
      Upload.img(file, 'file', e => {
        this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
      })
        .then(res => {
          this.set_pic_lists(res.id, res.url);
          this.isUploadLoading = false;
        })
        .catch(() => {
          this.isUploadLoading = false;
          this.uploadPercent = 0;
          this.delete_picl_list();
        });
    },
    set_pic_lists(id, url) {
      this.picLists.map((item) => {
        if (this.edit_pic.is_edit) {
          if (item.id === this.edit_pic.id) {
            item.id = id;
            item.file_path = url;
          }
        } else {
          if (item.id === 0) {
            item.id = id;
            item.file_path = url;
          }
        }
      });
      // 传回选择的图片
      this.$emit('get_pic', this.picLists);
    },
    delete_picl_list() {
      this.picLists.map((item, index) => {
        if (item.id === 0) {
          this.picLists.splice(index, 1);
        }
      });
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
  }
};
</script>

<style lang="scss" scoped>
  .upload_content {
    width: 90%;
    height: 600px;
    margin: 0 auto;
  }

  .upload-container {
    position: relative;
    width: 100%;
    line-height: 0;
  }

  .single-image__uploader {
    width: 126px;
    height: 126px;
  }

  .single-image__uploader .el-upload {
    position: relative;
    min-width: 126px;
    min-height: 126px;
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
    width: 126px;
    height: 126px;
    line-height: 126px;
    text-align: center;
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

  .dragArea{
    display: inline;
  }

  .commodity-pic-ul{
    display: inline-block;
  }

  .commodity-pic-sl{
    margin-bottom: 5px;
  }

  .commodity-pic-li{
    position: relative;
    margin-left: 3px;
  }

  .progress{
    position: absolute;
    left: 0;
    top: 50%;
  }

  .commodity-pic .single-image__uploader .el-upload, .commodity-pic-sl, .el-upload--text{
    display: inline-block;
    vertical-align: middle;
    width: 126px;
    height: 126px;
  }

  .el-upload--text img{
    object-fit: cover;
  }

  .el-upload__input{
    visibility:hidden;
  }

  .single-image-dis{
    position: relative;
  }

  .single-image-dis .single-image__uploader{
    // position: absolute;
    // left: 0;
    // top: 0;
  }

  .single-image-dis .el-upload__input{
    // width: 50%;
    // height: 50%;
    // position: absolute;
    // left: 50%;
    // top: 50%;
    display: none;
  }

  .cover{
    width: auto;
    height: auto;
    text-align: center;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    img{
      padding: 20px 0 15px;
      object-fit: cover;
    }
  }

  .size_select {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

</style>
