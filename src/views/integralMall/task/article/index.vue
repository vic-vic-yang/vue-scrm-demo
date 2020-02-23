<template>
  <div class="app-container task-list">
    <el-form
      class="activity-edit__form"
      :model="taskFm"
      :rules="frmRules"
      ref="taskFm"
      label-width="160px">

      <header>基本设置</header>

      <el-form-item prop="app_id" label="App_Id">
        <el-input
          v-model="taskFm.app_id"
          placeholder="请输入App_Id"
          :maxlength="50"
          name="app_id"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="integral" label="任务达标奖励积分额度">
        <el-input
          v-model="taskFm.integral"
          placeholder="任务达标奖励积分额度"
          name="integral"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="fans" label="阅读赠送积分次数限制">
        <el-input
          v-model="taskFm.fans"
          placeholder="请输入阅读赠送积分次数限制"
          name="fans"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="rule" label="任务说明">
        <tinymce placeholder="请输入任务说明" :height="260" v-model="taskFm.rule"/>
      </el-form-item>

      <header>文章列表</header>

      <el-tabs v-model="activeName" style="margin-bottom: 50px">
        <el-tab-pane label="已采集文章列表" name="manual">
          <div class="control-group" style="margin-bottom: 20px">
            <el-button type="primary" size="small" @click="addArticle">手动新增文章</el-button>
          </div>
          <custom-el-table
            v-model="pageIndex"
            :tableData="tableData"
            :tableOptions="tableOptions"
            :total="totalCount"
            @edit="editHandler"
            @delete="deleteHandler"
            @action="actionHandler"
            @size-change="sizeChangeHandler"
            @page-change="pageChangeHandler">
          </custom-el-table>
        </el-tab-pane>
        <!--<el-tab-pane label="文章自动采集设置 " name="automatic">-->
          <!--<div class="control-group" style="margin-bottom: 20px;border-bottom: 1px solid #eeeeee;padding: 10px 0 20px;">-->
            <!--<span>采集任务</span>-->
            <!--<span style="float: right">-->
               <!--<el-button  type="primary" size="small" @click="addArticle">新建采集任务</el-button>-->
            <!--</span>-->
          <!--</div>-->
        <!--</el-tab-pane>-->
      </el-tabs>

      <el-form-item>
        <el-button @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="45%">
      <article-add :articleFrm="articleFrm" @sendArticle="sendArticle"/>
    </el-dialog>
  </div>
</template>

<script>
  import integralTask from '@/api/integralMall/task';
  import _ from 'lodash';
  import Tinymce from '@/components/Tinymce';
  import customElTable from '@/components/customElTable';
  import articleAdd from './add';
  import { parseTime } from '@/utils';

  export default {
    name: 'taskAddEdit',
    data() {
      return {
        pageLoading: true,
        action: this.$route.query.aId ? 'modify' : 'add',
        taskFm: {
          id: this.$route.query.aId,
          app_id: '',
          integral: '',
          fans: '',
          rule: ''
        },
        dialogVisible: false,
        dialogTitle: '新增文章',
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '任务名称',
            prop: 'mission_name'
          },
          {
            label: '文章名称',
            prop: 'title'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            width: 300,
            actions: [
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
        activeName: 'manual',
        articleFrm: null,
        frmRules: {
          app_id: [
            {
              required: true, message: '请输入公众号App_Id'
            }
          ],
          integral: [
            {
              required: true, message: '请输入阅读每文章赠送积分额'
            }
          ]
        }
      };
    },
    components: {
      Tinymce,
      customElTable,
      articleAdd
    },
    created() {
      this.getDetail();
      this.getArticle();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        integralTask.details(this.taskFm.id).then(res => {
          this.taskFm = _.assign({}, this.taskFm, res);
          this.pageLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      getArticle() {
        integralTask.article_list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      addArticle() {
        this.articleFrm = {
          mission_name: '',
          title: '',
          author: '',
          url: '',
          cover: '',
          pic: []
        };
        this.dialogTitle = '新增文章';
        this.dialogVisible = true;
      },
      editHandler(info) {
        integralTask.article_get(info.id).then(res => {
          res.pic = res.cover;
          res.cover = res.cover[0].file_path;
          this.articleFrm = res;
          this.dialogTitle = '编辑文章';
          this.dialogVisible = true;
        });
      },
      deleteHandler(info) {
        this.$confirm(`确认删除文章 <b>${info.title}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          integralTask.article_del({ id: info.id })
            .then(() => {
              this.$message({
                type: 'success',
                message: `已删除文章${info.title}`
              });
              this.getArticle();
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
          const title = this.getStatusBtnInfo(info).label;
          this.$confirm(`确认立即${title}文章 <b>${info.title}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            integralTask.article_status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            })
              .then(() => {
                this.getArticle();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        }
      },
      sendArticle(status, data) {
        if (status) {
          const articleFrm = Object.assign({}, data);
          articleFrm.mission_name = '';
          articleFrm.mission_name = this.taskFm.name || articleFrm.mission_name;
          articleFrm.cover = (articleFrm.pic.map(pic => pic.id)).join(',');
          (data.id ? integralTask.article_edit(articleFrm) : integralTask.article_add(articleFrm))
            .then(() => {
              this.getArticle();
              this.dialogVisible = false;
            });
        } else {
          this.dialogVisible = false;
        }
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getArticle();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getArticle();
      },
      save() {
        this.$refs.taskFm.validate(valid => {
          if (valid) {
            const options = {
              id: this.taskFm.id,
              app_id: this.taskFm.app_id,
              fans: this.taskFm.fans,
              integral: this.taskFm.integral,
              rule: this.taskFm.rule
            };
            (this.action === 'modify' ? integralTask.edit(options) : integralTask.add(options))
              .then(() => {
                this.$router.back();
              });
          }
        });
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        if (status === 3) return false;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          } : {
            btn: 'primary',
            label: '启用'
          };
      }
    }
  };
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
  .el-form-item {
    max-width: 800px;
  }
  .activity-edit__form{
    max-width: 100%;
    width: auto;
  }
  .app-container .el-form:not(.el-form--inline){
    max-width: 100%;
  }
</style>
