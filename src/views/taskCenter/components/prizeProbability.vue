<template>
  <el-dialog
    title="任务奖励列表"
    :visible.sync="show"
    width="70%"
    @close="handleClose">
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @popoverHandler="popoverHandler">
    </custom-el-table>
  </el-dialog>
</template>

<script>
  import TASK_API from '@/api/task/index';
  import customElTable from '@/components/customElTable';

  export default {
    name: 'prizeProbability',
    components: {
      customElTable
    },
    props: ['probabilityShow', 'taskItem'],
    data() {
      return {
        show: this.probabilityShow,
        invite_prize_list: null,
        prize_list: null,
        prizeResult: [], // 邀请人
        invitePrizeResult: [], // 被邀请人
        tableOptions: [
          {
            label: '发奖对象',
            prop: 'target'
          },
          {
            label: '发奖策略',
            prop: 'prizeStrategy'
          },
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '奖品名称',
            prop: 'name'
          },
          {
            label: '奖品图标',
            prop: 'task_img',
            options: {
              type: 'img',
              width: 80,
              height: 80
            }
          },
          {
            label: '奖品价值',
            prop: 'worth'
          },
          {
            label: '奖品库存',
            prop: 'store',
            options: {
              type: 'edit'
            }
          },
          {
            label: '动态发奖概率',
            prop: 'rate_text',
            options: {
              type: 'tag',
              prop: 'tag_status'
            }
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true
      };
    },
    watch: {
      probabilityShow(val) {
        this.show = val;
        if (val) {
          this.getData();
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('handleClose');
      },
      getData() {
        this.tabLoading = true;
        const params = {
          page_size: this.pageSize,
          page_index: 10000,
          mission_id: this.taskItem.id
        };
        TASK_API.prize_rate_list(params).then(res => {
          console.log(res);
          this.prizeResult = (res.prizeResult || []).map(item => {
            return {
              ...item,
              target: '邀请人',
              rate_text: item.rate + '%',
              worth: item.worth + this.setCompany(item.type),
              task_img: item.pic[0].file_path,
              tag_status: 4
            };
          });
          this.invitePrizeResult = (res.invitePrizeResult || []).map(item => {
            return {
              ...item,
              target: '被邀请人',
              rate_text: item.rate + '%',
              worth: item.worth + this.setCompany(item.type),
              task_img: item.pic && item.pic.length ? item.pic[0].file_path : '',
              tag_status: 4
            };
          });
          this.tableData = [...this.prizeResult, ...this.invitePrizeResult];
          this.totalCount = this.tableData.length;
          this.tabLoading = false;
        });
      },
      popoverHandler(scope, value) {
        if (Number(value) < 0) {
          this.$message({
            type: 'error',
            message: `最小只能输入0`
          });
          return;
        }
        const params = {
          id: scope.row.id,
          store: value
        };
        TASK_API.set_store(params).then(res => {
          if (Number(res.data.status) === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getData();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1) {
          if (this.prizeResult.length <= 1) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
          if (this.invitePrizeResult.length <= 1) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
          if (rowIndex >= 0 && rowIndex < this.prizeResult.length) {
            return {
              rowspan: this.prizeResult.length,
              colspan: 1
            };
          } else if (rowIndex % this.invitePrizeResult.length === 0) {
            return {
              rowspan: this.invitePrizeResult.length,
              colspan: 1
            };
          }
        }
      },
      setCompany(type) {
        switch (type + '') {
          case '5':
          case '4':
            return '次';
          case '3':
            return '积分';
          case '2':
            return '元';
          default:
            return '';
        }
      }
    }
  };
</script>

<style scoped>

</style>
