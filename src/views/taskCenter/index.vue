<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:36:22
 * @LastEditTime: 2019-08-28 15:12:27
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="taskFrm" :model="taskFrm">
        <el-form-item prop="task_type" label="任务类型">
          <el-select placeholder="全部" clearable v-model="taskFrm.task_type" @change="typeChange">
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="用户完成任务选择" v-if="taskFrm.task_type === 8 || taskFrm.task_type === 6">
          <el-select v-model="taskFrm.type" placeholder="请选择用户完成任务" @change="typeSmallChange">
            <el-option
              v-for="item in finshTaskSelect"
              :key="item.value"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="任务名称">
          <el-input placeholder="任务名称" clearable v-model="taskFrm.name" style="width: 160px;"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="任务状态">
          <el-select placeholder="全部" clearable v-model="taskFrm.status" style="width: 140px;">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="任务有效期">
          <el-date-picker
            :editable="false"
            v-model="taskFrm.time"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTaskList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('taskFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createActivity">创建任务</el-button>
          <el-button type="primary" @click="go_task_details">任务数据</el-button>
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

    <prize-probability :probabilityShow="probabilityShow" :taskItem="taskItem" @handleClose="probabilityShow = false"/>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import missionTask from '@/api/task/index';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  import prizeProbability from './components/prizeProbability';
  import { taskType } from './task';

  const MISSION_TYPE = {
    '1': '阅读公众号文章签到',
    '2': '裂变涨粉',
    '3': '关注公众号',
    '4': '邀请好友关注公众号',
    '5': '小程序内阅读公众号文章',
    '6': '邀请用户完成任务',
    '7': '通用签到',
    '8': '小程序内完成任务',
    '9': '通用分享'
  };

  const MISSION_SMALL_TYPE = {
    '601': '答题',
    '602': '拼团',
    '603': '投票',
    '604': '阅读',
    '605': '打卡',
    '606': '上传作品'
  };
  export default {
    name: 'taskOverview',
    components: {
      customElTable,
      prizeProbability
    },
    data() {
      return {
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '任务名称',
            prop: 'name'
          },
          {
            label: '任务图标',
            prop: 'task_img',
            options: {
              type: 'img',
              width: 100,
              height: 100
            }
          },
          {
            label: '任务类型',
            prop: 'mission_type_text'
          },
          // {
          //   label: '任务奖励',
          //   prop: 'prize'
          // },
          {
            label: '任务有效期',
            prop: 'deadline'
          },
          {
            label: '任务状态',
            prop: 'statusZh',
            options: {
              type: 'tag',
              prop: 'mission_status'
            }
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
              'del',
              {
                type: 'article',
                options: this.getArticleBtnInfo
              },
              {
                type: 'prize_probability',
                label: '奖励列表'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        taskFrm: {
          task_type: '',
          type: '',
          name: '',
          time: '',
          status: '',
          type_small: ''
        },
        query: null,
        statusOptions: [
          {
            label: '未开始',
            value: 1
          },
          {
            label: '进行中',
            value: 2
          },
          {
            label: '已结束',
            value: 3
          },
          {
            label: '启用',
            value: 4
          },
          {
            label: '禁用',
            value: 5
          }
        ],
        // taskTypeOptions: MISSION_TYPE,
        probabilityShow: false,
        taskItem: null,
        taskTypeOptions: taskType,
        finshTaskSelect: []
      };
    },
    created() {
      this.getData();
    },
    methods: {
      typeChange() {
        if (this.taskFrm.task_type === 2 || this.taskFrm.task_type === 9) {
          this.taskFrm.type = this.taskFrm.task_type;
        }
        this.setTypeSmall();
        this.taskFrm.type = '';
      },
      typeSmallChange() {
        if (this.changeTaskType(this.taskFrm.type)) {
          this.taskFrm.type_small = this.changeTaskType(this.taskFrm.type);
        } else {
          this.taskFrm.type_small = '';
        }
      },
      changeTaskType(type) {
        var type_small = [601, 602, 603, 604, 605, 606];
        var item = type_small.find(item => {
          return item === Number(type);
        });
        if (item) {
          return item;
        }
        return '';
      },
      setTypeSmall() {
        taskType.map(item => {
          if (item.value === this.taskFrm.task_type) {
            this.finshTaskSelect = item.content || [];
          }
        });
      },
      formatMissionType(type, smallType) {
        if (~~smallType) {
          return `${MISSION_TYPE[type]}_${MISSION_SMALL_TYPE[smallType]}`;
        }
        return MISSION_TYPE[type];
      },
      getData() {
        this.tabLoading = true;
        const query = this.query || {};
        missionTask.getTasks({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              // prize: item.prize_info.name || '',
              mission_type_text: this.formatMissionType(item.type, item.type_small),
              statusZh: item.mission_status === 1 ? '未开始' : item.mission_status === 2 ? '进行中' : item.mission_status === 3 ? '已结束' : item.mission_status === 4 ? '启用' : '禁用',
              tag_type: item.mission_status === 1 ? 'info' : item.mission_status === 2 ? 'success' : item.mission_status === 3 ? 'warning' : item.mission_status === 4 ? 'success' : '',
              deadline: parseTime(item.start_time, '{y}-{m}-{d}') + ' 至 ' + parseTime(item.end_time, '{y}-{m}-{d}'),
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time),
              task_img: item.pic && item.pic.length ? item.pic[0].file_path : ''
              // task_img: item.pic && item.pic.length ? `<div style="width: 100px;height: 100px;margin: 0 auto"><img style="width: 100%;height: 100%;object-fit: cover" src="${item.pic[0].file_path}"/></div>` : ''
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
      searchTaskList() {
        var data = JSON.stringify(this.taskFrm);
        var params1 = JSON.parse(data);
        if (params1.task_type === 6 || params1.task_type === 8) {
          if (this.changeTaskType(params1.type)) {
            params1.type_small = this.changeTaskType(params1.type);
            params1.type = params1.task_type;
          } else {
            params1.type = params1.task_type;
            delete params1.type_small;
          }
        } else {
          delete params1.type_small;
          params1.type = params1.task_type;
        }
        delete params1.task_type;
        this.query = _.cloneDeep(params1);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', time[0] || '');
        this.$set(this.query, 'end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createActivity() {
        this.$router.push({ name: 'taskCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'taskEdit', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除任务 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          missionTask.del({
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
          var disableMessage = `确认${title}任务 <b>${info.name}</b> 吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            missionTask.status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            }).then(res => {
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'article') {
          if (info.type * 1 === 5) {
            this.$router.push({name: 'taskArticle', query: {id: info.id, name: info.name}});
          } else if (info.type * 1 === 1) {
            this.$router.push({name: 'taskArticleParameter', query: {id: info.id, name: info.name}});
          }
        } else if (type === 'prize_probability') {
          this.taskItem = info;
          this.probabilityShow = true;
        }
      },
      go_task_details() {
        this.$router.push({ name: 'taskLogs' });
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
            label: '启用'
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
      getArticleBtnInfo(item) {
        if (item.type * 1 === 1 || item.type * 1 === 5) {
          return {
            btn: 'primary',
            label: '文章'
          };
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      setTaskType() {
        var type = Number(this.taskFrm.type);
        switch (type) {
          case 1:
          case 3:
          case 5:
          case 7:
            this.taskFrm.task_type = 8;
            this.taskFrm.type = type;
            break;
          case 4:
            this.taskFrm.task_type = 6;
            this.taskFrm.type = type;
            break;
          default:
            this.taskFrm.task_type = this.taskFrm.type;
            this.taskFrm.type = type;
            break;
        }
      }
    }
  };
</script>


<style scoped>
</style>
