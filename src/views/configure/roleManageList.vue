<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="queryParams" ref="queryParams" class="demo-form-inline">
        <el-form-item prop="id" label="角色ID">
          <el-input v-model="queryParams.id" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item prop="role_name" label="角色名">
          <el-input v-model="queryParams.role_name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('queryParams')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="onSubmit">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="queryParams.page_index"
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
import { API_ROLE } from '@/api/setting';
import customElTable from '@/components/customElTable';
import { parseTime } from '@/utils';

export default {
  name: 'accountManageList',
  components: {
    customElTable
  },
  data() {
    return {
      queryParams: {
        id: '',
        role_name: ''
      },
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: false,
      tableData: [],
      tableOptions: [
        {
          label: '角色ID',
          prop: 'id'
        },
        {
          label: '角色名',
          prop: 'role_name'
        },
        {
          label: '描述',
          prop: 'desc'
        },
        {
          label: '角色创建时间',
          prop: 'create_time'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'edit',
              label: '编辑',
              disableds: item => {
                return Number(item.is_super) === 1;
              }
            },
            {
              type: 'del',
              label: '删除',
              disableds: item => {
                return Number(item.is_super) === 1;
              }
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.tabLoading = true;
      API_ROLE.getList({
        page_index: this.pageIndex,
        page_size: this.pageSize,
        ...this.queryParams
      })
        .then(res => {
          if (res.data && res.data.result) {
            this.tableData = (res.data.result || []).map(item => {
              return {
                ...item,
                create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
              };
            });
            this.totalCount = ~~res.data.totalCount;
          }
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
    },
    onQuery() {
      this.pageIndex = 1;
      this.getList();
    },
    onSubmit() {
      this.$router.push({
        name: 'roleManageEdit'
      });
    },
    editHandler(item) {
      this.$router.push({
        name: 'roleManageEdit',
        params: item,
        query: {id: item.id}
      });
    },
    deleteHandler(item) {
      this.$confirm(`<span style="color: #f56c6c">删除该角色，该角色关联的帐号将失去该角色权限</span>, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        API_ROLE.del(item.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
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
      this.getList();
    },
    pageChangeHandler(page) {
      this.pageIndex = page;
      this.getList();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>

</style>
