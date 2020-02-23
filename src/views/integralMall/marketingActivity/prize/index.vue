<!--
 * @Description: 
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-09-16 14:37:18
 -->
<template>
  <div class="app-container">
    <div class="app-container">
      <div class="control-group" style="padding: 0 0 20px">
        <el-button type="primary" @click="createPrize">
          <i class="fs-13 el-icon-plus mr-5"></i>新增奖品
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

  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import prize from '@/api/integralMall/prize';
  import { parseTime } from '@/utils';

  export default {
    name: 'prize_list',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '奖品名称',
            prop: 'name',
            width: 300
          },
          {
            label: '类型',
            prop: 'type_name'
          },
          {
            label: '奖品价值',
            prop: 'worth'
          }, {
            label: '总数',
            prop: 'total_num'
          },
          {
            label: '库存数',
            prop: 'store'
          },
          {
            label: '未分配数',
            prop: 'unallocated_num'
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
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
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
        prize.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              type_name: item.type * 1 === 1 ? '谢谢参与' : item.type * 1 === 2 ? '积分' : '虚拟奖品',
              create_time: item.create_time * 1 === 0 ? '--' : parseTime(item.create_time)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createPrize() {
        this.$router.push({ name: 'marketingPrizeCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'marketingPrizeModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除奖品 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          prize.del({ id: info.id })
            .then(() => {
              this.$message({
                type: 'success',
                message: `已删除奖品${info.name}`
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
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          this.$confirm(`确认立即${title}奖品 <b>${info.name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            prize.status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            })
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
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
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        if (status === 3) return false;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          } : {
            btn: 'primary',
            label: '启用'
          };
      }
    }
  };
</script>

<style scoped>

</style>
