<template>
  <div class="app-container">
    <div class="control-group" style="padding: 0 0 20px">
      <el-button type="primary" @click="createCommodity">
        <i class="fs-13 el-icon-plus mr-5"></i>新增奖项
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
  import lotteryPrize from '@/api/integralMall/lotteryPrize';
  import { parseTime } from '@/utils';

  export default {
    name: 'rule_list',
    components: {
      customElTable
    },
    data() {
      return {
        rule_id: this.$route.query.rule_id,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '奖品等级',
            prop: 'prize_level_name'
          },
          {
            label: '奖品名称',
            prop: 'prize_name'
          },
          {
            label: '奖品数量',
            prop: 'total_num'
          },
          {
            label: '已使用奖品数',
            prop: 'use_num'
          },
          {
            label: '剩余奖品数',
            prop: 'left_num'
          },
          {
            label: '中奖百分比',
            prop: 'win_percent'
          },
          {
            label: '排序',
            prop: 'sort'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              'del'
            ]
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
        lotteryPrize.list({
          rule_id: this.rule_id,
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 === 0 ? '--' : parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createCommodity() {
        this.$router.push({ name: 'marketingLotteryPrizeCreate', query: { rule_id: this.rule_id }});
      },
      editHandler(info) {
        this.$router.push({ name: 'marketingLotteryPrizeModify', params: { id: info.id }, query: { rule_id: this.rule_id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除奖项 <b>${info.prize_name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          lotteryPrize.del({ id: info.id })
            .then(() => {
              this.$message({
                type: 'success',
                message: `已删除奖项${info.prize_name}`
              });
              this.getData();
            });
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
