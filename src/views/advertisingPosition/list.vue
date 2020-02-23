<template>
  <div class="app-container">
    <el-form :inline="true" ref="taskFrm" :model="advertisingFrm">
      <el-form-item prop="task_type" label="广告位名称">
        <el-input placeholder="请输入内容" v-model="advertisingFrm.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="addItem">新增广告位</el-button>
      </el-form-item>
    </el-form>

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
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Api from '@/api/contentPlatform/advertising';
export default {
  components: {
    customElTable
  },
  data() {
    return {
      advertisingFrm: {
        name: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      tableOptions: [
        {
          label: '广告位ID',
          prop: 'id',
          width: 120
        },
        {
          label: '广告位名称',
          prop: 'name'
        },
        {
          label: '广告位类型',
          prop: 'type_str'
        },
        {
          label: '广告数',
          prop: 'advertNumber'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'look',
              options: () => {
                return { btn: 'default', label: '查看广告' };
              }
            },
            'edit',
            'del'
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
      Api.getPositionList({
        ...this.advertisingFrm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
        .then(data => {
          data.result.map(item => {
            switch (Number(item.type)) {
              case 1:
                item.type_str = '首页顶部banner';
                break;
              case 2:
                item.type_str = '特别推荐广告位';
                break;
            }
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    actionHandler(type, info) {
      if (type === 'look') {
        this.$router.push(
          `/newcontentPlatform/advertisingPosition/advertisingList?id=${info.id}&type=${info.type}`
        );
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
    editHandler(info) {
      // 修改
      this.$router.push(`/newcontentPlatform/advertisingPosition/positionEdit?id=${info.id}`);
    },
    deleteHandler(info) {
      // 删除
      this.$confirm(`确认删除广告位 <b>${info.name}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.delPosition({
            id: info.id
          }).then(res => {
            this.getData();
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    search() {
      this.pageIndex = 1;
      this.getData();
    },
    addItem() {
      this.$router.push('/newcontentPlatform/advertisingPosition/positionEdit');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>