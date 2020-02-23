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
      @edit="editArticle"
      @delete="deleteArticle"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
    <el-dialog
      title="新增文章"
      top="10vh"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form2" :model="article" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="文章作者">
          <el-input v-model="article.author"></el-input>
        </el-form-item>
        <el-form-item label="文章链接">
          <el-input v-model="article.url"></el-input>
        </el-form-item>
        <el-form-item label="文章封面">
          <upload-prize-avatar v-model="article.cover" style="margin: 0;" @update:imageId="submitCover"></upload-prize-avatar>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddArticle">确 定</el-button>
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
    name: 'task-article',
    components: {
      customElTable,
      uploadPrizeAvatar
    },
    data() {
      return {
        mission_name: 0,
        mission_id: 0,
        dialogVisible: false,
        tableData: [],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '任务名称',
            prop: 'mission_name'
          },
          {
            label: '文章名称',
            prop: 'title'
          },
          {
            label: '文章作者',
            prop: 'author'
          },
          {
            label: '文章链接',
            prop: 'url'
          },
          {
            label: '文章封面',
            prop: 'cover_img',
            options: {
              type: 'html'
            }
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            label: '操作',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del'
            ]
          }
        ],
        article: {
          title: '',
          author: '',
          cover: '',
          url: ''
        },
        article_id: '',
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        query: null
      };
    },
    created() {
      this.mission_id = this.$route.query.id || 0;
      this.mission_name = this.$route.query.name || '';
      this.getArticleList();
    },
    methods: {
      submitCover(res) {
        this.imgid = res;
      },
      getArticleList() {
        const query = this.query || {};
        TASK_API.getArticleList({
          mission_id: this.mission_id,
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.article_id = '';
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              cover_img: `<img style="width: 120px;height: auto" src="${item.cover[0].file_path}" />`
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(e => {
          this.$message({
            message: '获取文章信息出错',
            type: 'warning'
          });
        });
      },
      createArticle() {
        this.dialogVisible = true;
      },
      editArticle(scope) {
        this.dialogVisible = true;
        this.article_id = scope.id;
        this.imgid = scope.cover && scope.cover[0].id;
        Object.assign(this.article, {
          title: scope.title,
          author: scope.author,
          cover: scope.cover && scope.cover[0].file_path,
          url: scope.url
        });
      },
      deleteArticle(scope) {
        this.$confirm(`确认删除文章 <b>${scope.title}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TASK_API.delArticle(scope.id).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getArticleList();
          }).catch(e => {
            this.$message({
              message: '删除文章出错',
              type: 'warning'
            });
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
          this.$confirm(`确认立即${title}文章 <b>${info.title}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            TASK_API.statusArticle({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            })
              .then(() => {
                this.getArticleList();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        }
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getArticleList();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getArticleList();
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        if (status === 3) return false;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          } : {
            btn: 'primary',
            label: '启用'
          };
      },
      submitAddArticle() {
        let params = {
          mission_name: this.mission_name,
          mission_id: this.mission_id,
          title: this.article.title,
          author: this.article.author,
          cover: this.imgid,
          url: this.article.url
        };
        params = qs.stringify(params);
        if (!this.mission_name) {
          this.$message({
            message: '缺少任务名称！',
            type: 'warning'
          });
          return;
        }
        var urls = this.article_id ? TASK_API.editAriticle(this.article_id, params) : TASK_API.addAriticle(params);
        urls.then(res => {
          this.$message({
            message: this.article_id ? '修改文章成功' : '添加文章成功',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getArticleList();
        }).catch(e => {
          this.$message({
            message: '添加文章出错',
            type: 'warning'
          });
        });
      }
    }
  };
</script>

<style scoped>

</style>
