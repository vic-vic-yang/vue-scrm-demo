<template>
  <div class="app-container integral-list">
    <div class="control-group mb-20">
      <el-row class="">
        <el-col :span="16"><div class="grid-content title">积分数据总览</div></el-col>
        <el-col :span="3" :offset="4">
          <div class="grid-content des">
            <el-button @click="go_integral_details">积分明细</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已领取积分">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.integral_in * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已完成任务数">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.finish_mission_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已完成任务用户数">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.finish_mission_user_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="总剩余积分">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.integral_left * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已消耗积分">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.integral_out * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已兑换交易数">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.finish_change_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已完成兑换用户数">
          <count-to class="card-panel-num" :startVal="0" :endVal="integral_info.finish_change_user_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import integral from '@/api/integralMall/integral';
  import CountTo from 'vue-count-to';

  export default {
    name: 'integral-list',
    components: {
      CountTo
    },
    data() {
      return {
        integral_info: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        integral.overView().then(res => {
          res.data.integral_out = Math.abs(res.data.integral_out * 1);
          this.integral_info = res.data;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      go_integral_details() {
        this.$router.push({ name: 'integralDetails' });
      }
    }
  };
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    overflow: hidden;
  }

  .title{
    font-weight: bold;
    padding: 15px;
    margin-top: 10px;
  }

  .des{
    padding: 15px;
  }
  .header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
