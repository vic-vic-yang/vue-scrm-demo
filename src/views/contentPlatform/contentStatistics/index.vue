<template>
  <div class='app-container'>
    <div class='control-group'>
      <el-form :inline='true' :model='queryParams' class='demo-form-inline'>
        <el-form-item label='账号名称'>
          <el-input v-model='queryParams.search_input' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item label='部门'>
          <el-input v-model='queryParams.department_name' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item label='账号角色'>
          <el-input v-model='queryParams.role_name' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item label='发布时间'>
          <el-date-picker
            :editable='false'
            v-model='queryParams.time'
            type='datetimerange'
            :picker-options='pickerOptions'
            range-separator='至'
            start-placeholder='开始时间'
            end-placeholder='结束时间'
            value-format='yyyy-MM-dd HH:mm:ss'
            align='right'
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' operate='view' @click='onQuery'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' operate='view' @click='getList'>刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading='tabLoading'
      v-model='queryParams.page_index'
      :tableData='tableData'
      :tableOptions='tableOptions'
      :total='totalCount'
      @size-change='sizeChangeHandler'
      @page-change='pageChangeHandler'
    ></custom-el-table>
  </div>
</template>

<script>
import { API_USER } from '@/api/setting';
import customElTable from '@/components/customElTable';
export default {
  name: 'accountManageList',
  components: {
    customElTable
  },
  data() {
    return {
      queryParams: {
        role_name: '',
        search_input: '',
        department_name: '',
        status: '',
        page_index: 1,
        page_size: 20,
        time: []
      },
      totalCount: 0,
      tabLoading: false,
      tableData: [],
      pickerOptions: {
        // 时间选择器
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      tableOptions: [
        {
          label: '账号ID',
          prop: 'id'
        },
        {
          label: '姓名',
          prop: 'realname'
        },
        {
          label: '账号',
          prop: 'username'
        },
        {
          label: '账号角色',
          prop: 'role_name'
        },
        {
          label: '部门',
          prop: 'department_name'
        },
        {
          label: '原创数量',
          prop: 'create_count'
        },
        {
          label: '借鉴数量',
          prop: 'import_count'
        },
        {
          label: '审核数量',
          prop: 'audit_count'
        }
      ]
    };
  },
  mounted() {
    // console.log(this.$store.state.permission);
    this.getList();
  },
  methods: {
    onQuery() {
      this.queryParams.page_index = 1;
      this.getList();
    },
    getList() {
      API_USER.getList(this.queryParams).then(res => {
        if (res.data && res.data.result) {
          this.tableData = (res.data.result || []).map(item => {
            item.role_name = item.roles
              .map(dp => {
                return dp.role_name;
              })
              .join('，');
            item.department_name = item.department
              .map(dp => {
                return dp.name;
              })
              .join('，');
            item.status_text = item.status;
            return item;
          });
          this.totalCount = ~~res.data.totalCount;
        }
      });
    },
    sizeChangeHandler(size) {
      this.queryParams.page_size = size;
      this.getList();
    },
    pageChangeHandler(page) {
      this.queryParams.page_index = page;
      this.getList();
    }
  }
};
</script>

<style>
</style>
