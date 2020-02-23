<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="createRole">
            <i class="fs-13 el-icon-plus mr-5"></i>新建角色
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
  import Configure from '@/api/contentPlatform/configure';
  import { parseTime } from '@/utils';

  export default {
    name: 'contentRole',
    components: {
      customElTable
    },
    data() {
      return {
        stateOptions: [ // 状态
          {
            value: 1,
            label: '全部'
          },
          {
            value: 2,
            label: '已启用'
          },
          {
            value: 3,
            label: '已禁用'
          }
        ],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '角色名称',
            prop: 'role_name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 210,
            className: 'ph-6'
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
        this.tabLoading = true;
        Configure.role.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          (data.result || []).map(item => {
            item.create_time = item.create_time * 1 > 0 ? parseTime(item.create_time) : '--';
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      createRole() { // 新增
        this.$router.push({ name: 'contentAddRole' });
      },
      ifDisabled(item) { // 是否禁用
        if (!item) {
          return true;
        }
        return item.is_super - 0 === 1;
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
      },
      editHandler(info) {
        this.$router.push({
          name: 'contentEditorRole',
          params: {
            id: info.id
          }
        });
      },
      deleteHandler(info) {
        this.$confirm(`确认删除角色 <b>${info.role_name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Configure.role.del(info.id)
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
<style scoped>
.work-btn{
  width: 50%;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}
</style>
