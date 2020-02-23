<template>
  <div class="app-container" v-loading="pageLoading">
    <header>
      基本信息
      <el-button style="float: right; margin: 13px 20px 0 0" @click="$router.back()">返回</el-button>
    </header>
    <el-card class="box-card">
      <el-row v-if="userDetails.user_base_info">
        <el-col :span="4"><div class="grid-content">{{userDetail.user_base_info.source === 'wb' ? '微博' : '微信'}}昵称：{{userDetails.user_base_info.nickname}}</div></el-col>
        <el-col :span="6"><div class="grid-content">用户名：{{address.name}}</div></el-col>
        <el-col :span="6"><div class="grid-content">手机号：{{address.phone}}</div></el-col>
      </el-row>
      <el-row v-if="userDetails.user_contact_info && userDetails.user_integral">
        <el-col :span="4"><div class="grid-content">来源渠道：{{channel}}</div></el-col>
        <el-col :span="6"><div class="grid-content">联系地址：{{address.province}}{{address.city}}{{address.zone}}{{address.detail}}</div></el-col>
        <el-col :span="6"><div class="grid-content">积分值：{{userDetails.user_integral.integral * 1}}</div></el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <div class="bold">积分信息</div>
        <div class="small"><el-button @click="viewAddress(0)" type="text">多个联系地址</el-button></div>
      </div>
      <el-row v-if="userDetails.user_integral">
        <el-col :span="4">
          <div class="grid-content bolder center">{{userDetails.user_integral.integral * 1}}</div>
          <div class="grid-content center">积分余额</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bolder center">{{userDetails.user_integral.integral * 1 + userDetails.user_integral.use_integral * 1}}</div>
          <div class="grid-content center">已领取积分</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bolder center">{{userDetails.user_integral.mission_count}}</div>
          <div class="grid-content center">已领取任务数</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bolder center">{{userDetails.user_integral.use_integral * 1}}</div>
          <div class="grid-content center">已消耗积分</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bolder center">{{userDetails.user_integral.order_count}}</div>
          <div class="grid-content center">兑换商品次数</div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <div class="bold">答题信息</div>
        <div class="small"></div>
      </div>
      <el-row v-if="userDetails.answer_info">
        <el-col :span="4"><div class="grid-content">比赛总数：{{userDetails.answer_info.match_count}}</div></el-col>
        <!--<el-col :span="4"><div class="grid-content">胜负次数比：{{userDetails.answer_info.match_count}}</div></el-col>-->
        <el-col :span="4"><div class="grid-content">团队赛次数：{{userDetails.answer_info.team_play_count}}</div></el-col>
        <el-col :span="4"><div class="grid-content">加入团队数：{{userDetails.answer_info.join_team_count}}</div></el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <div class="bold">拼团信息</div>
        <div class="small"><el-button @click="viewAddress(1)" type="text">多个联系地址</el-button></div>
      </div>
      <el-row v-if="userDetails.group_info">
        <el-col :span="4"><div class="grid-content">拼团次数：{{userDetails.group_info.group_success_count * 1  + userDetails.group_info.group_fail_count * 1 }}</div></el-col>
        <el-col :span="18"><div class="grid-content">拼团成功/失败比：{{userDetails.group_info.group_success_count * 1}} : {{userDetails.group_info.group_fail_count * 1}}</div></el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" v-show="false">
      <div slot="header" class="card-header">
        <div class="bold">投票信息</div>
        <div class="small"><el-button @click="viewAddress(2)" type="text">多个联系地址</el-button></div>
      </div>
      <el-row>
        <el-col :span="4"><div class="grid-content">参加活动数：</div></el-col>
        <el-col :span="4"><div class="grid-content">参加任务数：</div></el-col>
        <el-col :span="4"><div class="grid-content">作品数：</div></el-col>
        <el-col :span="4"><div class="grid-content">投票数：</div></el-col>
      </el-row>
    </el-card>
    <el-dialog width="50%" title="联系地址" :visible.sync="dialogTableVisible">
      <custom-el-table
        v-loading="tabLoading"
        :tableData="tableData"
        :tableOptions="tableOptions">
      </custom-el-table>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import UserManagement from '@/api/user/user';

  export default {
    name: 'userDetails',
    components: {
      customElTable
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: false,
        dialogTableVisible: false,
        action: action,
        userDetails: {
          id: this.$route.params.id || 0
        },
        channel: this.$route.query.channel || '',
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '联系人姓名',
            prop: 'name'
          },
          {
            label: '联系人电话',
            prop: 'phone'
          },
          {
            label: '联系人地址',
            prop: 'address'
          }
        ],
        tableData: [],
        tabLoading: true
      };
    },
    computed: {
      address() {
        var data = {
          name: '',
          phone: '',
          address: ''
        };
        if (this.userDetails.user_contact_info && this.userDetails.user_contact_info.length > 0) {
          this.userDetails.user_contact_info.map(item => {
            if (item.default * 1 === 1) {
              data = item;
            } else {
              data = this.userDetails.user_contact_info[0];
            }
          });
        }
        return data;
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        UserManagement.common_details({ id: this.userDetails.id }).then(res => {
          this.userDetails = Object.assign(this.userDetails, res);
          this.pageLoading = false;
        });
      },
      viewAddress(type) {
        this.dialogTableVisible = true;
        this.tableData = (this.userDetails.user_contact_info || []).map(item => {
          return {
            ...item,
            address: (item.province + item.city + item.zone + item.detail) || ''
          };
        });
        this.tabLoading = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  header {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    padding-left: 50px;
    line-height: 60px;
  }
  .box-card{
    width: 98%;
    margin: 30px auto;
  }
  .grid-content{
    color: #333;
    font-size: 14px;
    padding: 15px;
  }
  .bolder{
    font-weight: bold;
  }
  .center{
    text-align: center;
  }
  .el-card__header{
    background-color: #E9EEF3;
  }
  .card-header{
    width: 100%;
    color: #333;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;;
    align-items: center;
    .bold{
      font-size: 16px;
    }
    .small{
      font-size: 14px;
    }
  }
</style>
