<template>
  <div class="activity-wrapper app-container">
    <el-form ref="form" :inline="true" :model="form" style="margin-left: 0">
      <el-form-item prop="nickname" label="创建者">
        <el-input placeholder="" v-model="queryForm.nickname"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="用户档案名称">
        <el-input placeholder="" v-model="queryForm.name"></el-input>
      </el-form-item>
      <el-form-item prop="time" label="创建时间">
        <el-date-picker
          :editable="false"
          v-model="queryForm.time"
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
        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        <el-button @click="resetForm()" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="activity">线下活动</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  import customElTable from '@/components/customElTable';
  import {parseTime } from '@/utils/index';
  export default {
    name: 'userGrowthIndex',
    components: {
      customElTable
    },
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        form: {
          activetype: ''
        },
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '创建者',
            prop: 'nickname'
          },
          {
            label: '档案模型',
            prop: 'doc_type'
          },
          {
            label: '成长档案名称',
            prop: 'name'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'view',
                label: '详情',
                btn: 'primary'
              }
            ]
          }
        ],
        queryForm: {
          nickname: '',
          name: '',
          time: []
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.query(this.formatResult);
      },
      search() {
        this.tableData = [];
        this.query(this.formatResult);
      },
      query(callback) {
        const params = {
          nickname: this.queryForm.nickname || '',
          name: this.queryForm.name || '',
          start_time: this.queryForm.time[0] || '',
          end_time: this.queryForm.time[1] || '',
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        };
        USER_GROWTH_API.index(params).then(callback);
      },
      formatResult(res) {
        const result = res.result;
        this.tableData = result.map(item => {
          item.create_time = parseTime(item.create_time);
          return {
            ...item
          };
        });
        this.totalCount = res.totalCount * 1;
      },
      resetForm() {
        this.queryForm.nickname = '';
        this.queryForm.name = '';
        this.queryForm.time = [];
      },
      actionHandler(type, scope) {
        if (type === 'view') {
          this.$router.push({
            name: 'growthView',
            params: {
              id: scope.id
            }
          });
        }
      },
      pickerOptions() {
        console.log('pickerOptions is empty');
      },
      activity() {
        this.$router.push({
          name: 'growthActivityIndex',
          params: {
          }
        });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
