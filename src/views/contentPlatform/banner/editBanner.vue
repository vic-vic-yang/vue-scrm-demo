<!--
 * @Description: 
 * @Autor: shao bo
 * @Date: 2019-11-13 13:48:54
 -->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="bannerFrm"
      :rules="frmRules"
      ref="bannerFrm"
      label-width="120px"
    >
      <header>基本信息</header>
      <el-form-item prop="cover" label="封面">
        <upload-prize-avatar
          v-model="bannerFrm.cover"
          style="margin: 0;"
          @update:imageId="getPicId"
        ></upload-prize-avatar>
        <small class="text-999">建议尺寸：750*422像素</small>
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-radio-group v-model="bannerFrm.type">
          <el-radio label="1">输入url</el-radio>
          <el-radio label="2">关联内容</el-radio>
        </el-radio-group>
        <el-input
          v-if="bannerFrm.type==='1'"
          v-model="bannerFrm.url"
          placeholder="链接地址"
          name="name"
          :clearable="true"
        ></el-input>
        <el-row v-else>
          <el-tag
            v-if="bannerFrm.content.title"
            :key="bannerFrm.content.title"
            closable
            type="info"
            @click="module_show"
            @close="tagClose"
          >{{bannerFrm.content.title}}</el-tag>
          <el-button v-else @click="module_show">关联内容</el-button>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
    <select-content
      v-model="bannerFrm.content"
      :show.sync="showSelect"
      @update-data="getContentDetail"
    ></select-content>
  </div>
</template>
<script>
import uploadPrizeAvatar from '@/components/Upload/singleImage';
import SelectContent from './content';
import BannerApi from '@/api/contentPlatform/banner';
import Content from '@/api/contentPlatform/content';
export default {
  components: {
    uploadPrizeAvatar,
    SelectContent
  },
  data() {
    return {
      pageLoading: true,
      edit: !!this.$route.params.id,
      bannerFrm: {
        banner_type: 1,
        cover: '',
        type: '1',
        url: '',
        id: this.$route.params.id || '',
        content: {}
      },
      frmRules: {
        cover: [
          {
            required: true,
            message: '请上传图片'
          }
        ]
      },
      showSelect: false
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getPicId(id) {
      this.pic_id = id;
    },
    getDetail() {
      console.log(this.$route.params.id);
      if (!this.edit) return (this.pageLoading = false);
      BannerApi.get(this.$route.params.id).then(res => {
        console.log(res);
        this.pageLoading = false;
        this.bannerFrm = {...this.bannerFrm, ...res};
        if (res.type === '2') {
          Content.list.get(this.bannerFrm.url).then(res => {
            this.bannerFrm.content = res;
            this.bannerFrm.url = '';
          });
        }
      });
    },
    module_show() {
      this.showSelect = true;
    },
    tagClose() {
      this.bannerFrm.content = {};
      this.bannerFrm.content_id = '';
    },
    getContentDetail(info) {
      console.log(info.id);
      this.bannerFrm.content = info;
    },
    save() {
      this.$refs.bannerFrm.validate(valid => {
        if (valid) {
          if (this.bannerFrm.type === '1' && !this.bannerFrm.url) {
            this.$message({
              type: 'error',
              message: '请输入内容链接'
            });
            return;
          }
          if (this.bannerFrm.type === '2' && !this.bannerFrm.content.id) {
            this.$message({
              type: 'error',
              message: '请选择内容'
            });
            return;
          }
          const params = {
            banner_type: this.bannerFrm.banner_type,
            cover: this.bannerFrm.cover,
            type: this.bannerFrm.type,
            url:
              this.bannerFrm.type === '1'
                ? this.bannerFrm.url
                : this.bannerFrm.content.id,
            id: this.bannerFrm.id
          };
          console.log(params);
          BannerApi.add(params).then(res => {
            this.$router.back();
          });
        }
      });
    }
  }
};
</script>