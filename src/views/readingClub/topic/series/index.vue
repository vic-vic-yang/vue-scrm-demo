<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="seriesFrm" :model="seriesFrm">
        <el-form-item>
          <el-button type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建系列
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
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import { parseTime } from '@/utils';
  import TOPIC from '@/api/readingClub/topic';

  export default {
    name: 'topicList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '系列',
            prop: 'name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 300,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            width: 300,
            actions: [
              'edit',
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null,
        seriesFrm: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        TOPIC.series.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(res => {
          (res.result || []).map(item => {
            item.create_time = parseTime(item.create_time);
          });
          this.tableData = res.result;
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.seriesFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'topicSeriesCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'topicSeriesModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除系列 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TOPIC.series.del(info.id).then(() => {
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      actionHandler(type, info) {
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

</style>
