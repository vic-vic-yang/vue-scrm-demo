<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container editor-container">
    <textarea :placeholder="placeholder" :id="tinymceId" class="tinymce-textarea"></textarea>
    <div class="editor-custom-btn-container video" :style="{'right':file_show?'216px':'110px'}" v-if="video_show">
      <editorVideo color="#1890ff" class="editor-upload-btn" @successVideo="videoSuccessCBK"/>
    </div>
    <div class="editor-custom-btn-container video" v-if="file_show">
      <editorVideo color="#1890ff" class="editor-upload-btn" accept="*" :is_video="false" @successVideo="fileUploadSuccessCBK"/>
    </div>
    <div :class="['editor-custom-btn-container-link', !uploadImgShow ? 'editor-custom-btn-container' : '']" v-show="miniLinkShow">
      <mini-link color="#1890ff" class="editor-upload-btn"  @successMiniLink="successMiniLink"/>
    </div>
    <div :class="['editor-custom-btn-container-keywords', uploadImgShow ? 'editor-custom-btn-container-keywords-show' : '']" v-show="keywordsShow">
      <insertKeywords color="#1890ff" :keywords="keywords" class="editor-upload-btn" @successKeywords="successKeywords"/>
    </div>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/>
    </div>
  </div>
</template>

<script>
  import editorImage from './components/editorImage';
  import miniLink from './components/miniLink';
  import insertKeywords from './components/insertKeywords';
  import editorVideo from './components/editorvideo';
  import plugins from './plugins';
  import toolbar from './toolbar';

  export default {
    name: 'Tinymce',
    components: { editorImage, miniLink, insertKeywords, editorVideo },
    props: {
      id: {
        type: String,
        default: function() {
          return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
        }
      },
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return [];
        }
      },
      menubar: {
        type: String,
        default: 'file edit insert view format table'
      },
      height: {
        type: Number,
        required: false,
        default: 360
      },
      uploadImgShow: {
        type: Boolean,
        default: true
      },
      miniLinkShow: {
        type: Boolean,
        default: false
      },
      keywordsShow: {
        type: Boolean,
        default: false
      },
      keywords: {
        type: Array,
        default: () => []
      },
      video_show: {
        type: Boolean,
        default: false
      },
      file_show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false,
        languageTypeList: {
          'en': 'en',
          'zh': 'zh_CN'
        }
      };
    },
    computed: {
      language() {
        return this.languageTypeList[this.$store.getters.language];
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''));
        }
      },
      language() {
        this.destroyTinymce();
        this.$nextTick(() => this.initTinymce());
      }
    },
    mounted() {
      this.initTinymce();
    },
    activated() {
      this.initTinymce();
    },
    deactivated() {
      this.destroyTinymce();
    },
    destroyed() {
      this.destroyTinymce();
    },
    methods: {
      initTinymce() {
        const _this = this;
        window.tinymce.init({
          language: this.language,
          selector: `#${this.tinymceId}`,
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: this.menubar,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          fontsize_formats: '10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 40px 50px',
          link_title: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value);
            }
            _this.hasInit = true;
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true;
              this.$emit('input', editor.getContent());
            });
          },
          setup(editor) {
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state;
            });
          },
          images_upload_handler: function(blobInfo, success, failure) {
            alert('2323');
          },
          insertimage_callback: cb => {
            console.log('dsfsdfsdfsdfs');
          }
        });
      },
      destroyTinymce() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy();
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value);
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent();
      },
      imageSuccessCBK(arr) {
        console.log('asdasdasd');
        const _this = this;
        arr.forEach(v => {
          window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`);
        });
      },
      successMiniLink(data) {
        const _this = this;
        window.tinymce.get(_this.tinymceId).insertContent(`<a href="${data.url}" data-miniprogram-appid="${data.app_id}" data-miniprogram-path="${data.path}">${data.title}</a>`);
      },
      successKeywords(data) {
        const _this = this;
        window.tinymce.get(_this.tinymceId).insertContent(`{${data}}`);
        window.tinymce.get(_this.tinymceId).addMenuItem({
          icon: 'link',
          text: 'keywords'
        });
        window.tinymce.get(_this.tinymceId).addContextMenu('keywords', {});
      },
      videoSuccessCBK(arr) {
        console.log(arr);
        const _this = this;
        arr.forEach(v => {
          window.tinymce.get(_this.tinymceId).insertContent(`<video class="wscnph" controls="controls" src="${v.url}" poster="${v.cover}"></video>`);
        });
      },
      fileUploadSuccessCBK(arr) {
        console.log(arr);
        const _this = this;
        arr.forEach(v => {
          window.tinymce.get(_this.tinymceId).insertContent(`<a href="${v.url}">文件</a>`);
        });
      }
    }
  };
</script>

<style scoped>
  .tinymce-container {
    position: relative;
  }
  .tinymce-container>>>.mce-fullscreen {
    z-index: 10000;
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container-link {
    position: absolute;
    right: 110px;
    top: 0;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 0;
    /*z-index: 2005;*/
  }
  .video{
    right: 110px;
  }
  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .editor-upload-btn {
    display: inline-block;
  }
  .editor-custom-btn-container-keywords{
    position: absolute;
    right: 120px;
    top: 0;
  }
  .editor-custom-btn-container-keywords-show{
    position: absolute;
    right: 228px;
    top: 0;
  }
</style>
