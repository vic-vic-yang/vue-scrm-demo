<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click"  @visible-change="userInfoDropChange">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="userInfo.avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled class="user-disabled__info">
            <p>您好，{{userInfo.user_name}}</p>
          </el-dropdown-item>
          <el-dropdown-item disabled divided class="user-disabled__info">
            <h5 class="title">系统时间</h5>
            <p class="el-icon-time sys-time">{{sysTime}}</p>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" class="d-block">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import ErrorLog from '@/components/ErrorLog';
import Screenfull from '@/components/Screenfull';
import LangSelect from '@/components/LangSelect';
import ThemePicker from '@/components/ThemePicker';
import { parseTime } from '@/utils';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ])
  },
  data() {
    return {
      sysTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}'),
      sysTimeTimer: null
    };
  },
  methods: {
    userInfoDropChange(visible) {
      if (visible) {
        this.sysTimeTimer = setInterval(() => {
          this.sysTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}');
        }, 5000);
      } else {
        clearInterval(this.sysTimeTimer);
      }
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload();
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<style>
  .user-disabled__info{
    color: #666666!important;
  }
  .user-disabled__info .title{
    margin: 0;
    font-weight: 600;
  }
  .sys-time.el-icon-time{
    font-size: 14px;
    line-height: 18px;
  }
  .sys-time.el-icon-time:before{
    margin-right: 6px;
    font-size: 18px;
    vertical-align: middle;
  }
</style>
