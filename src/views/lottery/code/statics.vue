<template>
  <div class="app-container">
    <div class="control-group">
      <el-form @submit.native.prevent="searchPvCode" :inline="true">
        <el-form-item label="码序号">
          <el-input
            v-model="pvCode"
            clearable
            placeholder="请输入码序号">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            icon="el-icon-search">
            搜索
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
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import CodeManager from '@/api/lottery/codeManager';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'codeStatics',
    components: {
      customElTable
    },
    data() {
      return {
        pvCode: '',
        queryPvCode: '',
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 65
          },
          {
            label: '手机号码',
            prop: 'phone',
            width: 120
          },
          {
            label: '码序号',
            prop: 'pv_code'
          },
          {
            label: '活动名称',
            prop: 'activity_name'
          },
          {
            label: '手机归属地',
            prop: 'phone_registration_location'
          },
          {
            label: '会员类型',
            prop: 'vip_type'
          },
          {
            label: '奖品等级',
            prop: 'prize_level'
          },
          {
            label: '奖品',
            prop: 'prize_name'
          },
          {
            label: '价值（元）',
            prop: 'prize_worth'
          },
          {
            label: '扫码地址',
            prop: 'scan_address'
          },
          {
            label: '扫码时间',
            prop: 'scan_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
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
        this.tabLoading = true;
        CodeManager.statics({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          pvCode: this.queryPvCode
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return _.merge(item, { scan_time: parseTime(item.scan_time) });
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchPvCode() {
        this.queryPvCode = this.pvCode;
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
      }
    }
  };
</script>

<style scoped>

</style>
