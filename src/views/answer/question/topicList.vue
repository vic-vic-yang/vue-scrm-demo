<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 14:20:38
 * @LastEditTime: 2019-01-16 14:20:38
 * @LastEditors: your name
 -->

<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="control-group">
      <el-form :inline="true" :model="topicListQueryFrm">
        <el-form-item label="题目名称">
          <el-input placeholder="题目名称" v-model="topicListQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="选择状态">
          <el-select v-model="topicListQueryFrm.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker
            :editable="false"
            v-model="topicListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTopic" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createTopic">
            <i class="fs-13 el-icon-plus mr-5"></i>新增
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="/api/v1/quiz/question/item/import"
            name="qsFile"
            accept=".xls,.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xlam,.csv"
            :http-request="uploadAction"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :data="{groupId:groupId}"
            :with-credentials="true"
            :show-file-list="false">
            <el-button type="primary"><i class="el-icon-upload
 mr-5"></i>导入
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-upload" @click="uploadImgShow">上传图片</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :size="pageSize"
      @edit="editHandler"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
    <el-dialog title="上传结果" :visible.sync="uploadResultDialog">
      <p>成功：{{uploadSuccessCount}} 失败：<span style="color: #C03639">{{uploadErrorData.length}}</span></p>
      <template v-if="uploadErrorData && uploadErrorData.length>0">
        <el-table :data="uploadCurrentPageErrorData">
          <el-table-column property="title" label="题目名称" width="150"></el-table-column>
          <el-table-column property="errors" label="错误原因"></el-table-column>
        </el-table>
        <el-pagination
          class="text-center mt-20"
          v-if="uploadErrorData.length > 10"
          background
          layout="prev, pager, next"
          @current-change="uploadPageChangeHandler"
          :total="uploadErrorData.length">
        </el-pagination>
      </template>
    </el-dialog>
    <el-dialog title="上传图片" width="35%" :visible.sync="dialogTableVisible">
      <el-upload
        class="upload-demo"
        :show-file-list="false"
        :action="$store.state.uploadImgUrl"
        multiple
        drag
        :http-request="uploadActionImg">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <p>只能上传jpg/png文件，且不超过5m</p>
          <p v-if="fileList && fileList.length > 0">以下上传文件中，<i class="el-icon-success"></i> 图片与题目匹配成功，<i class="el-icon-error"></i> 图片与题目匹配不成功</p>
          <div class="el-upload-list el-upload-list--text">
            <div class="el-upload-list__item is-success" v-for="(item, index) in fileList" :key="index">
              <a href="#">
                <i class="el-icon-picture"></i>
                {{item.id}}
              </a>
              <label class="el-upload-list__item-status-label">
                <i :class="[item.icon]"></i>
              </label>
            </div>
          </div>
        </div>
      </el-upload>
      <div style="margin-top: 30px;">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Question from '@/api/answer/question';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  import Upload from '@/api/upload';

  export default {
    name: 'topicList',
    components: {
      customElTable
    },
    data() {
      return {
        topicListQueryFrm: {
          title: '',
          status: '',
          time: ''
        },
        query: null,
        statusOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 'enable',
            label: '启用'
          },
          {
            value: 'disable',
            label: '禁用'
          }
        ],
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '题目名称',
            prop: 'title'
          },
          {
            label: '答案',
            prop: 'answers'
          },
          {
            label: '正确答案',
            prop: 'answersCorrect'
          },
          {
            label: '配图',
            prop: 'picUrl',
            options: {
              type: 'html'
            }
          },
          {
            label: '状态',
            prop: 'statusTxt',
            options: {
              type: 'tag',
              prop: 'status'
            },
            width: 120
          },
          {
            label: '添加时间',
            prop: 'createTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              // {
              //   label: '查看详情',
              //   type: 'detail'
              // },
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        questionGroupOptions: [],
        pageLoading: true,
        groupId: this.$route.query.group,
        isUploadLoading: false,
        uploadResultDialog: false,
        uploadErrorData: [],
        uploadCurrentPageErrorData: [],
        uploadCurrentPage: 1,
        uploadSuccessCount: 0,
        dialogTableVisible: false,
        imageClass: [],
        fileList: []
      };
    },
    beforeRouteEnter(to, fromRoute, next) {
      next(vm => {
        const isFrmTopicEditor = fromRoute && (fromRoute.name === 'topicModify' || fromRoute.name === 'topicCreate');
        if (isFrmTopicEditor) {
          const frmRouteQuery = fromRoute.query;
          vm.pageIndex = frmRouteQuery.pageIndex || vm.pageIndex;
          vm.pageSize = frmRouteQuery.pageSize || vm.pageSize;
        }
        vm.getData();
      });
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Question.topic.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          groupId: this.groupId,
          ...query
        }).then(data => {
          this.tableData = (data.items || []).map(item => {
            return {
              ...item,
              answers: this.getTopicAnswer(item),
              answersCorrect: this.getAnswersCorrect(item),
              status: item.status === 'enable' ? 1 : 0,
              statusTxt: item.status === 'enable' ? '启用' : '禁用',
              createTime: parseTime(item.createTime),
              picUrl: `<img style="max-width: 120px;height: auto" src="${item.picUrl}"/>`
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = this.pageLoading = false;
        });
      },
      getTopicAnswer(item) {
        if (!item.answers || item.answers.length < 1) return '';
        return item.answers.map(answer => answer.title).join('、');
      },
      getAnswersCorrect(data) {
        var answersCorrect = [];
        data.answers.map(item => {
          if (item.isTrue) {
            answersCorrect.push(item.title);
          }
        });
        return (answersCorrect.map(item => item)).join('、');
      },
      searchTopic() {
        this.query = _.cloneDeep(this.topicListQueryFrm);
        let startTime = '';
        let endTime = '';
        if (this.query.time && this.query.time.length === 2) {
          const time = this.query.time;
          startTime = time[0];
          endTime = time[1];
        }
        this.$set(this.query, 'earliestCreated', startTime);
        this.$set(this.query, 'lastCreated', endTime);
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createTopic() {
        this.$router.push({
          name: 'topicCreate',
          query: { group: this.groupId, pageIndex: this.pageIndex, pageSize: this.pageSize, type: this.$route.query.type }
        });
      },
      editHandler(info) {
        this.$router.push({
          name: 'topicModify',
          params: { id: info.id },
          query: { pageIndex: this.pageIndex, pageSize: this.pageSize, type: this.$route.query.type }
        });
      },
      deleteHandler(info) {
        this.$confirm(`确认删除题目 <b>${info.title}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Question.topic.del(info)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.$store.getters.getStatusTxt(!info.status);
          this.$confirm(`确认${title}题目 <b>${info.title}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Question.topic.status(info)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'detail') {
          this.$alert(info.desc, info.title, {
            confirmButtonText: '确定',
            showClose: false
          }).catch(err => {
            console.log('view detail : ', err);
          });
        }
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        return {
          btn: item.status * 1 === 0 ? 'primary' : 'danger',
          label: this.$store.getters.getStatusTxt(!item.status)
        };
      },
      beforeUpload() {
        this.isUploadLoading = this.$loading({
          lock: true,
          text: '正在导入',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      uploadSuccess(res) {
        this.isUploadLoading.close();
        this.$message({
          message: '导入成功',
          type: 'success'
        });
        this.uploadResultDialog = true;
        this.uploadSuccessCount = res.successCount;
        this.uploadErrorData = res.failures;
        this.uploadCurrentPageErrorData = res.failures.slice(0, 10);
      },
      uploadError(err) {
        this.isUploadLoading.close();
        this.$message({
          message: (err && err.message) ? err.message : '导入失败',
          type: 'error'
        });
      },
      uploadPageChangeHandler(page) {
        const start = (page - 1) * 10;
        const end = Math.min(start + 10, this.uploadErrorData.length);
        this.uploadCurrentPageErrorData = this.uploadErrorData.slice(start, end);
      },
      uploadAction(res) {
        Question.topic.upload(this.groupId, res.file).then(this.uploadSuccess)
          .catch(this.uploadError);
      },
      uploadImgShow() {
        this.dialogTableVisible = true;
      },
      handleSubmit() {
        this.imageClass = [];
        this.fileList = [];
        this.dialogTableVisible = false;
      },
      uploadActionImg(fileInfo) {
        var fileName = '';
        if (fileInfo.file.name) {
          fileName = fileInfo.file.name.split('.')[0];
          this.fileList.push({
            id: fileName,
            status: 2, // 0-失败， 1-成功， 2-等待
            icon: 'el-icon-loading'
          });
        }
        Upload.img(fileInfo.file, 'file', e => {
          this.uploadPercent = Math.min(99, Math.floor(e.loaded * 100 / e.total));
        })
          .then(res => {
            this.imageClass.push({
              id: fileName,
              picUrl: res.url
            });
            Question.topic.imageClass(this.imageClass).then(res => {
              if (res.data.length > 0) {
                this.fileList.map(item => {
                  var isExist = false;
                  res.data.map(val => {
                    if (item.id === val.id) {
                      isExist = true;
                    }
                  });
                  if (isExist) {
                    item.status = 0;
                    item.icon = 'el-icon-error';
                  } else {
                    item.status = 0;
                    item.icon = 'el-icon-success';
                  }
                });
              } else {
                this.fileList.map(item => {
                  if (item.id === fileName) {
                    item.status = 0;
                    item.icon = 'el-icon-success';
                  }
                });
              }
            });
          });
      }
    },
    beforeDestroy() {
      this.isUploadLoading && this.isUploadLoading.close();
    }
  };
</script>

<style lang="scss" scoped>
  .el-upload-list__item{
    cursor: pointer;
    &:hover .el-upload-list__item-status-label{
      display: block;
    }
  }
  .el-icon-error{
    font-size: 14px;
    color: #f56c6c;
  }
  .el-icon-loading{
    font-size: 14px;
  }
  .el-icon-success{
    font-size: 14px;
    color: #67c23a;
  }
</style>
