<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="activityQueryFrm">
        <el-form-item label="活动名称">
          <el-input placeholder="活动名称" v-model="activityQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select placeholder="全部" clearable v-model="activityQueryFrm.state">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            :editable="false"
            v-model="activityQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivity" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createActivity">
            <i class="fs-13 el-icon-plus mr-5"></i>新建活动
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
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
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Auxiliary from '@/api/contentPlatform/auxiliary';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'contentActivity',
    components: {
      customElTable
    },
    data() {
      return {
        activityQueryFrm: {
          title: '',
          time: [],
          state: ''
        },
        query: null,
        pickerOptions: { // 时间选择器
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
        stateOptions: [ // 状态
          {
            value: 0,
            label: '已禁用'
          },
          {
            value: 1,
            label: '进行中'
          },
          {
            value: 2,
            label: '未开始'
          },
          {
            value: 3,
            label: '已结束'
          }
        ],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '活动标题',
            prop: 'activity_name'
          },
          {
            label: '参与人数',
            prop: 'players',
            width: 120
          },
          {
            label: '开始时间',
            prop: 'start_time',
            sortable: true,
            width: 155,
            className: 'ph-6'
          },
          {
            label: '结束时间',
            prop: 'end_time',
            sortable: true,
            width: 155,
            className: 'ph-6'
          },
          {
            label: '状态',
            prop: 'status_cn',
            width: 120,
            options: {
              type: 'tag',
              prop: 'status'
            }
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del',
              {
                type: 'signUp',
                label: '报名管理'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Auxiliary.activity.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            if (item.start_time) {
              item.start_time = parseTime(item.start_time);
            }
            if (item.end_time) {
              item.end_time = parseTime(item.end_time);
            }
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchActivity() { // 查询
        const { title, time, state } = _.cloneDeep(this.activityQueryFrm);
        this.query = {
          activityName: title,
          status: state,
          startTime: '',
          endTime: ''
        };
        if (time && time.length > 1) {
          this.query.startTime = time[0];
          this.query.endTime = time[1];
        }
        this.pageIndex = 1;
        this.getData();
      },
      createActivity() { // 新增
        this.$router.push({ name: 'contentAddActivity' });
      },
      actionHandler(type, info) {
        if (type === 'status') { // 启用禁用
          this.$confirm(`确认${info.status === 0 ? '启用' : '禁用'}活动 <b>${info.activity_name}</b> 吗？`, `${info.status === 0 ? '启用' : '禁用'}`, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Auxiliary.activity.status(info.id)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else if (type === 'signUp') { // 报名管理
          this.$router.push({
            name: 'contentSignUp',
            params: {
              id: info.id
            }
          });
        }
      },
      editHandler(info) { // 编辑
        this.$router.push({
          name: 'contentEditorActivity',
          params: {
            id: info.id
          }
        });
      },
      deleteHandler(info) { // 删除
        this.$confirm(`确认删除 <b>${info.activity_name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Auxiliary.activity.del(info.id)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      getStatusBtnInfo(item) { // 自定义按钮样式
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        return {
          btn: status === 0 ? 'primary' : 'danger',
          label: status === 0 ? '启用' : '禁用'
        };
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      }
    }
  };
</script>
