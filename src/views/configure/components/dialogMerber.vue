<template>
  <el-dialog title="选择账号" :visible.sync="dialogVisible" class="dialog-select" @close="onCancel">
    <div class="container-select">
      <div class="control-group">
        <el-form :inline="true" :model="searchKey">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称" v-model="searchKey.search_input"></el-input>
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
          :pageSizes="[]"
          :size="pageSize"
          @handleSelect="handleSelect"
          @size-change='sizeChangeHandler'
          @page-change='pageChangeHandler'
        ></custom-el-table>
      </div>
    </div>
    <div class="right-table">
      <h3 class="right-top">已选择（{{hasSelectData.length}}）条</h3>
      <div>
        <el-table :data="hasSelectData" border>
          <el-table-column prop="id" align="center" label="账号ID"></el-table-column>
          <el-table-column prop="realname" align="center" label="姓名"></el-table-column>
          <el-table-column prop="username" align="center" label="账号"></el-table-column>
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
import { API_USER } from '@/api/setting';
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
      searchKey: {
        search_input: '',
        page_index: 1,
        page_size: 10
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
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      tabLoading: true
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    onCancel() {
      this.query = null;
      this.hasSelectData = [];
      this.mapSelectArr = [];
      this.$refs.fuckTable.$refs.customTable.clearSelection();
      this.$emit('cancel');
    },
    init() {
      this.searchKey = {
        role_name: '',
        page_index: this.pageIndex,
        page_size: this.pageSize
      };
      this.query = null;
      this.hasSelectData = [];
      this.mapSelectArr = [];
    },
    onSubmit() {
      this.$emit('submit', this.hasSelectData);
      this.init();
    },
    getData() {
      const filterChecked = (item) => {
        return !this.checkedIds.includes(item.id);
      };
      this.tableData = [];
      this.tabLoading = true;
      const parms = {
        page_index: this.pageIndex,
        page_size: this.pageSize,
        search_input: this.searchKey.search_input
      };
      API_USER.getList(parms)
        .then(data => {
          // this.dataChange(data.result);
          this.tableData = data.data.result.filter(filterChecked);
          this.totalCount = data.data.totalCount * 1;
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
      console.log(row);
      const mapIndex = this.mapSelectArr.indexOf(row.id);
      if (mapIndex !== -1) {
        // 已有就删除
        this.hasSelectData.splice(mapIndex, 1);
        this.mapSelectArr.splice(mapIndex, 1);
      } else {
        this.hasSelectData.push(row);
        this.mapSelectArr.push(row.id);
      }
    },
    delRow(scope, tableData) {
      // 对应取消勾选
      // 翻页之后scope.row里面渲染的id跟之前不一致
      this.$refs.fuckTable.$refs.customTable.data.forEach(item => {
        if (item.id === scope.row.id) {
          this.$refs.fuckTable.$refs.customTable.toggleRowSelection(item, false);
        }
      });

      const mapIndex = this.mapSelectArr.indexOf(scope.row.id);
      this.hasSelectData.splice(mapIndex, 1);
      this.mapSelectArr.splice(mapIndex, 1);
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

<style>
.btn-td-content-right{
  padding: 4px 0 !important;
}
</style>