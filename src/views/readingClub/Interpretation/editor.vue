<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row>
      <el-col :span="4" :offset="10">
        <div class="header-tabs">
          <div :span="12"
                  :class="['items', type == item.value ? 'active' : '']"
                  v-for="item in interpretationTypeOptions"
                  :key="item.value"
                  @click="tabsHandler(item)">
            {{item.label}}
          </div>
        </div>
      </el-col>
    </el-row>
    <el-form
      class="commodity-edit__form"
      :model="interpretationFrm"
      :rules="frmRules"
      ref="interpretationFrm"
      label-width="100px">
      <template v-if="type === 0">
        <el-form-item prop="book_id" label="书籍id">
          <el-input
            v-model="interpretationFrm.book_id"
            placeholder="书籍名称"
            :maxlength="40"
            name="book_id"
            :disabled="true"
            :clearable="false">
          </el-input>
        </el-form-item>
        <el-form-item prop="book_name" label="书籍名称">
          <el-input
            v-model="interpretationFrm.book_name"
            placeholder="书籍名称"
            :maxlength="40"
            name="book_name"
            :disabled="true"
            :clearable="false">
          </el-input>
        </el-form-item>
        <el-form-item prop="explain_name" label="解读人">
          <el-input
            v-model="interpretationFrm.explain_name"
            placeholder="解读人"
            :maxlength="40"
            name="explain_name"
            :clearable="false">
          </el-input>
        </el-form-item>
        <el-form-item prop="book_explain" label="解读音频">
          <template v-if="!interpretationFrm.book_explain">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="$store.state.uploadImgUrl"
              :show-file-list="true"
              :multiple="false"
              :limit="1"
              accept="audio/mpeg"
              :http-request="uploadAction">
              <el-button size="small" type="primary">解读音频</el-button>
            </el-upload>
          </template>
          <template v-if="interpretationFrm.book_explain">
            <audio :src="interpretationFrm.book_explain" controls style="width: 90%;height: 40px;vertical-align: middle;outline: none"></audio>
            <span class="delete-audio" @click="restAudio"><i class="el-icon-error"></i></span>
          </template>
        </el-form-item>
        <el-form-item prop="remarks" label="文稿">
          <el-input
            v-model="interpretationFrm.remarks"
            type="textarea"
            placeholder="文稿"
            :maxlength="40"
            rows="8"
            name="remarks"
            :clearable="true">
          </el-input>
        </el-form-item>
      </template>
      <template v-else-if="type === 2">
        <div class="chapter-content">
          <div class="chapter-item" v-for="(item, index) in chapter" :key="index">
            <div class="name">{{item.name}}</div>
            <div class="icon">
              <el-tooltip placement="top" content="上传解读">
                <a class="upload" @click="uploadExplain(item)"><i class="el-icon-upload"></i></a>
              </el-tooltip>
              <el-tooltip placement="top" content="修改文稿">
                <a @click="editorRemarks(item)"><i class="el-icon-tickets"></i></a>
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
      <el-form-item>
        <el-button @click.prevent.stop="cancel">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="解读"
      :visible.sync="dialogExplain"
      width="45%">
      <template v-if="!selectChapter.chapter_explain">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="$store.state.uploadImgUrl"
          :show-file-list="true"
          :multiple="false"
          :limit="1"
          accept="audio/mpeg"
          :http-request="uploadChapterAction">
          <el-button size="small" type="primary">新增解读音频</el-button>
        </el-upload>
      </template>
      <template v-if="selectChapter.chapter_explain">
        <audio :src="selectChapter.chapter_explain" controls style="width: 90%;height: 40px;vertical-align: middle;outline: none"></audio>
        <span class="delete-audio" @click="restAudio"><i class="el-icon-error"></i></span>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExplain = false">取 消</el-button>
        <el-button type="primary" @click="chapterExplain">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="文稿"
      :visible.sync="dialogRemarks"
      width="45%">
        <el-input
          v-model="selectChapter.remarks"
          type="textarea"
          placeholder="文稿"
          :maxlength="40"
          rows="10"
          name="remarks"
          :clearable="true">
        </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRemarks = false">取 消</el-button>
        <el-button type="primary" @click="chapter_remarks">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Upload from '@/api/upload';
  import explain from '@/api/readingClub/explain';
  import _ from 'lodash';
  import axios from 'axios';

  export default {
    name: 'editor',
    data() {
      const action = this.$route.query.isAdd ? 'add' : 'modify';
      return {
        pageLoading: true,
        action: action,
        type: 0,
        interpretationFrm: {
          id: this.$route.params.id || 0, // 解读id， 编辑
          book_id: this.$route.query.id || 0, // 图书id， 新增
          explain_name: '',
          book_name: '',
          audio_id: 0,
          book_explain: '',
          remarks: ''
        },
        chapter: [
          {
            id: 0,
            name: '第一节',
            isEditor: false,
            chapter_explain: '',
            remarks: ''
          }
        ],
        frmRules: {
          explain_name: [
            {
              required: true, message: '请输入解读人'
            }
          ],
          book_explain: [
            {
              required: true, message: '请上传解读音频'
            }
          ],
          remarks: [
            {
              required: true, message: '请输入文稿'
            }
          ]
        },
        interpretationTypeOptions: [
          {
            value: 0,
            label: '整书',
            isTrue: true
          },
          {
            value: 1,
            label: '章节',
            isTrue: false
          }
        ],
        dialogExplain: false,
        dialogRemarks: false,
        selectChapter: {
          id: '',
          chapter_explain: '',
          remarks: ''
        },
        uploadData: null,
        client: null,
        uploader: ''
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        this.pageLoading = true;
        if (this.action === 'add') return (this.pageLoading = false);
        explain.get({ id: this.interpretationFrm.id }).then(res => {
          this.interpretationFrm = _.assign({}, this.interpretationFrm, res.data);
          this.interpretationFrm.audio_id = res.data.yrUploadFile[0].id;
          this.interpretationFrm.book_explain = res.data.yrUploadFile[0].file_path;
          this.pageLoading = false;
        });
      },
      tabsHandler(item) {
        if (item.isTrue) {
          this.type = item.value;
        }
      },
      uploadExplain(data) {
        this.selectChapter.id = data.id;
        this.dialogExplain = true;
      },
      editorRemarks(data) {
        this.selectChapter.id = data.id;
        this.dialogRemarks = true;
      },
      chapter_remarks() {
        if (this.selectChapter.remarks !== '') {
          this.chapter.amp(item => {
            if (item.id === this.selectChapter.id) {
              item.remarks = this.selectChapter.remarks;
            }
          });
        }
        this.dialogRemarks = false;
      },
      chapterExplain() {
        if (this.selectChapter.chapter_explain !== '') {
          this.chapter.amp(item => {
            if (item.id === this.selectChapter.id) {
              item.chapter_explain = this.selectChapter.chapter_explain;
            }
          });
          this.dialogExplain = false;
        } else {
          this.$message({
            type: 'info',
            message: '还未上传成功'
          });
        }
      },
      getWebUpload(file, fileName) {
        Upload.webUpload().then(res => {
          this.uploadData = res.data;
          this.sendWebUpload(file, fileName);
        });
      },
      sendWebUpload(file, fileName) {
        var req = new FormData();
        var data = this.uploadData;
        const imgPath = data.dir + fileName;
        req.append('OSSAccessKeyId', data.accessid);
        req.append('policy', data.policy);
        req.append('signature', data.signature);
        req.append('key', imgPath);
        req.append('success_action_status', '200');
        req.append('callback', data.callback);
        req.append('name', new Date().getTime() + '_' + fileName);
        req.append('file', file);
        axios.post(data.host, req).then(res => {
          if (res.data.Status === 'Ok') {
            this.$message({
              type: 'success',
              message: '上传成功'
            });
            this.interpretationFrm.audio_id = data.fileId;
            this.interpretationFrm.book_explain = data.host + '/' + imgPath;
          } else {
            this.$message({
              type: 'info',
              message: '上传失败'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '上传失败'
          });
        });
      },
      uploadAction(res) {
        var fileName = res.file.name;
        var pos = fileName.lastIndexOf('.');
        var lastName = fileName.substring(pos, fileName.length);
        if (lastName.toLowerCase() === '.mp3') {
          this.getWebUpload(res.file, fileName);
        //   Upload.audio(res.file, 'file', e => {
        //   })
        //     .then(res => {
        //       this.interpretationFrm.audio_id = res.id;
        //       this.interpretationFrm.book_explain = res.url;
        //     })
        //     .catch(() => {
        //       this.interpretationFrm.book_explain = '';
        //     });
        // } else {
        //   this.$message({
        //     type: 'info',
        //     message: '只能上传“mp3”格式音频文件, 请重新选择附件上传'
        //   });
        }
      },
      uploadChapterAction(res) {
        var fileName = res.file.name;
        var pos = fileName.lastIndexOf('.');
        var lastName = fileName.substring(pos, fileName.length);
        if (lastName.toLowerCase() === '.mp3') {
          Upload.audio(res.file, 'file', e => {
          })
            .then(res => {
              this.selectChapter.chapter_explain = res.url;
            })
            .catch(() => {
              this.selectChapter.chapter_explain = '';
            });
        } else {
          this.$message({
            type: 'info',
            message: '只能上传“mp3”格式音频文件, 请重新选择附件上传'
          });
        }
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
      },
      restAudio() {
        this.interpretationFrm.book_explain = '';
        // this.$refs.upload.clearFiles();
      },
      save() {
        this.$refs.interpretationFrm.validate(valid => {
          if (valid) {
            const interpretationFrm = Object.assign({}, this.interpretationFrm);
            const interpretationFrms = (({ book_id, audio_id, explain_name, remarks }) => ({ book_id, explain_name, audio_id, remarks }))(interpretationFrm);
            if (this.action === 'modify') {
              interpretationFrms.id = interpretationFrm.id;
            }
            const data = {
              book_explain: interpretationFrms
            };

            (this.action === 'modify' ? explain.editor(data) : explain.add(data))
              .then(() => {
                if (this.action === 'add') {
                  this.$router.go(-2);
                } else {
                  this.$router.back();
                }
              });
          }
        });
      },
      cancel() {
        if (this.action === 'add') {
          this.$router.go(-2);
        } else {
          this.$router.back();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .delete-audio {
    display: inline-block;
    float: right;
    margin-right: 10px;
    .el-icon-error {
      font-size: 20px;
      vertical-align: middle;
      cursor: pointer;
    }
  }

  .header-tabs{
    width: 150px;
    border:1px solid #409eff;
    border-radius: 5px;
    margin: 15px 0 20px;
    .items{
      display: inline-block;
      width:50%;
      cursor: pointer;
      text-align: center;
      padding: 5px 0;
      &.active{
        background: #409eff;
        color: #fff;
      }
    }
  }

  .chapter-content{
    width: 90%;
    margin: 0 auto 50px;
    .chapter-item{
      border-bottom: 1px solid #eee;
      padding: 15px;
      display: flex;
      justify-content: space-between;;
      align-items: center;
      .icon{
        margin-right: 15px;
        i{
          font-size: 16px;
          cursor: pointer;
        }
        .upload{
          display: inline-block;
          margin-right: 10px;
        }
      }
    }
  }
</style>
