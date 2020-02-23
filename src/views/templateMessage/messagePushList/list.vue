<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="messageFrm" :model="messageFrm">
        <!--<el-form-item prop="title" label="标题">-->
          <!--<el-input placeholder="标题" v-model="messageFrm.title"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item prop="send_type" label="消息类型">-->
          <!--<el-select v-model="messageFrm.send_type"  placeholder="请选择消息类型">-->
            <!--<el-option-->
              <!--v-for="item in typeOptions"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>-->
          <!--<el-button @click="resetForm('messageFrm')" icon="el-icon-refresh">重置</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="switchProcedures">选择/切换小程序</el-button>
          <el-button type="primary" @click="synchronization" v-if="false">同步小程序模板消息库</el-button>
          <el-button type="primary" @click="addTemplate" v-if="false">添加模板</el-button>
          <el-button type="primary" @click="createHandler">新增消息推送</el-button>
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
  import msgPush from '@/api/templateMsg/msgPush';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  import { mapState } from 'vuex';
  import smallProcedures from '../selectSmallProcedures';

  export default {
    name: 'message-push-list',
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
            label: '消息名称',
            prop: 'title'
          },
          {
            label: '消息类型',
            prop: 'send_type'
          },
          {
            label: '推送对象',
            prop: 'send_users_name'
          },
          {
            label: '推送时间',
            prop: 'send_time'
          },
          {
            label: '进入小程序页面',
            prop: 'page_name'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
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
        messageFrm: {
          title: '',
          send_type: ''
        },
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null,
        dialogVisible: false,
        type: 'data', // synchronization - 同步，data - 列表
        tableShow: true,
        pageOptions: this.$store.state.templateMsg.pageOptions,
        typeOptions: this.$store.state.templateMsg.typeOptions
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
        // const query = this.query || {};
        this.tabLoading = true;
        msgPush.list({
          appid: this.appid,
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              status_name: item.status * 1 === 1 ? '启用' : '禁用',
              send_time: item.send_type === '定时推送消息' ? this.setTime(item.hours) + ':' + this.setTime(item.minutes) : '--',
              page_name: this.setPageName(item.page),
              send_users_name: item.send_type === '定时推送消息' ? item.send_users_name : '--',
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          this.tableShow = true;
        });
      },
      setTime(time) {
        return time * 1 < 10 ? '0' + time : time;
      },
      setPageName(page) {
        var item = this.pageOptions.find(item => {
          return item.page === page;
        });
        if (item) {
          return item.name;
        }
        return '';
      },
      synchronization() {
        if (this.appid) {
          msgPush.pull({
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
        this.query = _.cloneDeep(this.messageFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'messageListCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'messageListModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除模板 <b>${info.title}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          msgPush.del({
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
            msgPush.status({
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
