<template>
  <div class="app-container">
    <div class="control-group mb-20">
      <el-button type="primary" @click="addPrizeKc">
        <i class="el-icon-plus mr-5 fs-13"></i> 新增
      </el-button>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @edit="editHandler"
      @delete="deleteHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>
<script>
import customElTable from '@/components/customElTable';
import { PrizeInventory } from '@/api/lottery/prize';
import { parseTime } from '@/utils';
import _ from 'lodash';

export default {
  name: 'prizeManagement',
  components: {
    customElTable
  },
  data() {
    return {
      tableOptions: [
        {
          label: 'ID',
          prop: 'id',
          width: 65
        },
        {
          label: '奖品名称',
          prop: 'name'
        },
        {
          label: '类型',
          prop: 'prize_type_name',
          width: 100
        },
        {
          label: '发奖方',
          prop: 'deliver_from_name',
          width: 100
        },
        {
          label: '状态',
          prop: 'status_name',
          options: {
            type: 'tag',
            prop: 'status'
          },
          width: 100
        },
        {
          label: '价值（元）',
          prop: 'price',
          width: 100
        },
        {
          label: '总数',
          prop: 'total',
          width: 80
        },
        {
          label: '库存数',
          prop: 'stock_count',
          width: 80
        },
        {
          label: '未分配数',
          prop: 'unassigned_count',
          width: 80
        },
        {
          label: '创建时间',
          prop: 'create_time',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          label: '最后更新',
          prop: 'update_time',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          prop: 'USER_ACTION',
          actions: ['edit', 'del']
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
      PrizeInventory.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(data => {
        this.tableData = (data.result || []).map(item => {
          return _.merge(item, {
            stock_count: item.total - item.taken_count,
            unassigned_count: item.total - item.assigned_count,
            create_time: parseTime(item.create_time),
            update_time: parseTime(item.update_time)
          });
        });
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      });
    },
    addPrizeKc() {
      this.$router.push({ name: 'prizeCreate' });
    },
    editHandler(item) {
      this.$router.push({ name: 'prizeModify', params: { id: item.id }});
    },
    deleteHandler(item) {
      this.$confirm(`您确认要删除奖品 ${item.name} 吗?`, '提示', {
        type: 'warning'
      }).then(() => {
        PrizeInventory.del(item.id).then(this.getData);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
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
