<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :model="prizeRuleFrm"
      :rules="frmRules"
      ref="prizeRuleFrm"
      label-width="130px">
      <el-form-item prop="level" label="奖项等级">
        <el-select v-model="prizeRuleFrm.level" placeholder="请选择">
          <el-option
            v-for="item in levelsOptions"
            :key="item.id+''"
            :label="item.name"
            :value="item.id+''">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="prize_inventory_id" label="奖品">
        <el-select
          v-model="prizeRuleFrm.prize_inventory_id"
          placeholder="请选择"
          @change="prizeInventoryChange">
          <el-option
            v-for="item in prizeOptions"
            :key="item.id+''"
            :label="item.name"
            :value="item.id+''">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="奖品未分配数">
        <span>{{unassigned}}</span>
      </el-form-item>
      <el-form-item prop="assigned_num" label="奖品分配数">
        <el-input-number
          :min="0"
          :max="unassigned"
          @change="getFinalProbability"
          v-model="prizeRuleFrm.assigned_num">
        </el-input-number>
      </el-form-item>
      <el-form-item label="测算中奖率(%)">
        <span>{{calculate_probability}}%</span>
      </el-form-item>
      <el-form-item prop="probability_set" label="自定义中奖概率(%)">
        <el-input-number
          :min="0"
          v-model="prizeRuleFrm.probability_set">
        </el-input-number>
      </el-form-item>
      <el-form-item label="最终中奖概率(%)">
        <span>{{final_probability}}%</span>
      </el-form-item>
      <el-form-item prop="user_limit" label="单人中奖限制">
        <el-input-number
          v-model="prizeRuleFrm.user_limit">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="stat_type" label="单人统计标识">
        <el-checkbox-group v-model="prizeRuleFrm.stat_type">
          <el-checkbox :label="1">微信OpenID</el-checkbox>
          <el-checkbox :label="2">手机号</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="is_send_text" label="发送中奖短信">
        <el-radio
          v-model="prizeRuleFrm.is_send_text"
          :label="0">否
        </el-radio>
        <el-radio
          v-model="prizeRuleFrm.is_send_text"
          :label="1">是
        </el-radio>
      </el-form-item>
      <el-form-item prop="text_content" label="短信内容">
        <el-input
          type="textarea"
          :rows="2"
          name="text_content"
          :disabled="prizeRuleFrm.is_send_text===0"
          placeholder="默认公司名称请以##mCoName##替代，默认奖品名称请以##mPrizeName##替代，兑奖码请以##mValidationCode##替代。"
          v-model="prizeRuleFrm.text_content">
        </el-input>
      </el-form-item>
      <el-form-item prop="equal_prizes" label="可替换奖品列表">
        <el-select
          class="d-block"
          v-model="prizeRuleFrm.equal_prizes"
          multiple
          default-first-option
          placeholder="请选择可替换奖品">
          <el-option
            v-for="item in prizeOptions"
            :key="item.id+''"
            :label="item.name"
            :value="item.id+''">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="启用商品">
        <el-radio
          v-model="prizeRuleFrm.status"
          :label="0">停用
        </el-radio>
        <el-radio
          v-model="prizeRuleFrm.status"
          :label="1">启用
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop.prevent="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { PrizeRule } from '@/api/lottery/lotteryRule';
  import { PrizeInventory } from '@/api/lottery/prize';

  export default {
    name: 'editor',
    components: {},
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        prizeRuleFrm: {
          id: this.$route.params.id || 0,
          level: '',
          prize_inventory_id: '',
          assigned_num: 0,
          probability_set: 0,
          user_limit: 0,
          stat_type: [],
          is_send_text: 0,
          text_content: '',
          equal_prizes: [],
          status: 0,
          lottery_rule_id: this.$route.query.lotteryRuleId
        },
        unassigned: 0,
        final_probability: 0,
        calculate_probability: 0,
        frmRules: {
          level: [
            {
              required: true, message: '奖项等级为必选项'
            }
          ],
          prize_inventory_id: [
            {
              required: true, message: '奖品为必选项'
            }
          ],
          probability_set: [
            { validator: this.checkProbability, trigger: 'blur' }
          ],
          name: [
            {
              required: true, message: '名称必填'
            }
          ]
        },
        levelsOptions: [],
        prizeOptions: []
      };
    },
    created() {
      Promise.all([
        PrizeRule.getPrizesList(),
        PrizeRule.getLevelsList(),
        this.getDetail()])
        .then(res => {
          this.prizeOptions = res[0];
          this.levelsOptions = res[1];
          this.pageLoading = false;
        });
    },
    methods: {
      getDetail() {
        if (this.action !== 'modify') return;
        return PrizeRule.get(this.prizeRuleFrm.id)
          .then(res => {
            const prizeRule = res.prize_rule;
            this.unassigned = res.unassigned;
            this.final_probability = res.final_probability;
            this.calculate_probability = res.calculate_probability;
            const statType = prizeRule.stat_type * 1;
            this.prizeRuleFrm = {
              id: prizeRule.id,
              level: prizeRule.level + '',
              prize_inventory_id: prizeRule.prize_inventory_id + '',
              assigned_num: prizeRule.assigned_num,
              probability_set: prizeRule.probability_set,
              user_limit: prizeRule.user_limit,
              stat_type: statType === 3 ? [1, 2] : statType === 0 ? [] : [statType],
              is_send_text: prizeRule.is_send_text,
              text_content: prizeRule.text_content,
              equal_prizes: prizeRule.equal_prizes ? prizeRule.equal_prizes.split(',') : [],
              is_none_prize: prizeRule.is_none_prize,
              status: prizeRule.status,
              lottery_rule_id: res.lottery_rule_id || this.prizeRuleFrm.lottery_rule_id
            };
            return res;
          })
          .catch(() => {
            this.$alert('数据获取失败，返回抽奖规则列表页面', '错误', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.replace({ name: 'lotteryRule' });
              }
            });
          });
      },
      save() {
        const prizeRuleFrmData = Object.assign({}, this.prizeRuleFrm);
        prizeRuleFrmData.equal_prizes = prizeRuleFrmData.equal_prizes.join(',');
        const prizeStatTypeLen = prizeRuleFrmData.stat_type.length;
        prizeRuleFrmData.stat_type = prizeStatTypeLen === 0 ? 0 : prizeStatTypeLen === 2 ? 3 : prizeRuleFrmData.stat_type[0] * 1;
        this.$refs.prizeRuleFrm.validate(valid => {
          if (valid) {
            PrizeRule.operation(prizeRuleFrmData).then(res => {
              this.$router.back();
            });
          }
        });
      },
      getFinalProbability(assigned_num) {
        PrizeRule.getFinalProbability({
          lotteryRuleId: this.prizeRuleFrm.lottery_rule_id,
          prizeRuleId: this.prizeRuleFrm.id,
          assignNum: assigned_num
        }).then(res => {
          this.calculate_probability = res.calculate_probability * 1;
          this.final_probability = this.final_probability || res.final_probability * 1;
        });
      },
      checkProbability(rule, value, callback) {
        PrizeRule.checkProbability({
          lotteryRuleId: this.prizeRuleFrm.lottery_rule_id,
          prizeRuleId: this.prizeRuleFrm.id,
          probabilitySet: value
        })
          .then(() => {
            this.final_probability = value;
            callback();
          })
          .catch(() => {
            callback(new Error('自定义概率校验失败，请重新输入'));
          });
      },
      prizeInventoryChange(id) {
        PrizeInventory.get(id).then(res => {
          this.unassigned = res.total - res.assigned_count;
        });
      }
    }
  };
</script>

<style scoped>

</style>
