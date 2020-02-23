<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="table">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">操作系统</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.os || ''}}</div></el-col>
      </el-row>
      <el-row class="bg">
        <el-col :span="12"><div class="grid-content bg-purple">运行环境</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.environment || ''}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">PHP允许方式</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.php_run || ''}}</div></el-col>
      </el-row>
      <el-row class="bg">
        <el-col :span="12"><div class="grid-content bg-purple">上传附件限制</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.upload_size_limit || ''}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">执行时间限制</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.exe_time || ''}}</div></el-col>
      </el-row>
      <el-row class="bg">
        <el-col :span="12"><div class="grid-content bg-purple">服务器时间</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.server_time || ''}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">北京时间</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.bj_time || ''}}</div></el-col>
      </el-row>
      <el-row class="bg">
        <el-col :span="12"><div class="grid-content bg-purple">剩余空间</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.remain_space || ''}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">register_globals</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">OFF</div></el-col>
      </el-row>
      <el-row class="bg">
        <el-col :span="12"><div class="grid-content bg-purple">magic_quotes_gpc</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">NO</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">magic_quotes_runtime</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">NO</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">语言变量</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.language}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">管理员</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.administrator}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">在线用户</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">{{system.online_users}}</div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import SYSTEM from '@/api/configure/system';
  export default {
    name: 'systemParameter',
    data() {
      return {
        system: {
          os: '',
          environment: '',
          php_run: '',
          url: '',
          upload_size_limit: '',
          exe_time: '',
          server_time: '',
          bj_time: '',
          remain_space: ''
        },
        pageLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        SYSTEM.parameters().then(res => {
          this.system = res;
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      }
    }
  };
</script>

<style scoped>
  .app-container{
    width: 70%;
    margin-left: 100px;
  }
  .table{
    border-top: 1px solid #EDEDED;
    border-left: 1px solid #EDEDED;
  }
  .bg-purple {
    border-right: 1px solid #EDEDED;
    border-bottom: 1px solid #EDEDED;
    font-weight: bold;
  }
  .bg-purple-light {
    border-right: 1px solid #EDEDED;
    border-bottom: 1px solid #EDEDED;
    font-weight: bold;
  }
  .bg{
    background: #F8F8F8;
  }
  .grid-content {
    height: 50px;
    line-height: 50px;
    text-indent: 16px;
    color: #333;
  }
</style>
