<template>
  <div class="app-container">
    <el-form
      :model="prizeFrm"
      :rules="frmRules"
      ref="prizeFrom"
      label-width="80px">
      <el-form-item prop="prize_type" label="奖品类型">
        <el-select
          v-model="prizeFrm.prize_type"
          placeholder="请选择"
          @change="prizeTypeChange">
          <el-option
            v-for="item in prizeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="prize_template_id" label="奖品模板">
        <el-select
          v-model="prizeFrm.prize_template_id"
          placeholder="请选择"
          @change="prizeTemplateChange">
          <el-option
            v-for="item in prizeTemplateOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="total" label="库存数量">
        <el-input-number
          v-model="prizeFrm.total"
          :min="0"
          name="total"
          placeholder="库存数量">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="name" label="奖品名称">
        <el-input
          v-model="prizeFrm.name"
          placeholder="请输入奖品名称"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <template v-if="prizeFrm.prize_type===2">
        <el-form-item prop="merchant_name" label="商户名称">
          <el-input
            v-model="prizeFrm.merchant_name"
            name="merchant_name"
            placeholder="红包商户名称显示">
          </el-input>
        </el-form-item>
        <el-form-item prop="activity_name" label="活动名称">
          <el-input
            v-model="prizeFrm.activity_name"
            name="activity_name"
            placeholder="例如可以填写促销活动的名称">
          </el-input>
        </el-form-item>
        <el-form-item prop="bless" label="红包祝福">
          <el-input
            v-model="prizeFrm.bless"
            name="bless"
            placeholder="例如:新年快乐;谢谢惠顾">
          </el-input>
        </el-form-item>
        <el-form-item prop="comment" label="注释">
          <el-input
            v-model="prizeFrm.comment"
            name="comment"
            placeholder="例如:10000个红包">
          </el-input>
        </el-form-item>
      </template>
      <template v-if="prizeFrm.prize_type!==101">
        <el-form-item prop="avatar" label="奖品封面">
          <upload-prize-avatar v-model="prizeFrm.avatar"></upload-prize-avatar>
        </el-form-item>
        <el-form-item prop="info" label="奖品介绍">
          <el-input
            type="textarea"
            :rows="2"
            name="info"
            placeholder="请输入奖品介绍"
            v-model="prizeFrm.info">
          </el-input>
        </el-form-item>
        <el-form-item prop="price" label="奖品价值">
          <el-input
            v-model="prizeFrm.price"
            :min="0"
            name="price"
            placeholder="奖品价值">
            <label slot="append" class="text-999">（元）</label>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="prizeFrm.prize_type===1">
        <el-form-item prop="deliver_type" label="兑奖方式">
          <el-radio
            v-model="prizeFrm.deliver_type"
            :label="1">快递物流
          </el-radio>
          <el-radio
            v-model="prizeFrm.deliver_type"
            :label="2">线下兑奖
          </el-radio>
        </el-form-item>
      </template>
      <template v-if="prizeFrm.prize_type!==101">
        <el-form-item prop="status" label="启用奖品">
          <el-radio
            v-model="prizeFrm.status"
            :label="0">停用
          </el-radio>
          <el-radio
            v-model="prizeFrm.status"
            :label="1">启用
          </el-radio>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click.stop.prevent="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { PrizeTemplate, PrizeInventory } from '@/api/lottery/prize';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import { mapGetters } from 'vuex';

  export default {
    name: 'editor',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        prizeFrm: {
          id: this.$route.params.id || 0,
          prize_type: 1,
          prize_template_id: '',
          name: '',
          avatar: '',
          info: '',
          price: 0,
          total: 0,
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
          avatar: [
            {
              required: true, message: '奖品封面必填'
            }
          ],
          price: [
            {
              required: true, message: '奖品价值必填'
            }
          ],
          total: [
            {
              required: true, message: '库存数量必填'
            }
          ]
        },
        templateSelects: {}
      };
    },
    created() {
      Promise.all([this.getDetail(), this.$store.dispatch('getTemplateSelect')]).then(res => {
        this.templateSelects = res[1];
        if (!res[0]) {
          const prizeType = this.prizeTypeOptions[0].value;
          this.$set(this.prizeFrm, 'prize_type', prizeType);
          this.$set(this.prizeFrm, 'prize_template_id', res[1]['template_' + prizeType][0].value);
        }
        this.pageLoading = false;
      });
    },
    computed: {
      ...mapGetters({
        prizeTypeOptions: 'prizeTypeOptions'
      }),
      prizeTemplateOptions() {
        return this.templateSelects['template_' + this.prizeFrm.prize_type] || [];
      }
    },
    methods: {
      getDetail() {
        if (this.action !== 'modify') return false;
        return PrizeInventory.get(this.prizeFrm.id)
          .then(res => {
            this.prizeFrm = {
              id: res.id,
              prize_type: res.prize_type,
              prize_template_id: res.prize_template_id,
              name: res.name,
              avatar: res.avatar,
              info: res.info,
              price: res.price,
              total: res.total,
              deliver_type: res.deliver_type,
              status: res.status,
              merchant_name: res.merchant_name,
              activity_name: res.activity_name,
              bless: res.bless,
              comment: res.comment
            };
            return res;
          })
          .catch(err => {
            this.$alert('数据获取失败，返回奖品库存管理页面', '错误', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.replace({ name: 'prizeTemplate' });
              }
            });
            return Promise.reject(err);
          });
      },
      save() {
        this.$refs.prizeFrom.validate(valid => {
          if (valid) {
            PrizeInventory.operation(this.prizeFrm).then(res => {
              this.$router.back();
            });
          }
        });
      },
      prizeTypeChange() {
        this.$set(this.prizeFrm, 'prize_template_id', '');
      },
      prizeTemplateChange(id) {
        PrizeTemplate.get(id).then(res => {
          if (this.prizeFrm.prize_type === 1) {
            this.prizeFrm = Object.assign({}, this.prizeFrm, {
              name: res.name,
              deliver_type: res.deliver_type,
              avatar: res.avatar,
              price: res.price,
              info: res.info,
              merchant_name: '',
              activity_name: '',
              bless: '',
              comment: ''
            });
          } else if (this.prizeFrm.prize_type === 2) {
            this.prizeFrm = Object.assign({}, this.prizeFrm, {
              name: res.name,
              deliver_type: '',
              avatar: res.avatar,
              price: res.price,
              info: res.info,
              merchant_name: res.merchant_name,
              activity_name: res.activity_name,
              bless: res.bless,
              comment: res.comment
            });
          } else if (this.prizeFrm.prize_type === 101) {
            this.prizeFrm = Object.assign({}, this.prizeFrm, {
              name: res.name,
              deliver_type: '',
              avatar: '',
              price: '',
              info: '',
              merchant_name: '',
              activity_name: '',
              bless: '',
              comment: ''
            });
          }
        });
      }
    }
  };
</script>
