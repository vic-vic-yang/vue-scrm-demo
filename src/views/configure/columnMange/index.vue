<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="searchQueryFrm" :model="searchQueryFrm">
        <el-form-item prop="id" label="栏目ID">
          <el-input placeholder="栏目ID" v-model="searchQueryFrm.id" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name" label="栏目名称">
          <el-input placeholder="栏目名称" v-model="searchQueryFrm.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('searchQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button operate="create" type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建栏目
          </el-button>
          <el-button @click="getData">刷新</el-button>
          <el-button @click="backColumn" v-if="parent_id">返回上一级</el-button>
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
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import COLUMN from '@/api/configure/column';
  import { parseTime } from '@/utils';

  export default {
    name: 'index',
    components: {
      customElTable
    },
    data() {
      return {
        parent_id: this.$route.query.id || 0,
        tableOptions: [
          {
            label: '栏目ID',
            prop: 'id',
            width: 80
          },
          {
            label: '栏目名称',
            prop: 'name'
          },
          {
            label: '权重',
            prop: 'weight',
            max: 100,
            // editAble: true,
            // showInput: false,
            // type: 'Number',
            options: {
              type: 'edit'
            }
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo,
                operate: 'update'
              },
              'del',
              {
                type: 'subColumn',
                label: '查看子栏目',
                showBtn: (action, scope) => {
                  return !this.parent_id || this.parent_id === 0;
                },
                operate: 'view'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        searchQueryFrm: {
          id: '',
          name: ''
        },
        query: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        COLUMN.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          parent_id: this.parent_id || 0,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
              status_name: item.status * 1 === 1 ? '启用' : '禁用',
              weight: item.weight || 0
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      popoverHandler(scope, value) {
        var weight = Number(value);
        if (weight < 0) {
          this.$message({
            type: 'error',
            message: `最小只能输入0`
          });
          return;
        }
        const params = {
          id: scope.row.id,
          weight
        };
        COLUMN.setWeight(params).then(() => {
          this.getData();
        });
      },
      backColumn() {
        this.$router.back();
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'createColumnMange', query: {parent_id: this.parent_id || 0} });
      },
      editHandler(info) {
        this.$router.push({ name: 'modifyColumnMange', params: { id: info.id }, query: {parent_id: this.parent_id || 0}});
      },
      deleteHandler(info) {
        var delMessage = `确认删除栏目 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          COLUMN.del({
            id: info.id
          }).then(() => {
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
          var disableMessage = `确认${title}活动 <b>${info.name}</b> 吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            COLUMN.status({
              id: info.id,
              status: info.status * 1 === 1 ? 0 : 1
            }).then(() => {
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'subColumn') {
          this.$router.push({name: 'columnMange', query: {id: info.id}});
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
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          }
          : {
            btn: 'primary',
            label: '启用'
          };
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
