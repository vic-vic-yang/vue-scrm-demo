<template>
  <div class="detail-card d-flex flex-align-center">
    <!--<div class="detail-pic flex-shrink-0 mr-20" v-if="teamDetail.imageUrl">-->
    <!--<img alt="团队LOGO" :src="teamDetail.imageUrl"/>-->
    <!--</div>-->
    <div class="detail-content flex-box-autoFix">
      <h3>{{title}}</h3>
      <div class="sub-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailCard',
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .detail-pic {
    width: 200px;
    height: 120px;
    border-radius: 5px;
    overflow: hidden;
    line-height: 0;
    > img {
      width: 100%;
      height: 100%;
      line-height: 120px;
    }
  }

  .detail-card {
    padding: 12px 24px;
    margin-bottom: 30px;
    background-color: #ffffff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    overflow: hidden;
    color: #666666;
  }
</style>
