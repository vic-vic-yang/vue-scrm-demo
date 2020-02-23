<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="commentQueryFrm">
        <el-form-item label="用户名">
          <el-input placeholder="用户名" v-model="commentQueryFrm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="内容标题">
          <el-input placeholder="内容标题" v-model="commentQueryFrm.articleTitle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Auxiliary from '@/api/contentPlatform/auxiliary';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'contentComment',
    components: {
      customElTable
    },
    data() {
      return {
        commentQueryFrm: {
          nickname: '',
          articleTitle: ''
        },
        query: null,
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '内容标题',
            prop: 'title'
          },
          {
            label: '评论内容',
            prop: 'content'
          },
          {
            label: '用户',
            prop: 'nickname'
          },
          {
            label: '评论时间',
            prop: 'create_time',
            sortable: true,
            width: 160,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
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
        const query = this.query || {};
        this.tabLoading = true;
        query.id = '';
        if (this.$route.params.id && this.$route.params.id !== ':id') {
          query.id = this.$route.params.id;
        }
        Auxiliary.comment.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.create_time = parseTime(item.create_time);
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchUser() { // 查询
        this.query = _.cloneDeep(this.commentQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      deleteHandler(info) { // 删除
        this.$confirm(`确认删除 <b>${info.nickname}</b> 的评论吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Auxiliary.comment.del(info.id)
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
