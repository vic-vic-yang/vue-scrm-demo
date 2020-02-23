<template>
  <div class="app-container commodity-list">
    <div class="control-group mb-20">
      <el-button type="primary" @click="addCode" icon="el-icon-plus">新建核销码</el-button>
    </div>
    <custom-el-table v-loading="tabLoading" v-model="pageIndex" :tableData="tableData" :tableOptions="tableOptions"
      :total="totalCount" @action="actionHandler" @size-change="sizeChangeHandler" @page-change="pageChangeHandler"></custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  export default {
    name: 'writOff-list',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          // {
          //  label: '',
          //  prop: 'SELECTION',
          //  align: 'center'
          // },
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '创建时间',
            prop: 'create_time',
            width: 200,
            className: 'ph-6'
          },
          {
            label: '核销码',
            prop: 'code'
          },
          {
            label: '关联商品',
            prop: 'total_num'
          },
          {
            label: '总数',
            prop: 'total_num'
          },
          {
            label: '已发放',
            prop: 'success_num'
          },
          {
            prop: 'USER_ACTION',
            actions: [{
              type: 'export',
              label: '导出状态报表'
            }]
          }
        ],
        tableData: [{
          id: '123123',
          code: 'DSFGDSFG',
          create_time: '2014-09-08 12:22:11',
          total_num: '1',
          success_num: '1'
        }],
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
        this.tabLoading = false;
      },
      actionHandler(type, info) {
        if (type === 'export') {
          console.log('11111111');
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
      addCode() {
        this.$router.push({
          name: 'writeOffCreate'
        });
      }
    }
  };
</script>

<style>
</style>
