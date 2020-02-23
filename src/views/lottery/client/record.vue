<template>
  <div class="app-container">
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
  import MemberManager from '@/api/lottery/memberManager';

  export default {
    name: 'record',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '活动名称',
            prop: 'activity_name'
          },
          {
            label: '参与码',
            prop: 'pv_code',
            sortable: true
          },
          {
            label: '中奖结果',
            prop: 'prize_name'
          },
          {
            label: '发奖结果',
            prop: 'status'
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
        MemberManager.record({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          userId: this.$route.params.id
        }).then(data => {
          this.tableData = data.result || [];
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
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
