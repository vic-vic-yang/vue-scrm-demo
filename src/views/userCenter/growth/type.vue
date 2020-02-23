<template>
  <div class="activity-wrapper app-container">
    <el-form :inline="true" label-width="120px">
      <el-form-item>
        <el-button type="primary" :disabled="disableAdd" @click="add" icon="el-icon-plus">新建</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @edit="editHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  import customElTable from '@/components/customElTable';
  import {parseTime } from '@/utils/index';
  export default {
    name: 'userGrowthType',
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
        disableAdd: false,
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '成长记录档案模型',
            prop: 'name'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit'
            ]
          }
        ]
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.query(this.formatResult);
      },
      query(callback) {
        const params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        };
        USER_GROWTH_API.type(params).then(callback);
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
        this.disableAdd = this.tableData.length > 0;
      },
      editHandler(scope) {
        this.$router.push({
          name: 'growthEditType',
          params: {
            id: scope.id
          }
        });
      },
      add() {
        this.$router.push({
          name: 'growthAddType',
          params: {
          }
        });
      },
      actionHandler() {
        console.log('actionHandler is empty');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
