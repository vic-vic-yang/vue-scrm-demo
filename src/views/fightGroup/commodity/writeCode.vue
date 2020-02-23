<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="commodityFrm"
      :rules="frmRules"
      ref="commodityFrm"
      label-width="120px">
      <header>商品核销码</header>
      <template v-if="commodityFrm.type === 1 && commodityFrm.attr">
        <el-form-item prop="sku" label="商品规格" v-if="false">
          <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 30px">
            <el-form label-width="60px">
              <div v-for="(item, index) in specification" :key="index">
                <div class="sku-name">
                  <el-form-item label="规格名" style="background: #f8f8f8;">
                    <el-input v-model="item.name" style="width:200px" size="small"></el-input>
                  </el-form-item>
                  <div class="close" @click="delSepc(index)">
                    <i class="el-icon-error"></i>
                  </div>
                </div>
                <el-form-item label="规格值">
                  <div class="sku-value" v-for="(val, i) in item.leaf" :key="i">
                    <el-input type="text" size="mini" v-model="val.value"></el-input>
                    <i class="el-icon-error" @click="delOption(index, i)"></i>
                  </div>
                  <el-input type="text"
                            size="mini"
                            suffix-icon="el-icon-plus"
                            v-if="item.name"
                            style="width: 120px"
                            v-model="addValues[index]"
                            @keyup.native.enter='addOption(index)'
                            @blur='addOption(index)'></el-input>
                </el-form-item>
              </div>
              <el-button type="primary"
                         icon="el-icon-plus"
                         :disabled="specification.length >= 3"
                         @click="addSpec">添加规格</el-button>
              <el-button type="primary"  @click="setSkuData">数据</el-button>
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
              <td>核销码数量</td>
              <td> 操作
                <el-button type="text">
                  <a href="/static/兑换码格式.xlsx" style="text-decoration:underline;">下载核销码模板</a>
                </el-button>
              </td>
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
                  :disabled="true"
                  type="text"
                  v-model="childProductArray[index].price">
                </el-input-number>
              </td>
              <td>
                <el-input
                  class="input"
                  size="small"
                  type="text"
                  :disabled="true"
                  v-model="childProductArray[index].total_num">
                </el-input>
              </td>
              <td>
                <el-input
                  class="input"
                  size="small"
                  type="text"
                  :disabled="true"
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
                  :disabled="true"
                  v-model="childProductArray[index].purchase_price">
                </el-input-number>
              </td>
              <td>
                {{childProductArray[index].sell_num}}
              </td>
              <td>
                {{childProductArray[index].card_total}}
              </td>
              <td @click="uploadCode(index)">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="$store.state.uploadImgUrl"
                  accept=".xls,.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xlam,.csv"
                  :auto-upload="false"
                  :on-change="uploadAction">
                  <el-button size="small" type="text">上传核销码</el-button>
                </el-upload>
              </td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
      </template>
      <el-form-item label="核销码" v-if="(commodityFrm.type === 1 && !commodityFrm.attr) || commodityFrm.type === 2">
        <el-upload
          style="width: 200px;"
          class="upload-demo"
          ref="upload"
          :action="$store.state.uploadImgUrl"
          accept=".xls,.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xlam,.csv"
          :auto-upload="false"
          :on-change="uploadAction">
          <el-button size="small" type="primary">上传核销码</el-button>
        </el-upload>
        <small class="text-999">核销码格式：大小写英文数字._-,长度6-32位</small>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">返回</el-button>
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
  import UploadExcel from '@/components/UploadExcel/index';
  import classification from '@/api/fightGroup/classification';
  import { objEquals } from '@/utils/sku';
  import SuppliersApi from '@/api/integralMall/suppliers';
  import Api from '@/api/index';

  export default {
    name: 'commodityEditor',
    components: {
      customElTable,
      uploadCommodityPic,
      imgCropper,
      uploadPrizeAvatar,
      Tinymce,
      UploadExcel
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        write_code: this.$route.params.type || '',
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
          category_id: '',
          supplier_id: '',
          main_video: '',
          shop_code: '',
          deliver_type: 1,
          freight: '',
          attr: ''
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
        upCodeIndex: 0
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
        .catch(err => {
          console.log('game editor get data error : ', err);
          this.pageLoading = false;
        });
    },
    computed: {
      // 过滤掉属性名和属性值为空的数据规格项目
      specificationFilter() {
        return this.specification.filter(item => item.name && item.leaf.length);
      },
      stockSpecArr() {
        return this.childProductArray.map(item => item.childProductSpec);
      }
    },
    methods: {
      uploadCode(data) {
        this.upCodeIndex = data;
      },
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
      uploadAction(res) { // 上传核销码
        var url = '';
        const uploadFormData = new FormData();
        uploadFormData.append('file', res.raw);
        if ((this.commodityFrm.type === 1 && !this.commodityFrm.attr) || this.commodityFrm.type === 2) {
          url = `/groupBuy/v1/goods/goods/import-card-number?goods_id=${this.$route.params.id}`;
        } else {
          url = `/groupBuy/v1/goods/goods/import-card-number?goods_id=${this.childProductArray[this.upCodeIndex].goods_id}&goods_attr_id=${this.childProductArray[this.upCodeIndex].id}`;
        }
        Api.post(url, uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }).then(res => {
          if (res.code === 200 && res.data && res.data.status) {
            if (Number(res.data.status) === 1) {
              this.$message({
                message: '上传成功',
                type: 'success',
                duration: 3000
              });
              return res.data;
            } else {
              this.$message({
                message: Number(res.data.status) === 2 ? '部分成功' : '全部失败',
                type: 'error',
                duration: 3000
              });
              return res.data;
            }
          }
          this.$message({
            message: res.message || '上传失败',
            type: 'error',
            duration: 3000
          });
        });
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
            this.commodityFrm = _.assign({}, this.commodityFrm, res);
            if (res.goods_attr && res.attr && res.attr.length) {
              this.specification = JSON.parse(res.goods_attr);
              this.childProductArray = res.attr;
              this.analysis(res.goods_attr_detail);
            }
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
            commodityFrm.share_pic = commodityFrm.share_pic && commodityFrm.share_pic.id || '';
            if (!commodityFrm.attr || commodityFrm.attr.length === 0) {
              commodityFrm.total_num = this.commodityFrm.total_num * 1 + sell_num;
            }
            if (Number(commodityFrm.type) === 2) { // 虚拟
              delete commodityFrm.attr;
              delete commodityFrm.goods_attr;
              delete commodityFrm.deliver_type;
              delete commodityFrm.freight;
            }
            if (Number(commodityFrm.type) === 1) { // 实物
              var data = this.setSkuData();
              commodityFrm.attr = data;
              commodityFrm.goods_attr = JSON.stringify(this.specificationFilter);
              commodityFrm.goods_attr_detail = JSON.stringify(data);
            }
            this.doSave(commodityFrm);
          }
        });
      },
      doSave(commodityFrm) {
        (this.action === 'modify' ? Commodity.edit(commodityFrm) : Commodity.add(commodityFrm))
          .then(() => {
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
      analysis(data) {
        var goods_attr_detail = JSON.parse(data);
        goods_attr_detail.map((item, index) => {
          this.childProductArray[index].childProductSpec = item.childProductSpec;
          this.childProductArray[index].childProductSpec = item.childProductNo;
        });
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
        this.specification.push({
          id: createUniqueString() + '_id',
          name: '',
          leaf: []
        });
      },
      delSepc(index) {
        this.specification.splice(index, 1);
        this.handleSpecChange('del');
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
      },
      delOption(spec_index, option_index) {
        this.specification[spec_index].leaf.splice(option_index, 1);
        this.handleSpecChange('del');
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
          childProductNo: this.defaultProductNo + index,
          card_total: ''
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
        this.specification.forEach((item, specIndex) => {
          obj[item.name] = this.getSpecAttr(specIndex, index);
        });
        return obj;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .commodity-edit__form{
    max-width: 96% !important;
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
