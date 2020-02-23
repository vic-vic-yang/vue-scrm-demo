<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="taskQueryFrm" :model="taskQueryFrm">
        <el-form-item prop="title" label="任务名称">
          <el-input placeholder="任务名称" v-model="taskQueryFrm.title" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="任务状态">
          <el-select placeholder="全部" clearable v-model="taskQueryFrm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('taskQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>创建任务
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
  import prizeTask from '@/api/vote/prizeTask';
  import { parseTime } from '@/utils';
  // import _ from 'lodash';

  export default {
    name: 'index-task',
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
            label: '任务名称',
            prop: 'title'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        taskQueryFrm: {
          title: '',
          status: ''
        },
        query: null,
        statusOptions: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        prizeTask.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              status_name: item.status * 1 === 1 ? '启用' : '禁用',
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchList() {
        this.query = {};
        if (this.taskQueryFrm.title) {
          this.query['title'] = this.taskQueryFrm.title;
        }
        if (this.taskQueryFrm.status !== '') {
          this.query['status'] = this.taskQueryFrm.status;
        }
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'addTask' });
      },
      editHandler(info) {
        this.$router.push({ name: 'modifyTask', params: { id: info.id }});
      },
      deleteHandler(info) {
        let delMessage = `确认删除任务 <b>${info.title}</b> 吗？`;
        if (info.status * 1 === 1) {
          delMessage = '有任务正在进行当中，' + delMessage;
        }
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          prizeTask.del(info)
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
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          var disableMessage = `确认${title}活动 <b>${info.title}</b> 吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            prizeTask.status(info)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
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
