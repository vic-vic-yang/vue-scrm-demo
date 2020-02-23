<template>
  <div class="comment-wrapper app-container">
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @handleSelectChange="handleSelectChange"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import COMMENT_API from '@/api/comment/index';
  import customElTable from '@/components/customElTable';
  export default {
    name: 'configCenter',
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
            label: '编号',
            prop: 'id',
            width: 120
          },
          {
            label: '评论来源',
            prop: 'origin'
          },
          {
            label: '模式',
            prop: 'patternZh'
          },
          {
            prop: 'USER_ACTION',
            width: 120,
            actions: [
              {
                type: 'select',
                arr: [
                  {
                    value: '2',
                    label: '先发后审'
                  },
                  {
                    value: '1',
                    label: '先审后发'
                  },
                  {
                    value: '3',
                    label: '禁止评论'
                  }
                ]
              }
            ]
          }
        ]
      };
    },
    created() {
      this.init();
    },
    methods: {
      formatOrigin(type) {
        switch (~~type) {
          case 1:
            return '文章';
          case 2:
            return '投票';
          default:
            return '电竞';
        }
      },
      init() {
        COMMENT_API.configList().then(res => {
          this.tableData = res.map(item => {
            let patternZh = '';
            if (~~item.pattern === 1) {
              // 先审后发
              patternZh = '先审后发';
            } else if (~~item.pattern === 2) {
              // 先发后审
              patternZh = '先发后审';
            } else if (~~item.pattern === 3) {
              // 禁止评论
              patternZh = '禁止评论';
            }
            return {
              ...item,
              origin: this.formatOrigin(item.type),
              patternZh
            };
          });
        });
      },
      handleSelectChange(row) {
        // if (val !== row.pattern) {
        const params = {
          id: row.id,
          pattern: row.pattern
        };
        COMMENT_API.operateConfigList(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.init();
          }
        });
        // }
      },
      sizeChangeHandler() {},
      pageChangeHandler() {},
      deleteHandler() {}
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
