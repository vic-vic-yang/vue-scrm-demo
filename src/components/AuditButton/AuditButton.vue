<template>
  <button
    v-if="audit"
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'ElButton',

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean,
      operate: String,
      auditRoute: String
    },

    mounted() {
      // 检查在当前路由是否有权限
      // 白名单 - 登录、404、401等
      const whiteList = ['/login', '/authredirect', '/404', '/401'];
      if (whiteList.indexOf(this.$route.path) !== -1) {
        this.audit = true;
        return;
      }

      const audit = this.getAudit(this.$route.name);
      // if (!audit && this.auditRoute) {
      //   // 没有获取到权限，则通过参数指定的路由来获取权限，没有菜单栏的页面可以通过这种方式来获取权限
      //   audit = this.getAudit(this.auditRoute);
      // }
      this.audit = audit;
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      buttonDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      }
    },
    data() {
      return {
        audit: true
      };
    },
    methods: {
      /**
       * 获取权限
       * @param routeName
       * @returns {boolean}
       */
      getAudit(routeName) {
        const auditMap = this.$store.state.permission.leafAuditMap[routeName];
        // if (!auditMap) {
        //   // 理论上来说所有的可访问页面都应该有auditMap，如果这里没有的话直接返回无权限
        //   console.log('getAudit has no auditMap', routeName);
        //   return false;
        // }
        if (auditMap && !auditMap.all) {
          if (this.operate && !auditMap[this.operate]) {
            // console.log('AuditButton mounted no permission', this.operate, auditMap);
            return false;
          }
        }
        return true;
      },
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
