<template>
      <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="createClass">
            <i class="fs-13 el-icon-plus mr-5"></i>新建分类
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
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>  
</template>

<script>
import customElTable from '@/components/customElTable';
import Content from '@/api/contentPlatform/content';
export default {
  name: 'contentClass',
  components: {
    customElTable
  },
  data() {
    return {
      tableData: [],
      tabLoading: true,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tableOptions: [
        {
          label: '序号',
          prop: 'id',
          width: 120
        },
        {
          label: '分类',
          prop: 'classify_name'
        },
        {
          label: '分类描述',
          prop: 'description'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'editor',
              options: this.getTaskEditBtnInfo,
              disableds: this.ifDisabled
            },
            {
              type: 'delete',
              options: this.getTaskDelBtnInfo,
              disableds: this.ifDisabled
            }
          ]
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tabLoading = true;
      Content.class.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(data => {
        this.tableData = data.result;
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      })
        .catch(() => {
          this.tabLoading = false;
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
    },
    createClass() { // 新增
      this.$router.push({ name: 'addClass' });
    },
    editHandler(info) { // 修改
      this.$router.push({
        name: 'modifyClass',
        params: {
          id: info.id
        }
      });
    },
    deleteHandler(info) { // 删除
      this.$confirm(`确认删除 <b>${info.classify_name}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Content.class.del(info.id)
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
    ifDisabled(item) { // 是否禁用
      if (!item) {
        return true;
      }
      return item.merchant_id - 0 === 0;
    },
    getTaskEditBtnInfo() { // 操作按钮的样式
      return {
        btn: 'primary',
        label: '编辑'
      };
    },
    getTaskDelBtnInfo() { // 操作按钮的样式
      return {
        btn: 'danger',
        label: '删除'
      };
    }
  }
};
</script>

<style scoped>

</style>