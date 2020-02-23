<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="title" label="站点名称">
        <el-input v-model="formFrm.title" placeholder="请输入站点名称" name="title" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="keywords" label="关键字">
        <el-input v-model="formFrm.keywords" placeholder="请输入关键字" name="keywords" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="description" label="站点描述">
       <!--<Tinymce placeholder="请输入站点描述" :height="300" v-model="formFrm.description"></Tinymce>-->
        <el-input v-model="formFrm.description" placeholder="请输入站点描述" name="description" type="textarea" :clearable="true" :rows="5">
        </el-input>
      </el-form-item>
      <el-form-item prop="url" label="站点地址">
        <el-input v-model="formFrm.url" placeholder="请输入站点地址" name="url" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="imagetype" label="图片类型">
        <el-input v-model="formFrm.imagetype" placeholder="请输入图片类型" name="imagetype" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="imagesize" label="图片大小">
        <el-input v-model="formFrm.imagesize" placeholder="请输入图片类型" name="imagesize" style="width: 500px" :clearable="true">
        </el-input>
        <span>M</span>
      </el-form-item>
      <el-form-item prop="waterfile" label="水印图片">
        <el-input v-model="formFrm.waterfile" placeholder="请输入水印图片" name="waterfile" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="mediatype" label="媒体类型">
        <el-input v-model="formFrm.mediatype" placeholder="请输入媒体类型" name="mediatype" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="mediasize" label="媒体大小">
        <el-input v-model="formFrm.mediasize" placeholder="请输入媒体大小" name="mediasize" style="width: 500px" :clearable="true">
        </el-input>
        <span>M</span>
      </el-form-item>
      <el-form-item prop="doctype" label="附件类型">
        <el-input v-model="formFrm.doctype" placeholder="请输入附件类型" name="doctype" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="docsize" label="附件大小">
        <el-input v-model="formFrm.docsize" placeholder="请输入附件大小" name="docsize" style="width: 500px" :clearable="true">
        </el-input>
        <span>M</span>
      </el-form-item>
      <el-form-item prop="DEFAULT_THEME" label="模板">
        <el-input v-model="formFrm.DEFAULT_THEME" placeholder="请输入模板" name="DEFAULT_THEME" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="copyright" label="版权信息">
        <!--<Tinymce placeholder="请输入版权信息" :height="300" v-model="formFrm.copyright"></Tinymce>-->
        <el-input v-model="formFrm.copyright" placeholder="请输入版权信息" name="copyright" type="textarea" :clearable="true" :rows="5">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button operate="update" type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import SYSTEM from '@/api/configure/system';
  import _ from 'lodash';

  export default {
    name: 'systemSetting',
    components: {
      Tinymce
    },
    data() {
      return {
        pageLoading: true,
        formFrm: {
          title: '',
          keywords: '',
          description: '',
          url: '',
          imagetype: '',
          imagesize: '',
          waterfile: '',
          mediatype: '',
          mediasize: '',
          docsize: '',
          DEFAULT_THEME: '',
          copyright: '',
          doctype: ''
        },
        frmRules: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        SYSTEM.getSettings().then(res => {
          this.formFrm = _.assign({}, this.formFrm, res);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            SYSTEM.settings(formFrm).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.getData();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
