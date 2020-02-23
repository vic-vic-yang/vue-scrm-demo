<!--
 * @Description: 奖品中心页面/列表页
 * @Author: haorun
 * @Date: 2019-08-13 09:51:20
 * @LastEditTime: 2019-08-30 14:43:04
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog
    title="系列选择"
    :visible.sync="giftDialogVisible"
    top="5vh"
    width="80%"
    @close="dialogHide">
    <div>
      <div>已选择系列：</div>
      <div v-if="selectGift && selectGift.length" class="list-content">
        <el-tag v-for="(item, index) in selectGift" closable class="list" :key="index" type="success" @close="closeHandler(index)">{{item.name}}</el-tag>
      </div>
    </div>

    <div class="comment-wrapper app-container">
      <div class="control-group">
        <el-form :inline="true" ref="topicFrm" :model="topicFrm">
          <el-form-item>
            <el-button type="primary" @click="createHandler">
              <i class="fs-13 el-icon-plus mr-5"></i>新建系列
            </el-button>
            <el-button @click="getData" icon="el-icon-refresh">刷新列表</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="determine">确定选择</el-button>
          </el-form-item>
        </el-form>
      </div>

      <custom-el-table
        v-loading="tabLoading"
        v-model="pageIndex"
        :tableData="tableData"
        :tableOptions="tableOptions"
        :total="totalCount"
        :pageSizes="pageSizes"
        :size="pageSize"
        @action="actionHandler"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
    </div>
  </el-dialog>
</template>

<script>
  import customElTable from '@/components/customElTable';
  // import { parseTime } from '@/utils';
  // import _ from 'lodash';
  import { parseTime } from '@/utils';
  import TOPIC from '@/api/readingClub/topic';

  export default {
    name: 'select-series',
    components: {
      customElTable
    },
    props: ['show', 'multiple'],
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        totalCount: 0,
        tabLoading: false,
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
            width: 120,
            actions: [
              {
                type: 'checkbox',
                label: ''
              }
            ]
          }
        ],
        topicFrm: {},
        selectGift: [],
        giftDialogVisible: this.show
      };
    },
    watch: {
      show(val) {
        this.giftDialogVisible = val;
        if (val) {
          this.setSelectGift();
          this.setChecked();
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      dialogHide() {
        this.$emit('moduleHide');
      },
      closeHandler(index) {
        this.selectGift.splice(index, 1);
        this.setChecked();
      },
      determine() {
        this.giftDialogVisible = false;
        var series = [];
        this.selectGift.map(item => {
          var arr = item.topicIds.split(',');
          series = [...series, ...arr];
        });
        this.$emit('determineHandler', Array.from(new Set(series)));
      },
      setChecked() {
        this.tableData.map(item => {
          item.checked = false;
          this.selectGift.map(val => {
            if (item.id === val.id) {
              item.checked = true;
            }
          });
        });
      },
      setSelectGift() {
        // this.selectGift = JSON.parse(this.list) || [];
        this.selectGift = [];
      },
      createHandler() {
        const { href } = this.$router.resolve({ name: 'topicSeriesCreate', query: {type: 'newAdd'} });
        window.open(href, '_blank');
      },
      editHandler(scope) {
        const { href } = this.$router.resolve({name: 'topicSeriesModify', params: {id: scope.id, type: 'newAdd'}});
        window.open(href, '_blank');
      },
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
            item.checked = false;
          });
          this.tableData = res.result;
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          this.setChecked();
        }).catch(() => {
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
      actionHandler(type, scope) {
        if (type === 'checkbox') {
          if (scope.checked) {
            var item = this.selectGift.find(item => item.id === scope.id);
            if (!item) {
              if (this.multiple) {
                this.selectGift.push(scope);
              } else {
                this.selectGift = [];
                this.selectGift.push(scope);
                this.tableData.map(item => {
                  item.checked = false;
                  if (item.id === scope.id) {
                    item.checked = true;
                  }
                });
              }
            }
          } else {
            var index = this.selectGift.findIndex(item => item.id === scope.id);
            this.selectGift.splice(index, 1);
          }
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .btns-wrapper{
    margin-bottom: 20px;
  }
  .select-gift{
    padding: 10px 0 30px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }

  .list-content {
    margin-top: 20px;
    .list{
      margin:0 10px 10px 0
    }
  }
</style>
