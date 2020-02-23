<template>
  <el-dialog title="角色选择" :visible.sync="dialogVisibleShow" class="dialog-select" @close="onCancel">
    <div class="container-select">
      <div class="control-group">
        <el-form :inline="true" :model="searchKey">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称" v-model="searchKey.role_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="left-table">
        <custom-el-table
          ref="fuckTable"
          v-loading="tabLoading"
          v-model="pageIndex"
          tableNameTag="leftTable"
          :tableData="tableData"
          :tableOptions="tableOptions"
          :total="totalCount"
          @handleSelectAll="handleSelectAll"
          @handleSelect="handleSelect"
        ></custom-el-table>
      </div>
    </div>
    <div class="right-table">
      <h3 class="right-top">已选择（{{hasSelectData.length}}）条</h3>
      <div>
        <el-table :data="hasSelectData" border>
          <el-table-column prop="id" align="center" label="角色ID"></el-table-column>
          <el-table-column prop="role_name" align="center" label="角色名"></el-table-column>
          <el-table-column prop="desc" align="center" label="描述"></el-table-column>
          <el-table-column label="操作" align="center" width="80" class-name="btn-td-content-right">
            <template slot-scope="scope">
              <el-button @click="delRow(scope, tableData)" size="small" type="danger">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import customElTable from '@/components/customElTable';
import API from '@/api/contentPlatform/subscribe';
import { API_ROLE } from '@/api/setting';
import _ from 'lodash';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: String,
    checkedIds: Array
  },
  components: {
    customElTable
  },
  data() {
    return {
      dialogVisibleShow: false,
      searchKey: {
        role_name: ''
      },
      query: null,
      hasSelectData: [],
      mapSelectArr: [], // 映射已选择数据
      tableOptions: [
        {
          label: '',
          prop: 'SELECTION',
          align: 'center'
        },
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
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      selectAll: false
    };
  },
  watch: {
    dialogVisible(val) {
      this.dialogVisibleShow = val;
      if (val) {
        if (!this.tableData || !this.tableData.length) this.getData();
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
      this.hasSelectData = [];
      this.mapSelectArr = [];
      this.$refs.fuckTable.$refs.customTable.clearSelection();
    },
    init() {
      this.searchKey = {
        role_name: ''
      };
      this.query = null;
      this.hasSelectData = [];
      this.mapSelectArr = [];
      this.selectAll = false;
    },
    onSubmit() {
      this.$emit('submit', this.hasSelectData);
      this.init();
    },
    getData() {
      const filterChecked = (item) => {
        return !this.checkedIds.includes(item.id) && Number(item.is_super) !== 1;
      };
      this.tableData = [];
      this.tabLoading = true;
      API_ROLE.getList(this.searchKey)
        .then(data => {
          // this.dataChange(data.result);
          this.tableData = data.data.result.filter(filterChecked);
          // this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
          this.$nextTick(() => {
            // 隐藏全选框
            // document.querySelector('.el-checkbox').style.display = 'none';
            // 默认选中
            data.data.result.forEach((item, index) => {
              if (this.mapSelectArr.indexOf(item.id) !== -1) {
                this.$children[1].$refs.customTable.toggleRowSelection(item);
              }
            });
          });
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    dataChange(data) {
      return data;
    },
    searchUser() {
      // 查询
      this.query = _.cloneDeep(this.searchKey);
      this.pageIndex = 1;
      this.getData();
    },
    handleSelect(row) {
      if (this.selectAll) return;
      var index = this.hasSelectData.findIndex(item => item.id === row.id);
      if (index === -1) {
        this.hasSelectData.push(row);
        this.mapSelectArr.push(row.id);
      } else {
        this.hasSelectData.splice(index, 1);
        this.mapSelectArr.splice(this.mapSelectArr.indexOf(row.id), 1);
      }
    },
    handleSelectAll(selection) {
      this.selectAll = true;
      this.hasSelectData = selection;
      this.mapSelectArr = selection.map(item => item.id);
    },
    delRow(scope, tableData) {
      // 对应取消勾选
      // 翻页之后scope.row里面渲染的id跟之前不一致
      this.$refs.fuckTable.$refs.customTable.data.forEach(item => {
        if (item.id === scope.row.id) {
          this.$refs.fuckTable.$refs.customTable.toggleRowSelection(item, false);

          if (!this.selectAll) {
            var index = this.hasSelectData.findIndex(item => item.id === scope.row.id);
            this.hasSelectData.splice(index, 1);
            this.mapSelectArr.splice(this.mapSelectArr.indexOf(scope.row.id), 1);
          }
        }
      });
    },
    confirm() {
      const resultArr = this.hasSelectData.map(item => item.id);
      API.add({
        ids: resultArr.join()
      }).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.$router.push({
            name: 'subscribe'
          });
        } else {
          this.$message({
            type: 'error',
            message: '添加失败!'
          });
        }
      });
    },
    cancel(info) {
      this.$confirm('是否取消本次操作？', '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'subscribe'
        });
      });
    }
  }
};
</script>

<style>
.btn-td-content-right{
  padding: 4px 0 !important;
}
</style>
