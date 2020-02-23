<template>
      <div class="app-container">
        公众号功能开发中...
    <!-- <div class="control-group">
      <el-form :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>新建频道
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
    </custom-el-table> -->
  </div>  
</template>

<script>
import customElTable from '@/components/customElTable';
export default {
  name: 'contMp',
  components: {
    customElTable
  },
  data() {
    return {
      tableData: [
        {
          id: '001',
          name: '频道',
          describe: '描述',
          index: 0
        }
      ],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      tableOptions: [
        {
          label: '序号',
          prop: 'id',
          width: 120
        },
        {
          label: '频道名称',
          prop: 'name'
        },
        {
          label: '排列顺序',
          prop: 'index'
        },
        {
          label: '频道描述',
          prop: 'describe'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'edit',
            'del'
          ]
        }
      ]
    };
  },
  methods: {
    getData() {
    },
    sizeChangeHandler(size) {
      this.pageSize = size;
      this.pageIndex = 1;
    //   this.getData();
    },
    pageChangeHandler(page) {
      this.pageIndex = page;
    //   this.getData();
    },
    actionHandler(type, info) {
      if (type === 'detail') {
        this.$router.push({ name: 'contUserDetails', params: { id: info.id }});
      }
    },
    createGame(info) { // 新增
      console.log('新增');
    },
    editHandler(info) { // 修改
      console.log('编辑');
    },
    deleteHandler(info) { // 删除
      console.log('删除');
    }
  }
};
</script>

<style scoped>

</style>
