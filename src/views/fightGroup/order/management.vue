<template>
  <div class="app-container">
    <div class="control-group mb-20">
    <el-button type="primary" @click="goToOrderList">
      <i class="el-icon-search mr-5 fs-13"></i> 查看全部订单
    </el-button>
  </div>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="七天下单笔数">
          <count-to class="card-panel-num" :startVal="0" :endVal="managementData.order_7_count || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="待付款">
          <count-to class="card-panel-num" :startVal="0" :endVal="managementData.wait_pay || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="待发货">
          <count-to class="card-panel-num" :startVal="0" :endVal="managementData.wait_delivery || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="box-card mb-20" header="退款维权">
          <count-to class="card-panel-num" :startVal="0" :endVal="managementData.refund || 0" :duration="2600"></count-to>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-20" shadow="hover">
      <div slot="header" class="clearfix">
        <span>下单统计</span>
        <p class="text-999"><small>昨日下单笔数：{{managementData.yesterday_order}} 昨日付款订单：{{managementData.yesterday_pay}}</small></p>
      </div>
      <div class="order-statics-chart" ref="orderStaticsChart" style="width: 100%;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import CountTo from 'vue-count-to';
  import Order from '@/api/fightGroup/order';
  // import { parseTime } from '@/utils';
  // import _ from 'lodash';

  export default {
    name: 'orderManagement',
    components: {
      CountTo
    },
    data() {
      return {
        pageLoading: true,
        managementData: {},
        staticsChart: null
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        Order.management().then(data => {
          this.managementData = data;
          data.count && this.createChart(data);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      goToOrderList() {
        this.$router.push({ name: 'fightGroupOrderList' });
      },
      getXAxis(data) {
        const xAxis = [];
        const order = [];
        const pay = [];
        for (const date in data) {
          const temp = data[date];
          xAxis.push(date);
          order.push(temp.order);
          pay.push(temp.order_pay);
        }
        return {
          xAxis: xAxis,
          order: order,
          pay: pay
        };
      },
      createChart(data) {
        const chartData = this.getXAxis(data.count);
        const orderStaticsChart = this.$refs.orderStaticsChart;
        this.staticsChart = echarts.init(orderStaticsChart);
        this.staticsChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['下单笔数', '付款订单']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '下单笔数',
              type: 'line',
              data: chartData.order
            },
            {
              name: '付款订单',
              type: 'line',
              data: chartData.pay
            }
          ]
        });
        window.addEventListener('resize', () => {
          this.staticsChart.resize();
        });
      }
    }
  };
</script>
