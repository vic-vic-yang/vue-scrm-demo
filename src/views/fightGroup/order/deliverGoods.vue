<template>
  <div class="app-container commodity-list">
    <div class="control-group mb-20">
      <el-button type="primary" @click="deliverGoods">批量发货</el-button>
    </div>
    <custom-el-table v-loading="tabLoading" v-model="pageIndex" :tableData="tableData" :tableOptions="tableOptions"
      :total="totalCount" @action="actionHandler" @size-change="sizeChangeHandler" @page-change="pageChangeHandler"></custom-el-table>
    <el-dialog title="批量发货" :visible.sync="prepositionShow" @close="prepositionCancel">
      <el-upload 
        class="upload-demo" 
        ref="upload"
        action="" 
        :before-remove="beforeRemove"
        :auto-upload="false" 
        :on-exceed="handleExceed" 
        :file-list="fileList"
        :limit="1"
        :http-request="uploadAction">
        <div>
          <span class="fs-13 text-666">文件</span>
          <el-button size="small" type="text">点击上传</el-button>
        </div>

        <div slot="tip" class="el-upload__tip">最大支持10000条记录（支持cvs/xls/xlsx,文件大小控制在1M以内）</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="prepositionCancel ">取 消</el-button>
        <el-button type="primary" @click="prepositionSave">确认上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DeliverGoods from '@/api/fightGroup/deliverGoods';
  import customElTable from '@/components/customElTable';
  import { parseTime } from '@/utils';
  
  export default {
    name: 'deliverGoods-list',
    components: {
      customElTable
    },
    data() {
      return {
        fileList: [],
        prepositionShow: false,
        tableOptions: [
          // {
          //  label: '',
          //  prop: 'SELECTION',
          //  align: 'center'
          // },
          {
            label: '记录编号',
            prop: 'id',
            width: 80
          },
          {
            label: '操作人',
            prop: 'username'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            label: '发单数量',
            prop: 'send_number'
          },
          {
            label: '成功发单数量',
            prop: 'success_number'
          },
          {
            label: '状态',
            prop: 'status_text'
          },
          {
            prop: 'USER_ACTION',
            actions: [{
              type: 'export',
              label: '导出状态报表'
            }]
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
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        DeliverGoods.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              status_text: item.status === 1 ? '未开始' : item.status === 2 ? '处理中' : '已完成',
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      uploadAction(res) {
        console.log(res);
        DeliverGoods.upload(res.file).then(this.uploadSuccess)
          .catch(this.uploadError);
      },
      uploadSuccess(res) {
        this.prepositionShow = false;
        this.$message({
          message: '导入成功',
          type: 'success'
        });
        this.$refs.upload.clearFiles();
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'export') {
          window.open(
            `${process.env.BASE_API}/groupBuy/v1/order/import-log/export?id=${info.id}`
          );
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
      deliverGoods() {
        this.prepositionShow = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length}个文件`);
      },
      beforeRemove(file, fileList) {
        console.log(file);
        console.log(fileList);
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      prepositionSave() {
        this.$refs.upload.submit();
      },
      prepositionCancel() {
        this.prepositionShow = false;
        this.$refs.upload.clearFiles();
      }
    }
  };
</script>

<style>
</style>
