<template>
    <div class="app-container">
        <div class="control-group">
            <el-form :inline="true" :model="blackListQueryFrm">
                <el-form-item prop="type">
                    <el-radio-group v-model="type" style="width:400px" @change="searchType">
                        <el-radio :label="1">报名黑名单</el-radio>
                        <el-radio :label="2">作品黑名单</el-radio>
                        <el-radio :label="3">评论黑名单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="activity_id" label="活动名称">
                  <el-select placeholder="请选择活动名称" clearable v-model="blackListQueryFrm.activityId">
                    <el-option
                      v-for="item in wotks"
                      :key="item.id"
                      :label="item.activity_name"
                      :value="item.id">
                    </el-option>
                    <div class="article_pages">
                      <el-pagination
                        :page-size="wotks_page_info.pageSize"
                        :current-page="wotks_page_info.pageIndex"
                        @current-change="currentChangeActivity"
                        layout="prev, pager, next"
                        :total="wotks_page_info.totalCount">
                      </el-pagination>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input placeholder="昵称" v-model="blackListQueryFrm.nickname"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="searchBlackList" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
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
    </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import User from '@/api/vote/user';
import Activity from '@/api/vote/activity';
export default {
  name: 'blackList',
  components: {
    customElTable
  },
  data() {
    return {
      tabLoading: true,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      type: 1,
      wotks: [],
      tableData: [],
      blackListQueryFrm: {
        activityId: null,
        nickname: ''
      },
      wotks_page_info: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1
      },
      tableOptions: [
        {
          label: '编号',
          prop: 'id',
          width: 120
        },
        {
          label: '活动',
          prop: 'activity_name'
        },
        {
          label: '姓名',
          prop: 'user_name'
        },
        {
          label: '昵称',
          prop: 'nickname'
        },
        {
          label: '手机号码',
          prop: 'phone_number'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              label: '解除黑名单',
              type: 'remove'
            }
          ]
        }
      ],
      frmRules: {
        activity_id: [
          {
            required: true, message: '请选择活动'
          }
        ],
        nickname: [
          {
            required: true, message: '请输入微信昵称'
          }
        ]
      }
    };
  },
  created() {
    this.getWorks();
    this.getData();
  },
  methods: {
    getData() {
      this.tabLoading = true;
      let src = 'signUp';
      if (this.type === 2) {
        src = 'works';
      } else if (this.type === 3) {
        src = 'comment';
      }
      User[src].blackList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.blackListQueryFrm
      }).then(data => {
        this.tableData = data.result;
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    getWorks() {
      Activity.activity.list({
        pageIndex: this.wotks_page_info.pageIndex,
        pageSize: this.wotks_page_info.pageSize
      }).then(data => {
        this.wotks_page_info = {
          pageIndex: data.pageIndex * 1,
          pageSize: data.pageSize * 1,
          totalCount: data.totalCount * 1
        };
        this.wotks = data.result.map(item => {
          return {
            ...item,
            id: parseInt(item.id)
          };
        });
      });
    },
    searchType() { // 切换黑名单
      this.pageIndex = 1;
      this.totalCount = 0;
      this.getData();
    },
    searchBlackList() {
      this.getData();
    },
    actionHandler(type, info) {
      if (type === 'remove') { // 移除黑名单
        this.$confirm(`确认将 <b>${info.nickname}</b> 移除黑名单吗？`, '移除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let src = 'signUp';
          if (this.type === 2) {
            src = 'works';
          } else if (this.type === 3) {
            src = 'comment';
          }
          User[src].del(info.id)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    currentChangeActivity(e) {
      this.wotks_page_info.pageIndex = e;
      this.getWorks();
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
