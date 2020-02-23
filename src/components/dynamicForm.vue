<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 14:20:38
 * @LastEditTime: 2019-08-22 11:18:09
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div style="display: inline-block">
    <el-input v-if="formsConfig.type === 'input'" placeholder="" v-model="formsConfig.value"></el-input>
    <el-date-picker
      v-if="formsConfig.type === 'date'"
      v-model="formsConfig.value"
      value-format="yyyy-MM-dd"
      align="right"
      type="date">
    </el-date-picker>
    <el-select v-if="formsConfig.type === 'select'" v-model="formsConfig.value" value="">
      <el-option
        v-for="(option, index) of formsConfig.config.option" :key="index"
        :label="option.label"
        :value="option.value">
      </el-option>
    </el-select>
    <upload-prize-avatar
      v-if="formsConfig.type === 'image'"
      v-model="formsConfig.value"
      @update:imageId="">
    </upload-prize-avatar>
    <el-radio-group v-if="formsConfig.type === 'radio'" v-model="formsConfig.value">
      <template v-for="(option, iop) in formsConfig.config.option">
        <el-radio :label="option.value">{{option.label}}</el-radio>
      </template>
    </el-radio-group>
    <el-cascader
      v-if="formsConfig.type === 'district'"
      size="large"
      :options="options"
      v-model="areaData"
      @change="addressChange">
    </el-cascader>
  </div>
</template>

<script>
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import { provinceAndCityDataPlus, CodeToText, TextToCode} from 'element-china-area-data';

  export default {
    name: 'customElTable',
    components: {
      uploadPrizeAvatar,
      provinceAndCityDataPlus
    },
    data: function() {
      return {
        autofocus: true,
        clickIndex: 0,
        options: provinceAndCityDataPlus,
        areaData: null
      };
    },
    props: {
      formsConfig: {
      }
    },
    created() {
      this.init();
    },
    methods: {
      addressChange(arr) {
        console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
        this.formsConfig.value = [CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]].join(',');
      },
      init() {
        if (this.formsConfig && this.formsConfig.type === 'district') {
          const arr = this.formsConfig.value.split(',');
          this.areaData = [TextToCode[arr[0]], TextToCode[arr[1]], TextToCode[arr[2]]];
        }
      }
    }
  };
</script>

<style scoped>
</style>
