<template>
  <div class="app-container">
    <div class="control-group mb-20">
      <el-button type="primary" @click="createLotteryRule">
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
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import { LotteryRule } from '@/api/lottery/lotteryRule';
import { parseTime } from '@/utils';
import _ from 'lodash';

export default {
  name: 'lotteryRule',
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
          label: '规则名称',
          prop: 'name'
        },
        {
          label: '奖品规则数',
          prop: 'prize_rule_count',
          width: 100
        },
        {
          label: '启用黑名单',
          prop: 'is_black_txt',
          options: {
            type: 'tag',
            prop: 'is_black'
          },
          width: 100
        },
        {
          label: '启用会员组',
          prop: 'is_member_txt',
          options: {
            type: 'tag',
            prop: 'is_member'
          },
          width: 100
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
          actions: [
            'edit',
            'del',
            {
              type: 'prizeRule',
              label: '策略'
            }
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
      LotteryRule.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(data => {
        this.tableData = (data.result || []).map(item => {
          return _.merge(item, {
            is_black: item.filter_user === 1 ? 1 : 0,
            is_black_txt: item.filter_user === 1 ? '是' : '否',
            is_member: item.filter_user === 2 ? 1 : 0,
            is_member_txt: item.filter_user === 2 ? '是' : '否',
            create_time: parseTime(item.create_time),
            update_time: parseTime(item.update_time)
          });
        });
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      });
    },
    createLotteryRule() {
      this.$router.push({ name: 'lotteryRuleCreate' });
    },
    editHandler(item) {
      this.$router.push({ name: 'lotteryRuleModify', params: { id: item.id }});
    },
    deleteHandler(item) {
      this.$confirm(`您确认要删除抽奖规则 ${item.name} 吗?`, '提示', {
        type: 'warning'
      }).then(() => {
        LotteryRule.del(item.id).then(this.getData);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    actionHandler(type, item) {
      if (type === 'prizeRule') {
        this.$router.push({ name: 'prizeRule', query: { lotteryRuleId: item.id }});
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
