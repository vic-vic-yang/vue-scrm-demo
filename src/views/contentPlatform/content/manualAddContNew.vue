<template>
  <div class="app-container" v-loading="tabLoading">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="100px"
    >
      <el-form-item prop="title" label="标题">
        <el-input v-model="groupFrm.title" name="title" :clearable="true" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item prop="tags" label="内容标签">
        <el-select
          placeholder="请选择内容标签"
          style="width:480px"
          clearable
          multiple
          v-model="groupFrm.tags"
        >
          <el-option
            v-for="item in labelifiCations"
            :key="item.id"
            :label="item.tag_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="cover" label="封面">
        <img-cropper :pic="images" @get_pic="get_pic" type="only" :width="680" :height="440"></img-cropper>
      </el-form-item>
      <el-form-item prop="digest" label="简介">
        <el-input v-model="groupFrm.digest" name="digest" :clearable="true" placeholder="请输入简介"></el-input>
      </el-form-item>
      <el-form-item prop="author" label="内容来源">
        <el-input v-model="groupFrm.author" name="author" :clearable="true" placeholder="请输入内容来源"></el-input>
      </el-form-item>


      <el-form-item label="展示方式">
        <el-radio-group v-model="groupFrm.show_type">
          <el-radio label="1">手动编辑</el-radio>
          <el-radio label="2">采用链接</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="groupFrm.show_type === '2'">
        <el-form-item label="链接类型">
          <el-radio-group v-model="groupFrm.source_type">
            <el-radio label="1">公众号文章链接</el-radio>
            <el-radio label="2">第三方链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  v-if="groupFrm.source_type === '1'" prop="appid" label="公众号appid">
          <el-input v-model="groupFrm.appid" name="appid" :clearable="true" placeholder="请输入appid"></el-input>
        </el-form-item>
        <el-form-item prop="original_url" label="链接地址">
          <el-input
            v-model="groupFrm.original_url"
            name="content_address"
            :clearable="true"
            placeholder="请输入链接地址"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="类型">
          <el-radio-group v-model="groupFrm.article_type">
            <el-radio label="1">图文</el-radio>
            <el-radio label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item  v-if="groupFrm.article_type == '1'" prop="content" label="详情">
          <tinymce placeholder="请输入详情" :video_show="true" :file_show="true" :height="600" v-model="groupFrm.content" />
        </el-form-item>

        <el-form-item v-else prop="video" label="上传视频">
          <upload-video v-model="groupFrm.video" :uploadToOss="true" @setVdo="setVdo" @delVdo="delVdo" />
        </el-form-item>
      </template>
      <el-form-item v-if="check">
        <el-button type="primary" @click.prevent.stop="bandClick(true)">保存</el-button>
        <el-button @click="bandClick(false)">取消</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="success" @click.prevent.stop="preView">预览</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Auxiliary from '@/api/contentPlatform/auxiliary';
import Tinymce from '@/components/Tinymce';
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import uploadVideo from '@/components/Upload/uploadVideo.vue';
import ColumnsApi from '@/api/contentPlatform/columns';
export default {
  name: 'manualAddCont',
  props: ['check', 'detail'],
  components: {
    Tinymce,
    imgCropper,
    uploadVideo
  },
  data() {
    return {
      action: this.$route.params.id ? 'modify' : 'add',
      images: [],
      groupFrm: {
        column_id: this.$route.params.column,
        article_type: '1', // 图片/视频
        source_type: '1', // 文章类型
        appid: '', // 公众号appid
        channel_id: [],
        classify_id: '', // 分类
        tags: [], // 标签
        cover: '', // 封面图
        cover_id: '', // 封面图
        title: '', // 标题
        author: '', // 内容来源
        original_url: '', // 来源地址
        video: '', // 视频
        digest: '', // 简介
        show_type: '1',
        content: '' // 详情
      },
      tabLoading: false,
      classifiCations: [],
      labelifiCations: [],
      channesList: [],
      classifiCation_page_info: {
        pageIndex: 1,
        pageSize: 999,
        totalCount: 1,
        tabLoading: true
      },
      labelifiCation_page_info: {
        pageIndex: 1,
        pageSize: 999,
        totalCount: 1,
        tabLoading: true
      },
      sourceOptions: [
        {
          label: '内部文章',
          value: '3'
        },
        {
          label: '网页文章',
          value: '2'
        },
        {
          label: '公众号文章',
          value: '1'
        }
      ],
      frmRules: {
        title: [
          {
            required: true,
            message: '请输入标题'
          }
        ],
        classify_id: [
          {
            required: true,
            message: '请选择内容分类'
          }
        ],
        cover: [
          {
            required: true,
            message: '请上传封面图'
          }
        ],
        content: [
          {
            required: true,
            message: '请填写内容'
          }
        ],
        video: [
          {
            required: true,
            message: '请上传视频'
          }
        ],
        digest: [
          {
            required: true,
            message: '请输入简介'
          }
        ],
        author: [
          {
            required: true,
            message: '请输入内容来源'
          }
        ],
        original_url: [
          {
            required: true,
            message: '请输入链接'
          }
        ],
        appid: [
          {
            required: true,
            message: '请输入appid'
          }
        ]
      }
    };
  },
  created() {
    if (this.check) {
      this.images = [
        {
          file_path: this.detail.cover
        }
      ];
      this.groupFrm = JSON.parse(JSON.stringify(this.detail));
    } else if (this.action === 'modify') {
      this.tabLoading = true;
      this.getData();
    }
    this.getLabelifiCations();
  },
  methods: {
    getData() {
      // 获取频道数据
      ColumnsApi.get(this.$route.params.id).then(res => {
        res.show_type = res.show_type + '';
        this.groupFrm = res;
        this.images = [
          {
            // 裁剪组件内img数据格式
            file_path: res.cover
          }
        ];
        this.tabLoading = false;
      });
    },
    setVdo(url) {
      // 上传视频
      this.groupFrm.video = url;
    },
    handleClick(tab, event) {
      console.log('======');
      console.log(this.groupFrm.article_type);
    },
    delVdo() {
      // 删除视频
      this.groupFrm.video = '';
    },
    currentChangeLabel(e) {
      this.labelifiCation_page_info.pageIndex = e;
      this.getLabelifiCations();
    },
    getLabelifiCations() {
      // 获取标签信息
      this.labelifiCation_page_info.tabLoading = true;
      Auxiliary.label
        .list({
          pageIndex: this.labelifiCation_page_info.pageIndex,
          pageSize: this.labelifiCation_page_info.pageSize
        })
        .then(data => {
          this.labelifiCations = data.result;
          this.labelifiCation_page_info.totalCount = data.totalCount * 1;
          this.labelifiCation_page_info.tabLoading = false;
        });
    },
    get_pic(data) { // 裁剪
      this.images = data;
      this.groupFrm.cover = data[0] && data[0].file_path ? data[0].file_path : '';
      this.groupFrm.cover_id = data[0] && data[0].id ? data[0].id : 0;
    },
    bandClick(flag) {
      if (flag) {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            var groupFrm = Object.assign({}, this.groupFrm);
            groupFrm.content = groupFrm.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
            if (groupFrm.show_type === '1') {
              groupFrm.original_url = '';
              groupFrm.appid = '';
            } else {
              groupFrm.content = '';
              groupFrm.video = '';
            }
            ColumnsApi.editDrafts(groupFrm).then(res => {
              if (res.success) {
                this.$emit('bandClick', groupFrm);
              }
            });
          }
        });
      } else {
        this.$emit('bandClick', null);
      }
    },
    save() {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          var groupFrm = Object.assign({}, this.groupFrm);
          groupFrm.content = groupFrm.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
          if (groupFrm.show_type === '1') {
            groupFrm.original_url = '';
            groupFrm.appid = '';
          } else {
            groupFrm.content = '';
            groupFrm.video = '';
          }
          (this.action === 'modify'
            ? ColumnsApi.articlesEdit(groupFrm)
            : ColumnsApi.articlesAdd(groupFrm)).then(() => {
            this.$router.back();
          });
        }
      });
    },
    preView() {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          var groupFrm = Object.assign({}, this.groupFrm);
          groupFrm.content = groupFrm.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
          if (groupFrm.show_type === '1') {
            groupFrm.original_url = '';
            groupFrm.appid = '';
          } else {
            groupFrm.content = '';
            groupFrm.video = '';
          }
          ColumnsApi.preDetail(groupFrm).then((res) => {
            window.open(res.preview_url);
          });
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
