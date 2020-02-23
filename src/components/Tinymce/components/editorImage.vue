<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible" class="my-dialog-index">
      <el-upload
        class="editor-slide-upload"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        :with-credentials="true"
        :action="$store.state.uploadImgUrl"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        :http-request="uploadAction"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
       <el-form-item label="链接地址" style="margin-left:-40px">
          <el-input
            v-model="original_url"
            name="content_address"
            :clearable="true"
            style="width:400px"
            placeholder="请输入链接地址"
          ></el-input>
          <el-button type="primary" @click="uploadUrlAction">添 加</el-button>
      </el-form-item>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/api/upload';

export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      original_url: ''
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess);
    },
    handleSubmit() {
      // const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      // if (!this.checkAllSuccess()) {
      //   this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！');
      //   return;
      // }
      this.$emit('successCBK', this.fileList);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    uploadAction(fileInfo) {
      Upload.img(fileInfo.file, 'file', e => {
        this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
      })
        .then(res => {
          this.handleSuccess(res, fileInfo.file);
        });
    },
    uploadUrlAction(fileInfo) {
      if (!this.original_url) {
        return;
      }
      if (!/\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(this.original_url)) {
        this.$message({
          type: 'error',
          message: '图片链接无效'
        });
        return;
      }
      Upload.img_url(this.original_url).then(res => {
        this.original_url = '';
        this.$message({
          type: 'success',
          message: '图片上传成功'
        });
        this.handleUrlSuccess(res);
      });
    },
    handleUrlSuccess(response) {
      const id = new Date().getTime();
      this.listObj[id] = {
        hasSuccess: true,
        uid: id,
        url: response.data.url
      };
      this.fileList.push(
        {name: id, url: response.data.url, uid: id}
      );
    },
    handleSuccess(response, file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.url;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          this.fileList.push(
            {name: uid, url: response.url, uid: uid}
          );
          return;
        }
      }
    },
    onExceed(files, fileList) {
      this.$message({
        type: 'error',
        message: '最多选择9张图片'
      });
    },
    handleRemove(file) {
      const uid = file.uid;
      // const objKeyArr = Object.keys(this.listObj);
      // for (let i = 0, len = objKeyArr.length; i < len; i++) {
      //   if (this.listObj[objKeyArr[i]].uid === uid) {
      //     delete this.listObj[objKeyArr[i]];
      //     return;
      //   }
      // }
      for (let i = 0; i < this.fileList.length; i++) {
        if (uid === this.fileList[i].uid) {
          this.fileList.splice(i, 1);
          return;
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        this.fileList = this.fileList;
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height };
        };
        resolve(true);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.my-dialog-index{
  z-index: 20000 !important;
}
</style>