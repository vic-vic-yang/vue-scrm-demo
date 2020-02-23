<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="classListQueryFrm">
        <el-form-item label="活动类型">
          <el-select
            placeholder="全部"
            style="width:230px"
            clearable
            v-model="classListQueryFrm.appType"
            @change="appTypeChange"
          >
            <el-option
              v-for="item in activeTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input :disabled="classListQueryFrm.appType === ''" placeholder="活动名称" v-model="classListQueryFrm.activityName"></el-input>
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            :editable="false"
            v-model="classListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input placeholder="用户ID" v-model="classListQueryFrm.userId"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input placeholder="用户昵称" v-model="classListQueryFrm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input placeholder="任务名称" v-model="classListQueryFrm.missionName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGameList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGameList" icon="el-icon-refresh">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportData" icon="el-icon-document">导出</el-button>
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
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Api from '@/api/reportSystem/index';

export default {
  name: 'contentList',
  components: {
    customElTable
  },
  data() {
    return {
      tableOptions: [
        {
          label: '编号',
          prop: 'id',
          width: 80
        },
        {
          label: '用户ID',
          prop: 'user_id'
        },
        {
          label: '用户昵称',
          prop: 'nickname'
        },
        {
          label: '活动名称',
          prop: 'activity'
        },
        {
          label: '活动类型',
          prop: 'activity_type'
        },
        {
          label: '任务名称',
          prop: 'mission'
        },
        {
          label: '获得奖励',
          prop: 'prize_name'
        },
        {
          label: '发放情况',
          prop: 'status'
        },
        {
          label: '发放时间',
          prop: 'create_time'
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      activeTypes: [
        { name: '投票活动', id: 4 },
        { name: '答题活动', id: 1 },
        { name: '拼团活动', id: 2 },
        { name: '报名活动', id: 5 }
      ],
      exportDialogShow: false,
      classListQueryFrm: {
        // 查询条件
        activityName: '',
        appType: '',
        nickname: '',
        userId: '',
        missionName: '',
        time: null
      },
      merchantId: '', // 商户ID
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
      }
    };
  },
  created() {
    this.searchGameList();
  },
  methods: {
    exportData() {
      const params = {
        ...this.classListQueryFrm,
        merchantId: this.merchantId
      };
      let str = '';
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const item = params[key];
          str += `${key}=${item}&`;
        }
      }
      str = str.substring(0, str.length - 1);
      console.log(`${process.env.BASE_API}/base/v1/statistics/statistics/award-log-export?${str}`);
      window.open(
        `${process.env.BASE_API}/base/v1/statistics/statistics/award-log-export?${str}`
      );
      this.closeDialog();
    },
    closeDialog() {
      this.exportDialogShow = false;
    },
    getData() {
      const query = this.query || {};
      this.tabLoading = true;
      Api.rewardRecords({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...query
      })
        .then(data => {
          this.merchantId = data.merchantId;
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    searchGameList() {
      // 查询
      this.query = {
        activityName: this.classListQueryFrm.activityName,
        appType: this.classListQueryFrm.appType,
        nickname: this.classListQueryFrm.nickname,
        userId: this.classListQueryFrm.userId,
        missionName: this.classListQueryFrm.missionName,
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
    appTypeChange(val) {
      if (val === '') {
        this.classListQueryFrm.activityName = '';
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
    }
  }
};
</script>

<style lang="scss">
.export-dialog {
  /* 谷歌 */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  /* 火狐 */
  input {
    -moz-appearance: textfield;
  }
}
</style>

