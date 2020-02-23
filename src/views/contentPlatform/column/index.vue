
<template>
  <div class='app-container'>
    <div class='control-group'>
      <el-form :inline='true' :model='classListQueryFrm'>
        <el-form-item label='标题'>
          <el-input placeholder='标题' v-model='classListQueryFrm.title'></el-input>
        </el-form-item>
        <!-- <el-form-item label='形式'>
          <el-select placeholder='全部' clearable v-model='classListQueryFrm.type'>
            <el-option
              v-for='item in typeOptions'
              :key='item.value'
              :label='item.label'
              :value='item.value'
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label='状态'>
          <el-select placeholder='全部' clearable v-model='classListQueryFrm.status'>
            <el-option
              v-for='item in stateOptions'
              :key='item.value'
              :label='item.label'
              :value='item.value'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='发布时间'>
          <el-date-picker
            :editable='false'
            v-model='classListQueryFrm.time'
            type='datetimerange'
            :picker-options='pickerOptions'
            range-separator='至'
            start-placeholder='开始时间'
            end-placeholder='结束时间'
            value-format='yyyy-MM-dd HH:mm:ss'
            align='right'
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='searchGameList' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command='createContent' operate="create">
            <el-button type='primary'>
              <i class='fs-13 el-icon-plus mr-5'></i>添加内容
            </el-button>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='a'>手动添加</el-dropdown-item>
              <el-dropdown-item command='b'>内容池导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class='control-group'>
      <el-form :inline='true'>
        <el-form-item>
          <el-dropdown @command='publicChoose'>
            <el-button type='primary'>发布</el-button>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='a'>立即发布</el-dropdown-item>
              <el-dropdown-item command='b'>
                <el-date-picker
                  v-model='publish_time'
                  :editable='false'
                  type='datetime'
                  placeholder='定时发布'
                  @change='dateChange'
                ></el-date-picker>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-button @click='globalOperation(2)' type='info'>撤销</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click='globalOperation(5)' type='danger'>删除</el-button>
        </el-form-item>
      </el-form>
    </div>-->
    <custom-el-table
      v-loading='tabLoading'
      v-model='pageIndex'
      :tableData='tableData'
      :tableOptions='tableOptions'
      :total='totalCount'
      @handleSelectionChange='handleSelectionChange'
      @edit='editHandler'
      @delete='deleteHandler'
      @action='actionHandler'
      @more='moreHandler'
      @popoverHandler="popoverHandler"
      @size-change='sizeChangeHandler'
      @page-change='pageChangeHandler'
    ></custom-el-table>
    <el-dialog title='选择发布时间' :visible.sync='prepositionShow' @close='prepositionCancel' width="20%">
      发布时间：
      <el-date-picker v-model='publish_time' type='datetime' placeholder='选择日期时间' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='prepositionCancel'>取 消</el-button>
        <el-button type='primary' @click='prepositionSave'>确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title='选择审核流程' :visible.sync='examineShow' @close='examineCancel' >
      <san>*灰色表示提交之后下一级的审核人员</san>
      <div class="work-row" v-for="item of workFllow" :key="item.id">
        <el-steps :active="item.curIndex" :space="200">
          <el-step v-for="step of item.step_list"  :title="step.name" :description="step.users" :key="step.id"></el-step>
        </el-steps>
        <el-button type='primary' @click='chooseWorkFllow(item)'>选 择</el-button>
      </div>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='examineCancel'>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Content from '@/api/contentPlatform/content';
import ColumnsApi from '@/api/contentPlatform/columns';
import { parseTime } from '@/utils';
import { mapGetters } from 'vuex';
export default {
  name: 'contentList',
  components: {
    customElTable
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      column_id: this.$route.meta.id,
      examineOptions: [
        {
          label: '编号',
          prop: 'id',
          width: 80
        }
      ],
      tableOptions: [
        {
          label: '编号',
          prop: 'id',
          width: 80
        },
        {
          label: '标题',
          prop: 'title'
        },
        // {
        //   label: '形式',
        //   prop: 'article_type'
        // },
        {
          label: '来源',
          prop: 'author'
        },
        {
          label: '浏览量',
          prop: 'view_count'
        },
        {
          label: '发布时间',
          prop: 'publish_time',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          label: '状态',
          prop: 'status_cn',
          options: {
            type: 'tag',
            prop: 'stageType'
          }
        },
        {
          label: '权重',
          prop: 'weight',
          max: 100,
          // editAble: true,
          // showInput: false,
          // type: 'Number',
          options: {
            type: 'edit'
          }
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'examine',
              label: '发起审核',
              btn: 'primary',
              operate: 'update',
              showBtn: function(action, scope) {
                return scope.status * 1 === 2 || scope.status * 1 === 4;
              }
            },
            {
              type: 'status',
              label: '取消发布',
              btn: 'info',
              operate: 'update',
              showBtn: function(action, scope) {
                return scope.status * 1 === 1;
              }
            },
            {
              type: 'MORENEW',
              options: this.getStatusBtnInfo,
              operations: ['立即发布', '定时发布'],
              showBtn: function(action, scope) {
                return scope.status * 1 !== 1 && scope.status * 1 !== 2 && scope.status * 1 !== 4 && !scope.allow_cancel_audit;
              },
              operate: 'update',
              disableds: function(scope) {
                return scope.status * 1 !== 0;
              }
            },
            {
              type: 'cancleExamine',
              label: '取消审核',
              showBtn: function(action, scope) {
                return scope.allow_cancel_audit;
              },
              operate: 'view'
            },
            {
              type: 'edit',
              label: '编辑',
              disableds: this.disableds,
              operate: 'update'
            },
            {
              type: 'del',
              label: '删除',
              disableds: this.disableds,
              operate: 'delete'
            },
            {
              type: 'details',
              label: '详情',
              operate: 'view'
            },
            {
              type: 'top',
              options: this.getRecommendBtnInfo,
              btn: 'primary',
              operate: 'update',
              disableds: this.disableds_top
            },
            {
              type: 'preview',
              label: '预览',
              btn: 'primary',
              operate: 'view'
            }
          ]
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      publish_time: '',
      prepositionShow: false,
      examineShow: false,
      curInfo: {},
      workFllow: [],
      classListQueryFrm: {
        // 查询条件
        title: '',
        type: '',
        state: '',
        time: []
      },
      multipleSelection: [], // 选中的数据
      query: null,
      pickerOptions: {
        // 时间选择器
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      typeOptions: [
        // 形式
        {
          value: 1,
          label: '图文'
        },
        {
          value: 2,
          label: '视频'
        }
      ],
      stateOptions: [
        // 状态
        {
          value: 1,
          label: '已发布'
        },
        {
          value: 0,
          label: '待发布'
        },
        {
          value: 2,
          label: '待审核 '
        },
        {
          value: 3,
          label: '审核中 '
        },
        {
          value: 4,
          label: '审核驳回'
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const query = this.query || {};
      // this.tabLoading = true;
      ColumnsApi.articles({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        column_id: this.column_id,
        ...query
      })
        .then(data => {
          data.result.forEach(item => {
            if (item.publish_time) {
              item.publish_time = parseTime(item.publish_time);
            }
            const status = this.getItemStatus(Number(item.status));
            item.status_cn = status[0];
            item.stageType = status[1];
            item.weight = item.weight || 0;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    disableds(scope) {
      if (scope.status * 1 !== 3) {
        return false;
      }
      return true;
    },
    disableds_top(scope) {
      if (scope.status * 1 === 1 || scope.status * 1 === 0) {
        return false;
      }
      return true;
    },
    getItemStatus(status) {
      let text = '';
      let stageType = 0;
      switch (status) {
        case 0:
          text = '待发布';
          stageType = 3;
          break;
        case 1:
          text = '已发布';
          stageType = 1;
          break;
        case 2:
          text = '待审核';
          stageType = 3;
          break;
        case 3:
          text = '审核中';
          stageType = 2;
          break;
        case 4:
          text = '已驳回';
          stageType = 0;
          break;
      }
      return [text, stageType];
    },
    searchGameList() {
      // 查询
      this.query = {
        title: this.classListQueryFrm.title,
        status: this.classListQueryFrm.status,
        startTime: this.classListQueryFrm.time
          ? this.classListQueryFrm.time[0]
          : '',
        endTime: this.classListQueryFrm.time
          ? this.classListQueryFrm.time[1]
          : ''
      };
      this.pageIndex = 1;
      this.getData();
    },
    createContent(command) {
      // 新增
      if (command === 'a') {
        // 手动添加
        this.$router.push({ name: 'addContentNew', params: {column: this.column_id} });
      } else {
        // 自动编辑
        this.$router.push({ name: 'contentCenterNew', params: {column: this.column_id} });
      }
    },
    editHandler(info) {
      // 编辑
      this.$router.push({
        name: 'addContentNew',
        params: {
          id: info.id
        }
      });
    },
    deleteHandler(info) {
      // 删除
      this.$confirm(`确认删除 <b>${info.title}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            data: {
              'id': [info.id],
              'column_id': this.column_id
            }
          };
          ColumnsApi.del(params).then(() => {
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleSelectionChange(data) {
      this.multipleSelection = data;
    },
    globalOperation(type) {
      // 全部操作
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'info',
          message: '请选择对应的项目！'
        });
        return;
      }
      let title = '发布';
      let src = 'status';
      if (type === 2) {
        title = '撤销';
        src = 'revoke';
      } else if (type === 3) {
        title = '推荐';
        src = 'recommend';
      } else if (type === 4) {
        title = '取消推荐';
        src = 'cancel';
      } else if (type === 5) {
        title = '删除';
        src = 'del';
      }
      this.$confirm(`确认${title}？`, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const id = this.multipleSelection.map(item => item.id);
          Content.list[src](id).then(() => {
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    actionHandler(type, info, publish_time) {
      if (type === 'status') {
        this.$confirm(
          `确认${info.status - 0 === 0 ? '发布' : '撤销'} <b>${
            info.title
          }</b> 吗？`,
          '发布',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            const params = {
              id: [info.id + ''],
              publish_time: publish_time || ''
            };
            (info.status - 0 === 0 ? ColumnsApi.publish(params) : ColumnsApi.cancel([info.id])).then((res) => {
              this.getData();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
      } else if (type === 'details') {
        this.$router.push({
          name: 'contentApproval',
          params: { id: info.id }
        });
      } else if (type === 'top') {
        this.moreHandler('top_cn', info);
      } else if (type === 'examine') {
        this.examine(info);
      } else if (type === 'preview') {
        window.open(info.preUrl);
        console.log('preview', info);
      } else if (type === 'cancleExamine') {
        console.log('canclExamine');
        this.cancleExamine(info);
      }
    },
    cancleExamine(info) {
      this.$confirm(
        `确认撤回${info.title}？`,
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.sureCancleExamine(info);
        });
    },
    sureCancleExamine(info) {
      const parms = {
        id: info.id
      };
      ColumnsApi.cancelAudit(parms).then(() => {
        this.$message({
          type: 'success',
          message: '撤回成功'
        });
        this.getData();
      });
    },
    examine(info) {
      ColumnsApi.workFlow({}).then((result) => {
        console.log(result);
        if (result && result.length > 1) {
          this.setWorkFllow(result);
          this.curInfo = info;
        } else {
          this.submitExamine(info, result && result[0]);
        }
      });
    },
    setWorkFllow(result) {
      this.examineShow = true;
      for (const item of result) {
        let curIndex = 0;
        if (item.step_list) {
          for (const step of item.step_list) {
            let users = '';
            for (const user of step.users) {
              users += user.realname + '，';
              if (user.id * 1 === this.userInfo.user_id * 1) {
                curIndex++;
              }
            }
            if (users) {
              users = '审核人员：' + users;
            }
            step.users = users.substring(0, users.length - 1);
          }
        }

        item.curIndex = '' + curIndex;
      }
      this.workFllow = result;
    },
    chooseWorkFllow(data) {
      this.$confirm(
        `确认选择当前审核流程吗？`,
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.submitExamine(this.curInfo, data);
        });
    },
    submitExamine(info, work) {
      const params = {
        id: info.id,
        column_id: this.column_id
      };
      if (work) {
        params.work_flow_id = work.id;
      }
      ColumnsApi.submit(params).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.examineCancel();
        this.getData();
      });
    },

    moreHandler(type, info) {
      // 更多操作
      if (type === 'top_cn') { // 置顶
        this.$confirm(`确认${info.top - 0 === 0 ? '推荐' : '取消推荐'} <b>${info.title}</b> 吗？`, info.top - 0 === 0 ? '推荐' : '取消推荐', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Content.list.top(info.id)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else if (type === '立即发布') {
        this.actionHandler('status', info);
      } else if (type === '定时发布') {
        this.curInfo = info;
        this.prepositionShow = true;
      }
    },
    prepositionCancel() {
      this.prepositionShow = false;
      this.curInfo = {};
      this.publish_time = '';
    },
    prepositionSave() {
      if (!this.publish_time) {
        this.$message({
          type: 'error',
          message: `请选择发布时间`
        });
        return;
      }
      this.actionHandler('status', this.curInfo, this.publish_time);
      this.prepositionShow = false;
      // this.curInfo = {};
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
      // 发布按钮样式
      if (!item) {
        return {
          btn: 'info',
          label: '',
          opt: ['']
        };
      }
      const status = item.status * 1;
      return {
        btn: status === 0 ? 'primary' : 'primary',
        label: status === 0 ? '发布' : '发布',
        opt: status === 0 ? ['立即发布', '定时发布'] : []
      };
    },
    getRecommendBtnInfo(item) {
      // 发布按钮样式
      if (!item) {
        return {
          btn: 'info',
          label: '取消推荐'
        };
      }
      const top = item.top * 1;
      return {
        btn: top === 0 ? 'primary' : 'info',
        label: top === 0 ? '推荐' : '取消推荐'
      };
    },
    // 修改权重
    popoverHandler(scope, value) {
      if (Number(value) < 0) {
        this.$message({
          type: 'error',
          message: `最小只能输入0`
        });
        return;
      }
      const params = {
        column_id: this.column_id,
        id: scope.row.id,
        weight: value
      };

      ColumnsApi.weight(params).then(res => {
        if (res.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getData();
        } else {
          this.$message.error('意料之外的错误');
        }
      });
    },
    examineCancel() {
      this.examineShow = false;
      this.curInfo = {};
      this.workFllow = [];
    }
  }
};
</script>

<style scoped>
.work-row{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #f2f2f2;
}
.el-dialog__body{
  padding: 10px 20px !important;
}
</style>

