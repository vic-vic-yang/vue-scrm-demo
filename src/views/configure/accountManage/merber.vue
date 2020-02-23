<template>
  <div class="app-container">
    <h4>角色权限</h4>
    <div class="container-content">
      <div>
        <div>
          <el-button type="text" @click="connectRole">关联角色<i class="el-icon-arrow-right"></i></el-button>
          <h4>已关联的角色</h4>
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
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="$router.push({name: 'accountManageList'})">取消</el-button>
    </div>
    <dialog-role-select :id="id" :dialogVisible="dialogVisible" @cancel="onCancel" @submit="onSubmit" :checkedIds="checkedIds"/>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import dialogRoleSelect from '../components/dialogRoleSelect';
import { API_USER } from '@/api/setting';
import { parseTime } from '@/utils';

export default {
  name: 'accountManageEdit',
  components: {customElTable, dialogRoleSelect},
  data() {
    return {
      id: '',
      dialogVisible: false,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: false,
      type: 'base',
      tableData: [],
      checkedIds: [],
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
          label: '关联时间',
          prop: 'create_time'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'del'
          ]
        }
      ],
      editable: false
    };
  },
  created() {
    this.id = this.$route.params.id || '';
    if (this.id) {
      this.getList();
    }
  },
  methods: {
    init() {
      this.tableData = [];
      this.checkedIds = [];
    },
    submit() {
      const roleIds = Array.from(new Set(this.tableData.map(item => item.id)));
      API_USER.modifyRole(this.id, { roles: JSON.stringify(roleIds)})
        .then(() => {
          this.$message.success('保存成功');
          this.$router.push({name: 'accountManageList'});
          this.init();
          this.getList();
        });
      // console.log(roleIds);
      this.dialogVisible = false;
    },
    getList() {
      API_USER.getRole(this.id)
        .then(res => {
          if (res.data) {
            this.tableData = this.tableData.concat((res.data || []).map(item => {
              return {
                ...item,
                create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
              };
            }));
            this.checkedIds = this.tableData.map(item => item.id);
          }
        });
    },
    connectRole() {
      // 请求数据，打开弹框
      this.dialogVisible = true;
    },
    onCancel() {
      this.dialogVisible = false;
    },
    onSubmit(data) {
      const roleIds = Array.from(new Set(this.tableData.concat(data).map(item => item.id)));
      console.log(roleIds);
      this.onCancel();
      API_USER.modifyRole(this.id, { roles: JSON.stringify(roleIds)})
        .then(() => {
          this.init();
          this.getList();
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    findIndex(obj, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (obj.id === arr[i].id) {
          return i;
        }
      }
      return -1;
    },
    deleteHandler(item) {
      this.$confirm('此操作将删除该关联角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.findIndex(item, this.tableData);
        this.tableData.splice(index, 1);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    sizeChangeHandler() {
      alert('onSubmit');
    },
    pageChangeHandler() {
      alert('onSubmit');
    }
  }
};
</script>

<style>
.form-account-base .el-form-item__label {
  display: inline-block;
  width: 120px;
  text-align: left;
}
</style>
