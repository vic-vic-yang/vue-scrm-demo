<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="groupListQueryFrm" :model="groupListQueryFrm">
        <el-form-item prop="articleName" label="任务列表">
          <el-input placeholder="请输入任务名" v-model="groupListQueryFrm.articleName"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="选择状态">
          <el-select @change="getData()" v-model="groupListQueryFrm.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('groupListQueryFrm')" icon="el-icon-search">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createQuestionGroup">
            <i class="fs-13 el-icon-plus mr-5"></i>新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="groupListQueryFrm.pageIndex"
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
  import Task from '@/api/answer/task';

  export default {
    name: 'learningCentenr',
    components: {
      customElTable
    },
    data() {
      return {
        groupListQueryFrm: {
          articleName: '',
          status: '',
          pageIndex: 1,
          pageSize: 20
        },
        query: null,
        statusOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '启用'
          },
          {
            value: '0',
            label: '禁用'
          }
        ],
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '任务名称',
            prop: 'mission_name'
          },
          {
            label: '状态',
            prop: 'statusTxt',
            options: {
              type: 'tag',
              prop: 'status'
            },
            width: 120
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
        totalCount: 0,
        statusTxt: '',
        tabLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        Task.list(this.groupListQueryFrm).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              status: item.status === 'enable' ? 1 : 0,
              statusTxt: item.status === 'enable' ? '启用' : '禁用'
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      createQuestionGroup() {
        this.$router.push({ name: 'newTask' });
      },
      editHandler(info) {
        this.$router.push({ name: 'editingTask', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除任务 <b>${info.articleName}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Task.del(info.id)
            .then(() => {
              this.getData(this.groupListQueryFrm);
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
          this.$confirm(`确认${info.statusTxt === '禁用' ? '启用' : '禁用'}题库 <b>${info.mission_name}</b> 吗？`, info.statusTxt, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Task.revise(info.id)
              .then(() => {
                this.getData(this.groupListQueryFrm);
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${info.statusTxt}`
            });
          });
        } else if (type === 'detail') {
          this.$alert(info.desc, info.statusTxt, {
            confirmButtonText: '确定'
          }).catch(err => {
            console.log('view detail : ', err);
          });
        } else if (type === 'topic') {
          this.$router.push({
            name: 'topicList',
            query: {
              group: info.id
            }
          });
        }
      },
      sizeChangeHandler(size) {
        this.groupListQueryFrm.pageSize = size;
        this.groupListQueryFrm.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.groupListQueryFrm.pageIndex = page;
        this.getData();
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        return {
          btn: item.status * 1 === 0 ? 'primary' : 'danger',
          label: this.$store.getters.getStatusTxt(!item.status)
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
