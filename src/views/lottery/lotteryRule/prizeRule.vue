<template>
  <div class="app-container">
    <div class="control-group mb-20">
      <el-button type="primary" @click="createLotteryRule">
        <i class="el-icon-plus mr-5 fs-13"></i> 新增
      </el-button>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :pagination="false"
      @edit="editHandler"
      @delete="deleteHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import { PrizeRule } from '@/api/lottery/lotteryRule';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'lotteryRule',
    components: {
      customElTable
    },
    data() {
      return {
        lotteryRuleId: this.$route.query.lotteryRuleId,
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: 65
          },
          {
            label: '奖品等级',
            prop: 'level_name',
            width: 120
          },
          {
            label: '奖品',
            prop: 'prize_name'
          },
          {
            label: '奖品数目',
            prop: 'assigned_num',
            width: 100
          },
          {
            label: '已使用奖品数目',
            prop: 'delivered_count',
            width: 120
          },
          {
            label: '剩余奖品数目',
            prop: 'un_delivered_count',
            width: 120
          },
          {
            label: '中奖百分比',
            prop: 'm_calculate_probability',
            width: 120
          },
          {
            label: '干预中奖百分比',
            prop: 'probability_set',
            width: 120
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '启用',
            prop: 'statusTxt',
            options: {
              type: 'tag',
              prop: 'status'
            },
            width: 100
          },
          {
            prop: 'USER_ACTION',
            actions: ['edit', 'del']
          }
        ],
        tableData: [],
        tabLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        PrizeRule.list({
          lotteryRuleId: this.lotteryRuleId
        }).then(data => {
          if (data) {
            this.tableData = (data || []).map(item => {
              return _.merge(item, {
                un_delivered_count: item.assigned_num - item.delivered_count,
                m_calculate_probability: (item.m_calculate_probability * 1).toFixed(3),
                probability_set: (item.probability_set * 1).toFixed(3),
                statusTxt: ['停用', '启用'][item.status],
                create_time: parseTime(item.create_time)
              });
            });
            this.totalCount = data.totalCount * 1;
          }
          this.tabLoading = false;
        });
      },
      createLotteryRule() {
        this.$router.push({
          name: 'prizeRuleCreate',
          query: {
            lotteryRuleId: this.lotteryRuleId
          }
        });
      },
      editHandler(item) {
        this.$router.push({
          name: 'prizeRuleModify',
          params: { id: item.id },
          query: {
            lotteryRuleId: this.lotteryRuleId
          }
        });
      },
      deleteHandler(item) {
        this.$confirm(`您确认要删除奖品规则 ${item.prize_name} 吗?`, '提示', {
          type: 'warning'
        }).then(() => {
          PrizeRule.del(item.id).then(this.getData);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  };
</script>

<style scoped>

</style>
