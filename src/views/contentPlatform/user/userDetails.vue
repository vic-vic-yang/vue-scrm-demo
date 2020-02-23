<template>
  <div class="app-container" v-loading="pageLoading">
    <detail-card title="基础信息">
      <div class="item-detail-content">
        <p>姓名 : {{ userDetail.user_name ? userDetail.user_name : '--' }}</p>
        <p>{{userDetail.source === 'wb' ? '微博' : '微信'}}昵称 : {{ userDetail.nickname ? userDetail.nickname : '--' }}</p>
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
      <detail-card title="更多信息">
        <custom-el-table
        :tableData="userDetail.playerInfo"
        :tableOptions="tableOptions">
        </custom-el-table>
    </detail-card>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import User from '@/api/contentPlatform/user';
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
            label: '收藏数',
            prop: 'collections'
          },
          {
            label: '浏览次数',
            prop: 'view'
          },
          {
            label: '参加活动数',
            prop: 'activities'
          },
          {
            label: '评论数',
            prop: 'comments'
          }
        ],
        pageLoading: true,
        userDetail: {}
      };
    },
    created() {
      User.get(this.userId)
        .then(res => {
          res.playerInfo = [res.playerInfo];
          this.userDetail = res;
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
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
