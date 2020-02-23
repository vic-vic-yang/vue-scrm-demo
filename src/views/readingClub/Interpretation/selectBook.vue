<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="bookQueryFrm" :model="bookQueryFrm">
        <el-form-item prop="book_name" label="书籍名称">
          <el-input placeholder="书籍名称" v-model="bookQueryFrm.book_name"></el-input>
        </el-form-item>
        <el-form-item prop="book_id" label="书籍ID">
          <el-input placeholder="书籍ID" v-model="bookQueryFrm.book_id"></el-input>
        </el-form-item>
        <el-form-item prop="book_classify" label="分类">
          <el-select placeholder="全部" clearable v-model="bookQueryFrm.book_classify">
            <el-option
              v-for="item in classifyOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('bookQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import explain from '@/api/readingClub/explain';
  // import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'selectBook',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '书籍ID',
            prop: 'id',
            width: 120
          },
          {
            label: '书籍名称',
            prop: 'name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'add',
                label: '新增解读'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null,
        bookQueryFrm: {
          book_name: '',
          book_id: '',
          book_classify: ''
        },
        classifyOptions: []
      };
    },
    created() {
      Promise.all([this.get_classify(), this.getData()])
        .then(() => {
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        explain.book_list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = res.records;
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      get_classify() {
        explain.classify().then(res => {
          this.classifyOptions = res;
        });
      },
      searchActivityList() {
        this.query = _.cloneDeep(this.bookQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'add') {
          this.$router.push({ name: 'readingClubInterpretationCreate', query: { isAdd: true, id: info.id }});
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
