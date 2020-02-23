<template>
  <div class="app-container task-list">
    <div class="control-group mb-20">
      <el-row class="">
        <el-col :span="16"><div class="grid-content title">任务数据总览</div></el-col>
        <el-col :span="3" :offset="4">
          <div class="grid-content des">
            <el-button @click="go_integral_details">数据详情</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已完成任务数">
          <count-to class="card-panel-num" :startVal="0" :endVal="task_info.finish_mission_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="已完成任务用户数">
          <count-to class="card-panel-num" :startVal="0" :endVal="task_info.mission_user_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="用户已获取积分">
          <count-to class="card-panel-num" :startVal="0" :endVal="task_info.get_integral_all * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import integralTask from '@/api/integralMall/task';
  import CountTo from 'vue-count-to';

  export default {
    name: 'taskOverview',
    components: {
      CountTo
    },
    data() {
      return {
        task_info: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        integralTask.overView().then(res => {
          this.task_info = res.data;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      go_integral_details() {
        this.$router.push({ name: 'integralTaskDetails' });
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
