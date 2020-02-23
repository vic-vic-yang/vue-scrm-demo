<template>
  <div class="task-content">
    <div v-if="prizeList && prizeList.length" class="list-content">
      <div :span="6" v-for="(item, index) in prizeList" :key="index" class="list">
        <item-card :taskItem="item"
                   :index="index"
                   :cover="item.pic[0].file_path"
                   :name="item.name"
                   type="prize"
                   @editHandler="editTaskHandler"
                   @delHandler="handleClose"/>
      </div>
    </div>
    <el-button type="primary" size="mini" @click="addPrize">添加奖品</el-button>

    <!--任务选择弹层-->
    <gift-module :prizeShow="prizeShow" :list="JSON.stringify(prizeList)" :multiple="multiple" @giftHandler="giftHandler" @prizeHide="prizeShow = false"/>
  </div>
</template>

<script>
  import giftModule from '@/components/gift/giftModule';
  import GIFTCENTER_API from '@/api/giftcenter/index';
  import itemCard from '@/components/card/item-card';

  export default {
    name: 'selectGift',
    components: {
      giftModule,
      itemCard
    },
    model: {
      prop: 'prizeId',
      event: 'change'
    },
    props: {
      prizeId: {
        type: [Array, Number, String],
        default: []
      },
      multiple: {
        type: Boolean,
        default: true
      },
      parameter: {
        type: [Object, String],
        default: ''
      }
    },
    data() {
      return {
        prizeShow: false,
        prizeList: [],
        prizeTask: null
      };
    },
    computed: {
      prize: {
        set(data) {
          let prizeData = data;
          if (!this.multiple) {
            prizeData = data[0] || '';
          }
          this.$emit('change', prizeData);
        },
        get() {
          let prizeData = this.prizeId || [];
          if (!(prizeData.constructor === Array) || !this.multiple) {
            prizeData = [];
            if (this.prizeId) {
              prizeData.push(this.prizeId);
            }
            return prizeData;
          } else {
            return prizeData;
          }
        }
      }
    },
    created() {
      this.getPrize();
    },
    methods: {
      addPrize() {
        this.prizeShow = true;
      },
      giftHandler(data) {
        this.prizeList = data;
        this.setPrizeId();
        var prize = (this.prizeList || []).map(item => item.id);
        if (this.parameter && this.parameter.constructor === Object) {
          var parameter = this.parameter;
          parameter.id = !this.multiple ? Number(prize[0]) : prize;
          this.$emit('giftSuccess', parameter);
        }
        this.prizeShow = false;
      },
      setPrize() {
        let prizeData = this.prizeId || [];
        if (!(prizeData.constructor === Array) || !this.multiple) {
          prizeData = [];
          if (this.prizeId) {
            prizeData.push(this.prizeId);
          }
        }
        this.prizeList = this.prizeTask.filter(item => prizeData.includes(item.id));
      },
      editTaskHandler(scope) {
        const { href } = this.$router.resolve({name: 'giftconf', query: {id: scope.id, type: 'newAdd'}});
        window.open(href, '_blank');
      },
      setPrizeId() {
        this.prize = (this.prizeList || []).map(item => item.id);
      },
      handleClose(index) {
        this.prizeList.splice(index, 1);
        this.setPrizeId();
      },
      getPrize() {
        GIFTCENTER_API.list({
          page_index: this.pageIndex,
          page_size: 100000
        }).then(res => {
          this.prizeTask = res.result || [];
          this.setPrize();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-content {
    display: flex;
    flex-wrap: wrap;
    .list{
      margin:0 20px 10px 0
    }
  }
</style>
