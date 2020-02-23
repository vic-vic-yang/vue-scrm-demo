<template>
  <div class="app-container">
    <div class="control-group">
      <el-form
        ref="clientSearchFrm"
        @submit.native.prevent="searchClient"
        :inline="true">
        <el-form-item label="电话" prop="userPhone">
          <el-input
            type="tel"
            name="userPhone"
            v-model="userPhone"
            placeholder="请输入用户电话号码">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            icon="el-icon-search">
            查询
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
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import MemberManager from '@/api/lottery/memberManager';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'clientList',
    components: {
      customElTable
    },
    data() {
      return {
        userPhone: '',
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: 100
          },
          {
            label: '手机',
            prop: 'phone_number'
          },
          {
            label: '微信ID',
            prop: 'open_id'
          },
          {
            label: '扫码次数',
            prop: 'scan_count'
          },
          {
            label: '收货信息',
            prop: 'has_address'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'record',
                label: '获奖记录'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        searchPhone: '',
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
        MemberManager.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          phone: this.searchPhone
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return _.merge(item, {
              has_address: item.address ? '有' : '无',
              create_time: parseTime(item.create_time)
            });
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchClient() {
        this.searchPhone = this.userPhone;
        this.pageIndex = 1;
        this.getData(this.userPhone);
      },
      actionHandler(type, item) {
        if (type === 'record') {
          this.$router.push({ name: 'clientRecord', params: { id: item.id }});
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

<style scoped>

</style>
