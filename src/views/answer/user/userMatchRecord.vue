<template>
  <div class="app-container" v-loading="pageLoading">
    <detail-card :title="userDetail.userName">
      <div class="item-detail-content">
        <p>创建时间 : {{ userDetail.createTime | parseTime}}</p>
      </div>
    </detail-card>
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
</template>

<script>
  import customElTable from '@/components/customElTable';
  import UserManagement from '@/api/answer/userManagement';
  import DetailCard from '@/components/DetailCard';
  import { parseTime } from '@/utils';

  export default {
    name: 'userMatchRecord',
    components: {
      DetailCard,
      customElTable
    },
    data() {
      return {
        userId: this.$route.params.id,
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '参赛时间',
            prop: 'playTime',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '比赛名称',
            prop: 'matchName'
          },
          {
            label: '游戏模式',
            prop: 'matchMode'
          },
          {
            label: '比赛模式',
            prop: 'matchType'
          },
          {
            label: '比赛对手',
            prop: 'opponentName'
          },
          {
            label: '比赛结果',
            prop: 'resultTxt',
            options: {
              type: 'tag',
              prop: 'result'
            },
            width: 120
          },
          {
            label: '获得积分',
            prop: 'winScore'
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        pageLoading: true,
        userDetail: {}
      };
    },
    created() {
      Promise.all([UserManagement.user.get(this.userId), this.getPlayData()])
        .then(res => {
          this.userDetail = res[0];
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getPlayData() {
        this.tabLoading = true;
        return UserManagement.user.playList(this.userId, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              result: item.result < 0 ? 0 : 1,
              resultTxt: item.result < 0 ? '负' : '胜',
              playTime: parseTime(item.playTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(err => {
            this.tabLoading = false;
            return Promise.reject(err);
          });
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getPlayData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getPlayData();
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
