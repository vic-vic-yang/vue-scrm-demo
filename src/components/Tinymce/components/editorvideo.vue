<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传视频
    </el-button>
    <el-dialog append-to-body width="35%" :visible.sync="dialogVisible">
      <el-upload
        class="editor-slide-upload"
        :with-credentials="true"
        :action="$store.state.uploadImgUrl"
        :multiple="true"
        :show-file-list="false"
        list-type="text"
        :disabled="uploadPercentShow"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :http-request="uploadAction">
        <el-button size="small" :disabled="uploadPercentShow" type="primary">点击上传</el-button>
      </el-upload>
      <div class="list-content">
        <div class="list" v-for="(item, index) in fileList" @mouseover="handleMouseOver(item)" @mouseout="handleMouseOut(item)" :key="index">
          <a href="#"><i class="el-icon-document"></i> {{item.name}}</a>
          <label v-if="item.suc" class="success label">
            <i class="el-icon-success"></i>
          </label>
          <label v-else class="await label" @click="handleRemove(item)">
            <i class="el-icon-close"></i>
          </label>
          <el-progress v-show="uploadPercentShow && item.uid" :stroke-width="2" :percentage="uploadPercent"></el-progress>
        </div>
      </div>
      <div class="video-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
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
        uploadPercentShow: false,
        uploadPercent: 0
      };
    },
    watch: {
      dialogVisible(val) {
        if (!val) {
          this.fileList = [];
          this.uploadPercentShow = false;
          this.uploadPercent = 0;
          this.abort();
        }
      }
    },
    methods: {
      handleSubmit() {
        if (!this.fileList.length === 0) {
          this.$message('请等待所有视频上传成功 或 出现了网络问题，请刷新页面重新上传！');
          return;
        }
        this.$emit('successVideo', this.fileList);
        this.listObj = {};
        this.fileList = [];
        this.dialogVisible = false;
      },
      beforeUpload(file) {
        this.fileList.push({
          name: file.name,
          uid: file.uid,
          url: '',
          suc: false
        });
      },
      uploadAction(fileInfo) {
        this.uploadPercent = 0;
        this.uploadPercentShow = false;
        Upload.audio(fileInfo.file, 'file', e => {
          this.uploadPercentShow = true;
          this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
        })
          .then(res => {
            res.url = res.url.replace('https', 'http');
            res['name'] = fileInfo.file.name;
            res['uid'] = fileInfo.file.uid;
            this.handleSuccess(res, fileInfo.file);
            this.uploadPercent = 100;
            this.uploadPercentShow = false;
          }).catch(() => {
            this.uploadPercentShow = false;
            this.uploadPercent = 0;
          });
      },
      handleSuccess(data, file) {
        const uid = file.uid;
        this.fileList.map(item => {
          if (item.uid === uid) {
            item.id = data.id;
            item.url = data.url;
            item.suc = true;
            delete item.uid;
          }
        });
      },
      handleRemove(file) {
        this.fileList.map((item, index) => {
          if (item.id === file.id) {
            this.fileList.splice(index, 1);
          }
        });
      },
      handleMouseOut(data) {
        if (!this.uploadPercentShow) {
          this.fileList.map((item) => {
            if (item.id === data.id) {
              item.suc = true;
            }
          });
        }
      },
      handleMouseOver(data) {
        this.fileList.map((item) => {
          if (item.id === data.id) {
            item.suc = false;
          }
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
  .list-content{
    margin: 20px 0 0;
    .list{
      transition: all .5s cubic-bezier(.55,0,.1,1);
      font-size: 14px;
      color: #606266;
      line-height: 1.8;
      margin-top: 5px;
      position: relative;
      box-sizing: border-box;
      border-radius: 4px;
      width: 100%;
      cursor: pointer;
      padding: 10px 0;
      .el-icon-document{
        font-size: 14px;
      }
      a{
        color: #606266;
        display: block;
        margin-right: 40px;
        overflow: hidden;
        padding-left: 4px;
        text-overflow: ellipsis;
        transition: color .3s;
        white-space: nowrap;
      }
      .label{
        position: absolute;
        right: 5px;
        top: 0;
        line-height: inherit;
        cursor: pointer;
        i{
          speak: none;
          font-style: normal;
          font-weight: 400;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          vertical-align: baseline;
          display: inline-block;
          -webkit-font-smoothing: antialiased;
        }
      }
      .success{
        i {
          color: #67c23a;

        }
      }
      .await{
        i {
          opacity: .75;
          color: #606266;
        }
      }
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  .video-footer{
    margin-top: 50px;
  }

</style>
