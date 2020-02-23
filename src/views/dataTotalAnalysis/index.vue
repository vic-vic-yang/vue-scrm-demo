<!--
 * @Description: 
 * @Autor: shao bo
 * @Date: 2019-12-04 19:51:44
 -->
<template>
  <div class="app-container">
    <div
      style="margin-bottom: 40px;margin-bottom: 80px;border-bottom: 1px solid #ddd;padding-bottom: 20px;"
    >
      <h2>新闻发布趋势图</h2>
      <el-form :inline="true">
        <el-form-item label="时间段筛选">
          <el-date-picker
            @change="newsTimeChange"
            v-model="chartsOptions.news_time"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="chartsOptions.newsPicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            align="right"
            style="width: 410px;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div v-show="news_option.xAxis[0].data.length" id="main" style="width: 900px;height: 400px;padding: 10px;"></div>
      <h4 v-show="news_option.xAxis[0].data.length == 0" class="no_data">暂无数据</h4>
    </div>

    <div
      style="margin-bottom: 40px;margin-bottom: 20px;border-bottom: 1px solid #ddd;padding-bottom: 20px;"
    >
      <h2>Top10栏目发布图</h2>
      <el-form :inline="true">
        <el-form-item label="时间段筛选">
          <el-date-picker
            @change="columnTimeChange"
            v-model="chartsOptions.column_time"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="chartsOptions.newsPicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            align="right"
            style="width: 410px;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div id="top" v-show="column_options.xAxis[0].data.length" style="width: 900px;height: 400px;"></div>
      <h4 v-show="column_options.xAxis[0].data.length == 0" class="no_data">暂无数据</h4>
    </div>
  </div>
</template>

<script>
import Api from '@/api/dataStatis/index';
import echarts from 'echarts';
import {parseTime} from '@/utils/index';
export default {
  name: 'contChannel',
  data() {
    return {
      chartsOptions: {
        news_time: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
        column_time: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
        newsPicker: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', [new Date(), new Date()]);
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', [date, date]);
              }
            },
            {
              text: '最近7天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近30天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }
      },
      news_option: {
        title: {
          // text: "趋势图"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['发布量', '浏览量', '次均停留时长']
        },
        toolbox: {
          feature: {
            saveAsImage: {} // 保存为图片
          },
          right: 30
        },
        grid: {
          left: '3%',
          right: '40',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name: '时间',
            type: 'category',
            boundaryGap: false,
            data: [
              // '周一', '周二', '周三', '周四', '周五', '周六', '周日'
            ]
          }
        ],
        yAxis: [
          {
            name: '数量/时间(秒)',
            type: 'value'
          }
        ],
        series: [
          {
            name: '发布量',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [
              // 120, 132, 101, 134, 90, 230, 210
            ],
            smooth: true
          },
          {
            name: '浏览量',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [],
            smooth: true
          },
          {
            name: '次均停留时长',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [],
            smooth: true
          }
        ]
      },
      column_options: {
        title: {
          // text: "top10栏目发布"
        },
        text: '当前时间段暂无数据',
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {} // 保存为图片
          },
          right: 30
        },
        grid: {
          left: '3%',
          right: '50',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name: '栏目名',
            type: 'category',
            data: [
              // '焦点新闻',
              // '官方发布',
              // '赛事项目',
              // '赛事场馆',
              // '世界大运会',
              // '大运故事',
              // '赛事合作'
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '数量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '访问量(次)',
            type: 'bar',
            // barWidth: '60',
            data: [
              // 10, 52, 200, 334, 390, 500, 220
            ]
          }
        ]
      }
    };
  },
  mounted() {
    // this.$nextTick(function() {
    // this.drawPie('main', this.news_option);
    //   this.drawPie('top', this.column_options);
    // });
  },
  created() {
    const start = parseTime(new Date().getTime() - 3600 * 1000 * 24 * 7, '{y}-{m}-{d}');
    const end = parseTime(new Date().getTime(), '{y}-{m}-{d}');
    this.getTop10([start, end]);
    this.getNewsData([start, end]);
  },
  methods: {
    newsTimeChange(timeArr) {
      if (!timeArr) {
        return;
      }
      this.getNewsData(timeArr);
    },
    columnTimeChange(timeArr) {
      if (!timeArr) {
        return;
      }
      this.getTop10(timeArr);
    },
    getNewsData(timeArr) {
      Api.getNewsData({
        type: timeArr[0] === timeArr[1] ? 1 : 5,
        start_time: timeArr[0],
        end_time: timeArr[1]
      }).then(res => {
        const xArr = [];
        const yArr = [[], [], []];

        res.data.map(item => {
          xArr.push(item.t);
          yArr[0].push(Number(item.p_count)); // 发布量
          yArr[1].push(Number(item.v_count)); // 浏览量
          yArr[2].push(Number(item.v_time)); // 停留时长
        });

        this.news_option.xAxis[0].data = xArr;
        this.news_option.series[0].data = yArr[0];
        this.news_option.series[1].data = yArr[1];
        this.news_option.series[2].data = yArr[2];

        this.drawPie('main', this.news_option);
      });
    },
    getTop10(timeArr) { // 获取top10数据
      Api.getTop10({
        type: timeArr[0] === timeArr[1] ? 1 : 5,
        start_time: timeArr[0],
        end_time: timeArr[1]
      }).then(res => {
        const xArr = [];
        const yArr = [];

        res.top.map(item => {
          xArr.push(item.column_name);
          yArr.push(Number(item.count));
        });

        this.column_options.xAxis[0].data = xArr;
        this.column_options.series[0].data = yArr;

        this.drawPie('top', this.column_options);
      });
    },
    drawPie(id, option) { // 画图
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.no_data{
  color: #909399;
}
</style>

