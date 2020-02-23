<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :model="templateFrm"
      :rules="frmRules"
      ref="templateForm"
      label-width="80px">
      <el-form-item prop="prize_type" label="奖品类型">
        <el-select v-model="templateFrm.prize_type" placeholder="请选择">
          <el-option
            v-for="item in prizeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="奖品名称">
        <el-input
          v-model="templateFrm.name"
          placeholder="请输入奖品名称"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <template v-if="templateFrm.prize_type===2">
        <el-form-item prop="merchant_name" label="商户名称">
          <el-input
            v-model="templateFrm.merchant_name"
            name="merchant_name"
            placeholder="红包商户名称显示">
          </el-input>
        </el-form-item>
        <el-form-item prop="activity_name" label="活动名称">
          <el-input
            v-model="templateFrm.activity_name"
            name="activity_name"
            placeholder="例如可以填写促销活动的名称">
          </el-input>
        </el-form-item>
        <el-form-item prop="bless" label="红包祝福">
          <el-input
            v-model="templateFrm.bless"
            name="bless"
            placeholder="例如:新年快乐;谢谢惠顾">
          </el-input>
        </el-form-item>
        <el-form-item prop="comment" label="注释">
          <el-input
            v-model="templateFrm.comment"
            name="comment"
            placeholder="例如:10000个红包">
          </el-input>
        </el-form-item>
      </template>
      <template v-if="templateFrm.prize_type!==101">
        <el-form-item prop="avatar" label="奖品封面">
          <upload-prize-avatar v-model="templateFrm.avatar"></upload-prize-avatar>
        </el-form-item>
        <el-form-item prop="info" label="奖品介绍">
          <el-input
            type="textarea"
            :rows="2"
            name="info"
            placeholder="请输入奖品介绍"
            v-model="templateFrm.info">
          </el-input>
        </el-form-item>
        <el-form-item prop="price" label="奖品价值">
          <el-input
            v-model="templateFrm.price"
            :min="0"
            name="price"
            placeholder="奖品价值">
            <label slot="append" class="text-999">（元）</label>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="templateFrm.prize_type===1">
        <el-form-item prop="deliver_type" label="兑奖方式">
          <el-radio
            v-model="templateFrm.deliver_type"
            :label="1">快递物流
          </el-radio>
          <el-radio
            v-model="templateFrm.deliver_type"
            :label="2">线下兑奖
          </el-radio>
        </el-form-item>
      </template>
      <template v-if="templateFrm.prize_type!==101">
        <el-form-item prop="status" label="启用奖品">
          <el-radio
            v-model="templateFrm.status"
            :label="0">停用
          </el-radio>
          <el-radio
            v-model="templateFrm.status"
            :label="1">启用
          </el-radio>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { PrizeTemplate } from '@/api/lottery/prize';
  import { mapGetters } from 'vuex';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    name: 'templateEditor',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        templateFrm: {
          id: this.$route.params.id || 0,
          prize_type: 1,
          name: '',
          avatar: '',
          info: '',
          price: 0,
          deliver_type: 1,
          status: 1,
          merchant_name: '',
          activity_name: '',
          bless: '',
          comment: ''
        },
        frmRules: {
          name: [
            {
              required: true, message: '名称必填'
            }
          ],
          price: [
            {
              required: true, message: '奖品价值必填'
            }
          ]
        }
      };
    },
    created() {
      this.getDetail();
    },
    computed: {
      ...mapGetters({
        prizeTypeOptions: 'prizeTypeOptions'
      })
    },
    methods: {
      getDetail() {
        if (this.action !== 'modify') {
          this.pageLoading = false;
          return;
        }
        PrizeTemplate.get(this.templateFrm.id)
          .then(res => {
            this.templateFrm = {
              id: res.id,
              prize_type: res.prize_type,
              name: res.name,
              avatar: res.avatar,
              info: res.info,
              price: res.price,
              deliver_type: res.deliver_type,
              status: res.status,
              merchant_name: res.merchant_name,
              activity_name: res.activity_name,
              bless: res.bless,
              comment: res.comment
            };
            this.pageLoading = false;
          })
          .catch(() => {
            this.$alert('数据获取失败，返回模板列表页', '错误', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.replace({ name: 'prizeTemplate' });
              }
            });
          });
      },
      save() {
        this.$refs.templateForm.validate(valid => {
          if (valid) {
            PrizeTemplate.operation(this.templateFrm).then(res => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style>

</style>
