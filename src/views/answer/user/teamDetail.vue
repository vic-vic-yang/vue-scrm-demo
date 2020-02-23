<template>
  <div class="app-container" v-loading="pageLoading">
    <detail-card :title="teamDetail.teamName">
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="item-detail-content">
            <p>创建时间 : {{ teamDetail.createTime | parseTime}}</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item-detail-content">
            <p>团队积分 : {{teamDetail.teamScore}}</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item-detail-content">
            <p>参加比赛 : {{teamDetail.matchName}}</p>
          </div>
        </el-col>
      </el-row>
    </detail-card>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteMemberHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>

    <user-detail-modal :detail="userDetailInfo" :show.sync="userDetailDialog"></user-detail-modal>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import DetailCard from '@/components/DetailCard';
  import userDetailModal from './userDetailModal';
  import UserManagement from '@/api/answer/userManagement';
  import { parseTime } from '@/utils';

  export default {
    name: 'teamDetail',
    components: {
      customElTable,
      userDetailModal,
      DetailCard
    },
    data() {
      return {
        teamId: this.$route.params.id,
        teamDetail: {},
        tableOptions: [
          {
            label: '编号',
            prop: 'userId',
            width: 80
          },
          {
            label: '用户名',
            prop: 'userName'
          },
          {
            label: '代表团队参赛',
            prop: 'playCount'
          },
          {
            label: '为团队得分',
            prop: 'score'
          },
          {
            label: '加入时间',
            prop: 'createTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                label: '查看详情',
                type: 'detail'
              },
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        pageLoading: true,
        userDetailInfo: {},
        userDetailDialog: false
      };
    },
    created() {
      Promise.all([UserManagement.team.detail(this.teamId), this.getMembersData()])
        .then(res => {
          this.teamDetail = res[0];
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getMembersData() {
        this.tabLoading = true;
        return UserManagement.team.member(this.teamId, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              createTime: parseTime(item.createTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
          return data;
        })
          .catch(err => {
            this.tabLoading = false;
            return Promise.reject(err);
          });
      },
      actionHandler(type, info) {
        if (type === 'detail') {
          this.userDetailInfo = info;
          this.userDetailDialog = true;
        }
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getMembersData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getMembersData();
      },
      deleteMemberHandler(info) {
        this.$confirm(`确认删除团队成员 <b>${info.userName}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          UserManagement.team.delMember(this.teamId, info)
            .then(() => {
              this.getMembersData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
