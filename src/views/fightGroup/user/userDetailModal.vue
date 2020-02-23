<template>
  <el-dialog title="用户详情" :visible.sync="showUserDetail" width="600px">
    <div class="user-detail-wrapper" v-loading="pageLoading">
      <template v-if="errorMessage || pageLoading">
        <div class="user-detail-error text-center">
          <i v-if="errorMessage" class="el-icon-error" style="font-size: 24px"></i>
          <p>{{errorMessage}}</p>
        </div>
      </template>
      <template v-else>
        <div class="user-detail-info d-flex flex-align-center">
          <h3 class="mr-20">姓名 : </h3>
          <p>{{userDetail.userName}}</p>
        </div>
        <div class="user-detail-info d-flex flex-align-center">
          <h3 class="mr-20">手机 : </h3>
          <p>{{userDetail.phone}}</p>
        </div>
        <div class="user-detail-info d-flex flex-align-center">
          <h3 class="mr-20">地址 : </h3>
          <p>{{userDetail.address}}</p>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
  import UserManagement from '@/api/answer/userManagement';

  export default {
    name: 'userDetailModal',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default: () => {
        }
      }
    },
    computed: {
      showUserDetail: {
        set(val) {
          this.$emit('update:show', val);
        },
        get() {
          return this.show;
        }
      }
    },
    data() {
      return {
        userDetail: {},
        errorMessage: null,
        pageLoading: true
      };
    },
    watch: {
      show: {
        immediate: true,
        handler(val) {
          if (val === true && this.detail && this.detail.userId) {
            this.errorMessage = null;
            this.userDetail = {};
            this.getData();
          }
        }
      }
    },
    methods: {
      getData() {
        this.pageLoading = true;
        UserManagement.user.get(this.detail.userId)
          .then(res => {
            this.userDetail = res;
            this.pageLoading = false;
          })
          .catch(err => {
            let errMsg = err.message;
            if (err.response && err.response.data && err.response.data.message) {
              errMsg = err.response.data.message;
            }
            this.errorMessage = errMsg;
            this.pageLoading = false;
          });
      }
    }
  };
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  @import "../../../styles/variables";
  .user-detail-error{
    color: $pink;
  }
</style>
