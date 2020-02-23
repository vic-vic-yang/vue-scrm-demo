<template>
  <div class="app-container">
    <el-form
      :model="mainFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="mainFrm"
      label-width="110px"
    >
      <el-form-item prop="title" label="广告标题">
        <el-input v-model="mainFrm.title" :clearable="true" placeholder="请输入广告标题"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="广告类型">
        <el-select placeholder="请选择广告类型" v-model="mainFrm.type">
          <template v-for="(item, index) in columns">
            <el-option  :label="item.name" :value="item.val" :key="index" v-if="!item.disabled"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item v-if="mainFrm.type == 3">
        <el-button @click="articel_dialog = true" type="primary" style="margin-right: 20px;">关联文章</el-button>
        <span v-if="articel_obj">已关联文章： 《{{articel_obj.title}}》</span>
      </el-form-item>
      <el-form-item v-if="mainFrm.type == 5 || mainFrm.type == 6">
        <el-button @click="activity_dialog = true" type="primary" style="margin-right: 20px;">关联活动</el-button>
        <span v-if="activity_obj">已关联活动： 《{{activity_obj.activity_name}}》</span>
      </el-form-item>

      <!-- 图片广告 -->
      <el-form-item label="长图">
        <img-cropper :pic="upload_banner" @get_pic="get_pic" type="only" :width="longImgSize.w" :height="longImgSize.h"></img-cropper>
        <b style="color: #999;">长图说明：长图显示在PC端的首页顶部banner下，PC端和移动端的“特别推荐”广告位下</b>
      </el-form-item>
      <el-form-item label="短图">
        <img-cropper
          :pic="upload_banner_s"
          @get_pic="get_pic_s"
          type="only"
          :width="400"
          :height="400"
        ></img-cropper>
        <b style="color: #999;">短图说明：短图显示移动端的首页顶部banner下，PC端的“特别推荐”广告位下</b>
      </el-form-item>
      <el-form-item prop="color" label="颜色" v-if="mainFrm.type == 1 || mainFrm.type == 2 || mainFrm.type == 5">
        <el-color-picker v-model="mainFrm.color" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="上传视频" v-if="mainFrm.type == 2">
        <upload-video
          v-model="mainFrm.video"
          :uploadToOss="true"
          @setVdo="setVdo"
          @delVdo="delVdo"
        />
      </el-form-item>

      <el-form-item prop="describe" label="广告描述">
        <el-input v-model="mainFrm.describe" :clearable="true" placeholder="请输入广告描述"></el-input>
      </el-form-item>
      <el-form-item prop="link" label="链接地址" v-if="mainFrm.type !== 3 && mainFrm.type !== 5">
        <el-input v-model="mainFrm.link" :clearable="true" placeholder="请输入链接地址"></el-input>
      </el-form-item>
      <!-- 上线时间和下线时间 -->
      <el-form-item prop="time" label="展示时间">
        <el-date-picker
          v-model="mainFrm.time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="mainFrm.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="margin-top: 20px;">
        <el-button type="success" @click.prevent.stop="preView">预览</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择关联文章 -->
    <el-dialog title="选择文章" :visible.sync="articel_dialog" width="80%" top="auto" center>
      <articleSelection @selectOne="selectArticel" />
    </el-dialog>
    <!-- 选择活动 -->
    <el-dialog title="选择活动" :visible.sync="activity_dialog" width="80%" top="auto" center>
      <VoteSelection @selectOne="selectActivity" />
    </el-dialog>
  </div>
</template>

<script>
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import uploadVideo from '@/components/Upload/uploadVideo.vue';
import articleSelection from '@/components/ArticelSelection/index.vue'; // 文章导入器
import VoteSelection from '@/components/Selection/Vote.vue'; // 文章导入器
import Api from '@/api/contentPlatform/advertising';
import Activity from '@/api/vote/activity';
export default {
  components: {
    // Tinymce,
    imgCropper,
    uploadVideo,
    articleSelection,
    VoteSelection
  },
  data() {
    return {
      mainFrm: {
        title: '', // 广告位名称
        type: '', // 1图片 2视频 3文章 4链接 5活动
        advert_pic: '', // banner、长图
        advert_pic_short: '', // 短图
        color: '', // 颜色选择
        video: '',
        describe: '',
        link: '',
        time: '',
        status: 1, // 启用禁用
        mobile_link: '',
        actityType: 1 // 1投票，2答题
      },
      articel_obj: null,
      activity_obj: null,
      upload_banner: [], // banner图片
      upload_banner_s: [], // banner小图
      articel_dialog: false, // 是否展示选择文章的框
      activity_dialog: false,
      columns: [ // 广告类型
        {
          name: 'banner图片',
          val: 1,
          disabled: Number(this.$route.query.type) === 2
        },
        {
          name: 'banner视频',
          val: 2,
          disabled: Number(this.$route.query.type) === 2
        },
        {
          // featured广告位类型才显示文章和链接
          name: '文章',
          val: 3,
          disabled: Number(this.$route.query.type) === 1
        },
        {
          name: '链接',
          val: 4,
          disabled: Number(this.$route.query.type) === 1
        },
        {
          name: '投票活动',
          val: 5
        },
        {
          name: '答题活动',
          val: 6,
          disabled: true
        }
      ],
      frmRules: {
        title: [
          {
            required: true,
            message: '请输入广告位名称'
          }
        ],
        // color: [
        //   {
        //     required: true,
        //     message: "请选择颜色"
        //   }
        // ],
        link: [
          {
            required: true,
            message: '请输入链接地址'
          }
        ],
        describe: [
          {
            required: true,
            message: '请输入广告描述'
          }
        ],
        time: [
          {
            required: true,
            message: '请选择展示时间'
          }
        ]
      }
    };
  },
  computed: {
    longImgSize() {
      if (Number(this.$route.query.type) === 1) {
        return {
          w: 1440,
          h: 600
        };
      } else {
        return {
          w: 510,
          h: 255
        };
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getData();
    }
  },
  methods: {
    getData() {
      Api.getAdvertisingDetails({
        id: this.$route.query.id
      }).then(res => {
        // 重构数据格式
        res.online_time = new Date(res.online_time * 1000);
        res.offline_time = new Date(res.offline_time * 1000);
        res.time = [res.online_time, res.offline_time];
        res.type = Number(res.type);
        res.status = Number(res.status);

        this.mainFrm = res;

        // 展示图片
        this.upload_banner = [{
          file_path: res.advert_pic
        }];
        this.upload_banner_s = [{
          file_path: res.advert_pic_short
        }];
        if (this.mainFrm.type === 3) {
          this.articel_obj = {
            id: res.article_id,
            title: res.article_title
          };
        } else if (this.mainFrm.type === 5) {
          Activity.activity.get(res.article_id).then(result => {
            this.activity_obj = {
              id: result.id,
              activity_name: result.activity_name
            };
          });
        } else if (this.mainFrm.type === 6) {
          // todo
        }
      });
    },
    save() {
      if (!this.uploadCheck()) return;
      this.$refs.mainFrm.validate(valid => {
        if (valid) {
          this.submit().then(res => {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.$router.back();
          });
        }
      });
    },
    preView() {
      if (!this.uploadCheck()) return;
      this.$refs.mainFrm.validate(valid => {
        if (valid) {
          const data = this.setRequestData();
          Api.preAd(data).then(res => {
            console.log(res);
            window.open(res.preview_url);
          });
        }
      });
    },
    setRequestData() {
      let article_id = '';
      if (this.mainFrm.type === 3) {
        article_id = this.articel_obj.id;
        this.mainFrm.article_title = this.articel_obj.title;
      } else if (this.mainFrm.type === 5 || this.mainFrm.type === 6) {
        article_id = this.activity_obj.id;
        this.mainFrm.article_title = this.activity_obj.activity_name;
        let url = 'http://testwww.universiade.buerkongjian.com';
        // 判断是线上 还是测试环境
        if (window.location.href && window.location.href.indexOf('supplier.scrm.buerkongjian.com') > -1) {
          url = 'http://www.2021chengdu.com';
        }
        if (this.mainFrm.type === 5) {
          // 投票
          this.mainFrm.link = url + '/activity/vote?id=' + article_id;
          this.mainFrm.mobile_link = url + '/activityh5/pages-vote/pages-vote/vote-item/index?id=' + article_id;
        } else {
          this.mainFrm.link = '';
          this.mainFrm.mobile_link = '';
        }
      }
      const requestData = {
        ...this.mainFrm,
        place_id: this.$route.query.place_id,
        article_id: article_id,
        online_time: this.mainFrm.time[0],
        offline_time: this.mainFrm.time[1]
      };
      return requestData;
    },
    submit() {
      const data = this.setRequestData();
      if (this.$route.query.id) {
        // 编辑
        return Api.editAdvertising(data);
      } else {
        // 新增
        return Api.addAdvertising(data);
      }
    },
    uploadCheck() {
      // 验证图片视频是否上传，验证文章是否关联
      if (this.mainFrm.advert_pic === '') {
        this.$message({
          type: 'error',
          message: `请上传长图`
        });
        return false;
      }
      if (
        // (this.mainFrm.type === 3 || this.mainFrm.type === 4) &&
        this.mainFrm.advert_pic_short === ''
      ) {
        this.$message({
          type: 'error',
          message: '请上传短图'
        });
        return false;
      }
      if ((this.mainFrm.type === 1 || this.mainFrm.type === 2) && this.mainFrm.color === '') {
        this.$message({
          type: 'error',
          message: '请选择颜色'
        });
        return false;
      }
      if (this.mainFrm.type === 2 && this.mainFrm.video === '') {
        this.$message({
          type: 'error',
          message: '请上传视频'
        });
        return false;
      }
      if (!this.articel_obj && this.mainFrm.type === 3) {
        this.$message({
          type: 'error',
          message: '请选择关联文章'
        });
        return false;
      }
      return true;
    },
    selectArticel(articel) {
      this.articel_obj = articel;
      this.articel_dialog = false;
    },
    selectActivity(articel) {
      this.activity_obj = articel;
      this.activity_dialog = false;
    },
    get_pic(data) {
      // 上传图片
      this.upload_banner = data;
      this.mainFrm.advert_pic =
        data[0] && data[0].file_path ? data[0].file_path : '';
    },
    get_pic_s(data) {
      this.upload_banner_s = data;
      this.mainFrm.advert_pic_short =
        data[0] && data[0].file_path ? data[0].file_path : '';
    },
    setVdo(url) {
      // 上传视频
      this.mainFrm.video = url;
    },
    delVdo() {
      // 删除视频
      this.mainFrm.video = '';
    }
  }
};
</script>

<style lang="scss">
</style>
