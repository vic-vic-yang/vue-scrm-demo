<template>
  <div class="app-container">
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
    <el-dialog title="审核" width="30%" :visible.sync="ifComment">
      <p class="comment-text">请选择是否审核通过！</p>
      <div class="work-btn">
        <el-button type="danger" @click="commentNoPass">审核未过</el-button>
        <el-button type="primary" @click="commentPass">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Works from '@/api/vote/works';
  // import { parseTime } from '@/utils';

  export default {
    name: 'voteComment',
    components: {
      customElTable
    },
    data() {
      return {
        id: this.$route.params.id,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '评论内容',
            prop: 'content'
          },
          {
            label: '状态',
            prop: 'status_cn',
            width: 120,
            options: {
              type: 'tag',
              prop: 'stageType'
            }
          },
          {
            label: '用户姓名',
            prop: 'user_name',
            width: 100
          },
          {
            label: '联系电话',
            prop: 'phone_number',
            width: 120
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '审核',
                type: 'detail',
                options: this.getStatusBtnInfo,
                disableds: (item) => {return Number(item.black) === 1}
              },
              {
                label: '拉入黑名单',
                type: 'blacklist',
                disableds: (item) => {return Number(item.black) === 1}
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        ifComment: false,
        commentId: '',
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        Works.commentList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          compositionId: this.id
        }).then(data => {
          data.result.forEach(item => {
            switch (Number(item.status)) {
              case 2:
                item.status_cn = '未过审'
                item.stageType = 2
                break;
              default:
                item.status_cn = '已过审'
                item.stageType = 4
                break;
            }
            if (Number(item.black) === 1) {
              item.status_cn = '黑名单';
              item.stageType = 0
            }
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      actionHandler(type, info) {
        if (type === 'detail') {
          this.commentId = info.id;
          this.ifComment = true;
        } else if (type === 'blacklist') {
          if (info.status - 0 === 4) return;
          this.$confirm(`确认将 ${info.name} 拉入黑名单吗？`, '黑名单', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Works.commenBlack(info.id).then(() => {
              this.getData();
              this.$message({
                type: 'info',
                message: `已拉黑`
              });
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消`
            });
          });
        }
      },
      getStatusBtnInfo(item) { // 操作按钮的样式
        if (!item) {
          return {
            btn: 'primary',
            label: '审核'
          };
        }
        return {
          btn: 'primary',
          label: `审核`
        };
      },
      ifDisabled(item) { // 是否禁用
        if (!item) {
          return false;
        }
        if (Number(item.black) === 1) return true;
      },
      commentNoPass() {
        Works.commentStatus(this.commentId, { status: 2 }).then(() => {
          this.getData();
          this.ifComment = false;
        });
      },
      commentPass() {
        Works.commentStatus(this.commentId, { status: 1 }).then(() => {
          this.getData();
          this.ifComment = false;
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
      }
    }
  };
</script>
<style scoped>
.comment-text{
  margin: 0;
}
.work-btn{
  width: 40%;
  display: flex;
  margin: 30px auto 0;
  justify-content: space-between;
}
</style>
