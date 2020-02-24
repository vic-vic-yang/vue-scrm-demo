<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="searchFrm" :model="searchFrm">
        <el-form-item prop="name" label="事件标签">
          <el-input
            v-model="searchFrm.name"
            placeholder="请输入事件标签"
            :maxlength="15"
            :minLength="1"
            name="name"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('searchFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建事件标签
          </el-button>
        </el-form-item>
      </el-form>
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
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import CALENDAR from '@/api/contentPlatform/calendar';
  import { parseTime } from '@/utils';

  export default {
    name: 'tags',
    components: {
      customElTable
    },
    data() {
      return {
        searchFrm: {
          name: ''
        },
        query: null,
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '事件标签',
            prop: 'name'
          },
          {
            label: '标签描述',
            prop: 'describe'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200
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
        CALENDAR.tag.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'createEventTags' });
      },
      editHandler(info) {
        this.$router.push({ name: 'modifyEventTags', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除事件标签 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CALENDAR.tag.del(info.id).then(() => {
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      actionHandler(type, info) {},
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

<style>

</style>
