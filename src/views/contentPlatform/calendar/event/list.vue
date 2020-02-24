<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="searchFrm" :model="searchFrm">
        <el-form-item prop="name" label="事件名称">
          <el-input placeholder="事件名称" v-model="searchFrm.name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="tag" label="事件标签">
          <el-select placeholder="事件标签" clearable v-model="searchFrm.tag">
            <el-option
              v-for="item in tagsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <el-pagination
              v-loading="tag_page_info.tabLoading"
              :page-size="tag_page_info.pageSize"
              :current-page="tag_page_info.pageIndex"
              @current-change="currentChangeActivity"
              layout="prev, pager, next"
              :total="tag_page_info.totalCount">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            :editable="false"
            v-model="searchFrm.time"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('searchFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i>新建事件
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="/api/content/content/event/import"
            name="file"
            accept=".xls,.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xlam,.csv"
            :http-request="uploadAction"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :with-credentials="true"
            :show-file-list="false">
            <el-button type="primary"><i class="el-icon-upload
 mr-5"></i>批量导入
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <a class="download-a" download="事件集模板.xlsx" href="https://scrm-file.oss-cn-hangzhou.aliyuncs.com/static/doc/%E4%BA%8B%E4%BB%B6%E9%9B%86%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">下载模板</a>
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
    components: {
      customElTable
    },
    data() {
      return {
        searchFrm: {
          name: '',
          tags: '',
          time: ''
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
            label: '事件名称',
            prop: 'name'
          },
          {
            label: '事件标签',
            prop: 'tag'
          },
          {
            label: '事件时间',
            prop: 'time'
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
        tag_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1
        },
        isUploadLoading: null
      };
    },
    created() {
      this.getData();
      this.getTagList();
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
        CALENDAR.event.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              time: `${item.start_time * 1 > 0 ? parseTime(item.start_time) : '--'} 至 ${item.end_time * 1 > 0 ? parseTime(item.end_time) : '--'}`,
              tag_type: 'success'
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      getTagList() {
        CALENDAR.tag.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.tagsOptions = (res.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.tag_page_info.totalCount = res.totalCount * 1;
        });
      },
      currentChangeActivity(e) { // 分页频道
        this.tag_page_info.pageIndex = e;
        this.getTagList();
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', time[0] || '');
        this.$set(this.query, 'end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.$router.push({ name: 'createEvent' });
      },
      editHandler(info) {
        this.$router.push({ name: 'modifyEvent', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除事件 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CALENDAR.event.del(info.id).then(() => {
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

<style lang="scss" scoped>
.download-a {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    font-size: 13px;
    border-radius: 4px;
    padding: 10px 20px;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #FFF;      
    }
}
</style>>
