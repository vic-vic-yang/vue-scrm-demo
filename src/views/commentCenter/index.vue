<template>
  <div class="comment-wrapper app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="评论来源">
        <el-select v-model="formInline.sourceType" @change="selectChange" placeholder="评论来源">
          <el-option v-for="(origin, index) in origins" :key="index" :label="origin.label" :value="origin.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评论标题">
        <el-input v-model="formInline.commentTitle" placeholder="评论标题"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="formInline.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="formInline.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="operate(arguments, 3)"
      @pass="operate(arguments, 1)"
      @reject="operate(arguments, 2)"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import COMMENT_API from '@/api/comment/index';
  import customElTable from '@/components/customElTable';
  import { parseTime } from '@/utils';
  export default {
    name: 'commentCenter',
    components: {
      customElTable
    },
    data() {
      return {
        origins: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '文章',
            value: 1
          },
          {
            label: '投票',
            value: 2
          },
          {
            label: '电竞',
            value: 3
          }
        ],
        formInline: {
          sourceType: '',
          commentTitle: '',
          username: '',
          userId: ''
        },
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '编号',
            prop: 'id'
          },
          {
            label: '评论内容',
            prop: 'content'
          },
          {
            label: '评论标题',
            prop: 'title'
          },
          {
            label: '评论来源',
            prop: 'comment_origin'
          },
          {
            label: '用户ID',
            prop: 'user_id'
          },
          {
            label: '用户名',
            prop: 'user_name',
            width: 160
          },
          {
            label: '状态',
            prop: 'statusInZh'
          },
          {
            label: '评论时间',
            prop: 'timming'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'pass',
              'reject',
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
      getData() {
        const params = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...this.formInline
        };
        COMMENT_API.list(params).then(res => {
          this.tableData = res.result;
          this.tableData = this.tableData.map(item => {
            let statusInZh = '';
            if (item.status === '0') {
              statusInZh = '待审核';
            } else if (item.status === '1') {
              statusInZh = '通过';
            } else if (item.status === '2') {
              statusInZh = '拒绝';
            }
            const comment_origin = Number(item.source_type) === 2 ? '投票' : Number(item.source_type) === 1 ? '文章' : '电竞';
            return {
              ...item,
              timming: item.create_time * 1 > 0 ? parseTime(item.create_time, '{y}-{m}-{d} {h}:{i}:{s}') : '',
              statusInZh,
              comment_origin
            };
          });
          this.totalCount = res.totalCount * 1;
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
      operate(innerParams, status) {
        const params = {
          id: innerParams[0].id,
          status
        };
        if (Number(status) === 3) {
          this.$confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            COMMENT_API.operate(params).then(res => {
              if (res.success) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.getData();
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          COMMENT_API.operate(params).then(res => {
            if (res.success) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            }
          });
        }
      },
      onSubmit() {
        this.getData();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
