<!--
 * @Description: 
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:17
 -->
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      const hiddenProperty = 'hidden' in document ? 'hidden'
        : 'webkitHidden' in document ? 'webkitHidden'
          : 'mozHidden' in document ? 'mozHidden'
            : null;
      return {
        hiddenProperty: hiddenProperty
      };
    },
    created() {
      if (this.hiddenProperty) {
        const visibilityChangeEvent = this.hiddenProperty.replace(/hidden/i, 'visibilitychange');
        document.addEventListener(visibilityChangeEvent, this.onVisibilityChange);
      }
    },
    methods: {
      onVisibilityChange() {
        if (!!document[this.hiddenProperty] && !this.$store.getters.getUserStatusIsNormal) {
          this.$confirm('登录信息超时', {
            title: '提示',
            type: 'warning',
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false
          }).then(() => {
            window.location.reload();
          });
        }
      }
    }
  };
</script>
<style>
  .el-icon-plus{
    font-size: 13px;
  }
  .cell img{
    max-width: 200px;
    height: auto;
    margin-right: 10px;
  }
  input{
    font-family: 'Times New Roman' !important;
  }
</style>
