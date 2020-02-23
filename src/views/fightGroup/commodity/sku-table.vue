<template>
  <el-table
    :data="tableData"
    border
    max-height="800"
    v-on="$listeners"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="价格"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</template>

<script>
  import { flatten } from '@/utils/sku';
  // import { diffArary } from '@/utils';

  export default {
    name: 'sku-table',
    props: {
      skusData: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      skusList() {
        /**
         * output:
         * [
         *   {
         *     ids: '1-11_2-21',
         *     skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}],
         *   },
         *   {
         *     ids: '1-11_2-22',
         *     skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}],
         *   }
         * ]
         */
        return flatten(this.skusData).map(item => ({
          skus: item.skus,
          ids: item.skus.reduce((total, prev, index) => `${total}${prev.k_id}-${prev.v_id}${index === item.skus.length - 1 ? '' : '_'}`, '')
        }));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .flex{
    display: flex
  }

  .guide_coefficient{
    margin-right: 20px
  }

</style>
