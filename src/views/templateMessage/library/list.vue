<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="libraryFrm" :model="libraryFrm">
        <el-form-item prop="id" label="ID">
          <el-input placeholder="ID" v-model="libraryFrm.id"></el-input>
        </el-form-item>
        <el-form-item prop="title" label="标题">
          <el-input placeholder="标题" v-model="libraryFrm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('libraryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="switchProcedures">选择/切换小程序</el-button>
          <el-button type="primary" @click="synchronization">同步微信模板消息库</el-button>
        </el-form-item>
        <small style="float: right;color: #111; font-weight:bold;margin-right: 15px;" v-if="mini_program">{{mini_program.nick_name}}</small>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
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
  import smallProcedures from '../selectSmallProcedures';
  import { mapState } from 'vuex';

  export default {
    name: 'template-list',
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
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'selections',
                label: '选用'
              }
            ]
          }
        ],
        tableData: [],
        libraryFrm: {
          id: '',
          title: ''
        },
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null,
        dialogVisible: false,
        select_template_id: '',
        type: 'data' // select - 同步，data - 列表
      };
    },
    computed: {
      ...mapState({
        appid: state => state.templateMsg.appid,
        mini_program: state => state.templateMsg.mini_program
      })
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        templateMsg.templates({
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
        });
      },
      handleClose() {
        if (!this.appid) {
          this.$message('请先选择小程序，才能进行下一步操作。');
          return false;
        }
      },
      small_procedures_handler(data) {
        this.dialogVisible = data;
        if (this.type === 'select') {
          this.$router.push({ name: 'templateLibraryModify', params: { id: this.select_template_id }});
        } else {
          this.getData();
        }
      },
      synchronization() {
        templateMsg.update_library().then(() => {
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
      },
      switchProcedures() {
        this.dialogVisible = true;
      },
      searchActivityList() {
        this.query = _.cloneDeep(this.libraryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'selections') {
          if (!this.appid) {
            this.select_template_id = info.id;
            this.type = 'select';
            this.dialogVisible = true;
            return false;
          }
          this.$router.push({ name: 'templateLibraryModify', params: { id: info.id }});
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
