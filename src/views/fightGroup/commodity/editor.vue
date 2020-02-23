<!--
 * @Description: 添加商品
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-13 14:05:29
 -->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="commodityFrm"
      :rules="frmRules"
      ref="commodityFrm"
      label-width="120px">
      <header>基本信息</header>
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
      <el-form-item prop="name" label="商品名称">
        <el-input
          v-model="commodityFrm.name"
          placeholder="请输入商品名称"
          :maxlength="40"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="sell_description" label="商品卖点">
        <el-input
          v-model="commodityFrm.sell_description"
          placeholder="请输入商品卖点"
          name="sell_description"
          :clearable="true">
        </el-input>
        <small class="text-999">在商品详情页标题下面展示卖点信息，建议60字以内</small>
      </el-form-item>
      <el-form-item prop="category_ids" label="商品分类">
        <el-select placeholder="请选择商品分类" style="width: 350px;" multiple v-model="commodityFrm.category_ids">
          <el-option
            v-for="item in classificationOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="text" style="margin-left: 10px;" @click="refresh('class')">刷新</el-button>
        <span class="blue"> / </span>
        <el-button type="text" @click="addClassification">新建商品分类</el-button>
      </el-form-item>
      <el-form-item prop="supplier_id" label="供应商">
        <el-select placeholder="请选择供应商" v-model="commodityFrm.supplier_id">
          <el-option
            v-for="item in supplierOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="text" style="margin-left: 10px;" @click="refresh('supplier')">刷新</el-button>
        <span class="blue "> / </span>
        <el-button type="text" @click="addSupplier">新建供应商</el-button>
      </el-form-item>
      <el-form-item prop="pic" label="商品图片">
        <!-- <upload-commodity-pic v-if="!pageLoading" v-model="commodityFrm.pic"></upload-commodity-pic> -->
        <img-cropper :pic="commodityFrm.pic" @get_pic="get_pic" width="600" height="600"></img-cropper>
        <small class="text-999">建议尺寸：600*600像素，你可以拖拽图片调整顺序，最多上传15张</small>
      </el-form-item>
     <!-- <el-form-item prop="main_video" label="主图视频">
          <uploadVideo v-model="commodityFrm.main_video" :width="400" :height="320" @success="videoSuccess" @delVdo="delVdoHandler"></uploadVideo>
          <small class="text-999">目前仅支持在手机端播放，建议时长9-30秒，建议视频宽高比16：9</small>
        </el-form-item> -->

      <header>库存信息</header>
      <template v-if="commodityFrm.type === 1">
        <el-form-item prop="sku" label="商品规格">
          <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 30px">
            <el-form label-width="60px">
              <div v-for="(item, index) in specification" :key="index">
                <div class="sku-name">
                  <el-form-item label="规格名" style="background: #f8f8f8;">
                    <el-input v-model.trim="item.name" style="width:200px" size="small" @blur='selSpec(index)'></el-input>
                  </el-form-item>
                  <div class="close" @click="delSpec(index)">
                    <i class="el-icon-error"></i>
                  </div>
                </div>
                <el-form-item label="规格值">
                  <div class="sku-value" v-for="(val, i) in item.leaf" :key="i">
                    <el-input type="text" size="mini" v-model.trim="val.value" @blur="changeOption(index, i)"></el-input>
                    <i class="el-icon-error" @click="delOption(index, i)"></i>
                  </div>
                  <el-input type="text"
                            size="mini"
                            suffix-icon="el-icon-plus"
                            v-if="item.name"
                            style="width: 120px"
                            v-model.trim="addValues[index]"
                            @keyup.native.enter='addOption(index)'
                            @blur='addOption(index)'></el-input>
                </el-form-item>
              </div>
              <el-button type="primary"
                         icon="el-icon-plus"
                         :disabled="disabled"
                         @click="addSpec">添加规格</el-button>
            </el-form>
          </div>
        </el-form-item>
        <el-form-item label="规格明细" v-if="specificationFilter.length && specificationFilter[0].name">
          <table class="table-sku" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <td v-for="(list,index) in specificationFilter" :key="index">{{list.name}}</td>
              <td>价格（元）</td>
              <td>库存</td>
              <td>商品货号</td>
              <td>成本价</td>
              <td>销量</td>
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
                <el-input-number
                  class="input-number"
                  size="small"
                  :min="0"
                  :precision="2"
                  type="text"
                  v-model="childProductArray[index].price">
                </el-input-number>
              </td>
              <td>
                <el-input
                  class="input"
                  size="small"
                  type="text"
                  v-model="childProductArray[index].total_num">
                </el-input>
              </td>
              <td>
                <el-input
                  class="input"
                  size="small"
                  type="text"
                  v-model="childProductArray[index].shop_code">
                </el-input>
              </td>
              <td>
                <el-input-number
                  class="input-number"
                  size="small"
                  :min="0"
                  :precision="2"
                  type="text"
                  v-model="childProductArray[index].purchase_price">
                </el-input-number>
              </td>
              <td>
                {{childProductArray[index].sell_num}}
              </td>
            </tr>
          </tbody>
        </table>
        </el-form-item>
      </template>
      <el-form-item prop="price" label="价格">
        <el-input-number
          v-model="commodityFrm.price"
          :min="0"
          :precision="2"
          :disabled="attr_disabled"
          name="person_num">
        </el-input-number>
        <span class="ml-5 text-666">元</span>
      </el-form-item>
      <el-form-item v-if="false" prop="inventory_deduction" label="库存扣减方式">
        <el-radio-group v-model="commodityFrm.inventory_deduction">
          <el-radio :label="1">拍下减库存</el-radio>
          <el-radio :label="2">付款减库存</el-radio>
        </el-radio-group>
        <small style="color: #999;display: block">买家提交订单，扣减库存数量，可能存在恶意占用库存风险</small>
      </el-form-item>
      <el-form-item prop="total_num" label="库存">
        <el-input-number
          v-model="commodityFrm.total_num"
          :min="0"
          :disabled="attr_disabled"
          name="total_num">
        </el-input-number>
        <span class="ml-5 text-666">件</span>
        <small class="text-999" style="margin-left: 40px;" v-if="action == 'modify'">已兑换 {{commodityFrm.sell_num}} 件</small>
      </el-form-item>
      <!-- <el-form-item prop="show_left_num" label="">
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="commodityFrm.show_left_num"
          name="show_left_num">
          商品详情不显示剩余件数
        </el-checkbox>
      </el-form-item> -->
      <el-form-item prop="shop_code" label="商品编号">
        <el-input
          v-model="commodityFrm.shop_code"
          placeholder="请输入商品编号"
          name="shop_code"
          :clearable="true">
        </el-input>
      </el-form-item>

      <template v-if="commodityFrm.type === 1">
        <header>物流信息</header>
        <el-form-item prop="deliver_type" label="配送方式">
          <el-checkbox
            :true-label="1"
            :false-label="0"
            v-model="commodityFrm.deliver_type"
            name="deliver_type">
            快递发货
          </el-checkbox>
        </el-form-item>
        <el-form-item prop="freight" label="快递运费" v-if="commodityFrm.deliver_type * 1 === 1">
          同一邮费
          <el-input-number
            v-model="commodityFrm.freight"
            :precision="2"
            placeholder="请输入快递运费">
          </el-input-number>
          元
        </el-form-item>
      </template>

      <header>其他信息</header>
      <el-form-item prop="card_number_type" label="核销码生成" v-if="commodityFrm.type === 2">
        <el-radio-group v-model="commodityFrm.card_number_type">
          <el-radio :label="1">系统自动生成</el-radio>
          <el-radio :label="2">批量导入</el-radio>
        </el-radio-group>
        <small style="display: block;color: #999;">批量导入请在商品列表操作栏中点击“核销码”去设置核销码</small>
      </el-form-item>
      <el-form-item prop="sell_status" label="上架时间">
        <el-radio-group v-model="commodityFrm.sell_status">
          <el-radio :label="0">暂不售卖，放入仓库</el-radio>
          <el-radio :label="1">立即上架售卖</el-radio>
          <el-radio :label="2">自定义上架时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="commodityFrm.sell_status === 2">
        <el-form-item prop="sell_start_time" label="上架开始时间">
          <el-date-picker
            :editable="false"
            v-model="commodityFrm.sell_start_time"
            type="datetime"
            :picker-options="startPickerOptions"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="sell_end_time" label="上架结束时间">
          <el-date-picker
            :editable="false"
            :default-value="commodityFrm.sell_start_time"
            v-model="commodityFrm.sell_end_time"
            type="datetime"
            :picker-options="sellEndPickerOptions"
            placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
      </template>
      <template v-if="commodityFrm.type === 2">
        <el-form-item prop="validate_time_type" label="有效期">
          <el-radio-group v-model="commodityFrm.validate_time_type">
            <el-radio :label="1">生效时间起长期可用</el-radio>
            <el-radio :label="2">
              生效时间起
              <el-input
                class="limit-count__input"
                type="num"
                v-model="commodityFrm.validate_date"
                name="validate_date"
                :min="0"
                size="mini"
                :disabled="commodityFrm.validate_time_type !== 2">
              </el-input>
              天内可用
            </el-radio>
            <el-radio :label="3">自定义生效时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="commodityFrm.validate_time_type === 3">
          <el-form-item prop="validate_start_time" label="生效开始时间">
            <el-date-picker
              :editable="false"
              v-model="commodityFrm.validate_start_time"
              type="datetime"
              :picker-options="startPickerOptions"
              placeholder="开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="validate_end_time" label="生效结束时间">
            <el-date-picker
              :editable="false"
              :default-value="commodityFrm.validate_start_time"
              v-model="commodityFrm.validate_end_time"
              type="datetime"
              :picker-options="validateEndPickerOptions"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item prop="is_holiday_use" label="节假日是否可用">
        <el-checkbox
          :true-label="0"
          :false-label="1"
          v-model="commodityFrm.is_holiday_use"
          name="show_left_num">
        </el-checkbox>
      </el-form-item>
      </template>
      <el-form-item prop="is_can_buy" label="商品是否可购买">
        <el-checkbox
          :true-label="1"
          :false-label="2"
          v-model="commodityFrm.is_can_buy"
          name="is_can_buy">
        </el-checkbox>
      </el-form-item>
      <el-form-item prop="share_pic" label="分享海报（默认是商品的第一张图片）">
        <upload-prize-avatar @success="successShare" v-model="commodityFrm.share_pic.file_path"></upload-prize-avatar>
        <small class="text-999">建议尺寸：800*800像素</small>
        <el-button v-if="commodityFrm.share_pic.file_path" @click="deleteImg" type="danger">删除图片</el-button>
      </el-form-item>
      <el-form-item prop="use_description" label="使用说明">
        <!--<el-input-->
          <!--type="textarea"-->
          <!--:rows="3"-->
          <!--placeholder="请输入使用说明"-->
          <!--name="use_description"-->
          <!--v-model="commodityFrm.use_description">-->
        <!--</el-input>-->
        <!--<small class="text-999"> & 表示换行</small>-->
        <tinymce placeholder="请输入商品详情" :height="260" v-model="commodityFrm.use_description"/>
      </el-form-item>

      <header>商品详情</header>
      <el-form-item prop="desc" label="商品详情">
        <tinymce placeholder="请输入商品详情" :height="300" v-model="commodityFrm.desc"/>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Commodity from '@/api/fightGroup/commodity';
  import customElTable from '@/components/customElTable';
  import uploadCommodityPic from './uploadCommodityPic';
  import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
  import { parseTime, createUniqueString, uniqueArr } from '@/utils';
  import _ from 'lodash';
  import Tinymce from '@/components/Tinymce';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import uploadVideo from '@/components/Upload/uploadVideo';
  import UploadExcel from '@/components/UploadExcel/index';
  // import Upload from '@/api/upload';
  import classification from '@/api/fightGroup/classification';
  import { objEquals } from '@/utils/sku';
  import SuppliersApi from '@/api/integralMall/suppliers';

  export default {
    name: 'commodityEditor',
    components: {
      customElTable,
      uploadCommodityPic,
      imgCropper,
      uploadPrizeAvatar,
      Tinymce,
      uploadVideo,
      UploadExcel
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        commodityFrm: {
          id: this.$route.params.id || 0,
          type: '',
          name: '',
          pic: [],
          sell_description: '',
          price: '',
          show_left_num: 0,
          sell_status: 1,
          sell_start_time: '',
          sell_end_time: '',
          validate_time_type: 1,
          validate_date: 0,
          validate_start_time: '',
          validate_end_time: '',
          is_holiday_use: 1,
          use_description: '',
          desc: '',
          is_can_buy: 1,
          share_pic: [],
          category_ids: '',
          supplier_id: '',
          main_video: '',
          shop_code: '',
          deliver_type: '1',
          freight: '',
          attr: '',
          card_number_type: 1
        },
        frmRules: {
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
          sell_description: [
            {
              required: true, message: '请填写商品卖点'
            }
          ],
          category_ids: [
            {
              required: true, message: '请选择商品分类'
            }
          ],
          price: [
            {
              required: true, message: '请填写商品价格'
            }
          ],
          sell_start_time: [
            {
              required: true, message: '请选择上架开始时间'
            }
          ],
          sell_end_time: [
            {
              required: true, message: '请选择上架结束时间'
            }
          ],
          validate_start_time: [
            {
              required: true, message: '请选择生效开始时间'
            }
          ],
          validate_end_time: [
            {
              required: true, message: '请选择生效结束时间'
            }
          ]
        },
        startPickerOptions: {
          disabledDate(time) {
            const currentDate = new Date();
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        sellEndPickerOptions: {
          disabledDate: (time) => {
            let currentDate = new Date();
            if (this.commodityFrm.sell_start_time) {
              const currentStartDate = new Date(this.commodityFrm.sell_start_time);
              if ((+currentStartDate) > (+currentDate)) {
                currentDate = currentStartDate;
              }
            }
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        validateEndPickerOptions: {
          disabledDate: (time) => {
            let currentDate = new Date();
            if (this.commodityFrm.validate_start_time) {
              const currentStartDate = new Date(this.commodityFrm.validate_start_time);
              if ((+currentStartDate) > (+currentDate)) {
                currentDate = currentStartDate;
              }
            }
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
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
        ],
        classificationOptions: [],
        supplierOptions: [],
        specification: [],
        childProductArray: [],
        addValues: [],
        defaultProductNo: 'PRODUCTNO_',
        attr_disabled: false
      };
    },
    created() {
      // this.getDetail();
      Promise.all([
        this.getDetail(),
        this.getClassification(),
        this.getSupplier()
      ])
        .then(res => {
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    computed: {
      disabled() {
        return this.specification.length > 3 || this.specification.some(item => !item.name);
      },
      // 过滤掉属性名和属性值为空的数据规格项目
      specificationFilter() {
        return this.specification.filter(item => item.name && item.leaf.length);
      },
      stockSpecArr() {
        return this.childProductArray.map(item => item.childProductSpec);
      }
    },
    methods: {
      videoSuccess(data) {
        this.commodityFrm.main_video = data.url;
      },
      delVdoHandler() {
        this.commodityFrm.main_video = '';
      },
      refresh(type) {
        if (type === 'class') {
          this.getClassification();
        }
        if (type === 'supplier') {
          this.getSupplier();
        }
      },
      addClassification() {
        this.$router.push({ name: 'classificationList' });
      },
      addSupplier() {
        this.$router.push({ name: 'supplierManagement' });
      },
      getClassification() {
        classification.list({
          page_index: 1,
          page_size: 10000
        }).then(data => {
          this.classificationOptions = data.result || [];
        });
      },
      getSupplier() {
        SuppliersApi.list({
          page_index: 1,
          page_size: 10000
        }).then(res => {
          this.supplierOptions = res.result || [];
        });
      },
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        Commodity.get(this.commodityFrm.id)
          .then(res => {
            const sellStartTime = res.sell_start_time;
            const sellEndTime = res.sell_end_time;
            const validateStartTime = res.validate_start_time;
            const validateEndTime = res.validate_end_time;
            res.type = Number(res.type);
            res.sell_status = Number(res.sell_status);
            res.is_holiday_use = Number(res.is_holiday_use);
            res.is_can_buy = Number(res.is_can_buy);
            res.validate_time_type = Number(res.validate_time_type);
            res.show_left_num = Number(res.show_left_num);
            res.sell_start_time = sellStartTime * 1 ? parseTime(sellStartTime * 1000) : '';
            res.sell_end_time = sellEndTime * 1 ? parseTime(sellEndTime * 1000) : '';
            res.validate_start_time = validateStartTime * 1 ? parseTime(validateStartTime * 1000) : '';
            res.validate_end_time = validateEndTime * 1 ? parseTime(validateEndTime * 1000) : '';
            res.pic = res.pic || [];
            res.share_pic = res.share_pic && res.share_pic[0] || {};
            res.total_num = res.total_num * 1 - res.sell_num * 1;
            res.card_number_type = Number(res.card_number_type);
            res.category_ids = res.category_ids.split(',');
            res.supplier_id = String(res.supplier_id);
            res.deliver_type = Number(res.deliver_type);
            this.commodityFrm = _.assign({}, this.commodityFrm, res);
            if (res.goods_attr && res.attr && res.attr.length) {
              this.specification = JSON.parse(res.goods_attr);
              this.childProductArray = res.attr;
              this.addValues.length = this.specification.length;
              this.analysis(res.goods_attr_detail);
            }
            if (this.commodityFrm.type === 1 && (!this.specification || this.specification.length)) {
              this.attr_disabled = true;
            }
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      analysis(data) {
        var goods_attr_detail = JSON.parse(data);
        goods_attr_detail.map((item, index) => {
          this.childProductArray[index].childProductSpec = item.childProductSpec;
          this.childProductArray[index].childProductNo = item.childProductNo;
        });
      },
      save() {
        this.$refs.commodityFrm.validate(valid => {
          if (valid) {
            var sell_num = this.commodityFrm.sell_num * 1 || 0;
            const commodityFrm = Object.assign({}, this.commodityFrm);
            commodityFrm.pic = (commodityFrm.pic.map(pic => pic.id)).join(',');
            commodityFrm.share_pic = commodityFrm.share_pic && commodityFrm.share_pic.id || '';
            if (!commodityFrm.attr || commodityFrm.attr.length === 0) {
              commodityFrm.total_num = this.commodityFrm.total_num * 1 + sell_num;
            }
            commodityFrm.category_ids = (commodityFrm.category_ids.map(category_id => category_id)).join(',');
            if (Number(commodityFrm.type) === 2) { // 虚拟
              delete commodityFrm.attr;
              delete commodityFrm.goods_attr;
              delete commodityFrm.deliver_type;
              delete commodityFrm.freight;
            }
            if (Number(commodityFrm.type) === 1) { // 实物
              console.log(this.attr_disabled);
              if (this.attr_disabled) {
                var data = this.setSkuData();
                commodityFrm.attr = data;
                commodityFrm.goods_attr = JSON.stringify(this.specification);
                commodityFrm.goods_attr_detail = JSON.stringify(data);
                delete commodityFrm.price;
                delete commodityFrm.inventory_deduction;
              } else {
                delete commodityFrm.attr;
                delete commodityFrm.goods_attr;
                delete commodityFrm.goods_attr_detail;
              }
            }
            this.doSave(commodityFrm);
          }
        });
      },
      doSave(commodityFrm) {
        (this.action === 'modify' ? Commodity.edit(commodityFrm) : Commodity.add(commodityFrm))
          .then(() => {
            if (this.action === 'modify') {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            }
            this.$router.back();
          });
      },
      setSkuData() {
        const childProductData = this.childProductArray;
        childProductData.map(item => {
          var i = 0;
          for (var key in item.childProductSpec) {
            i += 1;
            item['attr_name' + i] = key;
            item['attr_value' + i] = item.childProductSpec[key];
          }
        });
        return childProductData;
      },
      set_attr_disabled() {
        if (this.specification.length && this.specification[0].leaf.length) {
          this.attr_disabled = true;
        } else {
          this.attr_disabled = false;
        }
      },
      get_pic(data) {
        this.commodityFrm.pic = data;
      },
      successShare(data) {
        this.commodityFrm.share_pic = {
          id: data.id,
          file_path: data.url
        };
      },
      deleteImg() {
        this.commodityFrm.share_pic = {};
      },
      addSpec() {
        if (this.specification.length < 4) {
          this.specification.push({
            id: createUniqueString() + '_id',
            name: '',
            leaf: []
          });
        }
      },
      delSpec(index) {
        this.specification.splice(index, 1);
        this.handleSpecChange('del');
        this.set_attr_disabled();
      },
      selSpec(index) {
        if (this.specification[index].name === '') {
          // this.specification.splice(index, 1);
        } else {
          this.handleSpecChange('edit');
        }
      },
      addOption(index) {
        let str = this.addValues[index] || '';
        str = str.trim();
        if (!str) return;
        const oldArr = this.specification[index].leaf;
        const arr = str
          .split(/\s+/) // 使用空格分割成数组
          .filter(value => !oldArr.some(option => option.value === value)) // 过滤掉 oldArr 已存在的 value
          .map(value => ({ id: createUniqueString() + '_id', value })); // 把 value 转成对象，id 设置为 null
        this.specification[index].leaf = uniqueArr([...oldArr, ...arr]);
        this.$set(this.addValues, index, '');
        this.handleSpecChange('add');
        this.set_attr_disabled();
      },
      changeOption(spec_index, option_index) {
        if (this.specification[spec_index].leaf[option_index].value === '') {
          this.delOption(spec_index, option_index)();
        } else {
          this.handleSpecChange('edit');
        }
      },
      delOption(spec_index, option_index) {
        this.specification[spec_index].leaf.splice(option_index, 1);
        this.handleSpecChange('del');
        this.set_attr_disabled();
      },
      handleSpecChange(option) {
        const stockCopy = JSON.parse(JSON.stringify(this.childProductArray));
        if (option === 'del') {
          this.childProductArray = [];
        }
        for (let i = 0; i < this.countSum(0); i++) {
          this.changeStock(option, i, stockCopy);
        }
      },
      changeStock(option, index, stockCopy) {
        var childProduct = {
          id: 0,
          price: '',
          total_num: '',
          shop_code: '',
          purchase_price: '',
          sell_num: '',
          childProductSpec: this.getChildProductSpec(index),
          childProductNo: this.defaultProductNo + index
        };
        const spec = childProduct.childProductSpec;
        if (option === 'add') {
          // 如果此id不存在，说明为新增属性，则向 childProductArray 中添加一条数据
          if (this.stockSpecArr.findIndex((item) => objEquals(spec, item)) === -1) {
            this.$set(this.childProductArray, index, childProduct);
          }
        } else if (option === 'del') {
          // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
          let origin = '';
          stockCopy.forEach(item => {
            if (objEquals(spec, item.childProductSpec)) {
              origin = item;
              return false;
            }
          });
          this.childProductArray.push(origin || childProduct);
        } else if (option === 'edit') {
          // 修改规格名称，直接替换
          this.childProductArray[index].childProductSpec = childProduct.childProductSpec;
        }
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
      getChildProductSpec(index) {
        var obj = {};
        this.specificationFilter.forEach((item, specIndex) => {
          obj[item.name] = this.getSpecAttr(specIndex, index);
        });
        return obj;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .commodity-edit__form{
    max-width: 1200px !important;
  }

  .limit-count__input {
    width: 66px;
  }

  .limit-count__input > input {
    padding: 0 10px;
    text-align: center;
  }
  .blue{
    color: #409eff;
  }
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }

  .sku-name{
    background: #f8f8f8;
    position: relative;
    .close{
      display: none;
      font-size: 20px;
      color: hsla(0,0%,60%,.6);
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
    }
    &:hover .close{
      display: block;
    }
  }

  .sku-value{
    display: inline-block;
    margin: 0 5px;
    width: 120px;
    position: relative;
    .el-icon-error{
      display: none;
      font-size: 18px;
      position: absolute;
      right: -8px;
      top: -4px;
      cursor: pointer;
    }
    &:hover .el-icon-error{
      display: block;
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
    width: 120px;
  }
</style>
