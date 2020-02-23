<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="账号名称">
          <el-input v-model="queryParams.search_input" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="queryParams.department_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="启用" value="10"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号角色">
          <el-input v-model="queryParams.role_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" operate="create" @click="onNewAccount">新建</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" operate="view" @click="onQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" operate="view" @click="getList">刷新</el-button>
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
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
import { API_USER } from '@/api/setting';
import customElTable from '@/components/customElTable';
export default {
  name: 'accountManageList',
  components: {
    customElTable
  },
  data() {
    return {
      queryParams: {
        role_name: '',
        search_input: '',
        department_name: '',
        status: '',
        page_index: 1,
        page_size: 20
      },
      totalCount: 0,
      tabLoading: false,
      tableData: [],
      tableOptions: [
        {
          label: '账号ID',
          prop: 'id'
        },
        {
          label: '姓名',
          prop: 'realname'
        },
        {
          label: '账号',
          prop: 'username'
        },
        {
          label: '账号角色',
          prop: 'role_name'
        },
        {
          label: '部门',
          prop: 'department_name'
        },
        {
          label: '状态',
          prop: 'status_text'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'edit',
              label: '编辑',
              operate: 'update'
            },
            {
              type: 'status',
              options: this.getStatusBtnInfo,
              operate: 'update'
            },
            'del',
            {
              type: 'role',
              options: this.getRoleInfo,
              operate: 'update'
            },
            {
              type: 'section',
              options: this.getSectionInfo,
              operate: 'update'
            }
          ]
        }
      ]
    };
  },
  mounted() {
    // console.log(this.$store.state.permission);
    this.getList();
  },
  methods: {
    onQuery() {
      this.queryParams.page_index = 1;
      this.getList();
    },
    actionHandler(type, info) {
      if (type === 'role') {
        this.$router.push({
          name: 'accountMerber',
          params: {id: info.id}
        });
      }
      if (type === 'status') {
        this.changeStatus(info);
      }
      if (type === 'section') {
        this.$router.push({
          name: 'accountSection',
          params: {id: info.id}
        });
      }
    },
    changeStatus(item) {
      let status;
      if (~~item.status === 10) {
        // 禁用
        status = 2;
      } else {
        status = 10;
      }
      API_USER.modifyStatus(item.id, status)
        .then(() => {
          this.$message.success('修改成功');
          this.getList();
        });
    },
    getRoleInfo(item) {
      return {
        btn: 'primary',
        label: '权限管理'
      };
    },
    getSectionInfo(item) {
      return {
        btn: 'primary',
        label: '关联部门'
      };
    },
    getList() {
      API_USER.getList(this.queryParams)
        .then(res => {
          if (res.data && res.data.result) {
            this.tableData = (res.data.result || []).map(item => {
              item.role_name = item.roles.map(dp => {
                return dp.role_name;
              }).join('，');
              item.department_name = item.department.map(dp => {
                return dp.name;
              }).join('，');
              item.status_text = ~~item.status === 10 ? '启用' : '禁用';
              return item;
            });
            this.totalCount = ~~res.data.totalCount;
          }
        });
    },
    onNewAccount() {
      this.$router.push({
        name: 'accountManageEdit'
      });
    },
    onSubmit() {
      alert('onSubmit');
    },
    editHandler(item) {
      this.$router.push({
        name: 'accountManageEdit',
        params: {id: item.id}
      });
    },
    getStatusBtnInfo(item) {
      if (!item) {
        return {
          btn: 'danger',
          label: '启用'
        };
      }
      const status = item.status * 1;
      return status === 2
        ? {
          btn: 'primary',
          label: '启用'
        } : {
          btn: 'danger',
          label: '禁用'
        };
    },
    deleteHandler(item) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API_USER.del(item.id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
      }).catch((err) => {
        console.error(err);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    sizeChangeHandler(size) {
      this.queryParams.page_size = size;
      this.getList();
    },
    pageChangeHandler(page) {
      this.queryParams.page_index = page;
      this.getList();
    }
  }
};
</script>

<style>

</style>
