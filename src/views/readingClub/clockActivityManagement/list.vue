<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="interpretationQueryFrm" :model="interpretationQueryFrm">
        <el-form-item prop="name" label="打卡活动名称">
          <el-input placeholder="打卡活动名称" v-model="interpretationQueryFrm.name"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select placeholder="状态" clearable v-model="interpretationQueryFrm.status">
            <el-option label="全部" value="" />
            <el-option value="0" label="禁用" />
            <el-option value="1" label="启用" />
            <el-option value="2" label="进行中" />
            <el-option value="3" label="已结束" />
            <el-option value="4" label="未开始" />
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="活动时间">
          <el-date-picker
            :editable="false"
            v-model="interpretationQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">筛选</el-button>
          <el-button @click="resetForm('interpretationQueryFrm')" icon="el-icon-refresh">重置</el-button>
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
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import API from '@/api/readingClub/activityManagement';
import { parseTime } from '@/utils';
import _ from 'lodash';

export default {
  name: 'interpretationList',
  components: {
    customElTable
  },
  data() {
    return {
      tableOptions: [
        {
          label: '打卡活动名称',
          prop: 'name'
          // width: 80
        },
        {
          label: '打卡类型',
          prop: 'type'
        },
        {
          label: '开始时间',
          prop: 'start_time'
        },
        {
          label: '结束时间',
          prop: 'end_time'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'edit',
            {
              type: 'taskList',
              label: '主题'
            },
            {
              type: 'clockDetail',
              label: '打卡详情'
            },
            {
              type: 'use',
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
      interpretationQueryFrm: {
        name: '',
        status: '',
        time: []
      },
      query: null,
      pickerOptions: {
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
      }
    };
  },
  created() {
    Promise.all([this.getData()])
      .then(() => {
        this.pageLoading = false;
      })
      .catch(() => {
        this.pageLoading = false;
      });
  },
  methods: {
    getData() {
      const query = this.query || {};
      this.tabLoading = true;
      API.activityList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...query
      }).then(res => {
        res.result.forEach(item => {
          item.type = item.extend.type;
          item.start_time = parseTime(item.start_time);
          item.end_time = parseTime(item.end_time);

          switch (item.type) {
            case '1':
              item.type = '自由打卡';
              break;
            case '2':
              item.type = '闯关打卡';
              break;
          }
          // switch (item.status) {
          //   case '0':
          //     item.status = '禁用';
          //     break;
          //   case '1':
          //     item.status = '启用';
          //     break;
          //   case '2':
          //     item.status = '进行中';
          //     break;
          //   case '3':
          //     item.status = '已结束';
          //     break;
          //   case '4':
          //     item.status = '未开始';
          //     break;
          // }
        });

        this.tableData = res.result;
        this.totalCount = res.totalCount * 1;
        this.tabLoading = false;
      });
      setTimeout(() => {
        this.tabLoading = false;
      }, 1500);
    },

    searchActivityList() {
      this.query = _.cloneDeep(this.interpretationQueryFrm);
      const time = this.query.time || [];
      this.$set(this.query, 'start_time', time[0] || '');
      this.$set(this.query, 'end_time', time[1] || '');
      this.$delete(this.query, 'time');
      this.pageIndex = 1;
      this.getData();
    },
    timestamp(date) {
      if (date) {
        var dateTmp = date.replace(/-/g, '/');
        return Date.parse(dateTmp) / 1000;
      } else {
        return '';
      }
    },
    createActivity() {
      this.$router.push('/app/reading/clockActivityManagement/activityDetail');
    },
    editHandler(info) {
      this.$router.push(`/app/reading/clockActivityManagement/activityDetail?id=${info.id}`);
    },
    deleteHandler(info) {
      var delMessage = `确认删除活动 <b>${info.name}</b> 吗？`;
      this.$confirm(delMessage, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          API.deleteActivity({id: info.id}).then(res => {
            this.$message({
              message: '操作成功!',
              type: 'success'
            });
            this.searchActivityList();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    actionHandler(type, info) {
      switch (type) {
        case 'taskList':
          this.$router.push(`/app/reading/clockActivityManagement/readTaskList?id=${info.id}`);
          break;
        case 'clockDetail':
          this.$router.push(`/app/reading/clockManagement/list?id=${info.id}`);
          break;
        case 'use':
          // 启用禁用
          API.changeStatus({id: info.id}).then(res => {
            this.$message({
              message: '操作成功!',
              type: 'success'
            });
            this.searchActivityList();
          });
          break;
      }
    },
    getStatusBtnInfo(item) { // 发布按钮样式
      if (item) {
        switch (item.status) {
          case '0':
            return {
              btn: 'primary',
              label: '启用'
            };
          default:
            return {
              btn: 'danger',
              label: '禁用'
            };
        }
      }
      return {
        btn: '',
        label: ''
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
</style>
