<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="classListQueryFrm">
        <el-form-item label="标题">
          <el-input placeholder="标题" v-model="classListQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-input placeholder="来源" v-model="classListQueryFrm.source"></el-input>
        </el-form-item>
        <el-form-item label="形式">
          <el-select placeholder="全部" clearable v-model="classListQueryFrm.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select placeholder="全部" clearable v-model="classListQueryFrm.class">
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
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
    <div class="control-group">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="importArticle" type="primary">导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :ifmultipleSelection="true"
      @handleSelectionChange="handleSelectionChange"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Content from '@/api/contentPlatform/content';
  import { parseTime } from '@/utils';
  // import _ from 'lodash';

  export default {
    name: 'contentList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 80
          },
          {
            label: '标题',
            prop: 'title'
          },
          {
            label: '形式',
            prop: 'article',
            width: 100
          },
          {
            label: '分类',
            prop: 'classify_name',
            width: 100
          },
          {
            label: '来源',
            prop: 'author'
          },
          {
            label: '发布时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                label: '导入',
                disableds: this.ifDisabled
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        content_id: '',
        multipleSelection: [], // 选中的数据
        ifOperation: false, // 是否多选操作
        b_class_options: [],
        class_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1,
          tabLoading: true
        },
        classListQueryFrm: { // 查询条件
          title: '',
          source: '',
          type: '',
          class: '',
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
        },
        classOptions: [ // 分类
          {
            id: 1,
            label: '全部'
          },
          {
            id: 2,
            label: '财经'
          },
          {
            id: 3,
            label: '新闻'
          },
          {
            id: 4,
            label: '教育'
          },
          {
            id: 5,
            label: '生活'
          }
        ],
        typeOptions: [ // 形式
          {
            value: 1,
            label: '图文'
          },
          {
            value: 2,
            label: '视频'
          }
        ]
      };
    },
    created() {
      this.getData();
      this.getBClass();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Content.list.listO({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            item.create_time = parseTime(item.create_time);
            item.article = item.article_type - 0 === 1 ? '图文' : '视频';
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      getBClass() {
        Content.class.list({
          pageIndex: this.class_page_info.pageIndex,
          pageSize: this.class_page_info.pageSize
        }).then(data => {
          this.b_class_options = data.result;
          this.class_page_info.totalCount = data.totalCount * 1;
          this.class_page_info.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      searchGameList() { // 查询
        this.query = {
          articleType: this.classListQueryFrm.type,
          classifyId: this.classListQueryFrm.class,
          title: this.classListQueryFrm.title,
          author: this.classListQueryFrm.source,
          startTime: this.classListQueryFrm.time[0],
          endTime: this.classListQueryFrm.time[1]
        };
        this.pageIndex = 1;
        this.getData();
      },
      ifDisabled(item) { // 是否禁用导入
        if (!item) {
          return false;
        }
        return !item.import;
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
        if (type === 'status') { // 导入
          this.content_id = info.id;
          this.ifOperation = false;
          this.seve();
        }
      },
      importArticle() { // 导入全部
        if (this.multipleSelection.length <= 0) return;
        this.ifOperation = true;
        this.seve();
      },
      seve() {
        let id = [this.content_id];
        if (this.ifOperation) {
          id = [];
          this.multipleSelection.forEach(item => {
            if (item.import) {
              id.push(item.id);
            }
          });
        }
        if (!id) return;
        Content.list.ipt(id).then(() => {
          this.content_id = '';
          this.getData();
          this.ifOperation = false;
        });
      }
    }
  };
</script>

<style scoped>
</style>