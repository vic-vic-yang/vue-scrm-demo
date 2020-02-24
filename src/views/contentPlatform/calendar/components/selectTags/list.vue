<template>
  <el-dialog
    title="标签选择"
    :visible.sync="dialogVisible"
    top="5vh"
    width="70%"
    @close="dialogHide">
    <div>
      <div>已选择标签：</div>
      <el-tag
        v-for="(tag, index) in tags_list"
        :key="index"
        closable
        style="margin-right: 10px;"
        @close="closed(index)">
        {{tag.name}}
      </el-tag>
    </div>

    <div class="app-container">
      <div class="control-group">
        <el-form :inline="true" ref="searchFrm" :model="searchFrm">
          <el-form-item prop="tags" label="事件标签">
            <!-- <el-select placeholder="全部" clearable v-model="searchFrm.tags">
              <el-option
                v-for="item in tagsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-input v-model="searchFrm.name" placeholder="请输入标签名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
            <!-- <el-button @click="resetForm('searchFrm')" icon="el-icon-refresh">重置</el-button> -->
            <el-button @click="getData" icon="el-icon-refresh">刷新列表</el-button>
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
        @action="actionHandler"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
    </div>
  </el-dialog>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import CALENDAR from '@/api/contentPlatform/calendar';
  import { parseTime } from '@/utils';

  export default {
    name: 'list',
    components: {
      customElTable
    },
    props: ['show', 'list', 'multiple'],
    data() {
      return {
        tags_list: [],
        searchFrm: {
          name: ''
        },
        query: null,
        tagsOptions: [],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '事件标签',
            prop: 'name'
          },
          {
            label: '标签描述',
            prop: 'describe'
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
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        dialogVisible: false
      };
    },
    watch: {
      show(val) {
        this.dialogVisible = val;
        if (val) {
          this.setTagsList();
          this.setChecked();
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      determine() {
        this.dialogVisible = false;
        this.$emit('determineHandler', this.tags_list);
      },
      closed(index) {
        this.tags_list.splice(index, 1);
        this.setChecked();
      },
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        CALENDAR.tag.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--',
              checked: false
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          this.setChecked();
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      setChecked() {
        this.tableData.map(item => {
          item.checked = false;
          this.tags_list.map(val => {
            if (item.id === val.id) {
              item.checked = true;
            }
          });
        });
      },
      setTagsList() {
        this.tags_list = JSON.parse(this.list);
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchFrm);
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'checkbox') {
          if (info.checked) {
            var item = this.tags_list.find(item => item.id === info.id);
            if (!item) {
              if (this.multiple) {
                this.tags_list.push(info);
              } else {
                this.tags_list = [];
                this.tags_list.push(info);
                this.tableData.map(item => {
                  item.checked = false;
                  if (item.id === info.id) {
                    item.checked = true;
                  }
                });
              }
            }
          } else {
            var index = this.tags_list.findIndex(item => item.id === info.id);
            this.tags_list.splice(index, 1);
          }
        }
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
      },
      dialogHide() {
        this.dialogVisible = false;
        this.$emit('dialogHide');
      }
    }
  };
</script>

<style scoped>
  .control-group{
    margin-bottom: 30px;
  }
</style>
