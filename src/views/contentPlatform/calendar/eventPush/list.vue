<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="searchFrm" :model="searchFrm">
        <el-form-item>
          <el-button type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建事件推送机制
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
  import _ from 'lodash';
  import CALENDAR from '@/api/contentPlatform/calendar';
  import { parseTime } from '@/utils';

  export default {
    name: 'list.vue',
    components: {
      customElTable
    },
    data() {
      return {
        searchFrm: {
          tags: ''
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
            label: '推送时间',
            prop: 'time_name'
          },
          {
            label: '推送方式',
            prop: 'type_name'
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
        templateOptions: [
          {
            id: 1,
            name: '模板消息'
          }
        ],
        unitOptions: [
          {
            id: 'd',
            name: '天'
          },
          {
            id: 'h',
            name: '小时'
          },
          {
            id: 'm',
            name: '分钟'
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
        CALENDAR.push.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--',
              type_name: this.setPushType(item.type),
              time_name: `提前${item.time}${this.setUnit(item.unit)}`
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      setPushType(type) {
        return this.templateOptions.find(item => Number(item.id) === Number(type)).name || '';
      },
      setUnit(unit) {
        return this.unitOptions.find(item => String(item.id) === String(unit)).name || '';
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'createEventPush' });
      },
      editHandler(info) {
        this.$router.push({ name: 'modifyEventPush', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除事件推送方式 <b>${info.type}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CALENDAR.push.del(info.id).then(() => {
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
