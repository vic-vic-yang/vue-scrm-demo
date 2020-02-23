<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true">
        <el-form-item label="选择状态">
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCodeSegment" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createCode">
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
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import CodeManager from '@/api/lottery/codeManager';
  import { parseTime } from '@/utils';

  export default {
    name: 'codeList',
    components: {
      customElTable
    },
    data() {
      return {
        statusOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '未启用'
          },
          {
            value: '1',
            label: '启用'
          }
        ],
        tableOptions: [
          {
            label: '流水ID',
            prop: 'id',
            width: 80
          },
          {
            label: '码段名称',
            prop: 'name'
          },
          {
            label: '关联活动',
            prop: 'activity_id',
            width: 100
          },
          {
            label: '激活/总量',
            prop: 'count'
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
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '最后更新',
            prop: 'update_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: ['edit']
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        status: '',
        searchStatus: '',
        totalCount: 0,
        tabLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        CodeManager.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          status: this.searchStatus
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              id: item.id,
              name: item.name,
              activity_id: item.activity_id,
              count: `${item.active_count}/${item.total_count}`,
              status: item.status * 1 === 0 ? 0 : 1,
              statusTxt: item.status * 1 === 0 ? '未启用' : '启用',
              create_time: parseTime(item.create_time),
              update_time: parseTime(item.update_time)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchCodeSegment() {
        this.searchStatus = this.status;
        this.pageIndex = 1;
        this.getData();
      },
      createCode() {
        this.$router.push({ name: 'codeAdd' });
      },
      editHandler(info) {
        this.$router.push({ name: 'codeModify', params: { id: info.id }});
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      }
    }
  };
</script>

<style scoped>
</style>
