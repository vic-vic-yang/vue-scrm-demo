<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="interpretationQueryFrm" :model="interpretationQueryFrm">

        <el-form-item prop="activity" label="活动">
          <!--<el-input placeholder="活动名称" v-model="interpretationQueryFrm.activity"></el-input>-->
          <el-select placeholder="请选择活动" v-model="interpretationQueryFrm.activity_id" @change="activityChange">
            <el-option
              v-for="item in activityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <div class="article_pages">
              <el-pagination
                :page-size="activityPageSize"
                :current-page="activityPageIndex"
                @current-change="currentChangeActivity"
                layout="prev, pager, next"
                :total="activityTotalCount">
              </el-pagination>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item prop="topic" label="主题">
          <!--<el-input placeholder="主题名称" v-model="interpretationQueryFrm.topic"></el-input>-->
          <el-select placeholder="请选择主题" v-model="interpretationQueryFrm.topic_id">
            <el-option
              v-for="item in seriesOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <div class="article_pages">
              <el-pagination
                :page-size="seriesPageSize"
                :current-page="seriesPageIndex"
                @current-change="currentChangeSeries"
                layout="prev, pager, next"
                :total="seriesTotalCount">
              </el-pagination>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item prop="nickname" label="用户昵称">
          <el-input placeholder="用户昵称" v-model="interpretationQueryFrm.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="打卡日期">
          <el-date-picker
            :editable="false"
            v-model="interpretationQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData" icon="el-icon-search">筛选</el-button>
          <el-button @click="resetForm('interpretationQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <h3 style="margin-bottom: 20px;">打卡统计：共打卡{{userCount}}人，共{{totalCount}}次</h3>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import API from '@/api/readingClub/clockManagement';
import ACTIVITY from '@/api/readingClub/activityManagement';
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
          label: '用户昵称',
          prop: 'nickname'
          // width: 80
        },
        {
          label: '打卡时间',
          prop: 'create_time'
        },
        {
          label: '打卡类型',
          prop: 'type'
        },
        {
          label: '活动名称',
          prop: 'activity_name'
        },
        {
          label: '主题名称',
          prop: 'name'
        },
        {
          label: '打卡内容',
          prop: 'content',
          width: 800,
          options: {
            type: 'html'
          }
        },
        {
          label: '打卡状态',
          prop: 'status'
        },
        // {
        //   label: '任务状态',
        //   type: 'use',
        //   options: this.getStatusBtnInfo
        // },
        {
          prop: 'USER_ACTION',
          actions: ['del']
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      userCount: 0,
      tabLoading: true,
      interpretationQueryFrm: {
        activity_id: '',
        topic_id: '',
        nickname: '',
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
      },
      activityOptions: [],
      activityPageIndex: 1,
      activityPageSize: 10,
      activityTotalCount: 1,
      seriesOptions: [],
      seriesPageIndex: 1,
      seriesPageSize: 10,
      seriesTotalCount: 1
    };
  },
  created() {
    this.interpretationQueryFrm.activity_id = this.$route.query.id || '';
    this.getActivity();
    this.getData();
  },
  methods: {
    getData() {
      this.tableData = [];
      this.tabLoading = true;
      API.clockList({
        page_index: this.pageIndex,
        page_size: this.pageSize,
        ...this.interpretationQueryFrm,
        start_time: this.interpretationQueryFrm.time[0],
        end_time: this.interpretationQueryFrm.time[1]
      }).then(res => {
        res.result.forEach(item => {
          item.create_time = parseTime(item.create_time);
          switch (item.type) {
            case '1':
              item.type = '自由打卡';
              break;
            case '2':
              item.type = '闯关打卡';
              break;
            default:
              break;
          }
          switch (item.status) {
            case '0':
              item.status = '重复打卡';
              break;
            case '1':
              item.status = '正常打卡';
              break;
            case '2':
              item.status = '补卡';
              break;
          }
          // 遍历内容
          let content = '';
          item.content.forEach(con => {
            // content += `<p>测试</p>`;
            switch (con.type) {
              case 'text':
                content += `<p>${con.value}</p>`;
                break;
              case 'audio':
                content += `<audio style="margin-right:10px;" preload="none" controls src="${con.value}"></audio>`;
                break;
              case 'video':
                content += `<div onclick="window.open('${con.value}');" style="width:210px;height:150px;display:inline-block;position:relative;"><img src="https://scrm-pic.oss-cn-hangzhou.aliyuncs.com/static/image/common/video_play.png" style="width: 40px;height: 40px;position:absolute;top:55px;left:80px;"></img><img style="width:200px;height:150px;margin-right:10px;" src="${con.cover}" /></div>`;
                break;
              case 'img':
                content += `<img style="width:200px;margin-right:10px;" src="${con.value}"/>`;
                break;
              default:
                break;
            }
          });
          item.content = content;
        });
        this.tableData = res.result;
        this.totalCount = res.totalCount * 1;
        this.userCount = res.userCount;
        this.tabLoading = false;
      });
      setTimeout(() => {
        this.tabLoading = false;
      }, 1500);
    },
    getActivity() {
      ACTIVITY.activityList({
        pageIndex: this.activityPageIndex,
        pageSize: this.activityPageSize
      }).then(res => {
        this.activityOptions = res.result;
        this.activityTotalCount = res.totalCount * 1;
        this.tabLoading = false;
        if (this.$route.query.id) {
          this.getSeries();
        }
      });
    },
    currentChangeActivity(e) {
      this.activityPageIndex = e;
      this.getActivity();
    },
    activityChange() {
      this.getSeries();
    },
    getSeries() {
      ACTIVITY.taskList({
        pageIndex: this.seriesPageIndex,
        pageSize: this.seriesPageSize,
        id: this.interpretationQueryFrm.activity_id
      }).then(res => {
        this.seriesOptions = res.result;
        this.seriesTotalCount = res.totalCount * 1;
        this.tabLoading = false;
      });
    },
    currentChangeSeries(e) {
      this.seriesPageIndex = e;
      this.getSeries();
    },
    searchActivityList() {
      this.query = _.cloneDeep(this.interpretationQueryFrm);
      const time = this.query.time || [];
      this.$set(this.query, 'start_time', this.timestamp(time[0]) || '');
      this.$set(this.query, 'end_time', this.timestamp(time[1]) || '');
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
    //   createActivity() {
    //     this.$router.push('/reading/clockActivityManagement/newActivity');
    //   },
    //   editHandler(info) {
    //     this.$router.push('/reading/clockActivityManagement/newActivity');
    //   },
    deleteHandler(info) {
      var delMessage = `确认删除 <b>${info.nickname}</b> 的打卡记录吗？`;
      this.$confirm(delMessage, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          API.deleteClock({ id: info.id }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
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
    // getStatusBtnInfo(item) {
    //   // 发布按钮样式
    //   if (item) {
    //     switch (item.status) {
    //       case '禁用':
    //         return {
    //           btn: 'primary',
    //           label: '启用'
    //         };
    //       default:
    //         return {
    //           btn: 'danger',
    //           label: '禁用'
    //         };
    //     }
    //   }
    //   return {
    //     btn: '',
    //     label: ''
    //   };
    // },
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
  .article_pages{
    text-align: right;
    margin: 5px 0 0;
  }
</style>
