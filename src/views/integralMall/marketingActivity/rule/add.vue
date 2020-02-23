<template>
  <div class="app-container">
    <el-form
      class="activity-edit__form"
      :model="ruleFrm"
      :rules="frmRules"
      ref="ruleFrm"
      label-width="140px">
      <el-form-item prop="name" label="规则名称">
        <el-input v-model="ruleFrm.name" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="抽奖算法">
        <el-radio-group v-model="ruleFrm.type">
          <el-radio :label="1" :disabled="true">平均分布</el-radio>
          <el-radio :label="2">随机分布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="奖品设置" v-show="false">
        <el-button @click="settingPrize">设置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import rule from '@/api/integralMall/rule';
  import _ from 'lodash';

  export default {
    name: 'rule_create',
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        ruleFrm: {
          id: this.$route.params.id || 0,
          name: '',
          type: ''
        },
        frmRules: {
          name: [
            {
              required: true, message: '请输入规则名称'
            }
          ],
          type: [
            {
              required: true, message: '请选择抽奖算法'
            }
          ]
        }
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        rule.get({ id: this.ruleFrm.id })
          .then(res => {
            this.ruleFrm = _.assign({}, this.ruleFrm, res.data);
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      settingPrize() {
        this.$router.push({ name: 'marketingLotteryPrizeList', query: { rule_id: this.ruleFrm.id }});
      },
      save() {
        this.$refs.ruleFrm.validate(valid => {
          if (valid) {
            const ruleFrm = Object.assign({}, this.ruleFrm);
            (this.action === 'modify' ? rule.edit(ruleFrm) : rule.add(ruleFrm))
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

</style>
