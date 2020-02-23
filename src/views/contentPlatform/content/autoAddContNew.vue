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
      @delete='deleteHandler'
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
    <el-dialog title="内容详情"  :visible.sync="dialogTableVisible" height="50%" width="60%" @close="closeDialog">
      <iframe :srcdoc="curDetail" class="my-dailog" style="text-align: center !important;width: 100%;height: 600px; frameborder=no" frameborder="no" border="0" marginWidth=0
			 marginHeight=0>
      </iframe>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import ColumnsApi from '@/api/contentPlatform/columns';
  import { parseTime } from '@/utils';
  // import _ from 'lodash';

  export default {
    name: 'contentList',
    components: {
      customElTable
    },
    data() {
      return {
        curDetail: '',
        dialogTableVisible: false,
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
                btn: 'primary'
              },
              {
                type: 'preview',
                label: '预览'
              },
              'del'
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
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        ColumnsApi.content({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          column_id: this.$route.params.column,
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
      searchGameList() { // 查询
        this.query = {
          articleType: this.classListQueryFrm.type,
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
        if (type === 'status') { // 导入
          this.content_id = info.id;
          this.ifOperation = false;
          this.seve();
        } else if (type === 'preview') { // 预览
          if (info.content) {
            this.curDetail = info.content;
            this.dialogTableVisible = true;
          } else if (info.original_url) {
            window.open(info.original_url, '_blank');
          } else {
            this.$message({
              type: 'error',
              message: '暂无内容'
            });
          }
          // if (info.original_url) {
          //   window.open(info.original_url, '_blank');
          // } else if (info.content) {
          //   this.curDetail = info.content;
          //   this.dialogTableVisible = true;
          // } else {
          //   this.$message({
          //     type: 'error',
          //     message: '暂无内容'
          //   });
          // }
        }
      },
      closeDialog() {

      },
      importArticle() { // 导入全部
        if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择需要导入的内容'
          });
          return;
        }
        this.ifOperation = true;
        this.seve();
      },
      seve() {
        let id = [this.content_id];
        if (this.ifOperation) {
          id = [];
          this.multipleSelection.forEach(item => {
            id.push(item.id);
          });
        }
        if (!id) return;
        const params = {
          id: id,
          column_id: this.$route.params.column
        };
        ColumnsApi.import(params).then(() => {
          this.content_id = '';
          this.getData();
          this.ifOperation = false;
        });
      },
      deleteHandler(info) {
      // 删除
        this.$confirm(`确认删除 <b>${info.title}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const params = {
              'id': [info.id]
            };
            ColumnsApi.exceptArticle(params).then(() => {
              this.getData();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
.my-dailog div{
  text-align: center !important;
}
</style>