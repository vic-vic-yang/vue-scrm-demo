<template>
  <div class="app-container">
    <el-form class="commodity-edit__form" :model="commodityFrm" :rules="frmRules" ref="commodityFrm" label-width="120px">
      <el-form-item prop="name" label="供应商名称">
        <el-input v-model="commodityFrm.name" placeholder="核销码名称" :maxlength="40" name="name" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="goods_id" label="选择商品">
        <div class="selected-goods-preview" v-if="selectedGoodsInfo">
          <div class="selected-goods-pic">
            <img v-if="selectedGoodsInfo.pic && selectedGoodsInfo.pic.length"
                                               :src="selectedGoodsInfo.pic[0].file_path" style="width: 200px; height: 200px"/>
          </div>
          <small class="text-666">商户名称：{{selectedGoodsInfo.name}}</small>
        </div>
      <el-button type="text" size="small" @click="showSelectCommodity = true;">选择商品</el-button>
      </el-form-item>
      <el-form-item prop="code" label="上传核销码">
        <el-upload
          class="upload-demo"
          v-model="commodityFrm.code"
          action="$store.state.uploadImgUrl"
          :http-request="uploadAction">
          <el-button size="small" type="primary">上传Excel</el-button>
        </el-upload>
        <el-button type="text" >下载核销码模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
    <select-commodity v-model="selectedGoodsInfo" :show.sync="showSelectCommodity"></select-commodity>
  </div>
</template>

<script>
  import Upload from '@/api/upload';
  import Commodity from '@/api/fightGroup/commodity';
  import selectCommodity from '../../activity/selectCommodity';
  import _ from 'lodash';
  export default {
    name: 'add',
    components: {
      selectCommodity
    },
    data() {
      return {
        showSelectCommodity: false,
        selectedGoodsInfo: null,
        code: '',
        commodityFrm: {
          name: ''
        },
        frmRules: {
          name: [{
            required: true,
            message: '请输入供应商名称'
          }],
          goods_id: [
            {
              required: true, message: ' '
            }
          ],
          code: [
            {
              required: true, message: ' '
            }
          ]
        },
        tabLoading: true,
        commodityQueryFrm: {
          name: '',
          status: ''
        }
      };
    },
    created() {
    },
    methods: {
      uploadAction(res) {
        var that = this;
        Upload.audio(res.file, 'file', e => {
        })
          .then(res => {
            console.log(res);
            that.commodityFrm.code = res.url;
          });
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.commodityQueryFrm);
        const sell_num = this.query.sell_num || [];
        this.$set(this.query, 'sell_num_min', sell_num[0]);
        this.$set(this.query, 'sell_num_max', sell_num[1]);
        this.pageIndex = 1;
        this.getData();
      },
      sureProducts(item) {
        this.commodityFrm.products = item;
        this.prepositionShow = false;
      },
      save() {
        this.$refs.commodityFrm.validate(valid => {
          if (valid) {
            var sell_num = this.commodityFrm.sell_num * 1 || 0;
            const commodityFrm = Object.assign({}, this.commodityFrm);
            commodityFrm.pic = (commodityFrm.pic.map(pic => pic.id)).join(',');
            commodityFrm.share_pic = commodityFrm.share_pic.id + '';
            commodityFrm.total_num = this.commodityFrm.total_num * 1 + sell_num;
            (this.action === 'modify' ? Commodity.edit(commodityFrm) : Commodity.add(commodityFrm))
              .then(() => {
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
