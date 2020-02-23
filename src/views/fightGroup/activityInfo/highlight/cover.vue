<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="coverFrm"
      :rules="frmRules"
      ref="coverFrm"
      label-width="120px">
      <el-form-item prop="pic" label="活动集锦封面">
         <upload-commodity-pic v-if="!pageLoading" v-model="coverFrm.pic"></upload-commodity-pic>
        <!--<img-cropper :pic="coverFrm.pic" @get_pic="get_pic"></img-cropper>-->
        <small class="text-999">建议尺寸：800*760像素，你可以拖拽图片调整顺序，最多上传15张</small>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import uploadCommodityPic from '../../commodity/uploadCommodityPic';
  import activityInfo from '@/api/fightGroup/activityInfo';
  import _ from 'lodash';

  export default {
    name: 'highlightCover',
    components: {
      uploadCommodityPic
    },
    data() {
      return {
        coverFrm: {
          key: 'LIVE_SHOW',
          pic: []
        },
        pageLoading: true,
        frmRules: {
          pic: [
            {
              required: false, message: '请上传封面'
            }
          ]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        activityInfo.operation({
          key: this.coverFrm.key
        }).then(res => {
          this.coverFrm = _.assign({}, this.coverFrm, res.data);
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.coverFrm.validate(valid => {
          if (valid) {
            const coverFrm = Object.assign({}, this.coverFrm);
            coverFrm.pic = (coverFrm.pic.map(pic => pic.id)).join(',');
            activityInfo.operation_edit({
              pic: coverFrm.pic,
              key: coverFrm.key
            }).then(() => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
