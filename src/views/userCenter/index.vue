<template>
  <div class="user-wrapper app-container">
    <el-form :inline="true" ref="form" :model="form" label-width="80px">
      <el-form-item label="用户ID">
        <el-input v-model="form.id" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.nickname" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="是否黑名单">
        <el-select v-model="form.status" placeholder="选择状态">
          <el-option v-for="(status, index) in statuses" :key="index" :label="status.label" :value="status.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(check, index) in checkListData" :key="index" :label="check.label"></el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import USERCENTER_API from '@/api/userCenter/index';
  import customElTable from '@/components/customElTable';
  export default {
    name: 'userCenter',
    components: {
      customElTable
    },
    data() {
      return {
        form: {
          status: '',
          user_name: '',
          id: ''
        },
        checkList: [],
        checkListData: [
          {
            label: '评论黑名单',
            value: 1
          },
          {
            label: '作品黑名单',
            value: 2
          }
        ],
        dialogVisible: false,
        statuses: [
          {
            label: '全部',
            value: '0'
          },
          {
            label: '否',
            value: '1'
          },
          {
            label: '是',
            value: '2'
          }
        ],
        tableData: [
        ],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '用户ID',
            prop: 'id'
          },
          {
            label: '用户名',
            prop: 'nickname'
          },
          {
            label: '黑名单状态',
            prop: 'black'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit'
            ]
          }
        ]
      };
    },
    created() {
      this.init();
    },
    methods: {
      onSubmit() {
        this.init();
      },
      save() {
        let type = [];
        console.log(this.checkList);
        type = this.checkList.map(item => {
          for (let i = 0; i < this.checkListData.length; i++) {
            if (this.checkListData[i].label === item) {
              return this.checkListData[i].value;
            }
          }
        });
        const params = {
          'user_id': this.paramsUserId,
          type
        };
        USERCENTER_API.edit(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.dialogVisible = false;
            this.init();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      },
      init() {
        const params = {
          nickname: this.form.nickname,
          id: this.form.id,
          is_black: this.form.status,
          page_size: this.pageSize,
          page_index: this.pageIndex
        };
        USERCENTER_API.list(params).then(res => {
          this.tableData = res.records;
          this.totalCount = res.totalCount * 1;
        });
      },
      editHandler(scope) {
        this.checkList = [];
        scope.black.split(',').forEach(item => {
          if (!(item.indexOf('评论') < 0)) {
            this.checkList.push('评论黑名单');
          } else if (!(item.indexOf('作品') < 0)) {
            this.checkList.push('作品黑名单');
          } else {
            this.checkList = [];
          }
        });
        this.dialogVisible = true;
        this.paramsUserId = scope.id;
      },
      handleClose(done) {
        done();
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.init();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.init();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
