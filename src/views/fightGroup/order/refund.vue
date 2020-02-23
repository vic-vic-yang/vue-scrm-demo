<template>
  <div class="app-container" v-loading="tabLoading">
    <div class="control-group">
      <el-form :inline="true" :model="refundQueryFrm">
        <el-form-item label="订单号">
          <el-input placeholder="订单号" v-model="refundQueryFrm.search_input"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            :editable="false"
            v-model="refundQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select placeholder="全部" clearable v-model="refundQueryFrm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchOrderList" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding: 15px 0" v-show="refund_show">
      <el-button type="primary" @click="handleRefund">退款</el-button>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @handleSelectionChange="handleSelectionChange"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import order from '@/api/fightGroup/order';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'commodityList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            prop: 'SELECTION'
          },
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '商品',
            prop: 'goods',
            width: 500,
            options: {
              type: 'html'
            }
          },
          {
            label: '价格',
            prop: 'price'
          },
          {
            label: '用户',
            prop: 'user',
            options: {
              type: 'html'
            }
          },
          {
            label: '下单日期',
            prop: 'create_time',
            sortable: true,
            width: 160,
            className: 'ph-6'
          },
          {
            label: '有效期',
            prop: 'validate_time',
            sortable: true,
            width: 160,
            className: 'ph-6'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            prop: 'USER_ACTION',
            width: 150,
            actions: [
              {
                type: 'refund',
                options: this.getStatusBtnInfo
              }
            ]
          }
        ],
        ids: '',
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        refundQueryFrm: {
          search_input: '',
          time: [],
          status: 3
        },
        query: null,
        statusOptions: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '已完成',
            value: 3
          },
          {
            label: '待退款',
            value: 6
          },
          {
            label: '发起退款',
            value: 7
          },
          {
            label: '退款中',
            value: 8
          },
          {
            label: '退款完成',
            value: 9
          }
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      };
    },
    created() {
      this.query = _.cloneDeep(this.refundQueryFrm);
      this.getData();
    },
    computed: {
      refund_show() {
        var data = this.ids.split(',');
        if (this.ids === '') return false;
        if (data.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        order.refund_list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              status_name: item.status_info.status_name,
              price: item.goods_info.price,
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
              validate_time: item.card_detail.validate_time * 1 > 0 ? parseTime(item.card_detail.validate_time) : item.card_detail.validate_time || '--',
              goods: `<div style="display: flex;align-items: center;justify-content: space-between">
                  <div style="width: 180px; margin-left: 30px;"><img style="max-width: 200px;height: auto" src="${item.goods_info.pic[0].file_path}" alt=""/></div>
                  <div style="margin: 0 15px 0 30px;text-align: left">
                    <div>订单号: </div>
                    <span style="display: inline-block;margin-left: 30px;">${item.order_number}</span>
                    <div>${item.goods_info.name}</div>
                  </div>
                  </div>`,
              user: `<div>${item.user_name}</div>
                    <div>${item.phone}</div>`
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchOrderList() {
        this.query = _.cloneDeep(this.refundQueryFrm);
        if (this.query.search_input) {
          this.query.search_type = 1;
        }
        const time = this.query.time;
        this.$set(this.query, 'order_start_time', time[0] || '');
        this.$set(this.query, 'order_end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'refund') {
          const title = '退款';
          this.ids = '' + info.id;
          this.$confirm(`确认立即${title}此订单吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            order.refund({ ids: this.ids })
              .then((result) => {
                console.log(result);
                if (result.status === 1) {
                  this.$message({
                    type: 'success',
                    message: '退款成功'
                  });
                  this.getData();
                } else {
                  this.$message({
                    type: 'error',
                    message: result.fail_message && result.fail_message[0] || '退款失败'
                  });
                }
              }).catch(() => {
                this.$message({
                  type: 'error',
                  message: '退款失败'
                });
              });
          }).catch(() => {
            this.$message({
              type: 'error',
              message: `已取消${title}`
            });
          });
        }
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      handleSelectionChange(data) {
        this.ids = (data.map(pic => pic.id)).join(',');
      },
      handleRefund() {
        this.$confirm(`确认立即退款选择的订单吗？`, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          order.refund({ ids: this.ids })
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退款'
          });
        });
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'primary',
            label: '退款'
          };
        }
        const status = item.status_info.status * 1;
        if (status === 3) {
          return {
            btn: 'primary',
            label: '退款'
          };
        } else {
          return false;
        }
      }
    }
  };
</script>

<style scoped>
</style>
