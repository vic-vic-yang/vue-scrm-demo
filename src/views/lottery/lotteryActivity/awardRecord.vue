<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="control-group">
      <el-form :inline="true">
        <el-form-item>
          <el-select
            v-model="searchFrm.activity_id"
            placeholder="活动名称">
            <el-option
              v-for="item in activityMenuOptions"
              :key="item.id"
              :label="item.act_name"
              :value="item.id*1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchFrm.prize_type"
            placeholder="奖品类型"
            @change="prizeTypeChange">
            <el-option
              v-for="item in $store.getters.prizeTypeFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchFrm.is_send" placeholder="发货状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchFrm.prize_template_id" placeholder="奖品">
            <el-option
              v-for="item in prizeTemplateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchFrm.start_date"
            type="datetime"
            :editable="false"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            placeholder="开始日期"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchFrm.end_date"
            type="datetime"
            :editable="false"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            placeholder="结束日期"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAwardRecord" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
      @cell-click="tabCellClickHandler">
    </custom-el-table>
    <el-dialog
      class="deliver-preview-dialog"
      title="发货管理"
      :visible.sync="previewDialogVisible">
      <el-form
        :model="deliverFrm"
        label-width="80px">
        <el-form-item label="状态">
          <el-radio
            v-model="deliverFrm.is_send"
            :label="1">已发货
          </el-radio>
          <el-radio
            v-model="deliverFrm.is_send"
            :label="2">未发货
          </el-radio>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-input
            v-model="deliverFrm.expressage"
            name="expressage"
            placeholder="物流公司">
          </el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input
            v-model="deliverFrm.expressage_code"
            name="expressage_code"
            placeholder="物流单号">
          </el-input>
        </el-form-item>
        <el-form-item label="发货日期">
          <el-date-picker
            v-model="deliverFrm.send_time"
            type="datetime"
            :editable="false"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            placeholder="发货日期"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deliverManageHandler">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import { PrizeTemplate } from '@/api/lottery/prize';
  import lotteryActivityManager from '@/api/lottery/lotteryActivityManager';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'awardRecord',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: '50'
          },
          {
            label: '活动名称',
            prop: 'activity_name'
          },
          {
            label: '中奖规则',
            prop: 'rule_name'
          },
          {
            label: '奖品类型',
            prop: 'prize_type_name'
          },
          {
            label: '奖项等级',
            prop: 'prize_level_name'
          },
          {
            label: '奖品/金额(元)',
            prop: 'prize_info'
          },
          {
            label: '发货状态',
            prop: 'deliver_status_text',
            options: {
              type: 'tag',
              prop: 'deliver_status'
            }
          },
          {
            label: '用户ID',
            prop: 'user_id'
          },
          {
            label: '记录时间',
            prop: 'prize_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        pageLoading: true,
        previewDialogVisible: false,
        previewRecord: {},
        activityMenuOptions: [],
        statusOptions: [
          {
            value: 0,
            label: '所有'
          },
          {
            value: 1,
            label: '已发货'
          },
          {
            value: 2,
            label: '待发货'
          }
        ],
        prizeTemplateOptions: [],
        searchFrm: {
          activity_id: this.$route.params.activityId * 1,
          prize_type: 0,
          is_send: 0,
          prize_template_id: 0,
          start_date: '',
          end_date: ''
        },
        searchQuery: {
          activity_id: this.$route.params.activityId * 1,
          prize_type: 0,
          is_send: 0,
          prize_template_id: 0,
          start_date: '',
          end_date: ''
        },
        deliverFrm: {
          is_send: 1,
          expressage: '',
          expressage_code: '',
          send_time: ''
        }
      };
    },
    created() {
      Promise.all([
        lotteryActivityManager.selectList(),
        PrizeTemplate.selectList(0),
        this.getData()
      ]).then(res => {
        res[1].unshift({ id: 0, name: '全部' });
        this.activityMenuOptions = res[0];
        this.prizeTemplateOptions = res[1];
        this.pageLoading = false;
      });
    },
    methods: {
      getData() {
        this.tabLoading = true;
        const query = _.assign({}, this.searchQuery);
        query.start_date !== '' && (query.start_date /= 1000);
        query.end_date !== '' && (query.end_date /= 1000);
        return lotteryActivityManager.awardRecord({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            const isSend = item.deliver_msg ? item.deliver_msg.is_send * 1 : 2;
            return _.merge(item, {
              prize_type_name: this.$store.getters.getPrizeType(item.prize_type).label,
              prize_info: `${item.prize_name} / ${item.prize_price}元`,
              deliver_status: isSend === 1 ? 1 : 0,
              deliver_status_text: isSend === 1 ? '已发货' : '待发货',
              prize_time: parseTime(item.prize_time)
            });
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
          return data;
        }).catch(err => {
          this.tabLoading = false;
          return err;
        });
      },
      tabCellClickHandler(prop, item) {
        if (prop === 'deliver_status_text') {
          this.previewRecord = item;
          const deliver_msg = item.deliver_msg;
          if (deliver_msg) {
            this.deliverFrm = {
              is_send: deliver_msg.is_send * 1,
              expressage: deliver_msg.expressage,
              expressage_code: deliver_msg.expressage_code,
              send_time: deliver_msg.send_time || ''
            };
          } else {
            this.deliverFrm = {
              is_send: 2,
              expressage: '',
              expressage_code: '',
              send_time: ''
            };
          }
          this.previewDialogVisible = true;
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
      searchAwardRecord() {
        this.searchQuery = Object.assign({}, this.searchFrm);
        this.getData();
      },
      prizeTypeChange(val) {
        PrizeTemplate.selectList(val).then(res => {
          res.unshift({ id: '', name: '全部' });
          this.prizeTemplateOptions = res;
        });
      },
      deliverManageHandler() {
        const deliverFrm = Object.assign({}, this.deliverFrm);
        deliverFrm.prize_record_id = this.previewRecord.id;
        deliverFrm.send_time !== '' && (deliverFrm.send_time /= 1000);
        lotteryActivityManager
          .deliverManagement(deliverFrm)
          .then(() => {
            this.getData();
            this.previewRecord = {};
            this.previewDialogVisible = false;
          });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
