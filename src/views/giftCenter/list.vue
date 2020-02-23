<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 09:51:20
 * @LastEditTime: 2019-08-21 10:11:04
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="comment-wrapper app-container">
    <div class="control-group">
      <el-form :inline="true" ref="awardFrm" :model="awardFrm">
        <el-form-item prop="prize_type" label="奖品类型">
          <el-select placeholder="全部" clearable v-model="awardFrm.prize_type">
            <el-option
              v-for="item in prizeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="prize_id" label="奖品">
          <el-select placeholder="全部" clearable v-model="awardFrm.prize_id">
            <el-option
              v-for="item in prizeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <el-pagination
              layout="prev, pager, next"
              :pager-count="7"
              :page-size="prizePageSize"
              :total="prizeTotalCount"
              :current-page="prizePageIndex"
              @current-change="prizePageChangeHandler">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item prop="mission_id" label="任务">
          <el-select placeholder="全部" clearable v-model="awardFrm.mission_id">
            <el-option
              v-for="item in missionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <el-pagination
              layout="prev, pager, next"
              :pager-count="7"
              :page-size="missionPageSize"
              :total="missionTotalCount"
              :current-page="missionPageIndex"
              @current-change="missionPageChangeHandler">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item prop="activity_id" label="活动">
          <el-select placeholder="全部" clearable v-model="awardFrm.activity_id">
            <el-option
              v-for="item in activityOptions"
              :key="item.id"
              :label="item.activity_name"
              :value="item.id">
            </el-option>
            <el-pagination
              layout="prev, pager, next"
              :pager-count="7"
              :page-size="activityPageSize"
              :total="activityTotalCount"
              :current-page="activityPageIndex"
              @current-change="activityPageChangeHandler">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="发送状态">
          <el-select placeholder="全部" clearable v-model="awardFrm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="nickname" label="得奖人微信昵称">
          <el-input placeholder="得奖人微信昵称" clearable v-model="awardFrm.nickname" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="发送时间">
          <el-date-picker
            :editable="false"
            v-model="awardFrm.time"
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
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('awardFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
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
  </div>
</template>

<script>
  import GIFTCENTER_API from '@/api/giftcenter/index';
  import missionTask from '@/api/task/index';
  import ACTIVITY_API from '@/api/activityCenter/index';
  import customElTable from '@/components/customElTable';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'commentCenter',
    components: {
      customElTable
    },
    data() {
      return {
        query: null,
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '奖品类型',
            prop: 'prize_type'
          },
          {
            label: '奖品名称',
            prop: 'prize_name'
          },
          {
            label: '奖品价值',
            prop: 'prize_value'
          },
          {
            label: '得奖人微信昵称',
            prop: 'nickname'
          },
          {
            label: '联系信息',
            prop: 'user_info',
            width: 160
          },
          {
            label: '所属任务',
            prop: 'mission'
          },
          {
            label: '所属活动',
            prop: 'activity_name'
          },
          {
            label: '发送时间',
            prop: 'create_time'
          },
          {
            label: '发送状态',
            prop: 'status_name',
            options: {
              type: 'tag',
              prop: 'status'
            }
          },
          {
            label: '发奖备注',
            prop: 'error_msg'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'replacement',
                options: item => {
                  return {
                    label: '补发',
                    btn: 'button'
                  };
                }
              }
            ]
          }
        ],
        prizeTypeOptions: [
          {
            label: '谢谢参与',
            value: 1
          },
          {
            label: '红包',
            value: 2
          },
          {
            label: '积分',
            value: 3
          },
          {
            label: '答题次数',
            value: 4
          },
          {
            label: '投票次数',
            value: 5
          },
          {
            label: '电子卡券',
            value: 6
          }
        ],
        prizeOptions: [],
        missionOptions: [],
        statusOptions: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '成功',
            value: 1
          },
          {
            label: '失败',
            value: 2
          }
        ],
        awardFrm: {
          prize_type: '',
          prize_id: '',
          mission_id: '',
          activity_id: '',
          status: '',
          time: '',
          send_start_time: '',
          send_end_time: '',
          nickname: ''
        },
        pickerOptions: {
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
        activityOptions: [],
        prizePageIndex: 1,
        prizePageSize: 20,
        prizeTotalCount: 0,
        missionPageIndex: 1,
        missionPageSize: 20,
        missionTotalCount: 0,
        activityPageIndex: 1,
        activityPageSize: 20,
        activityTotalCount: 0
      };
    },
    created() {
      this.getData();
      this.getAward();
      this.getMission();
      this.getActivity();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        GIFTCENTER_API.plot({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              prize_type: this.set_prize_type(item.prize_type),
              mission: item.mission_info ? item.mission_info.name : '',
              status_name: item.status * 1 === 1 ? '成功' : '失败',
              user_info: item.user_contact_info ? item.user_contact_info.province + item.user_contact_info.city + item.user_contact_info.zone + item.user_contact_info.detail : '',
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      getAward() {
        GIFTCENTER_API.list({
          page_index: this.prizePageIndex,
          page_size: this.prizePageSize
        }).then(res => {
          this.prizeOptions = res.result;
          this.prizeTotalCount = res.totalCount * 1;
        });
      },
      prizePageChangeHandler(page) {
        this.prizePageIndex = page;
        this.getAward();
      },
      getMission() {
        missionTask.getTasks({
          page_index: this.missionPageIndex,
          page_size: this.missionPageSize
        }).then(res => {
          this.missionOptions = res.result || [];
          this.missionTotalCount = res.totalCount * 1;
        });
      },
      missionPageChangeHandler(page) {
        this.missionPageIndex = page;
        this.getMission();
      },
      getActivity() {
        ACTIVITY_API.list({
          page_index: this.activityPageIndex,
          page_size: this.activityPageSize
        }).then(res => {
          this.activityOptions = res.result;
          this.activityTotalCount = res.totalCount * 1;
        });
      },
      activityPageChangeHandler(page) {
        this.activityPageIndex = page;
        this.getActivity();
      },
      set_prize_type(data) {
        var type = '';
        this.prizeTypeOptions.map(item => {
          if (item.value * 1 === data * 1) {
            type = item.label;
          }
        });
        return type;
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
      searchActivityList() {
        this.query = _.cloneDeep(this.awardFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'send_start_time', time[0] || '');
        this.$set(this.query, 'send_end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      actionHandler(type, info) {
        if (type === 'replacement') {
          GIFTCENTER_API.resend(info.id).then(res => {
            console.log(res);
            if (res.data.status === 1) {
              this.$message({
                type: 'success',
                message: '补发成功'
              });
            } else {
              this.$message({
                type: 'error',
                message: '补发失败'
              });
            }
          });
        }
      }
    }
  };
  </script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
