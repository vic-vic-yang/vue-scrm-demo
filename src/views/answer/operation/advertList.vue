<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="advertListQueryFrm" :model="advertListQueryFrm">
        <el-form-item prop="description" label="广告标题">
          <el-input placeholder="请输入题目名" v-model="advertListQueryFrm.description"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="广告开关">
          <el-select placeholder="全部" clearable v-model="advertListQueryFrm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            :editable="false"
            v-model="advertListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="timestamp"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAdvertList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('advertListQueryFrm')" icon="el-icon-search">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createAdvert">
            <i class="fs-13 el-icon-plus mr-5"></i>新增
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
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Advert from '@/api/answer/advert';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'gameList',
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
            label: '广告标题',
            prop: 'description'
          },
          {
            label: '广告开关',
            prop: 'statusTxt',
            options: {
              type: 'tag',
              prop: 'status'
            },
            width: 120
          },
          {
            label: '广告位置',
            prop: 'location'
          },
          {
            label: '广告链接',
            prop: 'link'
          },
          {
            label: '创建时间',
            prop: 'createdAt',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
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
        advertListQueryFrm: {
          description: '',
          status: -1,
          time: []
        },
        query: null,
        pickerOptions: {
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
        statusOptions: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 1,
            label: '开'
          },
          {
            value: 0,
            label: '关'
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
        Advert.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              statusTxt: item.status * 1 === 0 ? '关' : '开',
              location: item.location * 1 === 0 ? '首页' : '答题结束页',
              createdAt: parseTime(item.createdAt)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchAdvertList() {
        this.query = _.cloneDeep(this.advertListQueryFrm);
        let startTime = '';
        let endTime = '';
        if (this.query.time && this.query.time.length === 2) {
          const time = this.query.time;
          startTime = Math.floor(time[0] / 1000);
          endTime = Math.floor(time[1] / 1000);
        }
        this.$set(this.query, 'startTime', startTime);
        this.$set(this.query, 'endTime', endTime);
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createAdvert() {
        this.$router.push({ name: 'advertModify' });
      },
      editHandler(info) {
        this.$router.push({ name: 'advertCreate', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除广告 <b>${info.description}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Advert.del(info)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>
</style>
