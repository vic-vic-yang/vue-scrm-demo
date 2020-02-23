<template>
  <el-dialog title="选择内容" :visible.sync="dialogSelectCommodityVisible" class="select-commodity-dialog">
    <div class="control-group">
      <el-form :inline="true" :model="commodityQueryFrm" size="mini">
        <el-form-item label="标题">
          <el-input placeholder="标题" v-model="commodityQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="形式">
          <el-select placeholder="全部" clearable v-model="commodityQueryFrm.articleType">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            :editable="false"
            v-model="commodityQueryFrm.time"
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
          <el-button type="primary" @click="searchCommodityList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :pageSizes="[]"
      :size="pageSize"
      maxHeight="455"
      @action="actionHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </el-dialog>
</template>

<script>
  import _ from 'lodash';
  import customElTable from '@/components/customElTable';
  import Content from '@/api/contentPlatform/content';
  import { parseTime } from '@/utils';

  export default {
    name: 'selectCommodity',
    model: {
    },
    props: {
      value: {},
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
      customElTable
    },
    data() {
      return {
        commodityQueryFrm: {
          title: '',
          status: 1,
          time: [],
          articleType: ''
        },
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: 80
          },
          {
            label: '标题',
            prop: 'title'
          },
          {
            label: '类型',
            prop: 'article_type'
          },
          {
            label: '发布时间',
            prop: 'publish_time',
            sortable: true,
            width: 140
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                options: this.getStatusBtnInfo
              }
            ]
          }
        ],
        query: null,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        tabLoading: true,
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
    computed: {
      dialogSelectCommodityVisible: {
        set(val) {
          this.$emit('update:show', val);
        },
        get() {
          return this.show;
        }
      }
    },
    watch: {
      show(val) {
        if (val) {
          this.getData();
        }
      }
    },
    methods: {
      getData() {
        const query = this.commodityQueryFrm || {};
        this.tabLoading = true;
        // this.tabLoading = true;
        query.startTime = query.time ? query.time[0] : '';
        query.endTime = query.time ? query.time[1] : '';
        Content.list.listB({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            if (item.publish_time) {
              item.publish_time = parseTime(item.publish_time);
            }
            item.article_type = item.article_type - 0 === 1 ? '图文' : '视频';
            item.status_cn = item.status - 0 === 0 ? '未发布' : '已发布';
            // item.title = item.recommend - 0 === 1 ? '[推荐] ' + item.title : item.title;
            // item.title = item.top - 0 === 1 ? '[置顶] ' + item.title : item.title;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      cancel() {
        this.dialogSelectCommodityVisible = false;
      },
      ok() {
        this.dialogSelectCommodityVisible = false;
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.commodityQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '不可选'
          };
        }
        const status = item.status * 1;
        return status === 1
          ? {
            btn: 'primary',
            label: '选取',
            disabled: true
          } : {
            btn: 'danger',
            label: '不可选'
          };
      },
      actionHandler(type, info) {
        if (type === 'status' && (info.status * 1) === 1) {
          this.$confirm(`确认选取 <b>${info.title}</b> 吗？`, '确认', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('input', info);
            this.$emit('update-data', info);
            this.dialogSelectCommodityVisible = false;
          }).catch(() => {
            console.log('取消选取');
          });
        }
      }
    }
  };
</script>

<style>
  .select-commodity-dialog .el-dialog{
    min-width: 1080px;
  }
</style>
