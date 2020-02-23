<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="myTemplateFrm" :model="myTemplateFrm">
        <el-form-item prop="id" label="ID">
          <el-input placeholder="ID" v-model="myTemplateFrm.id"></el-input>
        </el-form-item>
        <el-form-item prop="title" label="标题">
          <el-input placeholder="标题" v-model="myTemplateFrm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('myTemplateFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="switchProcedures">选择/切换小程序</el-button>
          <el-button type="primary" @click="synchronization">同步小程序模板消息库</el-button>
          <el-button type="primary" @click="addTemplate">添加模板</el-button>
        </el-form-item>
        <small style="float: right;color: #111; font-weight:bold;margin-right: 15px;" v-if="mini_program">{{mini_program.nick_name}}</small>
      </el-form>
    </div>
    <custom-el-table
      v-if="tableShow"
      v-loading="tabLoading"
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
    <div v-if="!appid" style="text-align: center; padding: 100px 0 0;">请点击“选择/切换小程序”按钮选择小程序，然后才能进行其他操作</div>
    <el-dialog
      title="选择小程序"
      :visible.sync="dialogVisible"
      width="50%">
      <smallProcedures name="small" @small_procedures_handler="small_procedures_handler"/>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import templateMsg from '@/api/templateMsg/index';
  import _ from 'lodash';
  import { mapState } from 'vuex';
  import smallProcedures from '../selectSmallProcedures';

  export default {
    name: 'my-template-list',
    components: {
      customElTable,
      smallProcedures
    },
    data() {
      return {
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: 120
          },
          {
            label: '标题',
            prop: 'title'
          },
          {
            label: '模板ID',
            prop: 'template_id'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del'
            ]
          }
        ],
        tableData: [],
        myTemplateFrm: {
          id: '',
          title: ''
        },
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null,
        dialogVisible: false,
        type: 'data', // synchronization - 同步，data - 列表
        tableShow: true
      };
    },
    computed: {
      ...mapState({
        appid: state => state.templateMsg.appid,
        mini_program: state => state.templateMsg.mini_program
      })
    },
    watch: {
      dialogVisible(val) {
        if (!val && !this.appid) {
          this.tabLoading = false;
          this.tableShow = false;
        }
      }
    },
    created() {
      if (this.appid) {
        this.getData();
      } else {
        this.type = 'data';
        this.dialogVisible = true;
      }
    },
    methods: {
      handleClose() {
        if (!this.appid) {
          this.$message('请先选择小程序，才能进行下一步操作。');
          return false;
        }
      },
      switchProcedures() {
        this.dialogVisible = true;
      },
      small_procedures_handler(data) {
        this.dialogVisible = data;
        if (this.type === 'synchronization') {
          this.synchronization();
        } else {
          this.getData();
        }
      },
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        templateMsg.my_template({
          appid: this.appid,
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              status_name: item.status * 1 === 1 ? '启用' : '禁用'
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          this.tableShow = true;
        });
      },
      synchronization() {
        if (this.appid) {
          templateMsg.pull({
            appid: this.appid
          }).then(() => {
            this.$message({
              message: '同步微信模板消息库成功',
              type: 'success'
            });
          }).catch(() => {
            this.$message({
              message: '同步微信模板消息库失败',
              type: 'error'
            });
          });
        } else {
          this.type = 'synchronization';
          this.dialogVisible = true;
        }
      },
      addTemplate() {
        this.$router.push({ name: 'templateLibraryList' });
      },
      searchActivityList() {
        this.query = _.cloneDeep(this.myTemplateFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createActivity() {
        this.$router.push({ name: 'myTemplateCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'myTemplateModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除模板 <b>${info.title}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          templateMsg.del({
            id: info.id
          }).then(() => {
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
          const title = this.getStatusBtnInfo(info).label;
          var disableMessage = `确认${title}模板 <b>${info.title}</b> 吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            templateMsg.status({
              id: info.id
            }).then(() => {
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
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
        const status = item.status * 1;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          }
          : {
            btn: 'primary',
            label: '启用'
          };
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
