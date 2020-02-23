<template>
  <div>
    <draggable :list="picLists" class="dragArea" :options="{group:'article'}">
        <upload-prize-avatar
          :disabled="true"
          :showDelImage="true"
          class="commodity-pic"
          v-for="(pic,index) in picLists"
          :key="index+'_'+pic.id"
          :image-id.sync="pic.id"
          v-model="pic.file_path"
          @del="delHandler(index)">
        </upload-prize-avatar>
      </draggable>
  </div>
</template>

<script>
  import _ from 'lodash';
  import draggable from 'vuedraggable';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  export default {
    name: 'uploadCommodityPic',
    model: {
      prop: 'pic',
      event: 'change'
    },
    props: {
      pic: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    components: {
      draggable,
      uploadPrizeAvatar
    },
    data() {
      return {
        picLists: this.pic || []
      };
    },
    watch: {
      picLists: {
        immediate: true,
        deep: true,
        handler(val) {
          if (val) {
            const findIndex = this.findUploadPosition(val);
            if (findIndex < 0 && val.length < 15) {
              this.picLists.push({
                id: '',
                file_path: ''
              });
            }
            this.$emit('change', this.getPicData(val));
          }
        }
      }
    },
    methods: {
      findUploadPosition(data) {
        return _.findIndex(data, pic => !pic.id && !pic.file_path);
      },
      getPicData(data) {
        data = _.cloneDeep(data);
        return _.filter(data, pic => pic.id && pic.file_path);
      },
      delHandler(index) {
        this.picLists.splice(index, 1);
      }
    }
  };
</script>

<style scoped>
  .commodity-pic{
    display: inline-block;
    margin: 6px 4px;
    width: auto;
  }
</style>

<style>
  .commodity-pic .single-image__uploader .el-upload{
    width: 126px;
    height: 126px;
  }
</style>
