<template>
    <div class="app-container user-details">
      <div style="text-align: right;margin-right: 50px;">
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </div>
      <header>基础信息</header>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="用户姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="微信昵称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="联系人姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
      <header class="integral-header">积分信息</header>
      <el-row>
        <el-col :span="4"><div class="font-style">积分余额： {{user_integral.integral * 1 - user_integral.use_integral * 1 || 0}}</div></el-col>
        <el-col :span="4"><div class="font-style">已兑换积分： {{user_integral.use_integral || 0}}</div></el-col>
        <el-col :span="4"><div class="font-style">已兑换次数： {{user_integral_count.order_count || 0}}</div></el-col>
        <el-col :span="4"><div class="font-style">已领取积分： {{user_integral.integral || 0}}</div></el-col>
        <el-col :span="4"><div class="font-style">已领取任务数： {{user_integral_count.mission_count || 0}}</div></el-col>
      </el-row>
    </div>
</template>

<script>
import user from '@/api/user/user';

export default {
  name: 'userDetails',
  data() {
    return {
      id: this.$route.params.id || 0,
      tableData: [],
      user_base_info: {},
      user_integral: {},
      user_integral_count: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      user.details(this.id).then(res => {
        this.user_base_info = res.user_base_info;
        this.user_integral = res.user_integral ? res.user_integral : {
          integral: 0,
          use_integral: 0
        };
        this.user_integral_count = res.user_integral_count;
        this.tableData = res.user_contact_info.map((item, index) => {
          if (index >= 1) {
            return {
              ...item,
              id: '',
              user_name: '',
              nickname: '',
              name: item.name,
              phone: item.phone,
              address: `${item.province === item.city ? item.province : item.province + item.city}${item.zone}${item.detail}`
            };
          }
          return {
            ...item,
            id: item.user_id,
            user_name: res.user_base_info.user_name,
            nickname: res.user_base_info.nickname,
            name: item.name,
            phone: item.phone,
            address: `${item.province === item.city ? item.province : item.province + item.city}${item.zone}${item.detail}`
          };
        });
      }).catch(err => {
        this.$message({
          type: 'info',
          message: err.message
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  header{
    padding: 15px 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: 400;
    color: #1f2f3d;
  }
  .integral-header{
    margin-top: 80px;
    border-top: 1px solid #e7e7e7;
    padding-top: 30px;
  }
  .font-style{
    font-size: 14px;
    color: #606266;
  }
</style>
