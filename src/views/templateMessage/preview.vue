<template>
  <div class="preview">
    <div class="title" v-if="tips">{{tips}}</div>
    <div class="preview-cont">
      <div class="mini-program" v-if="mini_program">
        <span><i class="el-icon-picture-outline-round"></i></span>
        <span> {{mini_program.nick_name}}</span>
      </div>
      <div class="card-title">
        <div>{{title || ''}}</div>
        <small>{{time}}</small>
      </div>
      <div class="card-info">
        <div class="list" v-for="item in preview_list">
          <span class="name">{{item.name}}</span>
          <span class="cont">{{item.example}}</span>
        </div>
      </div>
      <div class="card-detail">
        <span>查看详情</span>
        <span><i class="el-icon-arrow-right"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'preview',
    props: ['preview_list', 'title', 'tips'],
    data() {
      return {
        time: ''
      };
    },
    computed: {
      ...mapState({
        appid: state => state.templateMsg.appid,
        mini_program: state => state.templateMsg.mini_program
      })
    },
    mounted() {
      var date = new Date();
      var month = (date.getMonth() + 1);
      month = month > 10 ? month : '0' + month;
      this.time = date.getFullYear() + '年' + month + '月';
    }
  };
</script>

<style scoped>
  .preview{
    width: 400px;
  }
  .title{
    font-size: 14px;
    color: #606266;
    margin-bottom: 15px;
  }
  .preview-cont{
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .mini-program{
    padding: 15px 20px 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  .mini-program span {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
    font-size: 14px;
    color: #999;
  }
  .mini-program .el-icon-picture-outline-round{
    width: 36px;
    height: 36px;
    border-radius: 100%;
    font-size: 18px;
    background: #D5D5D5;
  }
  .card-title {
    padding: 30px 15px 30px;
    font-size: 14px;
    line-height: 20px;
  }
  .card-title small{
    font-size: 14px;
    color: #999;
  }
  .card-info{
    padding: 0 15px 30px;
    min-height: 260px;
  }
  .list{
    line-height: 20px;
  }
  .list .name{
    display: inline-block;
    min-width: 60px;
    font-size: 14px;
    color: #999;
    margin-right: 15px;
  }
  .list .cont{
    font-size: 14px;
  }
  .card-detail{
    padding: 20px 15px 15px;
    border-top: 1px solid #eee;
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
</style>
