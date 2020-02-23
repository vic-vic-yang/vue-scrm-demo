<template>
  <div class="app-container">
    <div class="control-group mb-20">
      <el-button type="primary" @click="createGameName">
        <i class="fs-13 el-icon-plus mr-5"></i>新增称号
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
  import Game from '@/api/answer/game';
  import { parseTime } from '@/utils';

  export default {
    name: 'gameNameList',
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
            label: '称号名称',
            prop: 'name'
          },
          {
            label: '称号描述',
            prop: 'desc'
          },
          {
            label: '得分比',
            prop: 'percent'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
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
        tabLoading: true,
        gameId: this.$route.params.gameId
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        Game.name.list(this.gameId, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          this.tableData = (data || []).map(item => {
            return {
              ...item,
              percent: `${item.startPercent}%-${item.endPercent}%`,
              createTime: parseTime(item.createTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      createGameName() {
        this.$router.push({ name: 'gameNameCreate', params: { gameId: this.gameId }});
      },
      editHandler(info) {
        this.$router.push({ name: 'gameNameModify', params: { id: info.id, gameId: this.gameId }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除称号 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Game.name.del(this.gameId, info.id)
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
