<template>
  <div class="app-container task-list">
    <div class="control-group">
      <el-form :inline="true" ref="orderQueryFrm" :model="orderQueryFrm">
        <el-form-item prop="search_input">
          <el-input
            placeholder="请输入内容"
            v-model="orderQueryFrm.search_input"
            class="input-with-select">
            <el-select style="width: 126px" v-model="orderQueryFrm.search_type" @change="searchTypeChange" slot="prepend" placeholder="请选择">
              <el-option
                v-for="item in conditionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="手机号码">-->
          <!--<el-input placeholder="手机号码" v-model="orderQueryFrm.phone"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item prop="mission_name" label="任务名称">
          <el-input placeholder="任务名称" v-model="orderQueryFrm.mission_name"></el-input>
        </el-form-item>
        <!--<el-form-item label="任务类型">-->
          <!--<el-select placeholder="任务类型" clearable v-model="orderQueryFrm.status">-->
            <!--<el-option-->
              <!--v-for="item in statusOptions"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item prop="time" label="完成时间">
          <el-date-picker
            :editable="false"
            v-model="orderQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchOrderList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('orderQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import integralTask from '@/api/integralMall/task';
  import { parseTime } from '@/utils';

  export default {
    name: 'taskList',
    components: {
      customElTable
    },
    data() {
      return {
        orderQueryFrm: {
          search_type: 1,
          search_input: '',
          status: '',
          time: [],
          mission_name: ''
        },
        tableOptions: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '用户ID',
            prop: 'user_id',
            options: {
              type: 'html'
            }
          },
          {
            label: '昵称',
            prop: 'nick_name'
          },
          {
            label: '联系用户名',
            prop: 'user_name',
            options: {
              type: 'html'
            }
          },
          {
            label: '手机号码',
            prop: 'phone',
            options: {
              type: 'html'
            }
          },
          {
            label: '获取积分',
            prop: 'mission_integral',
            options: {
              type: 'html'
            }
          },
          {
            label: '完成时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            label: '任务名称',
            prop: 'mission_name'
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        conditionOptions: [
          {
            value: 1,
            label: '用户ID'
          },
          {
            value: 2,
            label: '昵称'
          },
          {
            value: 3,
            label: '联系用户名'
          },
          {
            value: 4,
            label: '手机号码'
          }
        ],
        conditionType: 'order_number',
        statusOptions: [
          {
            value: 0,
            label: '全部积分数据'
          },
          {
            value: 1,
            label: '用户已消耗积分'
          },
          {
            value: 2,
            label: '用户已获取积分'
          }
        ],
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
        query: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        integralTask.journalDetails({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time)
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
      searchOrderList() {
        this.query = _.cloneDeep(this.orderQueryFrm);
        const time = this.query.time;
        this.$set(this.query, 'finish_start_time', time[0] || '');
        this.$set(this.query, 'finish_end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
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
      searchTypeChange() {
        this.$set(this.orderQueryFrm, 'search_input', '');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
