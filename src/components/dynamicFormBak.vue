<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 14:20:38
 * @LastEditTime: 2019-08-22 11:18:09
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="dynamic-form">
    <div class="activity-wrapper app-container">
      <el-form label-width="80px">
        <template v-for="(item, index) in formsList">
          <el-form-item v-if="item.type === 'text'" :prop="'name_' + index" :key="'name_' + index" :label="item.name">
            <el-input placeholder="" v-model="item.value"></el-input>
          </el-form-item>
          <el-form-item v-if="item.type === 'date'" :prop="'name_' + index" :key="'name_' + index" :label="item.name">
            <el-date-picker
              v-model="item.value"
              align="right"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="item.type === 'select'" :prop="'name_' + index" :label="item.name">
            <el-select v-model="item.value" value="">
              <el-option
                v-for="(item, index) of item.config.option" :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.type === 'image'" :prop="'name_' + index" :label="item.name">
            <el-form-item prop="detail" label="">
              <upload-prize-avatar v-model="item.value"  @update:imageId=""></upload-prize-avatar>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="item.type === 'radio'" :prop="'name_' + index" :label="item.name">
            <el-radio-group v-model="item.value">
              <template v-for="(option, iop) in item.config.option">
                <el-radio :label="option.value">{{option.label}}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
<!--      <el-button type="primary" @click="save">确 定</el-button>-->
<!--      <el-button type="danger" @click="close">取 消</el-button>-->
    </div>
  </div>
</template>

<script>
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import { provinceAndCityDataPlus } from 'element-china-area-data';

  export default {
    name: 'customElTable',
    components: {
      uploadPrizeAvatar,
      provinceAndCityDataPlus
    },
    data: function() {
      return {
        autofocus: true,
        clickIndex: 0
      };
    },
    props: {
      formsList: {
        // default: [
        //   {
        //     type: 'text', // 字段类型
        //     name: '姓名', // 字段label
        //     config: null, // 字段配置
        //     pattern: null, // 正则表达式
        //     min_length: null, // 最小长度
        //     max_length: null, // 最大长度
        //     create_time: '1569056034',
        //     delete_time: '0',
        //     value_id: '1', // 字段值id
        //     value: '英子', // 字段值
        //     key_name: 'name', // 字段名
        //     prompt_text: '请输入姓名'
        //   }
        // ]
      },
      value: {
        type: Number,
        default: 1
      },
      tableOptions: {
        type: Array,
        required: true
      },
      tableData: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Boolean,
        default: true
      },
      total: {
        type: Number
      },
      pageSizes: {
        type: Array,
        default: () => [20, 50, 100]
      },
      size: {
        type: Number,
        default: 20
      },
      layout: {
        type: String
      },
      height: {
        type: [String, Number]
      },
      maxHeight: {
        type: [String, Number]
      },
      ifmultipleSelection: {
        type: Boolean,
        default: false
      }
    },
    computed: {},
    methods: {}
  };
</script>

<style scoped>
.pagination-wrapper {
  margin: 20px 0;
}

.small-padding {
  padding: 7px 10px !important;
}

.some-flex{
  display: flex;
  justify-content: center;
}
</style>
