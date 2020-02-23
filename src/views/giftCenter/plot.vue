<!--
 * @Description: 奖品策略列表
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-10-17 11:09:23
 -->
<template>
  <div class="comment-wrapper app-container">
    <div class="btns-wrapper">
      <el-button type="primary" @click.stop="configGift">新增发奖策略</el-button>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @action="actionHandler"
      @handleSelectChange2="statusChange"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import Strategies from '@/api/integralMall/strategies';
  import customElTable from '@/components/customElTable';
  // import { parseTime } from '@/utils';
  export default {
    name: 'commentCenter',
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
        tableOptions: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '策略名称',
            prop: 'name'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'myedit',
                label: '编辑',
                btn: 'primary',
                itemOnly: false
              },
              {
                width: 80,
                actionType: 'select',
                label: '是否启用权重',
                labels: [
                  {
                    value: 1,
                    label: '启用'
                  },
                  {
                    value: 2,
                    label: '禁用'
                  }
                ]
              },
              'del'
            ]
          }
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      selectChange() {},
      configGift() {
        this.$router.push({name: 'addPlot'});
      },
      getData() {
        Strategies.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(result => {
          this.tableData = (result.result || []).map(item => {
            let statusCh = '';
            if (Number(item.status) === 1) {
              statusCh = '启用';
            } else if (Number(item.status) === 2) {
              statusCh = '禁用';
            }
            item.status = Number(item.status);
            return {
              ...item,
              statusCh
            };
          });
          this.totalCount = result.totalCount * 1;
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
      },
      deleteHandler(info) {
        this.$confirm(`确认删除策略 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Strategies.del(info)
            .then(() => {
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
        if (type === 'myedit') {
          this.$router.push({ name: 'addPlot', params: { id: info.id }});
        }
      },
      statusChange(info, e) {
        const params = {
          id: info.id,
          status: info.status
        };
        Strategies.status(params)
          .then(res => {
            this.getData();
          });
      }
    }
  };
  </script>

<style rel="stylesheet/scss" lang="scss" scoped>
.btns-wrapper{
  margin-bottom: 20px;
}
</style>
