<template>
  <keep-alive :include="cachedViews">
    <router-view :key="key"></router-view>
  </keep-alive>
</template>

<script>
  export default {
    name: 'blankLayout',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews;
      },
      key() {
        return this.$route.fullPath;
      }
    }
  };
</script>

<style scoped>

</style>
