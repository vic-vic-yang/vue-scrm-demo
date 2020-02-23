<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="codeFrm"
      :rules="frmRules"
      ref="codeFrm"
      label-width="120px">
      <el-form-item label="新增奖品核销码">
        <div v-if="file && file_info">
          <el-tag type="success" closable @close="handleClose()">{{file_info && file_info.name}}</el-tag>
        </div>
        <el-upload
          v-else
          action="/api/prizeCenter/v1/prize/prize/import-card-number"
          name="file"
          accept=".xls,.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xlam,.csv"
          :http-request="uploadAction"
          :on-error="uploadError"
          :with-credentials="true"
          :show-file-list="false">
          <el-button size="small" type="primary">导入文件</el-button>
          <div slot="tip" class="el-upload__tip">请上传xls、xlsx格式表格，一列一个码。<a href="/static/兑换码格式.xlsx" style="text-decoration:underline;">点击下载格式文件</a></div>
        </el-upload>
      </el-form-item>

      <el-form-item prop="remark" label="导入文件备注">
        <el-input
          v-model="codeFrm.remark"
          placeholder="请输入导入文件备注"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>

      <div style="padding: 30px 0; width: 93%;margin-left: 50px;">
        <custom-el-table
          v-loading="tabLoading"
          v-model="pageIndex"
          :tableData="tableData"
          :tableOptions="tableOptions"
          :total="totalCount"
          @size-change="sizeChangeHandler"
          @page-change="pageChangeHandler">
        </custom-el-table>
      </div>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import { parseTime } from '@/utils';
  import integralCommodity from '@/api/integralMall/commodity';

  export default {
    name: 'writeCode',
    components: {
      customElTable
    },
    data() {
      return {
        codeFrm: {
          id: this.$route.query.id,
          remark: ''
        },
        tableData: [],
        pageLoading: false,
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '已上传文件名',
            prop: 'name'
          },
          {
            label: '已使用/总共数据',
            prop: 'file_data'
          },
          {
            label: '上传时间',
            prop: 'create_time'
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ],
        frmRules: {},
        file: '',
        file_info: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        integralCommodity.import_list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          goods_id: this.codeFrm.id
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time),
              file_data: `${item.used}/${item.total}`
            };
          });
          this.totalCount = res.totalCount * 1;
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
      save() {
        integralCommodity.upload(this.codeFrm.id, this.file, this.codeFrm.remark).then(() => {
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          this.$router.back();
        });
      },
      handleClose() {
        this.file_info = null;
        this.file = '';
      },
      uploadAction(res) {
        this.file_info = {
          name: res.file.name
        };
        this.file = res.file;
        this.$message({
          message: '导入成功',
          type: 'success'
        });
      },
      uploadError(err) {
        this.$message({
          message: (err && err.message) ? err.message : '导入失败',
          type: 'error'
        });
      }
    }
  };
</script>

<style scoped>
.el-upload__tip{
  display: inline-block;
  margin-left: 80px;
}
</style>
