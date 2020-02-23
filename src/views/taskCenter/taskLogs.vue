<template>
  <div class="app-container task-list">
    <div class="header">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="grid-content bg-purple" style="padding-left: 10px;">
            <div style="font-size: 16px;margin-top: 10px;" class="task-btn">任务数据总览</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="12">
          <div class="grid-content bg-purple" style="text-align: right;">
            <el-button class="task-btn" @click="go_log_details">数据详情</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div class="text item">
            <p class="text1">已完成任务数</p>
            <p class="text2" v-if="logsAbove">{{logsAbove.finish_mission_count || 0}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="text item">
            <p class="text1">已完成任务用户数</p>
            <p class="text2" v-if="logsAbove">{{logsAbove.finish_user_count || 0}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="text item">
            <p class="text1">用户已获得积分</p>
            <p class="text2" v-if="logsAbove">{{logsAbove.user_get_integral || 0}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="text item">
            <p class="text1">用户已获得红包额</p>
            <p class="text2" v-if="logsAbove">{{logsAbove.user_get_red_pack || 0}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import missionTask from '@/api/task/index';

  export default {
    name: 'taskOverview',
    components: {
    },
    data() {
      return {
        logsAbove: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        missionTask.getLogsAbove().then(res => {
          this.logsAbove = res;
        });
      },
      go_log_details() {
        this.$router.push({name: 'taskLogsDetails'});
      }
    }
  };
</script>


<style scoped>
  .header{
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  .task-btn{
    color: #000;
  }

  .pagination-wrapper {
    margin: 20px 0;
  }
  .text1,.text2{
    text-align: center;
    font-size: 16px;
  }
</style>
