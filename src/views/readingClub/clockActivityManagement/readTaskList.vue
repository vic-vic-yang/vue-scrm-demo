<template>
  <div class="app-container">
    <div class="control-group text-right">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addSeries()">
            <i class="fs-13 el-icon-plus mr-5"></i>按系列添加
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTopic()">
            <i class="fs-13 el-icon-plus mr-5"></i>按主题添加
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
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
    ></custom-el-table>

    <select-Topic :show="topic_show"
                  :multiple="true"
                  :isFilter="true"
                  :list="JSON.stringify(tableData)"
                  @moduleHide="topic_show = false"
                  @determineHandler="determineHandler"/>
    <select-series :show="series_show"
                  :multiple="true"
                  @moduleHide="series_show = false"
                  @determineHandler="determineHandler"/>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import { parseTime } from '@/utils';
import API from '@/api/readingClub/activityManagement';
import selectTopic from '../components/select-topic';
import selectSeries from '../components/select-series';

export default {
  name: 'interpretationList',
  components: {
    customElTable,
    selectTopic,
    selectSeries
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
          label: '参与人数',
          prop: 'players'
        },
        {
          label: '创建时间',
          prop: 'create_time'
        },
        {
          label: '主题状态',
          prop: 'status_name'
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
          prop: 'USER_ACTION',
          actions: [
            'edit',
            {
              type: 'use',
              options: this.getStatusBtnInfo
            },
            'del'
          ]
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      topic_show: false,
      series_show: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tabLoading = true;
      API.taskList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        id: this.$route.query.id
      }).then(res => {
        res.result.forEach(item => {
          item.create_time = parseTime(item.create_time);
          switch (item.status) {
            case '2':
              item.status_name = '禁用';
              break;
            case '1':
              item.status_name = '启用';
              break;
            // case '2':
            //   item.status_name = '进行中';
            //   break;
            // case '3':
            //   item.status_name = '已结束';
            //   break;
            // case '4':
            //   item.status_name = '未开始';
            //   break;
          }
        });
        this.tableData = res.result;
        this.totalCount = res.totalCount * 1;
        this.tabLoading = false;
      });
    },
    determineHandler(data) {
      if (!data || !data.length) return;
      var topic_ids = data.join(',');
      API.addTopic({
        id: this.$route.query.id,
        topic_ids
      }).then(res => {
        this.getData();
      });
    },
    timestamp(date) {
      if (date) {
        var dateTmp = date.replace(/-/g, '/');
        return Date.parse(dateTmp) / 1000;
      } else {
        return '';
      }
    },
    addSeries() {
      this.series_show = true;
    },
    addTopic() {
      this.topic_show = true;
    },
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
        weight: value,
        activityId: this.$route.query.id
      };
      API.taskWeight(params).then(() => {
        this.getData();
      });
    },
    editHandler(scope) {
      this.$router.push({ name: 'topicListModify', params: { id: scope.id } });
    },
    deleteHandler(info) {
      var delMessage = `确认删除主题 <b>${info.name}</b> 吗？`;
      this.$confirm(delMessage, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          API.changeTaskStatus({
            activityId: this.$route.query.id,
            id: info.id,
            status: -1
          }).then(() => {
            this.$message({
              message: '操作成功!',
              type: 'success'
            });
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    actionHandler(type, info) {
      switch (type) {
        case 'use':
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
        API.changeTaskStatus({
          activityId: this.$route.query.id,
          id: info.id,
          status: info.status * 1 === 1 ? 2 : 1
        }).then(res => {
          this.$message({
            type: 'success',
            message: `修改成功`
          });
          this.getData();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${title}`
        });
      });
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
</style>
