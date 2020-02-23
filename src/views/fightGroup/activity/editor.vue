<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="activityFrm" :rules="frmRules" ref="activityFrm" label-width="120px">
      <!-- <header>商户信息</header> -->
      <!-- <el-form-item prop="merchant_name" label="商户名称">
        <el-input
          v-model="activityFrm.merchant_name"
          placeholder="请输入商户名称"
          :maxlength="50"
          name="merchant_name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="merchant_contact_name" label="联系人">
        <el-input
          v-model="activityFrm.merchant_contact_name"
          :maxlength="20"
          placeholder="请输入联系人名称"
          name="merchant_contact_name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="merchant_phone" label="联系方式">
        <el-input
          v-model="activityFrm.merchant_phone"
          type="tel"
          :maxlength="11"
          placeholder="请输入活动名称"
          name="merchant_phone"
          :clearable="true">
        </el-input>
      </el-form-item> -->

      <header>活动信息</header>
      <el-form-item prop="goods_id" label="选择商品">
        <div class="selected-goods-preview" v-if="selectedGoodsInfo">
          <div class="selected-goods-pic"><img v-if="selectedGoodsInfo.pic && selectedGoodsInfo.pic.length" :src="selectedGoodsInfo.pic[0].file_path" /></div>
          <small class="text-666">商户名称：{{selectedGoodsInfo.name}}</small>
        </div>
        <el-button type="text" size="small" @click="showSelectCommodity = true;">选择商品</el-button>
      </el-form-item>
      <el-form-item prop="active_name" label="活动名称">
        <el-input v-model="activityFrm.active_name" placeholder="请输入活动名称" :maxlength="20" name="active_name" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="share_desc" label="分享描述">
        <el-input v-model="activityFrm.share_desc" placeholder="微信分享给好友时显示" :maxlength="26" name="share_desc"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="person_num" label="拼团类型">
        <el-input-number v-model="activityFrm.person_num" :min="2" :max="100" name="person_num">
        </el-input-number>
        <span class="ml-5 text-666">人</span>
      </el-form-item>
      <el-form-item prop="active_time" label="活动有效期">
        <el-date-picker :editable="false" v-model="activityFrm.active_time" type="datetimerange" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels align="right">
        </el-date-picker>
        <p class="text-999">
          <small>拼团活动有效期</small>
        </p>
      </el-form-item>
      <el-form-item prop="group_time" label="拼团有效期">
        <el-select placeholder="-" style="width: 66px" v-model="activityFrm.group_time[0]">
          <el-option v-for="item in 31" :key="item" :label="31-item" :value="31-item">
          </el-option>
        </el-select>
        <span class="mh-5 text-666">天</span>
        <el-select placeholder="-" style="width: 66px" v-model="activityFrm.group_time[1]">
          <el-option v-for="item in 60" :key="item" :label="60-item" :value="60-item">
          </el-option>
        </el-select>
        <span class="mh-5 text-666">时</span>
        <el-select placeholder="-" style="width: 66px" v-model="activityFrm.group_time[2]">
          <el-option v-for="item in 60" :key="item" :label="60-item" :value="60-item">
          </el-option>
        </el-select>
        <span class="mh-5 text-666">分</span>
        <!--<el-select placeholder="-" style="width: 66px" v-model="activityFrm.group_time[3]">-->
        <!--<el-option-->
        <!--v-for="item in 60"-->
        <!--:key="item"-->
        <!--:label="60-item"-->
        <!--:value="60-item">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<span class="mh-5 text-666">秒</span>-->
        <p class="text-999">
          <small>拼团活动下，用户参团或开团到成团的最大时间，超过该时间，拼团失败</small>
        </p>
      </el-form-item>
      <el-form-item prop="payment_time" label="支付有效期">
        <el-select placeholder="-" style="width: 66px" v-model="activityFrm.payment_time[0]">
          <el-option v-for="item in 31" :key="item" :label="31-item" :value="31-item">
          </el-option>
        </el-select>
        <span class="mh-5 text-666">天</span>
        <el-select placeholder="-" style="width: 66px" v-model="activityFrm.payment_time[1]">
          <el-option v-for="item in 60" :key="item" :label="60-item" :value="60-item">
          </el-option>
        </el-select>
        <span class="mh-5 text-666">时</span>
        <el-select placeholder="-" style="width: 66px" v-model="activityFrm.payment_time[2]">
          <el-option v-for="item in 60" :key="item" :label="60-item" :value="60-item">
          </el-option>
        </el-select>
        <span class="mh-5 text-666">分</span>
        <!--<el-select placeholder="-" style="width: 66px" v-model="activityFrm.payment_time[3]">-->
        <!--<el-option-->
        <!--v-for="item in 60"-->
        <!--:key="item"-->
        <!--:label="60-item"-->
        <!--:value="60-item">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<span class="mh-5 text-666">秒</span>-->
        <p class="text-999">
          <small>用户提交订单后，选择支付的剩余的时间(为0时，支付有效期即为拼团有效期)</small>
        </p>
      </el-form-item>
      <el-form-item prop="buy_max_num" label="开启限购">
        <el-checkbox v-model="buyMaxEnable">
          开启限购
          <el-input class="limit-count__input" type="num" v-model="activityFrm.buy_max_num" name="buy_max_num" :min="0"
            size="mini" :disabled="!buyMaxEnable">
          </el-input>
          件/人
        </el-checkbox>
      </el-form-item>
      <el-form-item prop="buy_join_type" label="凑团设置">
        <el-checkbox :true-label="1" :false-label="0" v-model="activityFrm.buy_join_type">
          开启凑团
        </el-checkbox>
        <p class="text-999">
          <small>开启凑团后，对于未参团的买家，活动商品详情页会显示未成团的团列表，买家可以直接任选一个参团，提升成团率。</small>
        </p>
      </el-form-item>
      <el-form-item prop="buy_join_type" label="机器人成团">
        <el-checkbox :true-label="1" :false-label="0" v-model="activityFrm.group_type">
          开启机器人成团
        </el-checkbox>
        <p class="text-999">
          <small>开启机器人成团后，拼团有效期内人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。你只需要对已付款参团的真实买家发货</small>
        </p>
      </el-form-item>
      <el-form-item label="商品活动价" v-if="specificationFilter.length && specificationFilter[0].name">
        <table class="table-sku" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <td v-for="(list,index) in specificationFilter" :key="index">{{list.name}}</td>
              <td>微商城原价(元)</td>
              <td>拼团价(元)</td>
              <td>库存</td>
            </tr>
          </thead>
          <tbody v-if="specificationFilter[0] && specificationFilter[0].leaf.length">
            <tr v-for="(item, index) in countSum(0)" :key="index">
              <td v-for="(n, specIndex) in specificationFilter.length"
                  v-if="showTd(specIndex, index)"
                  :key="n"
                  :rowspan="countSum(n)">
              {{getSpecAttr(specIndex, index)}}
              </td>
              <td>
                {{childProductArray[index].price}}
              </td>
              <td>
                <el-input-number
                  class="input-number"
                  size="small"
                  :min="0"
                  :precision="2"
                  type="text"
                  v-model="childProductArray[index].active_price">
                </el-input-number>
              </td>
              <td>
                {{childProductArray[index].total_num}}
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
      <el-form-item v-else prop="price" label="商品活动价">
        <el-input-number
            v-model="activityFrm.price"
            :min="0"
            name="price">
        </el-input-number>
        <span class="ml-5 text-666">元</span>
      </el-form-item>
      <el-form-item prop="sort" label="权重值">
        <el-input-number v-model="activityFrm.sort" :min="0" name="sort">
        </el-input-number>
        <small class="text-999" style="margin-left: 50px;">（0-1000）活动权重值越高，展示顺序越靠前</small>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
    <select-commodity v-model="selectedGoodsInfo" :show.sync="showSelectCommodity" @update-data="getPruductDetail"></select-commodity>
  </div>
</template>

<script>
  import Activity from '@/api/fightGroup/activity';
  import customElTable from '@/components/customElTable';
  import selectCommodity from './selectCommodity';
  import Commodity from '@/api/fightGroup/commodity';
  import _ from 'lodash';
  import {
    parseTime
  } from '@/utils';

  export default {
    name: 'activityEditor',
    components: {
      customElTable,
      selectCommodity
    },
    data() {
      const validateGroupTime = (rule, value, callback) => {
        const groupTimeValidateRes = !!(value[0] || value[1] || value[2] || value[3]);
        if (groupTimeValidateRes) {
          callback();
        } else {
          callback(new Error('请选择活动拼团有效期时间'));
        }
      };
      const validatePaymentTime = (rule, value, callback) => {
        const groupTimeValidateRes = !!(value[0] || value[1] || value[2] || value[3]);
        if (groupTimeValidateRes) {
          callback();
        } else {
          callback(new Error('请选择拼团支付有效期时间'));
        }
      };
      return {
        tableData: [],
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        activityFrm: {
          id: this.$route.params.id || 0,
          // merchant_name: '',
          // merchant_contact_name: '',
          // merchant_phone: '',
          goods_id: '',
          active_name: '',
          share_desc: '',
          person_num: '',
          group_time: [1, 0, 0, 0],
          group_validate_time_days: 1,
          group_validate_time_hours: 0,
          group_validate_time_minutes: 0,
          group_validate_time_seconds: 0,
          // payment_time: [1, 0, 0, 0],
          payment_time: [1, 0, 0],
          order_pay_time_days: 1,
          order_pay_time_hours: 0,
          order_pay_time_minutes: 0,
          order_pay_time_seconds: 0,
          active_time: [],
          start_time: '',
          end_time: '',
          buy_max_num: 0,
          buy_join_type: 0,
          group_type: 0,
          price: 0,
          sort: ''
        },
        specification: [],
        buyMaxEnable: false,
        childProductArray: [],
        frmRules: {
          // merchant_name: [
          //   {
          //     required: false, message: '请填写商户名称'
          //   }
          // ],
          // merchant_contact_name: [
          //   {
          //     required: false, message: '请填写联系人'
          //   }
          // ],
          // merchant_phone: [
          //   {
          //     required: false, message: '请填写联系方式'
          //   }
          // ],
          goods_id: [{
            required: true,
            message: '请选择一个商品'
          }],
          active_name: [{
            required: true,
            message: '请填写活动名称'
          }],
          share_desc: [{
            required: true,
            message: '请填写分享描述'
          }],
          active_time: [{
            required: true,
            message: '请选择活动有效期时间'
          }],
          group_time: [{
            validator: validateGroupTime
          }],
          payment_time: [{
            validator: validatePaymentTime
          }],
          price: [{
            required: true,
            message: '请输入拼团价',
            trigger: 'blur'
          }]
        },
        startPickerOptions: {
          disabledDate(time) {
            const currentDate = new Date();
            const currentTime = +new Date(
              `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        activityEndPickerOptions: {
          disabledDate: (time) => {
            let currentDate = new Date();
            if (this.activityFrm.start_time) {
              const currentStartDate = new Date(this.activityFrm.start_time);
              if ((+currentStartDate) > (+currentDate)) {
                currentDate = currentStartDate;
              }
            }
            const currentTime = +new Date(
              `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        groupEndPickerOptions: {
          disabledDate: (time) => {
            let currentDate = new Date();
            if (this.activityFrm.group_start_time) {
              const currentStartDate = new Date(this.activityFrm.group_start_time);
              if ((+currentStartDate) > (+currentDate)) {
                currentDate = currentStartDate;
              }
            }
            const currentTime = +new Date(
              `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        showSelectCommodity: false,
        selectedGoodsInfo: null
      };
    },
    watch: {
      selectedGoodsInfo(goods) {
        goods && this.$set(this.activityFrm, 'goods_id', goods.id);
      }
    },
    computed: {
      specificationFilter() {
        return this.specification.filter(item => item.name && item.leaf.length);
      }
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        Activity.get(this.activityFrm.id)
          .then(res => {
            const startTime = parseTime(res.start_time * 1000);
            const endTime = res.end_time * 1 ? parseTime(res.end_time * 1000) : '';
            res.active_time = [startTime, endTime];
            res.group_time = [res.group_validate_time_days || 0, res.group_validate_time_hours || 0, res.group_validate_time_minutes ||
              0, res.group_validate_time_seconds || 0
            ];
            // res.payment_time = [res.order_pay_time_days || 0, res.order_pay_time_hours || 0, res.order_pay_time_minutes || 0, res.order_pay_time_seconds || 0];
            res.payment_time = [res.order_pay_time_days || 0, res.order_pay_time_hours || 0, res.order_pay_time_minutes ||
              0
            ];
            this.activityFrm = _.assign({}, this.activityFrm, res);
            this.buyMaxEnable = res.buy_max_num * 1 > 0;
            this.selectedGoodsInfo = res.goods_info;
            console.log(res.goods_info.att);
            this.specification = JSON.parse(res.goods_info.goods_attr);
            this.childProductArray = res.goods_info.attr;
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      getPruductDetail(info) {
        console.log(info.id);
        Commodity.get(info.id)
          .then(res => {
            if (res.goods_attr && res.attr && res.attr.length) {
              this.specification = JSON.parse(res.goods_attr);
              this.childProductArray = res.attr;
            }
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      countSum(specIndex) {
        let num = 1;
        this.specificationFilter.forEach((item, index) => {
          if (index >= specIndex && item.leaf.length) {
            num *= item.leaf.length;
          }
        });
        return num;
      },
      showTd(specIndex, index) {
        // 如果当前项目下没有属性，则不显示
        if (!this.specificationFilter[specIndex]) {
          return false;
        } else if (index % this.countSum(specIndex + 1) === 0) {
          return true;
        } else {
          return false;
        }
      },
      getSpecAttr(specIndex, index) {
        // 获取当前规格项目下的属性值
        const currentValues = this.specificationFilter[specIndex].leaf;
        let indexCopy;

        // 判断是否是最后一个规格项目
        if (this.specificationFilter[specIndex + 1] && this.specificationFilter[specIndex + 1].leaf.length) {
          indexCopy = index / this.countSum(specIndex + 1);
        } else {
          indexCopy = index;
        }

        const i = Math.floor(indexCopy % currentValues.length);

        if (i.toString() !== 'NaN') {
          return currentValues[i].value;
        } else {
          return '';
        }
      },
      save() {
        this.$refs.activityFrm.validate(valid => {
          if (valid) {
            const activityFrmData = Object.assign({}, this.activityFrm);
            activityFrmData.start_time = activityFrmData.active_time[0];
            activityFrmData.end_time = activityFrmData.active_time[1];
            [activityFrmData.group_validate_time_days, activityFrmData.group_validate_time_hours, activityFrmData.group_validate_time_minutes,
              activityFrmData.group_validate_time_seconds
            ] = activityFrmData.group_time;
            // [activityFrmData.order_pay_time_days, activityFrmData.order_pay_time_hours, activityFrmData.order_pay_time_minutes, activityFrmData.order_pay_time_seconds] = activityFrmData.payment_time;
            [activityFrmData.order_pay_time_days, activityFrmData.order_pay_time_hours, activityFrmData.order_pay_time_minutes] =
            activityFrmData.payment_time;
            activityFrmData.goods_attr = JSON.stringify(this.childProductArray);
            console.log(this.childProductArra);
            delete activityFrmData.group_time;
            delete activityFrmData.payment_time;
            console.log(JSON.stringify(activityFrmData));
            (this.action === 'modify' ? Activity.edit(activityFrmData) : Activity.add(activityFrmData))
              .then(() => {
                this.$router.back();
              });
          }
        });
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    }
  };
</script>

<style>
  .limit-count__input {
    width: 66px;
  }

  .limit-count__input>input {
    padding: 0 10px;
    text-align: center;
  }

  .activity-edit__form header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
<style scoped rel="stylesheet/scss" lang="scss">
  .selected-goods-preview {
    .selected-goods-pic {
      position: relative;
      width: 120px;
      height: 120px;
      border: 1px solid #e2e2e2;
      overflow: hidden;
      border-radius: 5px;

      >img {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .table-sku {
    width: 100%;
    background-color: #fff;
    text-align: left;
    border-collapse: separate;
    border-color: #dfe6ec;
    border-style: solid;
    border-width: 1px 0 0 1px;

  }
  .table-sku td {
    padding: 4px 10px;
    border-collapse: separate;
    border-color: #dfe6ec;
    border-style: solid;
    border-width: 0 1px 1px 0;
  }
  .table-sku td .input{
    width: 80px;
  }
  .table-sku td .input-number{
    width: 140px;
  }
</style>
