<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="teamListQueryFrm" :model="teamListQueryFrm">
        <el-form-item prop="teamName" label="团队名称">
          <el-input placeholder="团队名称" v-model="teamListQueryFrm.teamName"></el-input>
        </el-form-item>
        <el-form-item prop="matchName" label="参加比赛">
          <el-input placeholder="比赛名称" v-model="teamListQueryFrm.matchName"></el-input>
        </el-form-item>
        <el-form-item prop="memberCount" label="团队人数">
          <el-input style="width: 80px" v-model.number="teamListQueryFrm.memberCount[0]"></el-input>
          <span class="mh-5">-</span>
          <el-input style="width: 80px" v-model.number="teamListQueryFrm.memberCount[1]"></el-input>
        </el-form-item>
        <el-form-item prop="teamScore" label="团队积分">
          <el-input style="width: 80px" v-model.number="teamListQueryFrm.teamScore[0]"></el-input>
          <span class="mh-5">-</span>
          <el-input style="width: 80px" v-model.number="teamListQueryFrm.teamScore[1]"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTeamList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('teamListQueryFrm')" icon="el-icon-search">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import UserManagement from '@/api/answer/userManagement';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'teamList',
    components: {
      customElTable
    },
    data() {
      return {
        teamListQueryFrm: {
          teamName: '',
          matchName: '',
          memberCount: [],
          teamScore: []
        },
        query: null,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '团队名称',
            prop: 'teamName'
          },
          {
            label: '团队人数',
            prop: 'memberCount'
          },
          {
            label: '参加比赛',
            prop: 'matchName'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '团队积分',
            prop: 'teamScore'
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
        UserManagement.team.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              createTime: parseTime(item.createTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchTeamList() {
        this.query = _.cloneDeep(this.teamListQueryFrm);
        const teamScore = this.teamListQueryFrm.teamScore;
        this.$set(this.query, 'teamScoreLow', teamScore[0]);
        this.$set(this.query, 'teamScoreHigh', teamScore[1]);
        const memberCount = this.teamListQueryFrm.memberCount;
        this.$set(this.query, 'memberCountLow', memberCount[0]);
        this.$set(this.query, 'memberCountHigh', memberCount[1]);
        this.pageIndex = 1;
        this.getData();
      },
      deleteHandler(info) {
        this.$confirm(`确认删除团队 <b>${info.teamName}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          UserManagement.team.del(info)
            .then(() => {
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
        if (type === 'detail') {
          this.$router.push({ name: 'teamDetail', params: { id: info.id }});
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
