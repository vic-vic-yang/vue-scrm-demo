<template>
  <div class="app-container articel_selection_167">
    <div class="control-group">
      <el-form :inline="true" :model="classListQueryFrm">
        <el-form-item label="标题">
          <el-input placeholder="标题" v-model="classListQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-input placeholder="来源" v-model="classListQueryFrm.source"></el-input>
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
  import Content from '@/api/contentPlatform/advertising';
  import { parseTime } from '@/utils';

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
            prop: 'title'
          },
          {
            label: '来源',
            prop: 'author'
          },
          {
            label: '发布时间',
            prop: 'publish_time'
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
              },
              {
                type: 'pre_view',
                options: () => {
                  return { btn: 'primary', label: '预览' };
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
        Content.getAdArticle({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.publish_time = parseTime(item.publish_time);
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
          start_time: this.classListQueryFrm.time[0],
          end_time: this.classListQueryFrm.time[1]
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
        } else if (type === 'pre_view') {
          window.open(info.preUrl, '_blank');
        }
      }
    }
  };
</script>

<style lang="scss">
.articel_selection_167{

}
</style>