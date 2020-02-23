<template>
  <div class="app-container" v-loading="pageLoading">
    <h4 class="mv-30">授权微信小程序
      <el-button v-if="userGuideUrl" type="text" class="mh-10" @click="introduceHandler">教程说明</el-button>
      <el-button v-if="authInfo && authInfo.length > 0" type="text" @click="bindHandler" class="mh-10"><i class="el-icon-plus mr-5"></i>添加小程序</el-button>
    </h4>
    <template v-if="authInfo && authInfo.length > 0">
      <el-card class="mv-30" v-for="item in authInfo" :key="item.id">
        <div slot="header" class="clearfix">
          <label>{{item.nick_name}}</label><small class="mh-10">({{item.service_type*1 === 2 ? '服务号':'订阅号'}})</small>
          <el-button type="text" @click.prevent="unbindHandler(item)"><i class="el-icon-delete mr-5"></i>解除绑定</el-button>
        </div>
        <div class="d-flex flex-align-end">
          <div class="public-member-avatar mr-20">
            <img :src="item.head_img" alt="公众号头像"/>
          </div>
          <div class="auto-content ml-10">
            <p>
              <el-tag
                :type="item.verify_type*1===0?'success':'danger'">
                {{item.verify_type*1===0?'已认证':'未认证'}}
              </el-tag>
            </p>
            <p>
              <span>微信授权功能：</span>
              <el-tag :type="['danger','success'][item.authStatus]">{{ktStatusTxt[item.status]}}</el-tag>
            </p>
          </div>
        </div>
      </el-card>
    </template>
    <template v-else>
      <el-card class="mv-30">
        <div class="text-center">
          <p class="text-999 mh-10">暂无绑定任何小程序</p>
          <el-button  type="text" @click="bindHandler">去授权绑定<i class="icon el-icon-arrow-right ml-10"></i></el-button>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
  import wxManager from '@/api/answer/wxManager';

  export default {
    name: 'bindPublicNumber',
    beforeRouteEnter(to, from, next) {
      const v = to.query.v;
      const auth_code = to.query.auth_code;
      if (v && auth_code) {
        wxManager
          .authCallback({
            code: auth_code,
            v: v
          })
          .then(() => {
            next({ name: to.name, replace: true });
          })
          .catch(() => {
            next();
          });
      } else {
        next();
      }
    },
    data() {
      return {
        pageLoading: true,
        authInfo: [],
        authStatus: 0,
        authStatusTxt: ['未授权', '已授权'],
        ktStatusTxt: ['未开通', '已开通'],
        userGuideUrl: '',
        authUrl: '',
        avatarLoading: true
      };
    },
    created() {
      Promise.all([this.getData(), this.getAuthUrl()])
        .then(() => {
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getData() {
        return wxManager.getThirdAuthInfo()
          .then(res => {
            this.authInfo = res;
            this.authStatus = res.status * 1;
            this.pageLoading = false;
            return res;
          })
          .catch(err => {
            this.pageLoading = false;
            return Promise.reject(err);
          });
      },
      getAuthUrl() {
        return wxManager.getAuthUrl()
          .then(res => {
            this.authUrl = res.authUrl;
            return res;
          })
          .catch(err => {
            return Promise.reject(err);
          });
      },
      bindHandler() {
        this.authUrl && window.open(this.authUrl, '_self');
      },
      unbindHandler(item) {
        this.$confirm(`确定解绑 ${item.nick_name} 公众号吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            wxManager.unbind({
              id: item.id
            }).then(() => {
              this.getData();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消解绑'
            });
          });
      },
      introduceHandler() {
        this.userGuideUrl && window.open(this.userGuideUrl, '_blank');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .public-member-avatar {
    width: 120px;
    height: 120px;
    border: 1px solid #e2e2e2;
    line-height: 0;
    > img {
      width: 100%;
      height: 100%;
    }
  }
</style>
