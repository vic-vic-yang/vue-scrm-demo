<template>
  <div class="app-container">
    <el-form
      :model="ruleFrm"
      :rules="frmRules"
      ref="ruleFrom"
      label-width="80px">
      <el-form-item prop="name" label="规则名称">
        <el-input
          v-model="ruleFrm.name"
          placeholder="请输入抽奖规则名称"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="algorithm" label="抽奖算法">
        <el-radio
          v-model="ruleFrm.algorithm"
          :label="1">平均分布</el-radio>
        <el-radio
          v-model="ruleFrm.algorithm"
          :label="2">绝对随机</el-radio>
      </el-form-item>
      <el-form-item prop="filter_user" label="用户过滤">
        <el-radio
          v-model="ruleFrm.filter_user"
          :label="0">无</el-radio>
        <el-radio
          v-model="ruleFrm.filter_user"
          :label="1">黑名单</el-radio>
        <el-radio
          v-model="ruleFrm.filter_user"
          :label="2">会员组</el-radio>
      </el-form-item>
      <el-form-item prop="info" label="规则备注">
        <el-input
          type="textarea"
          :rows="2"
          name="info"
          placeholder="请输入抽奖规则介绍"
          v-model="ruleFrm.info">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop.prevent="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { LotteryRule } from '@/api/lottery/lotteryRule';
export default {
  name: 'editor',
  components: {
  },
  data() {
    return {
      action: this.$route.params.id ? 'modify' : 'add',
      avatarAction: '/fileUpload/fileUpload/upload',
      ruleFrm: {
        id: this.$route.params.id || 0,
        name: '',
        algorithm: 1,
        filter_user: 0,
        info: ''
      },
      frmRules: {
        name: [
          {
            required: true, message: '名称必填'
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
      if (this.action !== 'modify') return;
      LotteryRule.get(this.ruleFrm.id)
        .then(res => {
          this.ruleFrm = {
            id: res.id,
            name: res.name,
            algorithm: res.algorithm,
            filter_user: res.filter_user,
            info: res.info
          };
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
      this.$refs.ruleFrom.validate(valid => {
        if (valid) {
          LotteryRule.operation(this.ruleFrm).then(res => {
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
