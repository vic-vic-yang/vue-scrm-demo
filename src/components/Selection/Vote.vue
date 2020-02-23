<template>
  <div class="app-container articel_selection_167">
    <div class="control-group">
      <el-form :inline="true" :model="classListQueryFrm">
        <el-form-item label="标题">
          <el-input placeholder="标题" v-model="classListQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            :editable="false"
            v-model="classListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGameList" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :ifmultipleSelection="false"
      @handleSelectionChange="handleSelectionChange"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  // 目前只写了文章的单选
  // 多选需要添加 ifmultipleSelection = true，和多选的确定选择按钮
  import customElTable from '@/components/customElTable';
  import { parseTime } from '@/utils';
  import Activity from '@/api/vote/activity';
  export default {
    name: 'contentList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '内容ID',
            prop: 'id',
            width: 80
          },
          {
            label: '标题',
            prop: 'activity_name'
          },
          {
            label: '开始时间',
            prop: 'start_time'
            // sortable: true,
            // width: 120,
            // className: 'ph-6'
          },
          {
            label: '结束时间',
            prop: 'end_time'
            // sortable: true,
            // width: 120,
            // className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'select_item',
                options: () => {
                  return { btn: 'primary', label: '选择' };
                }
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        tabLoading: false,
        multipleSelection: [], // 选中的数据
        classListQueryFrm: { // 查询条件
          title: '',
          source: '',
          type: '',
          time: []
        },
        query: null,
        pickerOptions: { // 时间选择器
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Activity.activity.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          status: 1,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.start_time = parseTime(item.start_time);
            item.end_time = parseTime(item.end_time);
            item.status_cn = item.status - 0 === 0 ? '禁用' : item.status_cn;
            item.stageType = item.status_cn === '已结束' ? 1 : item.status_cn === '进行中' ? 3 : 0;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      searchGameList() { // 查询
        this.query = {
          title: this.classListQueryFrm.title,
          author: this.classListQueryFrm.source,
          startTime: this.classListQueryFrm.time[0],
          endTime: this.classListQueryFrm.time[1]
        };
        this.pageIndex = 1;
        this.getData();
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
      handleSelectionChange(data) {
        this.multipleSelection = data;
      },
      actionHandler(type, info) {
        if (type === 'select_item') { // 导入
          this.$emit('selectOne', info);
        }
      }
    }
  };
</script>

<style lang="scss">
.articel_selection_167{

}
</style>