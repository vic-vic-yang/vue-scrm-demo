<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="groupListQueryFrm" :model="groupListQueryFrm">
        <el-form-item prop="title" label="题库名称">
          <el-input placeholder="题库名称" v-model="groupListQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="选择状态">
          <el-select v-model="groupListQueryFrm.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="选择时间">
          <el-date-picker
            :editable="false"
            v-model="groupListQueryFrm.time"
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
          <el-button type="primary" @click="searchQuestionGroup" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('groupListQueryFrm')" icon="el-icon-search">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createQuestionGroup">
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
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Question from '@/api/answer/question';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'groupList',
    components: {
      customElTable
    },
    data() {
      return {
        groupListQueryFrm: {
          name: '',
          status: '',
          time: '',
          title: ''
        },
        query: null,
        statusOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 'enable',
            label: '启用'
          },
          {
            value: 'disable',
            label: '禁用'
          }
        ],
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '题库名称',
            prop: 'title'
          },
          {
            label: '状态',
            prop: 'statusTxt',
            options: {
              type: 'tag',
              prop: 'status'
            },
            width: 120
          },
          {
            label: '创建时间',
            prop: 'createTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '包含题目',
            prop: 'itemNum',
            width: 80
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '查看详情',
                type: 'detail'
              },
              {
                label: '查看题目',
                type: 'topic'
              },
              'edit',
              {
                type: 'status',
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
        Question.group.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.items || []).map(item => {
            return {
              ...item,
              status: item.status === 'enable' ? 1 : 0,
              statusTxt: item.status === 'enable' ? '启用' : '禁用',
              createTime: parseTime(item.createTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      searchQuestionGroup() {
        this.query = _.cloneDeep(this.groupListQueryFrm);
        let startTime = '';
        let endTime = '';
        if (this.query.time && this.query.time.length === 2) {
          const time = this.query.time;
          startTime = time[0];
          endTime = time[1];
        }
        this.$set(this.query, 'earliestCreated', startTime);
        this.$set(this.query, 'lastCreated', endTime);
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createQuestionGroup() {
        this.$router.push({ name: 'questionGroupCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'questionGroupModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除题库 <b>${info.title}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Question.group.del(info)
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
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.$store.getters.getStatusTxt(!info.status);
          this.$confirm(`确认${title}题库 <b>${info.title}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Question.group.status(info)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'detail') {
          this.$alert(info.desc, info.title, {
            confirmButtonText: '确定'
          }).catch(err => {
            console.log('view detail : ', err);
          });
        } else if (type === 'topic') {
          this.$router.push({
            name: 'topicList',
            query: {
              group: info.id,
              type: info.type
            }
          });
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
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        return {
          btn: item.status * 1 === 0 ? 'primary' : 'danger',
          label: this.$store.getters.getStatusTxt(!item.status)
        };
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>
</style>
