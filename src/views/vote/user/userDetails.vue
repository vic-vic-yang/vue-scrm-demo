<template>
  <div class="app-container" v-loading="pageLoading">
    <detail-card title="基础信息">
      <div class="item-detail-content">
        <p>姓名 : {{ userDetail.user_name ? userDetail.user_name : '--' }}</p>
        <p>微信昵称 : {{ userDetail.nickname ? userDetail.nickname : '--' }}</p>
        <span>手机号码 :</span>
        <div class="item-detail">
        <p v-for="(item, index) of userDetail.contacts" :key="index">{{ item.phone ? item.phone : ' --' }}</p>
        </div>
        <span>地址 :</span>
        <div class="item-detail">
        <p v-for="(item, index) of userDetail.contacts" :key="index">{{ item.province || ' --' }}{{ item.city}}{{ item.zone}}{{ item.detail}}</p>
        </div>
      </div>
    </detail-card>
      <detail-card title="比赛信息">
        <custom-el-table
        :tableData="userDetail.playerInfo"
        :tableOptions="tableOptions">
        </custom-el-table>
    </detail-card>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import User from '@/api/vote/user';
  import DetailCard from '@/components/DetailCard';

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
            label: '参加活动数',
            prop: 'activities'
          },
          {
            label: '参加任务数',
            prop: 'missions'
          },
          {
            label: '作品数',
            prop: 'compositions'
          },
          {
            label: '投票数',
            prop: 'tickets'
          }
        ],
        pageLoading: true,
        userDetail: {}
      };
    },
    created() {
      User.get(this.userId)
        .then(res => {
          res.data.playerInfo = [res.data.playerInfo];
          this.userDetail = res.data;
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      // sizeChangeHandler(size) {
      //   this.pageSize = size;
      //   this.pageIndex = 1;
      // },
      // pageChangeHandler(page) {
      //   this.pageIndex = page;
      //   // this.getPlayData();
      // }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.item-detail-content{
    display: flex;
    height: auto;
    span{
      margin-top: 16px;
    }
    p{
        display: inline-block;
        margin-right: 40px;
        margin-bottom: 0;
    }
}
.item-detail{
  display: flex;
  flex-direction: column;
  height: auto;
}
.flex-box-autoFix{
    overflow: hidden;
}
</style>