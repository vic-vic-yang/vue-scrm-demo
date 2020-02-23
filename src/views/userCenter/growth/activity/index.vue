<template>
  <div class="activity-wrapper app-container">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="addActivity" icon="el-icon-plus">新建线下活动</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @edit="editHandler"
      @action="actionHandler">
    </custom-el-table>

    <el-dialog
      title="线下活动详情"
      :visible.sync="dialogVisible"
      width="60%">
      <div style="display: flex;flex-direction: column;line-break: auto" class="dialog-div">
        <span class="dialog-title">活动名称</span>
        <span>{{ viewData.name }}</span>
        <span class="dialog-title">活动类型</span>
        <span>{{ viewData.activity_type_name }}</span>
        <span class="dialog-title">活动封面</span>
        <el-image :src="viewData.activity_cover" alt="" style="width: 200px; height: 200px" fit="cover"/>
        <span class="dialog-title">活动简介</span>
        <span>{{ viewData.description }}</span>
        <span class="dialog-title">活动时间</span>
        <span>{{ viewData.start_time }} - {{ viewData.end_time }}</span>
        <span class="dialog-title">创建时间</span>
        <span>{{ viewData.create_time }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  import customElTable from '@/components/customElTable';
  import {parseTime } from '@/utils/index';
  import {value2Label } from '@/utils/enum';
  export default {
    name: 'growthActivityIndex',
    components: {
      customElTable
    },
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '活动名称',
            prop: 'name'
          },
          {
            label: '活动类型',
            prop: 'activity_type'
          },
          {
            label: '开始时间',
            prop: 'start_time'
          },
          {
            label: '结束时间',
            prop: 'end_time'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'view',
                label: '详情',
                btn: 'primary'
              },
              {
                type: 'edit',
                label: '编辑',
                btn: 'primary'
              }
            ]
          }
        ],
        eventTypes: [
          {
            value: 2,
            label: '线下讲座'
          }
        ],
        viewData: {
          name: '',
          description: '',
          activity_type_name: '',
          cover: '',
          create_time: '',
          start_time: '',
          end_time: ''
        },
        dialogVisible: false
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.query(this.formatResult);
      },
      search() {
        this.tableData = [];
        this.query(this.formatResult);
      },
      query(callback) {
        const params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        };
        USER_GROWTH_API.getActivities(params).then(callback);
      },
      formatResult(res) {
        const result = res.result;
        this.tableData = result.map(item => {
          item.create_time = parseTime(item.create_time);
          item.start_time = item.start_time ? parseTime(item.start_time) : '-';
          item.end_time = item.end_time ? parseTime(item.end_time) : '-';
          item.activity_type = value2Label(this.eventTypes, item.activity_type);
          return {
            ...item
          };
        });
        this.totalCount = res.totalCount * 1;
      },
      actionHandler(type, scope) {
        if (type === 'view') {
          USER_GROWTH_API.getActivity(scope.id, {}).then(res => {
            this.viewData.name = res.name;
            this.viewData.description = res.description;
            this.viewData.activity_cover = res.cover;
            this.viewData.activity_type_name = value2Label(this.eventTypes, res.activity_type);
            this.viewData.start_time = parseTime(res.start_time);
            this.viewData.end_time = parseTime(res.end_time);
            this.viewData.create_time = parseTime(res.create_time);
            this.dialogVisible = true;
          }).catch(e => {
            this.$message.error('请求失败');
          });
        }
      },
      editHandler(scope) {
        this.$router.push({
          name: 'growthEditActivity',
          params: {
            'id': scope.id
          }
        });
      },
      addActivity() {
        this.$router.push({
          name: 'growthEditActivity',
          params: {
            'id': 'new'
          }
        });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
  .el-input {
    width: 130px;
  }

  .dialog-title {
    font-size: 15px;
    font-weight: bold;
  }

  .dialog-div{
    span{
      margin-top: 10px;
    }
  }
</style>
