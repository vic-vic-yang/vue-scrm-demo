<template>
  <div class="app-container">
    <el-form :inline="true" :model="advertisingFrm">
      <el-form-item prop="title" label="广告名称">
        <el-input placeholder="请输入名称" v-model="advertisingFrm.title" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="addItem">新增广告</el-button>
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
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Api from '@/api/contentPlatform/advertising';
import { parseTime } from '@/utils';
export default {
  components: {
    customElTable
  },
  data() {
    return {
      advertisingFrm: {
        place_id: this.$route.query.id,
        title: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      tableOptions: [
        {
          label: '广告ID',
          prop: 'id',
          width: 120
        },
        {
          label: '广告名称',
          prop: 'title'
        },
        {
          label: '权重',
          prop: 'weight',
          max: 100,
          options: {
            type: 'edit'
          }
        },
        {
          label: '开始时间',
          prop: 'online_time'
        },
        {
          label: '结束时间',
          prop: 'offline_time'
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
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tabLoading = true;
      Api.getAdvertisingList({
        ...this.advertisingFrm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
        .then(data => {
          data.result.map(item => {
            item.online_time = item.online_time * 1 > 0 ? parseTime(item.online_time) : '--';
            item.offline_time = item.offline_time * 1 > 0 ? parseTime(item.offline_time) : '--';
          });
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
    editHandler(info) {
      // 修改
      this.$router.push(`/newcontentPlatform/advertisingPosition/advertisingDetails?place_id=${this.$route.query.id}&id=${info.id}&type=${this.$route.query.type}`);
    },
    deleteHandler(info) {
      // 删除
      this.$confirm(`确认删除广告位 <b>${info.title}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.delAdvertising({
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
      this.$router.push(`/newcontentPlatform/advertisingPosition/advertisingDetails?place_id=${this.$route.query.id}&type=${this.$route.query.type}`);
    },
    // 修改权重
    popoverHandler(scope, value) {
      if (Number(value) < 0) {
        this.$message({
          type: 'error',
          message: `最小只能输入0`
        });
        return;
      }
      const params = {
        id: scope.row.id,
        weight: value
      };

      Api.setAdvertisingWeight(params).then(res => {
        if (res.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          // this.tableDataIndex = undefined;
          this.getData();
        } else {
          this.$message.error('意料之外的错误');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
