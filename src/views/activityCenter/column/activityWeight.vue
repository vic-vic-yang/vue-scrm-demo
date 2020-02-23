<template>
  <div class="activity-wrapper app-container">
    <el-form ref="form" :inline="true" label-width="80px">
      <el-form-item>
        <el-button @click="$router.back()">返回上一步</el-button>
        <el-button type="primary" @click="editorActivity">设置栏目活动</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import column from '@/api/activityCenter/column';
  import { parseTime } from '@/utils';

  export default {
    name: 'avtivityWeight',
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
            label: '活动标题',
            prop: 'activity_name'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            label: '状态',
            prop: 'statusCh'
          },
          {
            label: '权重',
            prop: 'weight',
            max: 100,
            options: {
              type: 'edit'
            }
          }
          // {
          //   prop: 'USER_ACTION',
          //   actions: [
          //     // 'del'
          //   ]
          // }
        ],
        form: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        column.activity_list({
          column_id: this.$route.params.id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            let statusCh = '';
            if (Number(item.status) === 1) {
              statusCh = '启用';
            } else if (Number(item.status) === 2) {
              statusCh = '隐藏';
            } else if (Number(item.status) === 0) {
              statusCh = '禁用';
            }
            item.weight = Number(item.weight);
            item.status = Number(item.status);
            return {
              ...item,
              old_weight: item.weight,
              create_time: parseTime(item.create_time),
              statusCh
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      editorActivity() {
        this.$router.push({ name: 'activityColumnModify', params: { id: this.$route.params.id }, query: { type: 1}});
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
          weight: value,
          type: 2
        };

        column.weight(params).then(res => {
          if (res.success) {
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
