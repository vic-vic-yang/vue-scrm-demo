<template>
  <div class="login-container">

    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">

      <div class="title-container">
        <h3 class="title">{{$t(isSupplier?'login.titleSupplier':'login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>

      <template v-if="type == 0">
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
          <el-input name="username" type="text" v-model.trim="loginForm.username" autoComplete="off"
                    :placeholder="$t('login.username')"
          />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                    autoComplete="off"
                    :placeholder="$t('login.password')"/>
          <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
        </el-form-item>

        <el-form-item prop="code">
          <!--<span class="svg-container">-->
          <!--<svg-icon icon-class="password" />-->
          <!--</span>-->
          <el-input name="code" class="auth-code-input" @keyup.enter.native="handleLogin" v-model="loginForm.code" autoComplete="off"
                    placeholder="验证码" :maxlength="4">
            <div class="user-auth__code" slot="append">
              <img @click="getCode()" :src="codeImgUrl"/>
            </div>
          </el-input>
        </el-form-item>
      </template>

      <template v-if="type == 1">
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
          <el-input name="username" type="text" v-model.trim="loginForm.phone" :maxlength="11" autoComplete="off"
                    :placeholder="$t('login.phone')"
          />
        </el-form-item>
        <el-form-item prop="code" style="border: none;background: none;">
          <div class="code-input-div">
            <span class="svg-container">
              <svg-icon icon-class="email"/>
            </span>
            <el-input name="code" class="auth-code-input code-input" @keyup.enter.native="handleLogin" v-model="loginForm.code" autoComplete="off"
                      placeholder="验证码" :maxlength="6">
            </el-input>
          </div>

          <div class="code-input-btn">
            <el-button class="code-btn" type="primary" @click="getVerificationCode">{{codeText}}</el-button>
          </div>
        </el-form-item>
      </template>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading"
                 @click.native.prevent="handleLogin">{{$t('login.logIn')}}
      </el-button>

      <!-- <div class="tips" style="padding:19px 0;">
       
      </div> -->
      <div class="bt_view">
        <el-button v-if="!isSupplier" class="thirdparty-button" type="primary" @click="changeLogin">{{ type == 0 ? '手机号码登录' : '账号登录' }}</el-button>
      </div>

    </el-form>

  </div>
</template>

<script>
  import { getVerifyCode, getPhoneVerifyCode, getAuthUrl, loginByAuth, getSupplierVerifyCode } from '@/api/login';
  import LangSelect from '@/components/LangSelect';
  import SocialSign from './socialsignin';

  const TIME = 60;
  export default {
    components: { LangSelect, SocialSign },
    name: 'login',
    data() {
      return {
        codeImgUrl: '',
        showDialog: false,
        type: 0, // 0，账户密码登录； 1，手机号码验证登录;
        codeText: '获取验证码',
        use_timer: TIME,
        timer: null,
        loginForm: {
          username: '',
          password: '',
          code: '',
          codeSessionId: '',
          phone: ''
        },
        loginRules: {
          username: [{ required: true, message: '用户名必填' }],
          password: [{ required: true, message: '密码必填' }],
          code: [{ required: true, message: '验证码必填' }],
          phone: [{ required: false, message: '验证码必填' }]
        },
        passwordType: 'password',
        loading: false,
        isSupplier: false
      };
    },
    computed: {
      is_valid() {
        if (!this.loginForm.phone.match(/^1[34578]\d{9}$/)) {
          return false;
        }
        return true;
      }
    },
    created() {
      if (window.location.href && window.location.href.indexOf('supplier.scrm.buerkongjian.com') > -1) {
        this.isSupplier = true;
      }
      this.getCode();
      this.getQueryParams();
    },
    mounted() {
    },
    methods: {
      changeLogin() {
        if (this.type === 1) {
          this.type = 0;
          this.loginRules.username[0].required = true;
          this.loginRules.password[0].required = true;
          this.loginRules.phone[0].required = false;
        } else {
          this.type = 1;
          this.loginRules.phone[0].required = true;
          this.loginRules.username[0].required = false;
          this.loginRules.password[0].required = false;
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = '';
        } else {
          this.passwordType = 'password';
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            const loginForm = this.loginForm;
            var loginForms = null;
            if (this.type === 0) {
              loginForms = (({ username, password, code, codeSessionId }) => ({ username, password, code, codeSessionId }))(loginForm);
            } else {
              loginForms = (({ phone, code }) => ({ phone, code }))(loginForm);
            }
            this.$store.dispatch(this.isSupplier ? 'LoginBySupplier' : 'LoginByUsername', loginForms).then(() => {
              this.loading = false;
              this.$router.push({ path: '/' });
            }).catch(err => {
              var data = err.response.data;
              if (data.code === 602) { // 验证码错误，重新获取验证码
                this.getCode();
              }
              this.loading = false;
            });
          } else {
            return false;
          }
        });
      },
      getCode() {
        (this.isSupplier ? getSupplierVerifyCode() : getVerifyCode()).then(res => {
          this.codeImgUrl = res.imgBase64;
          this.$set(this.loginForm, 'codeSessionId', res.codeSessionId);
        });
      },
      getVerificationCode() {
        if (this.is_valid) {
          getPhoneVerifyCode({ phone: this.loginForm.phone }).then(res => {
            this.countDown();
          });
        } else {
          this.$message({
            type: 'info',
            message: '请输入正确的手机号码'
          });
        }
      },
      countDown() {
        this.timer = setTimeout(() => {
          this.beginTimer();
        }, 1000);
      },
      beginTimer() {
        this.use_timer -= 1;
        this.codeText = `(${this.use_timer}s)`;
        if (this.use_timer >= 1) {
          this.countDown();
        } else {
          this.use_timer = TIME;
          this.codeText = '重新获取验证码';
          clearTimeout(this.timer);
        }
      },
      // 获取url参数
      getQueryParams() {
        const params = this.$route.query;
        if (params.hasOwnProperty('id')) {
          this.getAuthUrl();
        } else if (params.code && params.signature) {
          console.log('授权登录');
          this.loginByAuth(params.code, params.signature);
        } else {
          console.log(params);
        }
      },
      // 通过授权登录
      loginByAuth(code, signature) {
        const params = { code, signature };
        loginByAuth(params)
          .then((res) => {
            this.$store.commit('SET_USER_INFO', res.data);
            this.$store.commit('SET_TOKEN', res.data.access_token);
            this.loading = false;
            this.$router.push({ path: '/' });
            console.log('授权登录成功');
          }).catch(err => {
            this.loading = false;
            console.log('授权登录失败', err);
          });
      },
      // 获取授权地址
      getAuthUrl() {
        getAuthUrl()
          .then(res => {
            if (res.data && res.data.url) {
              window.location.href = res.data.url;
            }
          });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      width: 85%;
      &.auth-code-input{
        width: 100%;
      }
      &.code-input{
        width: 75%;
      }
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 50px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .code-input-div{
      display: inline-block;
      width: 55%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .code-input-btn{
      float: right;
      .code-btn{
        width: 110px;
        color: #fff;
        padding: 15px 0;
        margin-top: 2px;
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      max-width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .bt_view{
      display: flex;
      justify-content: flex-end
    }
    .thirdparty-button {
    
    }
  }
</style>
