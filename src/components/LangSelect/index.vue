<!--
 * @Description: 语言切换
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 -->
<template>
  <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
    <div class="el-dropdown-link">
      <!-- <svg-icon class-name='international-icon' icon-class="language" /> -->
      {{lang_text}}<i class="el-icon-arrow-down el-icon--right"></i>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
      <el-dropdown-item command="fr" :disabled="language==='fr'">Français</el-dropdown-item>
      <el-dropdown-item command="es" :disabled="language==='es'">Español</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      lang_text: ''
    };
  },
  computed: {
    language() {
      let text = '';
      switch (this.$store.getters.language) {
        case 'zh' : text = '中文'; break;
        case 'en' : text = 'English'; break;
        case 'fr' : text = 'Français'; break;
        case 'es' : text = 'Español'; break;
      }
      this.lang_text = text;
      return this.$store.getters.language;
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch('setLanguage', lang);
      this.$message({
        message: 'switch language success',
        type: 'success'
      });
      this.$router.replace('/');
      location.reload();
    }
  }
};
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>


