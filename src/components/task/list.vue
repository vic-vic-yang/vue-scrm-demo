<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:36:22
 * @LastEditTime: 2019-08-28 15:12:27
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog
    title="任务选择"
    :visible.sync="taskDialogVisible"
    top="5vh"
    width="80%"
    @close="dialogHide">
    <div>
      <div>已选择任务：</div>
      <div v-if="taskList && taskList.length" class="list-content">
        <div v-for="(item, index) in taskList" :key="index" class="list">
          <item-card :taskItem="item"
                     :index="index"
                     :cover="item.pic[0].file_path"
                     :name="item.name"
                     type="task"
                     @editHandler="editHandler"
                     @delHandler="closeHandler"/>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="control-group">
        <el-form :inline="true" ref="taskFrm" :model="taskFrm">
          <el-form-item prop="type" label="任务类型">
            <el-select placeholder="全部" clearable v-model="taskFrm.type">
              <el-option
                v-for="(value, key) in taskTypeOptions"
                :key="key"
                :label="value"
                :value="key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="任务名称">
            <el-input placeholder="任务名称" clearable v-model="taskFrm.name"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="任务状态">
            <el-select placeholder="全部" clearable v-model="taskFrm.status">
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
            <!--<el-button @click="resetForm('taskFrm')" icon="el-icon-refresh">重置</el-button>-->
            <el-button @click="getData" icon="el-icon-refresh">刷新列表</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="createActivity">创建任务</el-button>
            <el-button type="primary" @click="determine">确定选择</el-button>
          </el-form-item>
        </el-form>
      </div>

      <custom-el-table
        v-loading="tabLoading"
        v-model="pageIndex"
        :tableData="tableData"
        :tableOptions="tableOptions"
        :pageSizes="pageSizes"
        :size="pageSize"
        :total="totalCount"
        @action="actionHandler"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
    </div>
  </el-dialog>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import missionTask from '@/api/task/index';
  import { parseTime } from '@/utils';
  import _ from 'lodash';
  import itemCard from '@/components/card/item-card';

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
      itemCard
    },
    props: ['taskShow', 'multiple', 'list'],
    data() {
      return {
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 60
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
              width: 60,
              height: 60
            }
          },
          {
            label: '任务类型',
            prop: 'mission_type_text'
          },
          {
            label: '任务奖励',
            prop: 'prize'
          },
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
            width: 180,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            width: 120,
            actions: [
              {
                type: 'checkbox',
                label: ''
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        tabLoading: true,
        taskFrm: {
          type: '',
          name: '',
          time: '',
          status: ''
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
            label: '启用',
            value: 4
          }
        ],
        taskTypeOptions: MISSION_TYPE,
        taskList: [],
        taskDialogVisible: this.taskShow,
        pageSizes: [10, 20, 50, 100]
      };
    },
    watch: {
      taskShow(val) {
        this.taskDialogVisible = val;
        if (val) {
          this.setTaskList();
          this.setChecked();
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      dialogHide() {
        this.$emit('taskHide');
      },
      closeHandler(index) {
        this.taskList.splice(index, 1);
      },
      determine() {
        this.taskDialogVisible = false;
        this.$emit('taskHandler', this.taskList);
      },
      getData() {
        this.tabLoading = true;
        const query = this.query || {};
        query.status = query.status ? query.status : 6;
        missionTask.getTasks({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              prize: item.prize_info.name || '',
              mission_type_text: this.formatMissionType(item.type, item.type_small),
              statusZh: item.mission_status === 1 ? '未开始' : item.mission_status === 2 ? '进行中' : item.mission_status === 3 ? '已结束' : item.mission_status === 4 ? '启用' : '禁用',
              tag_type: item.mission_status === 1 ? 'info' : item.mission_status === 2 ? 'success' : item.mission_status === 3 ? 'warning' : item.mission_status === 4 ? 'success' : '',
              deadline: parseTime(item.start_time, '{y}-{m}-{d}') + ' 至 ' + parseTime(item.end_time, '{y}-{m}-{d}'),
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time),
              task_img: item.pic && item.pic.length ? item.pic[0].file_path : '',
              checked: false
            };
          });
          this.setChecked();
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      setChecked() {
        this.tableData.map(item => {
          item.checked = false;
          // this.taskList.map(val => {
          this.taskList.map(val => {
            if (item.id === val.id) {
              item.checked = true;
            }
          });
        });
      },
      setTaskList() {
        this.taskList = JSON.parse(this.list);
      },
      formatMissionType(type, smallType) {
        if (~~smallType) {
          return `${MISSION_TYPE[type]}_${MISSION_SMALL_TYPE[smallType]}`;
        }
        return MISSION_TYPE[type];
      },
      searchTaskList() {
        this.query = _.cloneDeep(this.taskFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', time[0] || '');
        this.$set(this.query, 'end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createActivity() {
        // this.$router.push({ name: 'taskCreate' });
        const { href } = this.$router.resolve({ name: 'taskCreate', query: {type: 'newAdd'} });
        window.open(href, '_blank');
      },
      editHandler(info) {
        // this.$router.push({ name: 'taskEdit', params: { id: info.id }});
        const { href } = this.$router.resolve({ name: 'taskEdit', params: { id: info.id, type: 'newAdd' }});
        window.open(href, '_blank');
      },
      actionHandler(type, info) {
        if (type === 'checkbox') {
          if (info.checked) {
            var item = this.taskList.find(item => item.id === info.id);
            if (!item) {
              if (this.multiple) {
                this.taskList.push(info);
              } else {
                this.taskList = [];
                this.taskList.push(info);
                this.tableData.map(item => {
                  item.checked = false;
                  if (item.id === info.id) {
                    item.checked = true;
                  }
                });
              }
            }
          } else {
            var index = this.taskList.findIndex(item => item.id === info.id);
            this.taskList.splice(index, 1);
          }
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


<style lang="scss" scoped>
  .select-gift{
    padding:20px 0 10px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }

  .list-content {
    display: flex;
    flex-wrap: wrap;
    .list{
      margin:0 10px 10px 0
    }
  }
</style>
