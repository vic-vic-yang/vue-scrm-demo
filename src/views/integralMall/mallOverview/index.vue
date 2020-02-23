<template>
  <div class="app-container mall-overview">
    <div class="control-group mb-20">
      <el-row class="">
        <el-col :span="12">
          <h4 style="display: inline-block">数据概况</h4>
          <div style="display: inline-block" class="grid-content des">更新时间：{{shopping_mall_info.update_time}}</div>
        </el-col>
        <el-col :span="12">
          <el-button style="float: right;" @click="mallEdith">设置</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="总浏览量">
          <count-to class="card-panel-num" :startVal="0" :endVal="shopping_mall_info.view_all * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="访客数">
          <count-to class="card-panel-num" :startVal="0" :endVal="shopping_mall_info.view_user_all * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="积分总消耗">
          <count-to class="card-panel-num" :startVal="0" :endVal="shopping_mall_info.integral_use_all * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="商品兑换数">
          <count-to class="card-panel-num" :startVal="0" :endVal="shopping_mall_info.order_count * 1 || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import shoppingMall from '@/api/integralMall/shoppingMall';
  import { parseTime } from '@/utils';
  import CountTo from 'vue-count-to';

  export default {
    name: 'mall-overview',
    components: {
      CountTo
    },
    data() {
      return {
        shopping_mall_info: {
          view_all: 0,
          view_user_all: 0,
          integral_use_all: 0,
          order_count: 0,
          create_time: '',
          update_time: ''
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        shoppingMall.info().then(res => {
          res.integral_use_all = res.integral_use_all ? Math.abs(res.integral_use_all * 1) : '';
          res.create_time = (res.create_time === '' || res.create_time * 1 === 0) ? '--' : parseTime(res.create_time);
          res.update_time = (res.update_time === '' || res.update_time * 1 === 0) ? '--' : parseTime(res.update_time);
          this.shopping_mall_info = res;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      mallEdith() {
        this.$router.push({ name: 'mallEdith' });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 15px 0;
  }

  .des{
    padding: 15px;
    text-align: right;
    margin-right: 290px;
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
