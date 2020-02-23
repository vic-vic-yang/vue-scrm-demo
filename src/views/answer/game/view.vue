<template>
  <div class="app-container">
    <div class="color-picker-container" style="display:flex;align-items:center;">
      <span class="label-clone">主色调&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="form.main_color" size="small"></el-color-picker>
      <span class="label-clone">&nbsp;&nbsp;&nbsp;开始答题颜色&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="form.start_color" size="small"></el-color-picker>
      <span class="label-clone">&nbsp;&nbsp;&nbsp;有奖任务颜色&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="form.mission_color" size="small"></el-color-picker>
      <span class="label-clone">&nbsp;&nbsp;&nbsp;学习中心顶部文字颜色&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="form.study_font_color" size="small"></el-color-picker>
    </div>
    <el-form ref="form" :model="form" label-width="120px" class="mt-20">
      <el-form-item label="开始答题">
        <image-upload v-model="form.start_icon"></image-upload>
        <el-button v-if="form.start_icon" @click="deleteImg('start_icon')" type="danger">删除图片</el-button>
        <small style="display: block;color: #999;">建议尺寸：460 * 100</small>
      </el-form-item>
      <el-form-item label="有奖任务">
        <image-upload v-model="form.mission_icon"></image-upload>
        <el-button v-if="form.mission_icon" @click="deleteImg('mission_icon')" type="danger">删除图片</el-button>
        <small style="display: block;color: #999;">建议尺寸：460 * 100</small>
      </el-form-item>
      <el-form-item label="比赛背景图">
        <image-upload v-model="form.home_img"></image-upload>
        <el-button v-if="form.home_img" @click="deleteImg('home_img')" type="danger">删除图片</el-button>
        <small style="display: block;color: #999;">建议尺寸：750 * 1206</small>
      </el-form-item>
      <el-form-item label="比赛背景图(iphone X)">
        <image-upload v-model="form.home_img_other"></image-upload>
        <el-button v-if="form.home_img_other" @click="deleteImg('home_img_other')" type="danger">删除图片</el-button>
        <small style="display: block;color: #999;">建议尺寸：1242 x 2424</small>
      </el-form-item>
      <el-form-item label="红包分享文案">
        <el-input type="textarea" rows="5" v-model="form.share_desc" :maxLength="100" :clearable="true" placeholder="请输入红包分享文案"></el-input>
      </el-form-item>
      <el-form-item label="红包分享配图">
        <image-upload v-model="form.share_img"></image-upload>
        <el-button v-if="form.share_img" @click="deleteImg('share_img')" type="danger">删除图片</el-button>
        <small style="display: block;color: #999;">建议尺寸：750 * 1206</small>
      </el-form-item>
      <el-form-item label="任务中心配图">
        <image-upload v-model="form.mission_back_img"></image-upload>
        <el-button v-if="form.mission_back_img" @click="deleteImg('mission_back_img')" type="danger">删除图片</el-button>
        <small style="display: block;color: #999;">建议尺寸：750 * 277</small>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">返回首页</span>
            <el-form-item>
              <image-upload v-model="form.home_icon" width="39" height="39" size="small"></image-upload>
              <el-button v-if="form.home_icon" @click="deleteImg('home_icon')" type="danger">删除图片</el-button>
              <small style="display: block;color: #999;">建议尺寸：132 * 54</small>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">比赛规则</span>
            <el-form-item>
              <image-upload v-model="form.rule_icon" width="39" height="39" size="small"></image-upload>
              <el-button v-if="form.rule_icon" @click="deleteImg('rule_icon')" type="danger">删除图片</el-button>
              <small style="display: block;color: #999;">建议尺寸：144 * 54</small>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">我的比赛</span>
            <el-form-item>
              <image-upload v-model="form.mine_icon" width="39" height="39" size="small"></image-upload>
              <el-button v-if="form.mine_icon" @click="deleteImg('mine_icon')" type="danger">删除图片</el-button>
              <small style="display: block;color: #999;">建议尺寸：200 * 72</small>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">学习中心</span>
            <el-form-item>
              <image-upload v-model="form.study_icon" width="39" height="39" size="small"></image-upload>
              <el-button v-if="form.study_icon" @click="deleteImg('study_icon')" type="danger">删除图片</el-button>
              <small style="display: block;color: #999;">建议尺寸：200 * 72</small>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">排行榜</span>
            <el-form-item>
              <image-upload v-model="form.rank_icon" width="39" height="39" size="small"></image-upload>
              <el-button v-if="form.rank_icon" @click="deleteImg('rank_icon')" type="danger">删除图片</el-button>
              <small style="display: block;color: #999;">建议尺寸：200 * 72</small>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="答题页底部logo">
        <image-upload v-model="form.foot_logo"></image-upload>
        <el-button v-if="form.foot_logo" @click="deleteImg('foot_logo')" type="danger">删除图片</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save()">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Game from '@/api/answer/game';
import imageUpload from '@/components/Upload/singleImage';
export default {
  name: '',
  data() {
    return {
      form: {
        main_color: '',
        start_color: '',
        mission_color: '',
        study_font_color: '',
        mission_back_img: '',
        id: '',
        home_img: '',
        home_img_other: '',
        share_desc: '',
        share_img: '',
        home_icon: '',
        rule_icon: '',
        mine_icon: '',
        study_icon: '',
        rank_icon: '',
        foot_logo: '',
        start_icon: '',
        mission_icon: ''
      },
      gameId: this.$route.params.gameId
    };
  },
  components: { imageUpload },
  mounted() {
    this.formFill();
  },
  methods: {
    save(e) {
      Game.editView(this.gameId, this.form).then(() => {
        this.$router.back();
      });
    },
    deleteImg(type = 'share_img') {
      this.form[type] = '';
    },
    formFill() {
      Game.getView(this.gameId).then(res => {
        if (res.data) {
          this.form = res.data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.label-clone {
  text-align: left;
  margin-left: 120px;
  font-size: 13px;
  line-height: 36px;
  color: #606266;
  box-sizing: border-box;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.back-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
  }
}
.back-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.img-back {
  display: block;
}
.img-back.middle {
  width: 178px;
  height: 178px;
}
.img-back.small {
  width: 78px;
  height: 78px;
}
.back-uploader-icon.middle {
  width: 178px;
  height: 178px;
  line-height: 178px;
}
.back-uploader-icon.small {
  width: 78px;
  height: 78px;
  line-height: 78px;
}
</style>
