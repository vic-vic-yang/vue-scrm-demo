<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="prizeFrm"
      :rules="frmRules"
      ref="prizeFrm"
      label-width="140px">
      <el-form-item prop="prize_level_id" label="奖品等级">
        <el-select v-model="prizeFrm.prize_level_id" clearable placeholder="请选择奖品等级">
          <el-option
            v-for="item in levelOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="prize_id" label="奖品选择">
        <el-select v-model="prizeFrm.prize_id"
                   :disabled="action == 'modify' ? true : false"
                   @change="changePrize"
                   clearable
                   placeholder="请选择奖品">
          <el-option
            v-for="item in PrizeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="pageSize"
              :pager-count="Math.ceil(totalCount / pageSize)"
              :current-page="pageIndex"
              @current-change="currentChangePrize"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="奖品未分配数">
        <span class="p-left">{{prizeFrm.unallocated_num}}</span>
      </el-form-item>
      <el-form-item prop="total_num" label="奖品分配数">
        <el-input-number
          v-model="prizeFrm.total_num"
          :min="prizeFrm.use_num * 1 || 0"
          :max="total_num_max"
          placeholder="请输入奖品分配数"
          name="total_num"
          :disabled="total_num_dis ? false : true"
          @change="changeTotalNum">
        </el-input-number>
      </el-form-item>
      <el-form-item label="测算中奖率(%)">
        <span class="p-left">{{prizeFrm.win_percent}}%</span>
      </el-form-item>
      <el-form-item prop="prize_limit_num" label="单人中奖限制">
        <el-input-number
          v-model="prizeFrm.prize_limit_num"
          :min="0"
          placeholder="请输入单人中奖限制"
          name="prize_limit_num">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input
          v-model="prizeFrm.sort"
          placeholder="请输入排序"
          name="sort">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import lotteryPrize from '@/api/integralMall/lotteryPrize';
  import prize from '@/api/integralMall/prize';
  import _ from 'lodash';

  export default {
    name: 'rule_create',
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        rule_id: this.$route.query.rule_id,
        prizeFrm: {
          id: this.$route.params.id || 0,
          prize_level_id: '',
          prize_id: '',
          total_num: 1,
          prize_limit_num: 1,
          sort: '',
          unallocated_num: 0,
          win_percent: 0,
          use_num: 0
        },
        frmRules: {
          prize_level_id: [
            {
              required: true, message: '请选择奖品等级'
            }
          ],
          prize: [
            {
              required: true, message: '请选择奖品'
            }
          ],
          total_num: [
            {
              required: true, message: '请输入奖品分配数'
            }
          ]
        },
        levelOptions: [],
        PrizeOptions: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        total_num: '',
        unallocated_num: '',
        total_num_dis: false
      };
    },
    computed: {
      total_num_max() {
        return this.prizeFrm.unallocated_num * 1 + this.prizeFrm.total_num * 1 || 0;
      }
    },
    created() {
      this.getLevel();
      this.getPrizeOptions();
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') {
          this.total_num = 1;
          this.total_num_dis = false;
          return (this.pageLoading = false);
        }
        lotteryPrize.get({ id: this.prizeFrm.id })
          .then(res => {
            this.prizeFrm = _.assign({}, this.prizeFrm, res.data);
            this.prizeFrm.prize_level_id = this.prizeFrm.prize_level_id * 1;
            this.total_num = res.data.total_num;
            this.unallocated_num = res.data.unallocated_num;
            this.total_num_dis = true;
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      getLevel() {
        lotteryPrize.getLevel()
          .then(res => {
            this.levelOptions = _.assign({}, this.levelOptions, res.data);
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      getPrizeOptions() {
        prize.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.PrizeOptions = (res.result || []).map(item => {
            return {
              id: item.id,
              name: item.name
            };
          });
          this.totalCount = res.totalCount * 1;
        });
      },
      // 获取未分配数
      changePrize(data) {
        this.total_num_dis = true;
        this.prizeFrm.total_num = 1;
        this.total_num = 1;
        lotteryPrize.getUnallocatedNum({
          id: data,
          rule_id: this.rule_id
        }).then(res => {
          this.prizeFrm.unallocated_num = res.data - 1;
          this.unallocated_num = res.data - 1;
        });
      },
      changeTotalNum(data) {
        lotteryPrize.getWinPercent({
          id: this.prizeFrm.id,
          rule_id: this.rule_id,
          num: data
        }).then(res => {
          this.prizeFrm.win_percent = res.data;
          this.prizeFrm.unallocated_num = this.unallocated_num - (this.prizeFrm.total_num - this.total_num);
        });
      },
      currentChangePrize(e) {
        this.pageIndex = e;
        this.getPrizeOptions();
      },
      save() {
        this.$refs.prizeFrm.validate(valid => {
          if (valid) {
            const prizeFrm = Object.assign({}, this.prizeFrm);
            if (this.action === 'add') {
              prizeFrm.rule_id = this.rule_id;
            }
            (this.action === 'modify' ? lotteryPrize.edit(prizeFrm) : lotteryPrize.add(prizeFrm))
              .then(() => {
                this.$router.back();
              });
          }
        });
      }
    }
  };
</script>

<style scoped>
.p-left{
  padding-left: 5px;
}
.article_pages{
  text-align: right;
  margin: 5px 0 0;
}
</style>
