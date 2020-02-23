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
import Log from '@/api/lottery/log';
import { parseTime } from '@/utils';
import _ from 'lodash';

export default {
  name: 'operationLog',
  components: {
    customElTable
  },
  data() {
    return {
      tableOptions: [
        {
          label: '序号',
          prop: 'id',
          width: 65
        },
        {
          label: '操作用户',
          prop: 'op_username',
          width: 120
        },
        {
          label: '日志类型',
          prop: 'op_description',
          width: 240
        },
        {
          label: '日志类容',
          prop: 'op_detail',
          align: 'left'
        },
        {
          label: '日志时间',
          prop: 'create_time',
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
      Log.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(data => {
        this.tableData = (data.result || []).map((item, index) => {
          return _.merge(item, { id: index + 1, create_time: parseTime(item.create_time) });
        });
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
