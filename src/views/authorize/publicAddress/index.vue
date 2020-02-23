<template>
  <div class="app-container" v-loading="pageLoading">
    <h4 class="mv-30">授权微信公众号
      <el-button v-if="userGuideUrl" type="text" class="mh-10" @click="introduceHandler">教程说明</el-button>
      <el-button type="text" @click="bindHandler" class="mh-10"><i class="el-icon-plus mr-5"></i>添加微信公众号</el-button>
    </h4>
    <template v-if="authInfo && authInfo.length > 0">
      <el-card class="mv-30" v-for="item in authInfo" :key="item.id">
        <el-row>
          <el-col :span="20">
            <div class="text item"><span class="span">公众号微信号：</span>{{item.alias}}
              <small class="gray" style="margin-left: 15px;" v-if="item.alias == ''">你的公众号暂未设置微信号，请设置后重新授权</small>
              <el-button style="margin-left: 30px" type="text" @click.prevent="renewbindHandler">重新授权</el-button>
              <el-button style="margin-left: 15px" type="text" @click.prevent="unbindHandler(item)">解除绑定</el-button>
            </div>
            <div class="text item"><span class="span">公众号昵称：</span>{{item.nick_name}}</div>
            <div class="text item"><span class="span">主体信息：</span>{{item.principal_name}}</div>
            <div class="text item"><span class="span">微信账号类型：</span>
              {{item.verify_type == -1 ? '未认证' : '已认证'}}{{item.service_type == 2 ? '服务号' : '订阅号'}}
              <el-tooltip placement="right-start" v-if="item.verify_type == -1">
                <div slot="content" style="max-width: 350px;">
                  <div class="right-title">友情提示：</div>
                  <div class="right-text">如果你的公众号已成功升级（从未认证升级为认证号），请点击重新授权</div>
                  <div class="right-title">如何升级：</div>
                  <div class="right-text right-text-last">
                    如需对公众号进行微信认证，请登录微信公众平台->公众号设置，在“认证情况”栏目，点击申请微信认证</div>
                </div>
                <i style="font-size: 16px;cursor: pointer;" class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <div class="text item" v-if="item.func_info && item.func_info.length > 0">
              <span class="span">已授权权限：</span>
              <el-button type="text" @click.prevent="checkJurisdiction(item.func_info)">查看</el-button>
            </div>
            <div class="text item" v-else>
              <span class="span">权限状态：</span>
              <small style="color: #CC6600;">您的公众号已在微信后台取消授权</small>
              <el-button style="margin-left: 30px" type="text" @click.prevent="renewbindHandler">重新授权</el-button>
            </div>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <div class="public-member-avatar mr-20">
              <!--<img :src="item.qrcode_url" alt="qrCode"/>-->
              <iframe :id="'f' + item.id" src="" frameBorder="0"></iframe>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </template>
    <template v-else>
      <el-card class="mv-30">
        <div class="text-center">
          <p class="text-999 mh-10">暂无绑定任何微信公众号</p>
          <el-button  type="text" @click="bindHandler">去授权绑定<i class="icon el-icon-arrow-right ml-10"></i></el-button>
        </div>
      </el-card>
    </template>

    <el-dialog
      title="提示"
      :visible.sync="dialogRelieve"
      width="30%">
      <span class="gray">解除绑定微信号，会造成当前店铺的重要信息丢失（包括但不仅限于图文素材、自动回复、自定义菜单、公众号粉丝、分销员客户关系）请谨慎操作</span>
      <div class="relieve-checkbox">
        <el-checkbox v-model="dbRelieve" label="已知晓解除绑定的风险，确认解绑"></el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="!dbRelieve" type="primary" @click="unbindHandlerDialog">解除绑定</el-button>
        <el-button @click="dialogRelieve = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.dialogVisible"
      width="30%">
      <span>{{dialog.content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDialog(dialog.type)">{{dialog.confirmText}}</el-button>
        <el-button @click="cancelDialog(dialog.type)">{{dialog.cancelText}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="公众号授权权限列表"
      :visible.sync="dialogJurisdiction"
      width="30%">
      <p class="ju-item">展示公众号已授权给开放平台的权限</p>
      <div class="ju-cont">
        <div class="item" v-for="(item, index) in ju_list" :key="index">
          <el-tag type="success" v-if="item.funcscope_category.name != '未知'">{{item.funcscope_category.name}}</el-tag>
          <!--<span v-if="item.funcscope_category.name != '未知'">{{item.funcscope_category.name}}</span>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import wxManager from '@/api/authorize/wxManager';

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
          .catch((err) => {
            console.log(err);
            next(vm => {
              Object.assign(vm.dialog, {
                title: '',
                type: 0,
                dialogVisible: true,
                content: '开放平台帐号管理权限” 已授权给其他平台，不能重复授权，请先到微信公众号后台->公众号设置->授权管理，取消原第三平台的授权',
                cancelText: '关闭',
                confirmText: '已取消，重新授权'
              });
            });
          });
      } else {
        next();
      }
    },
    data() {
      return {
        pageLoading: true,
        dialogVisible: false,
        dialogRelieve: false,
        dialogJurisdiction: false,
        dbRelieve: false,
        userGuideUrl: '',
        authInfo: [],
        authStatus: 0,
        authUrl: '',
        ju_list: null,
        dialog: {
          title: '',
          type: 0, // 0-绑定失败,1-重新授权, 2 - 点击坦克按钮重新授权,手动点击授权成功与否
          dialogVisible: false,
          content: '',
          cancelText: '取消',
          confirmText: '确定'
        },
        un_id: 0
      };
    },
    watch: {
      dialogRelieve(val) {
        if (!val) {
          this.dbRelieve = false;
        }
      }
    },
    created() {
      Promise.all([this.getData(), this.getAuthUrl()])
        .then(() => {
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
    },
    mounted() {
      setTimeout(() => {
        this.authInfo.map(item => {
          this.setImg(item);
        });
      }, 1000);
    },
    methods: {
      setImg(data) {
        var src = ['src' + data.id];
        window[src] = '';
        var f = document.getElementById('f' + data.id);
        window[src] = '<img id="img" width="120px" height="120px" alt="qrCode" src=\'' + data.qrcode_url + '?' + Math.random() + '\' />';
        f.src = `javascript:parent.${src}`;
      },
      getData() {
        return wxManager.getThirdAuthInfo({ type: 2 })
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
        return wxManager.getAuthUrl({ type: 2 })
          .then(res => {
            this.authUrl = res.authUrl;
            return res;
          })
          .catch(err => {
            return Promise.reject(err);
          });
      },
      checkJurisdiction(data) {
        this.ju_list = data;
        this.dialogJurisdiction = true;
      },
      // 添加公众号
      bindHandler() {
        this.authUrl && window.open(this.authUrl, '_self');
      },
      // 重新授权
      renewbindHandler() {
        Object.assign(this.dialog, {
          title: '提示',
          type: 1,
          dialogVisible: true,
          content: '只可重新授权当前授权的小程序。如果要授权其他小程序，请先解除授权当前的小程序。',
          cancelText: '取消',
          confirmText: '重新授权'
        });
      },
      // 解除绑定
      unbindHandler(item) {
        this.un_id = item.id;
        this.dialogRelieve = true;
      },
      // 确定解除绑定
      unbindHandlerDialog() {
        wxManager.unbind({
          id: this.un_id
        }).then(() => {
          this.un_id = 0;
          this.dialogRelieve = false;
          location.reload();
        });
      },
      cancelDialog(type) {
        this.dialog.dialogVisible = false;
        if (type === 2) {
          location.reload();
        }
      },
      confirmDialog(type) {
        this.dialog.dialogVisible = false;
        if (type * 1 === 1 || type * 1 === 0) {
          this.authUrl && window.open(this.authUrl, '_blank');
          Object.assign(this.dialog, {
            title: '提示',
            type: 2,
            dialogVisible: true,
            content: '请在新窗口中完成公众号授权',
            confirmText: '授权成功',
            cancelText: '授权失败'
          });
        } else if (type === 2) {
          location.reload();
        }
      },
      introduceHandler() {
        this.userGuideUrl && window.open(this.userGuideUrl, '_blank');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 5px 0;

  }
  .span{
     display: inline-block;
     min-width: 120px;
     text-align: right;
  }

  .relieve-checkbox{
    margin: 80px 0 0;
  }

  .ju-item{
    font-size: 14px;
    padding: 5px 0;
  }

  .ju-cont{
    font-size: 14px;
    overflow: hidden;
    .item{
      display: inline-block;
      padding: 15px 20px;
      span{
        display: inline-block;
        margin-left: 5px;
      }
    }
  }

  .right-title {
    font-weight: bold;
    padding: 15px 10px;
  }

  .right-text {
    padding: 0 10px;
  }
  .right-text-last{
    padding-bottom: 15px;
  }

  .public-member-avatar{
    display: inline-block;
    width: 120px;
    height: 120px;
    line-height: 0;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .gray {
    color: #909399;
  }
</style>
