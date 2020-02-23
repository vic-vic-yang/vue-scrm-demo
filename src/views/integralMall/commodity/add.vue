<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-25 15:14:40
 * @LastEditTime: 2019-08-27 16:09:58
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="commodityFrm"
      :rules="frmRules"
      ref="commodityFrm"
      label-width="120px">

      <el-form-item prop="type" label="商品类型">
        <el-select placeholder="请选择商品类型" v-model="commodityFrm.type">
          <el-option
            v-for="item in commodityTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <header>基本信息</header>

      <el-form-item prop="name" label="商品名称">
        <el-input
          v-model="commodityFrm.name"
          placeholder="请输入商品名称"
          :maxlength="40"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="pic" label="商品图片">
        <!-- <upload-commodity-pic v-if="!pageLoading" v-model="commodityFrm.pic"></upload-commodity-pic> -->
        <img-cropper :pic="commodityFrm.pic" @get_pic="get_pic"></img-cropper>
        <small class="text-999">建议尺寸：800*600像素，你可以拖拽图片调整顺序，最多上传15张</small>
      </el-form-item>
      <el-form-item prop="desc" label="商品描述">
        <el-input
          type="textarea"
          :rows="4"
          v-model="commodityFrm.desc"
          placeholder="请输入商品描述"
          name="desc"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="price" label="商品价格">
        <el-input-number
          v-model="commodityFrm.price"
          :min="0"
          name="person_num">
        </el-input-number>
        <span class="ml-5 text-666">元</span>
        <el-switch
          style="margin-left: 10px;"
          v-model="commodityFrm.price_show">
        </el-switch>
        <span class="ml-5 text-666">{{commodityFrm.price_show ? '显示' : '不显示'}}</span>
      </el-form-item>
      <el-form-item prop="integral" label="商品积分价格">
        <el-input-number
          v-model="commodityFrm.integral"
          :min="0"
          name="integral">
        </el-input-number>
        <span class="ml-5 text-666">积分</span>
      </el-form-item>
      <el-form-item prop="total_num" label="库存">
        <el-input-number
          v-model="commodityFrm.total_num"
          :min="0"
          name="total_num">
        </el-input-number>
        <span class="ml-5 text-666">件</span>
        <small class="text-999" style="margin-left: 40px;" v-if="action == 'modify'">已兑换 {{commodityFrm.sell_num}} 件</small>
      </el-form-item>
      <el-form-item prop="sort" label="权重值">
        <el-input-number
          v-model="commodityFrm.sort"
          :min="0"
          name="sort">
        </el-input-number>
        <small class="text-999" style="margin-left: 50px;">（0-1000）商品权重值越高，展示顺序越靠前</small>
      </el-form-item>
      <el-form-item prop="card_number_type" label="核销码" v-if="commodityFrm.type == 2">
        <el-radio-group v-model="commodityFrm.card_number_type">
          <el-radio :label="1">系统自动生成</el-radio>
          <el-radio :label="2">批量导入</el-radio>
        </el-radio-group>
        <small style="color: #999;display: block">批量导入请在奖品列表操作栏中点击“核销码”去设置核销码</small>
      </el-form-item>

      <header>其他信息</header>

      <el-form-item prop="status" label="上架时间">
        <el-radio-group v-model="commodityFrm.status">
          <el-radio :label="1">立即上架</el-radio>
          <el-radio :label="2">暂不上架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="need_contact" label="用户填写手机号" label-width="auto">
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="commodityFrm.need_contact"
          name="need_contact">
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
  import integralCommodity from '@/api/integralMall/commodity';
  import _ from 'lodash';

  export default {
    name: 'add',
    components: {
      imgCropper
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        isUploadLoading: false,
        pageLoading: true,
        action: action,
        commodityFrm: {
          price_show: true,
          id: this.$route.params.id || 0,
          type: '',
          name: '',
          desc: '',
          pic: [],
          price: '',
          status: 1,
          integral: '',
          sort: 0,
          card_number_type: 1, //  1-自动；2-导入
          need_contact: 1
        },
        frmRules: {
          card_number_type: [
            {
              required: true, message: '请选择商品类型'
            }
          ],
          type: [
            {
              required: true, message: '请选择商品类型'
            }
          ],
          name: [
            {
              required: true, message: '请填写商品名称'
            }
          ],
          desc: [
            {
              required: true, message: '商品描述'
            }
          ],
          pic: [
            {
              required: true, message: '请填上传商品图片'
            }
          ],
          price: [
            {
              required: true, message: '请填写商品价格'
            }
          ],
          integral: [
            {
              required: true, message: '请填写商品积分价格'
            }
          ],
          total_num: [
            {
              required: true, message: '请填写库存'
            }
          ],
          sort: [
            {
              required: true, message: '请填写权重值'
            }
          ],
          status: [
            {
              required: true, message: '请选择上架时间'
            }
          ]
        },
        commodityTypeOptions: [
          {
            value: 1,
            label: '实物商品'
          },
          {
            value: 2,
            label: '电子卡券'
          }
        ]
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        integralCommodity.get(this.commodityFrm.id)
          .then(res => {
            res.total_num = res.total_num * 1 - res.sell_num * 1;
            res.pic = res.pic || [];
            res.price_show = Boolean(res.price_show);
            this.commodityFrm = _.assign({}, this.commodityFrm, res);
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      save() {
        this.$refs.commodityFrm.validate(valid => {
          if (valid) {
            var sell_num = this.commodityFrm.sell_num * 1 || 0;
            const commodityFrm = Object.assign({}, this.commodityFrm);
            commodityFrm.pic = (commodityFrm.pic.map(pic => pic.id)).join(',');
            commodityFrm.total_num = this.commodityFrm.total_num * 1 + sell_num;
            commodityFrm.price_show = Number(commodityFrm.price_show);
            if (this.commodityFrm.type === 1) {
              delete commodityFrm.card_number_type;
            }
            (this.action === 'modify' ? integralCommodity.edit(commodityFrm) : integralCommodity.add(commodityFrm))
              .then(res => {
                this.$router.back();
              });
          }
        });
      },
      get_pic(data) {
        this.commodityFrm.pic = data;
      }
    }
  };
</script>

<style scoped>
  .limit-count__input {
    width: 66px;
  }

  .limit-count__input > input {
    padding: 0 10px;
    text-align: center;
  }

  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
