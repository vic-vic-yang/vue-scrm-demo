<template>
  <div class="app-container">
    <div class="control-group">
      <el-form ref="activityQueryFrm">
        <el-form-item>
          <el-button type="primary" @click="createArticle">新建文章</el-button>
          <el-button type="primary" @click="$router.back()">返回</el-button>
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
    <el-dialog
      title="新建公众号文章跳转小程序参数"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form
        label-width="120px"
      >
        <el-form-item prop="article_name" label="公众号文章标题">
          <el-input
            v-model="article_name"
            placeholder="请输入公众号文章标题"
            :maxlength="50"
            name="article_name"
            :clearable="true">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitReadingName">确 定</el-button>
          <small style="font-size: 12px;color: rgba(0,0,0,.5);">点击确定，自动生成对应的参数</small>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import TASK_API from '@/api/task/index';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import qs from 'qs';

  export default {
    name: 'article-parameter',
    components: {
      customElTable,
      uploadPrizeAvatar
    },
    data() {
      return {
        mission_id: 0,
        mission_name: 0,
        dialogVisible: false,
        tableData: [],
        article_id: '',
        article_name: '',
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '公众号文章标题',
            prop: 'article_name'
          },
          {
            label: '参数',
            prop: 'code'
          },
          {
            prop: 'USER_ACTION',
            label: '操作',
            actions: [
              'edit'
            ]
          }
        ],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        paramsData: null,
        imgid: 0,
        query: null
      };
    },
    created() {
      this.mission_id = this.$route.query.id || 0;
      this.mission_name = this.$route.query.name || '';
      this.getTableData();
    },
    methods: {
      submitCover(res) {
        this.imgid = res;
      },
      getTableData() {
        const query = this.query || {};
        TASK_API.getReadingList({
          mission_id: this.mission_id,
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.article_id = '';
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              code: '?articleCode=' + item.code
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(e => {
          this.$message({
            message: '获取文章标题信息出错',
            type: 'warning'
          });
        });
      },
      createArticle() {
        this.dialogVisible = true;
      },
      editHandler(info) {
        this.article_id = info.id;
        this.article_name = info.article_name;
        this.dialogVisible = true;
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getTableData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getTableData();
      },
      submitReadingName() {
        this.paramsData = {
          mission_id: this.mission_id,
          article_name: this.article_name
        };
        this.saveArticle();
        this.dialogVisible = false;
      },
      saveArticle() {
        if (this.paramsData) {
          const formData2 = qs.stringify(this.paramsData);
          var urls = this.article_id ? TASK_API.editReadingPara(this.article_id, formData2) : TASK_API.getReadingPara(formData2);
          // 添加跳转参数
          urls.then(res => {
            this.getTableData();
            this.$message({
              message: this.article_id ? '编辑文章成功' : '新增文章成功',
              type: 'success'
            });
          });
        }
      }
    }
  };
</script>

<style scoped>

</style>
