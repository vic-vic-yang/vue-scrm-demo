<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true"
               ref="searchFrm"
               :model="searchFrm">
        <el-form-item prop="name"
                      label="事件集名称">
          <el-input v-model="searchFrm.name"
                    placeholder="请输入事件集名称"
                    :maxlength="50"
                    name="name"
                    :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="searchHandler"
                     icon="el-icon-search">查询</el-button>
          <!-- <el-button @click="resetForm('searchFrm')" icon="el-icon-refresh">重置</el-button> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建事件集
          </el-button>
        </el-form-item>            
      </el-form>
    </div>
    <custom-el-table v-loading="tabLoading"
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
  name: 'eventCollection',
  components: {
    customElTable
  },
  data() {
    return {
      isUploadLoading: null,
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
          label: '事件集名称',
          prop: 'name'
        },
        {
          label: '事件集描述',
          prop: 'describe'
        },
        {
          label: '日历创建时间',
          prop: 'create_time',
          sortable: true
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'recommend',
              options: this.getRecommendBtnInfo
            },
            'edit',
            'del',
            {
              type: 'status',
              options: this.getStatusBtnInfo
            }
          ]
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true
    };
  },
  created() {
    this.getData();
  },
  methods: {
    beforeUpload() {
      this.isUploadLoading = this.$loading({
        lock: true,
        text: '正在导入',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    uploadSuccess(res) {
      this.isUploadLoading.close();
      this.$message({
        message: '导入成功',
        type: 'success'
      });
      this.getData();
    },
    uploadError(err) {
      this.isUploadLoading.close();
      this.$message({
        message: (err && err.message) ? err.message : '导入失败',
        type: 'error'
      });
    },
    downloadTemp() {
      console.log('下载模板');
    },
    uploadAction(res) {
      CALENDAR.collection.upload(res.file).then(this.uploadSuccess)
        .catch(this.uploadError);
    },
    getData() {
      const query = this.query || {};
      this.tabLoading = true;
      CALENDAR.collection.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...query
      }).then(res => {
        this.tableData = (res.result || []).map(item => {
          return {
            ...item,
            create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
          };
        });
        this.totalCount = res.totalCount * 1;
        this.tabLoading = false;
      }).catch(() => {
        this.tabLoading = false;
      });
    },
    searchHandler() {
      this.query = _.cloneDeep(this.searchFrm);
      this.pageIndex = 1;
      this.getData();
    },
    createHandler() {
      this.$router.push({ name: 'createEventCollection' });
    },
    editHandler(info) {
      this.$router.push({ name: 'modifyEventCollection', params: { id: info.id } });
    },
    deleteHandler(info) {
      var delMessage = `确认删除事件集 <b>${info.name}</b> 吗？`;
      this.$confirm(delMessage, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CALENDAR.collection.del({
          cid: info.id,
          status: -1
        }).then(() => {
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
        const title = this.getStatusBtnInfo(info).label;
        var disableMessage = `确认${title}事件集 <b>${info.name}</b> 吗？`;
        this.$confirm(disableMessage, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CALENDAR.collection.status({
            cid: info.id,
            status: info.status * 1 === 1 ? 2 : 1
          }).then(() => {
            this.$message({
              type: 'success',
              message: `${title}成功！`
            });
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${title}`
          });
        });
      } else if (type === 'recommend') {
        const title = this.getRecommendBtnInfo(info).label;
        var delMessage = `确认${title}事件集 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '推荐', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CALENDAR.collection.recommend({
            cid: info.id,
            is_recommend: info.is_recommend * 1 === 1 ? 2 : 1
          }).then(() => {
            this.$message({
              type: 'success',
              message: `${title}成功`
            });
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${title}`
          });
        });
      }
    },
    getStatusBtnInfo(item) {
      if (!item) {
        return {
          btn: 'danger',
          label: '禁用'
        };
      }
      const status = item.status * 1;
      return status === 1
        ? {
          btn: 'danger',
          label: '禁用'
        }
        : {
          btn: 'primary',
          label: '启用'
        };
    },
    getRecommendBtnInfo(item) {
      if (!item) {
        return {
          btn: 'info',
          label: '取消推荐'
        };
      }
      const is_recommend = item.is_recommend * 1;
      return is_recommend === 1
        ? {
          btn: 'info',
          label: '取消推荐'
        }
        : {
          btn: 'success',
          label: '推荐'
        };
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

<style>
</style>
