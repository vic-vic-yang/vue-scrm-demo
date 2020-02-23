<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>
      <span class="international right-menu-item clear" @click="clearCatch">清除缓存</span>
      <!-- <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>-->
      <!-- <span class="international right-menu-item">当前站点</span> -->
      <lang-select class="international right-menu-item"></lang-select>
      <div class="international right-menu-item message" @click="showData">
        <i class="el-icon-message message-img"></i>
        <div v-show="messageNum" class="tips"></div>
      </div>
      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>-->

      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="click"
        @visible-change="userInfoDropChange"
      >
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="userInfo.avatar" />
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
            <span @click="bingUser" class="d-block">绑定账户</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="changeDiaShow = true" class="d-block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" class="d-block">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <pass-dia v-if="changeDiaShow" @closed="changeDiaShow = false" />

    <!-- 展示绑定账户的dialog -->
    <el-dialog
      title="绑定账户"
      :visible.sync="bingDialogShow"
      class="bind-dialog-163e"
      >
      <b>使用模板消息前，你需要使用微信扫码绑定你的微信账户</b>
      <img :src="qrcodeImg" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button @click="bingDialogShow = false">取消绑定</el-button>
        <el-button type="primary" @click="bingDialogShow = false">已绑定完成</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";
import { parseTime } from "@/utils";
import passDia from "./changePasswordDia";
import Common from "@/api/common/index";
import Approval from "@/api/contentPlatform/approval";
import QRCode from "qrcode";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    passDia
  },
  computed: {
    ...mapGetters(["sidebar", "userInfo"])
  },
  data() {
    return {
      sysTime: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}"),
      sysTimeTimer: null,
      changeFrm: {
        old: "",
        new: "",
        reNew: ""
      },
      changeDiaShow: false,
      bingDialogShow: false, // 绑定微信账户的dialog
      qrcodeImg: '',
      messageNum: 0,
      timer: null
    };
  },
  created() {
    this.initData();
  },
  methods: {
    bingUser() {
      Common.getBindUrl().then(res => {
        QRCode.toDataURL(res)
          .then(url => {
            this.qrcodeImg = url;
            this.bingDialogShow = true;
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    initData() {
      this.getMessage();
      this.timer = setInterval(() => {
        this.getMessage();
      }, 60000);
    },
    getMessage() {
      Approval.list({
        pageIndex: 1,
        pageSize: 10,
        type: 1
      }).then(data => {
        this.messageNum = data.totalCount * 1;
      });
    },
    changePassword() {
      this.$refs.changeFrm.validate(valid => {
        if (valid) {
          console.log(this.changeFrm);
        }
      });
    },
    userInfoDropChange(visible) {
      if (visible) {
        this.sysTimeTimer = setInterval(() => {
          this.sysTime = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}");
        }, 5000);
      } else {
        clearInterval(this.sysTimeTimer);
      }
    },
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    },
    clearCatch() {
      Common.clear().then(res => {
        this.$message({
          type: "success",
          message: "清楚缓存成功"
        });
      });
    },
    showData() {
      if (this.messageNum) {
        this.$router.push({ name: "contentApprovalManagment" });
      } else {
        this.$message({
          type: "info",
          message: "暂无待审核内容"
        });
      }
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
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    position: inherit;
    z-index: 100;
    span {
      font-size: 15px;
      color: #666;
    }
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .clear {
      cursor: pointer;
    }
    .clear:active {
      opacity: 0.7;
    }
    .screenfull {
      height: 20px;
    }
    .international {
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

<style lang="scss">
.user-disabled__info {
  color: #666666 !important;
}
.user-disabled__info .title {
  margin: 0;
  font-weight: 600;
}
.sys-time.el-icon-time {
  font-size: 14px;
  line-height: 18px;
}
.sys-time.el-icon-time:before {
  margin-right: 6px;
  font-size: 18px;
  vertical-align: middle;
}
.message {
  position: relative;
  cursor: pointer;
}
.message-img {
  font-size: 18px;
  color: #666666;
}
.tips {
  position: absolute;
  right: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: red;
  top: 15px;
}
.bind-dialog-163e{
  text-align: center;
  img{
    margin: 0 auto;
    display: block;
    width: 200px;
    height: 200px;
  }
}
</style>
