<template>
  <div class="app-container">
    <!-- <div class="color-picker-container" style="display:flex;align-items:center;">
      <span class="label-clone">主色调&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="groupFrm.main_color" size="small"></el-color-picker>
      <span class="label-clone">&nbsp;&nbsp;&nbsp;开始答题颜色&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="groupFrm.start_color" size="small"></el-color-picker>
      <span class="label-clone">&nbsp;&nbsp;&nbsp;有奖任务颜色&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="groupFrm.mission_color" size="small"></el-color-picker>
      <span class="label-clone">&nbsp;&nbsp;&nbsp;学习中心顶部文字颜色&nbsp;&nbsp;&nbsp;</span>
      <el-color-picker v-model="groupFrm.study_font_color" size="small"></el-color-picker>
    </div>-->
    <el-form :model="groupFrm" class="mt-20" :rules="frmRules" ref="groupFrm" label-width="120px">
      <el-form-item label="主色调">
        <el-color-picker v-model="groupFrm.main_color" size="small"></el-color-picker>
      </el-form-item>
      <el-row v-if="false">
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">战绩</span>
            <el-form-item>
              <image-upload v-model="groupFrm.record_img" width="39" height="39" size="small"></image-upload>
              <el-button v-if="groupFrm.record_img" @click="deleteImg('record_img')" type="danger">删除图片</el-button>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">排行榜</span>
            <el-form-item>
              <image-upload v-model="groupFrm.ranking_img" width="39" height="39" size="small"></image-upload>
              <el-button v-if="groupFrm.ranking_img" @click="deleteImg('ranking_img')" type="danger">删除图片</el-button>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex-column">
            <span class="label-clone">奖励</span>
            <el-form-item>
              <image-upload v-model="groupFrm.reward_img" width="39" height="39" size="small"></image-upload>
              <el-button v-if="groupFrm.reward_img" @click="deleteImg('reward_img')" type="danger">删除图片</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item prop="share_desc" label="分享文案">
        <el-input type="textarea" rows="5" v-model="groupFrm.share_desc" name="share_desc" :maxLength="100" :clearable="true" placeholder="请输入分享文案"></el-input>
      </el-form-item>
      <el-form-item prop="share_img" label="分享配图">
        <image-upload v-model="groupFrm.share_img"></image-upload>
        <el-button v-if="groupFrm.share_img" @click="deleteImg()" type="danger">删除图片</el-button>
        <small style="color: #999; display: block;">支持PNG及JPG。显示图片长宽比是 5:4。</small>
      </el-form-item>
      <el-form-item label="logo">
        <image-upload v-model="groupFrm.logo"></image-upload>
        <el-button v-if="groupFrm.logo" @click="deleteImg('logo')" type="danger">删除图片</el-button>
        <small style="color: #999; display: block;">支持PNG及JPG。建议尺寸：179 * 44</small>
      </el-form-item>
      <el-form-item label="首页底部配图">
        <image-upload v-model="groupFrm.index_foot_img"></image-upload>
        <el-button v-if="groupFrm.index_foot_img" @click="deleteImg('index_foot_img')" type="danger">删除图片</el-button>
      </el-form-item>
      <!-- <el-form-item label="首页背景配图">
        <image-upload v-model="groupFrm.index_back_img"></image-upload>
        <el-button v-if="groupFrm.index_back_img" @click="deleteImg('index_back_img')" type="danger">删除图片</el-button>
      </el-form-item>-->
      <!-- <el-form-item label="任务中心配图">
        <image-upload v-model="groupFrm.mission_back_img"></image-upload>
        <el-button v-if="groupFrm.mission_back_img" @click="deleteImg('mission_back_img')" type="danger">删除图片</el-button>
      </el-form-item>-->
      <el-form-item label="授权页背景图">
        <image-upload v-model="groupFrm.auth_back"></image-upload>
        <el-button v-if="groupFrm.auth_back" @click="deleteImg('auth_back')" type="danger">删除图片</el-button>
      </el-form-item>
      <el-form-item prop="auth_title" label="授权页标题">
        <el-input type="text" v-model="groupFrm.auth_title" name="auth_title" :maxLength="100" :clearable="true" placeholder="请输入授权页标题"></el-input>
      </el-form-item>
      <el-form-item prop="auth_desc" label="授权页简介">
        <el-input type="text" v-model="groupFrm.auth_desc" name="auth_desc" :maxLength="100" :clearable="true" placeholder="请输入授权页简介"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Global from '@/api/answer/global';
import imageUpload from '@/components/Upload/singleImage';

export default {
  name: 'groupEditor',
  components: { imageUpload },
  data() {
    return {
      action: false,
      groupFrm: {
        share_desc: '', // 默认分享描述
        share_img: '', // 默认分享配图
        logo: '', // 小程序logo
        main_color: '', // 主配色
        start_color: '', // 开始答题颜色
        mission_color: '', // 有奖任务颜色
        study_font_color: '', // 学习中心字体颜色
        index_foot_img: '', // 首页底部图片
        index_back_img: '', // 首页背景图片
        mission_back_img: '', // 任务中心图片
        record_img: '', // 战绩
        ranking_img: '', // 排行榜
        reward_img: '', // 奖励
        auth_back: '', // 授权页背景图
        auth_title: '', // 授权页标题
        auth_desc: '' // 授权页简介
      },
      frmRules: {
        share_desc: [
          {
            required: true,
            message: '请输入分享文案'
          }
        ],
        share_img: [
          {
            required: true,
            message: '请上传分享配图'
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
      Global.get().then(res => {
        if (res.id) {
          this.action = true;
        }
        this.groupFrm = res;
      });
    },
    deleteImg(type = 'share_img') {
      this.groupFrm[type] = '';
    },
    save() {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          (this.action ? Global.edit(this.groupFrm) : Global.add(this.groupFrm)).then(() => {
            this.$router.back();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
.color-picker-container {
  padding-left: 70px;
}
.label-clone {
  text-align: left;
  // margin-left: 120px;
  font-size: 13px;
  line-height: 36px;
  color: #606266;
  box-sizing: border-box;
}
</style>
