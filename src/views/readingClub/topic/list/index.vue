<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="topicFrm" :model="topicFrm">
        <el-form-item>
          <el-button type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建主题
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
    name: 'seriesList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '主题序号',
            prop: 'id',
            width: 80
          },
          {
            label: '主题名称',
            prop: 'name'
          },
          {
            label: '主题系列',
            prop: 'seriesNameList'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            width: 400,
            actions: [
              'edit',
              'del',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null,
        topicFrm: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        TOPIC.topic.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(res => {
          (res.result || []).map(item => {
            item.create_time = parseTime(item.create_time);
            switch (item.status) {
              case '0':
                item.status = '禁用';
                break;
              case '1':
                item.status = '启用';
                break;
              case '2':
                item.status = '进行中';
                break;
              case '3':
                item.status = '已结束';
                break;
              case '4':
                item.status = '未开始';
                break;
            }
          });
          this.tableData = res.result;
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.topicFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'topicListCreate' });
      },
      editHandler(info) {
        console.log(info);
        this.$router.push({ name: 'topicListModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除主题 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TOPIC.topic.del(info.id).then(() => {
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
        switch (type) {
          case 'status':
            this.setStatus(info);
            break;
          default:
            break;
        }
      },
      setStatus(info) {
        const title = this.getStatusBtnInfo(info).label;
        this.$confirm(`确认立即${title}主题 <b>${info.name}</b> 吗？`, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TOPIC.topic.status(info.id).then(() => {
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${title}`
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
      },
      getStatusBtnInfo(item) {
        // 发布按钮样式
        if (item) {
          switch (item.status) {
            case '禁用':
              return {
                btn: 'primary',
                label: '启用'
              };
            default:
              return {
                btn: 'danger',
                label: '禁用'
              };
          }
        }
        return {
          btn: '',
          label: ''
        };
      }
    }
  };
</script>

<style scoped>

</style>
