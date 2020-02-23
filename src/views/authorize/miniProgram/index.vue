<template>
  <div class="app-container" v-loading="pageLoading">
    <h4 class="mv-30">授权微信小程序
      <el-button v-if="userGuideUrl" type="text" class="mh-10" @click="introduceHandler">教程说明</el-button>
      <el-button type="text" @click="bindHandler" class="mh-10"><i class="el-icon-plus mr-5"></i>添加微信小程序</el-button>
    </h4>
    <template v-if="authInfo && authInfo.length > 0">
      <el-card class="mv-30" v-for="item in authInfo" :key="item.id">
        <el-row>
          <el-col :span="20" :style="{borderRight: item.app_type == 0 ? '1px dashed #e7e7e7' : 'none'}">
            <div class="text item"><span class="span">小程序名称：</span>{{item.nick_name}}
              <small class="gray" style="margin-left: 30px;" v-if="item.status == 0">你的公众号暂未设置微信号，请设置后重新授权</small>
              <el-button style="margin-left: 30px" type="text" @click.prevent="unbindHandler(item)">解除绑定</el-button>
            </div>
            <div class="text item"><span class="span">微信认证：</span>{{item.verify_type == 0 ? '已认证' : (item.verify_type == -1) ? '未认证' : ''}}</div>
            <div class="text item"><span class="span">app_id：</span>{{item.authorizer_appid}}</div>
            <div class="text item">
              <span class="span">自动更新：</span>
              有新版本时自动提交微信审核（若审核失败需手动更新）
              <el-switch
                v-model="item.auto_release"
                :active-value="1"
                :inactive-value="0"
                @change="releaseAutoUpdate(item)">
              </el-switch>
            </div>
            <div class="text item"><span class="span">线上版本：</span>{{item.user_version}}</div>
            <div class="text item"><span class="span">更新时间：</span>
            {{item.create_time}}
            </div>
            <div class="text item">
              <span class="span" style="vertical-align: top;">更新状态：</span>
              <div class="update-status">
                <p v-if="item.code_update_info.is_new_version == 1 && item.code_update_info.audit_status != 2">有新版本可更新{{item.code_update_info.new_version ? `(${item.code_update_info.new_version})` : '' }}</p>
                <p v-if="item.code_update_info.is_new_version == 2 && item.code_update_info.audit_status != 0">已经是最新版本</p>
                <p v-if="item.code_update_info.audit_status == 2"> 小程序{{item.code_update_info.audit_version ? `(${item.code_update_info.audit_version})` : '' }}正在等待微信审核</p>
                <p v-if="item.code_update_info.audit_status == 0">线上版本为最新稳定版</p>
                <p v-if="item.code_update_info.audit_status == 1">审核失败，请到微信小程序后台查看失败原因，解决后可重新提交审核</p>
                <p v-if="item.code_update_info.audit_status == -1 && item.code_update_info.is_new_version != 1">待更新</p>
                <div>
                  <template v-if="item.code_update_info.is_new_version == 1 && item.code_update_info.audit_status != 2">
                    <el-button type="primary" size="mini" @click="updateVersion(item)">更新版本</el-button>
                    <small class="version-small gray-size">新版本更新审核的时候，不会影响之前已经在线上运行的老版本小程序。</small>
                  </template>
                  <template v-else-if="item.code_update_info.audit_status == 2">
                    <small class="gray-size">预计7个工作日内完成审核（遇审核量过大等特殊情况审核会延迟）审核过程中，你当前版本的小程序功能可正常使用</small>
                  </template>
                  <template v-else-if="item.code_update_info.audit_status == 1 || item.code_update_info.audit_status == 0">
                    <el-button :type="item.code_update_info.audit_status == 1 ? 'primary' : ''" size="mini" @click="updateExamine(item)">重新提交审核</el-button>
                  </template>
                </div>
              </div>
             </div>
            <div class="text item">
              <span class="span">已授权权限：</span>
              <small style="color: #CC6600;" v-if="item.status == 0">您的小程序已在微信后台取消授权</small>
              <el-button v-if="item.status == 1" type="text" @click.prevent="checkJurisdiction(item.func_info)">查看</el-button>
              <small class="gray" style="margin-left: 30px;">注意：为保证您在本平台的各项功能使用正常，请保证您已将所有权限集授权给本平台。</small>
            </div>
            <!--<div v-if="item.app_type != 0" class="text item"><span class="span">已绑定功能：</span>{{item.app_type == 1 ? '答题' : (item.app_type == 2 ? '拼团' : '积分')}}</div>-->
            <div v-if="item.app_type != 0" class="text item"><span class="span">已绑定功能：</span>{{item.app_type_name}}</div>
            <div v-if="item.app_type != 0" class="text item">
              <span class="span">跳转其他小程序：</span>
              <el-button v-if="item.status == 1" type="text" @click.prevent="setJumpMiniProgram(item)">设置</el-button>
              <small class="gray" style="margin-left: 30px;">注意：最多可添加10个目标小程序</small>
            </div>
          </el-col>
          <el-col :span="4" style="text-align: center;margin-top: 50px;">
            <div v-if="item.app_type != 0" class="public-member-avatar">
              <img :src="item.qrcode_url" alt="qrCode"/>
              <!--<iframe :id="'f' + item.id" src="" frameBorder="0"></iframe>-->
            </div>
            <template v-else>
              <el-button @click="setMiniProgram(item)">选择小程序功能</el-button>
              <p class="gray-size" style="text-align: center;">根据您的需要选择合适的小程序功能版本</p>
            </template>
          </el-col>
        </el-row>
      </el-card>
    </template>
    <template v-else>
      <el-card class="mv-30">
        <div class="text-center">
          <p class="text-999 mh-10">暂无绑定任何微信小程序</p>
          <el-button  type="text" @click="bindHandler">去授权绑定<i class="icon el-icon-arrow-right ml-10"></i></el-button>
        </div>
      </el-card>
    </template>

    <el-dialog
      title="提示"
      :visible.sync="dialogRelieve"
      width="30%">
      <span class="gray">解除小程序授权后，如果有已经在运行的小程序将无法再继续使用，请谨慎操作</span>
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
      title="小程序授权权限列表"
      :visible.sync="dialogJurisdiction"
      width="30%">
      <p class="ju-item">展示小程序已授权给开放平台的权限</p>
      <div class="ju-cont">
        <div class="item" v-for="(item, index) in ju_list" :key="index">
          <el-tag type="success" v-if="item.funcscope_category.name != '未知'">{{item.funcscope_category.name}}</el-tag>
          <!--<span v-if="item.funcscope_category.name != '未知'">{{item.funcscope_category.name}}</span>-->
        </div>
      </div>
    </el-dialog>
    <!--选择小程序功能-->
    <el-dialog
      :title="is_setting ? '可跳转的小程序名单' : (active == 0 ? '选择小程序功能' : '选择跳转的目标小程序')"
      :visible.sync="dialogFeatures"
      width="35%"
      top="10vh">
      <template v-if="active == 0">
        <div class="features-title">
          <h5>绑定说明</h5>
          <p>1、一个小程序仅能选择发布一个版本，多个小程序可发布同一个版本；</p>
          <p>2、请根据功能建议的小程序类型及类目进行选择版本，否则可能导致小程序功能无法正常使用，或者代码在微信审核失败。</p>
        </div>
        <div class="features-cont">
          <h5>请选择小程序需要绑定的功能</h5>
          <div class="features-ul">
            <div v-for="(item, index) in features_list" @click="selectFeatureItem(item)" :key="item.id" :class="['features-item', item.app_type == features_id ? 'active' : '', index % 2 !== 0 ? 'right' : '']">
              <h5>{{item.app_type_name}}</h5>
              <p>建议类型：{{item.type || '不限'}}</p>
              <p>建议类目：
                <span v-for="(val, i) in item.category_list" :key="i">{{val.first_class + '>' + val.second_class}} {{i < item.category_list.length - 1 ?  ' 、' : ''}} </span>
              </p>
              <i class="el-icon-success"></i>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="active == 1">
        <small v-if="is_setting">注意：修改跳转的appid需要重新提交版本审核</small>
        <div class="features-title" v-else>
          <h5>说明</h5>
          <p>1、如果要在该小程序里使用跳转至其他小程序的功能，请填写要跳转的小程序appid（不超过10个）该名单可在发布新版本时更新，不支持动态修改；</p>
          <p>2、小程序appid可在微信小程序管理后台->开发->开发设置中查看；</p>
          <p>3、由于修改跳转目标小程序只能在发布新版本时更新，所以修改appid之后需要重新提交审核。</p>
        </div>
        <div class="features-cont">
          <div class="mini-program-link">
            <el-form :inline="true">
              <div v-for="(items, index) in mini_program" :key="index" class="link-item">
                <el-form-item :label="'Appid ' + (index + 1) + ' ：'">
                  <el-input placeholder="请输入Appid" v-model="items.app_id"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input placeholder="请输入备注" v-model="items.remarks"></el-input>
                </el-form-item>
                <el-button style="margin-left: 30px" v-if="mini_program.length > 1" type="text" @click.prevent="delLink(items)">移除</el-button>
              </div>
            </el-form>
            <div class="link-add">
              <el-button v-if="mini_program.length < 10" style="margin-left: 30px" type="text" @click.prevent="addLink">+新增可跳转的小程</el-button>
            </div>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <template v-if="is_setting">
          <el-button type="primary" @click="saveMiniProgram">保存</el-button>
          <el-button @click="dialogFeatures = false">取消</el-button>
        </template>
        <template v-else>
          <el-button v-if="active == 0" type="primary" :disabled="features_id == null" @click="nextStep">下一步</el-button>
          <el-button v-if="active == 1" type="primary" @click="determineFeatures">确定</el-button>
          <el-button v-if="active == 1" @click="release">跳过，直接发布</el-button>
        </template>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import wxManager from '@/api/authorize/wxManager';
  import { parseTime } from '@/utils';

  export default {
    name: 'bindMiniProgram',
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
                content: '“开放平台帐号管理权限” 已授权给其他平台，不能重复授权，请先到微信小程序后台->设置，取消原第三平台的授权',
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
        dialogVisible: false,
        dialogRelieve: false,
        dialogJurisdiction: false,
        dialogFeatures: false,
        dbRelieve: false,
        userGuideUrl: '',
        authInfo: [],
        authStatus: 0,
        authUrl: '',
        ju_list: null,
        dialog: {
          title: '',
          type: 0, // 0-绑定失败, 2-授权成功与否，3-更新, 4 - 重新提交审核
          dialogVisible: false,
          content: '',
          cancelText: '取消',
          confirmText: '确定'
        },
        active: 0,
        features_list: [
          {
            id: 0,
            name: '答题',
            type: '不限',
            category: '在线教育'
          },
          {
            id: 1,
            name: '拼团',
            type: '不限',
            category: '电电商平台'
          },
          {
            id: 2,
            name: '抽奖',
            type: '不限',
            category: '休闲娱乐、计算机类办公、效率'
          }
        ],
        features_id: null,
        mini_program: [],
        is_setting: false,
        pageLoading: true,
        un_id: 0, // 解绑的小程序选择的id
        p_id: 0, // 设置功能的小程序选择的id
        up_id: 0, // 更新版本的小程序选择的id
        app_id: 0,
        is_common: false
      };
    },
    watch: {
      dialogRelieve(val) {
        if (!val) {
          this.dbRelieve = false;
        }
      },
      dialogFeatures(val) {
        if (!val) {
          this.features_id = null;
          this.mini_program = [];
          this.active = this.is_setting ? 1 : 0;
        }
      }
    },
    created() {
      Promise.all([this.getFeaturesList(), this.getData(), this.getAuthUrl()])
        .then(() => {
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getData() {
        return wxManager.getThirdAuthInfo({ type: 1 }) // 1 - 小程序,2 - 公众号
          .then(res => {
            res.map((item) => {
              item['user_version'] = item.online_code && item.online_code.user_version ? item.online_code.user_version : '';
              item['create_time'] = item.code_update_info.create_time * 1 === 0 || !item.code_update_info.create_time ? '--' : parseTime(item.code_update_info.create_time);
            });
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
        return wxManager.getAuthUrl({ type: 1 })
          .then(res => {
            this.authUrl = res.authUrl;
            return res;
          })
          .catch(err => {
            return Promise.reject(err);
          });
      },
      getFeaturesList() {
        wxManager.getTemplate().then(res => {
          this.features_list = res.data;
          this.authInfo.map(item => {
            item.app_type_name = '';
            this.features_list.map(val => {
              if (item.app_type * 1 === val.app_type * 1) {
                item.app_type_name = val.app_type_name;
              }
            });
          });
        });
      },
      checkJurisdiction(data) {
        this.ju_list = data;
        this.dialogJurisdiction = true;
      },
      getJumpList(app_id) {
        wxManager.getAppJumpList({
          app_id: app_id
        }).then(res => {
          if (!res.data || !res.data.jump_app_list || res.data.jump_app_list.length === 0) {
            this.mini_program = [
              {
                id: 0,
                remarks: '',
                app_id: ''
              },
              {
                id: 1,
                remarks: '',
                app_id: ''
              }
            ];
          } else {
            this.mini_program = res.data.jump_app_list;
          }
        });
      },
      // 自动更新
      releaseAutoUpdate(data) {
        wxManager.setAutoRelease({
          id: data.id,
          auto: data.auto_release
        });
      },
      // 发布
      releaseFeatures() {
        wxManager.release({
          id: this.features_id
        }).then(res => {
          if (res.data.status * 1 === 1) {
            this.dialogFeatures = false;
            this.active = 0;
            this.features_id = null;
          } else {
            this.$message({
              type: 'info',
              message: '发布失败'
            });
          }
          location.reload();
        }).catch(() => {
          setTimeout(() => {
            location.reload();
          }, 1500);
        });
      },
      // 更新版本
      updateVersion(data, type) {
        this.up_id = data.id;
        Object.assign(this.dialog, {
          title: '提示',
          type: 3,
          dialogVisible: true,
          content: '是否确定要更新版本',
          confirmText: '确认',
          cancelText: '取消'
        });
      },
      // 重新提交审核
      updateExamine(data) {
        this.up_id = data.id;
        Object.assign(this.dialog, {
          title: '提示',
          type: 4,
          dialogVisible: true,
          content: '是否确定要重新提交审核',
          confirmText: '确认',
          cancelText: '取消'
        });
      },
      // 添加小程序
      bindHandler() {
        this.authUrl && window.open(this.authUrl, '_self');
      },
      // 选择小程序
      setMiniProgram(item) {
        this.p_id = item.id;
        this.dialogFeatures = true;
        this.active = 0;
        this.is_setting = false;
        this.getJumpList(item.authorizer_appid);
      },
      // 设置小程序跳转链接
      setJumpMiniProgram(item) {
        this.dialogFeatures = true;
        this.active = 1;
        this.is_setting = true;
        this.app_id = item.authorizer_appid;
        this.getJumpList(item.authorizer_appid);
      },
      // 设置保存
      saveMiniProgram() {
        var i = 0;
        this.mini_program.map(item => {
          if (item.app_id !== '') {
            i += 1;
          }
        });
        if (i < 1) {
          this.$message({
            type: 'info',
            message: '缺少必要参数'
          });
        } else {
          this.saveMiniProgramJump();
        }
      },
      saveMiniProgramJump() {
        const mini_program = this.mini_program;
        mini_program.map((item, index) => {
          if (item.app_id === '') {
            mini_program.splice(index, 1);
          }
        });
        wxManager.setAppJumpList({
          app_id: this.app_id,
          jump_app_list: JSON.stringify(mini_program)
        }).then(() => {
          this.dialogFeatures = false;
          this.active = 0;
          this.is_setting = false;
          if (!this.is_common) {
            location.reload();
          }
        }).catch(() => {
          if (!this.is_common) {
            setTimeout(() => {
              location.reload();
            }, 1500);
          }
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
          location.reload();
          this.dialogRelieve = false;
        }).catch(() => {
          setTimeout(() => {
            location.reload();
          }, 1500);
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
        if (type * 1 === 0) {
          this.authUrl && window.open(this.authUrl, '_blank');
          Object.assign(this.dialog, {
            title: '提示',
            type: 2,
            dialogVisible: true,
            content: '请在新窗口中完成小程序授权',
            confirmText: '授权成功',
            cancelText: '授权失败'
          });
        } else if (type === 2) {
          location.reload();
        } else if (type === 3 || type === 4) {
          // 更新版本
          console.log(this.up_id);
          this.features_id = this.up_id;
          this.releaseFeatures();
        }
      },
      // 下一步
      nextStep() {
        if (this.active++ > 1) this.active = 0;
      },
      // 选择功能
      selectFeatureItem(data) {
        this.features_id = data.app_type;
      },
      // 添加小程序跳转
      addLink() {
        if (this.mini_program.length < 10) {
          var n_id = this.mini_program[this.mini_program.length - 1].id * 1 || this.mini_program.length - 1;
          this.mini_program.push({
            id: n_id + 1,
            app_id: '',
            remarks: ''
          });
        }
      },
      // 移除该小程序
      delLink(data) {
        this.mini_program.map((item, index) => {
          if (item.id === data.id && this.mini_program.length > 1) {
            this.mini_program.splice(index, 1);
          }
        });
      },
      // 确定
      determineFeatures() {
        var i = 0;
        this.mini_program.map(item => {
          if (item.app_id !== '') {
            i += 1;
          }
        });
        if (i < 1) {
          this.$message({
            type: 'info',
            message: '缺少必要参数'
          });
        } else {
          this.is_common = true;
          Promise.all(this.selectFeaturesItem(this.p_id, this.features_id), this.saveMiniProgramJump()).then(() => {
            location.reload();
          }).catch(() => {
            setTimeout(() => {
              location.reload();
            }, 1500);
          });
        }
      },
      // 修改选择功能
      selectFeaturesItem(id, app_type) {
        wxManager.selectFeatures(
          {
            id: id,
            app_type: app_type
          }
        ).then(() => {
          this.dialogFeatures = false;
          this.active = 0;
          this.features_id = null;
        });
      },
      // 点击跳过发布按钮
      release() {
        // 先提交选择的功能或跳转小程序，成功后再发布
        this.is_common = true;
        Promise.all(this.selectFeaturesItem(this.p_id, this.features_id), this.saveMiniProgramJump()).then(() => {
          this.releaseFeatures();
        }).catch(() => {
          setTimeout(() => {
            location.reload();
          }, 1500);
        });
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

  .version-small{
    display: inline-block;
    margin-left: 15px;
  }

  .update-status{
    display: inline-block;
    p {
      margin-top: 0;
    }
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

  .features-title{
    p{
      font-size: 12px;
      color: #666666;
    }
  }


  .features-cont{
    .features-ul{
      overflow: hidden;
      width: 60%;
    }
    .features-item{
      width: 140px;
      min-height: 120px;
      padding: 15px 15px 0 15px;
      position: relative;
      border: 1px solid #e7e7e7;
      box-sizing: content-box;
      border-radius: 10px;
      cursor: pointer;
      float: left;
      margin-bottom: 15px;
      h5{
        margin: 0;
        padding-bottom: 10px;
      }
      p{
        margin: 0;
        font-size: 12px;
      }
      .el-icon-success{
        font-size: 18px;
        color: #0033CC;
        position: absolute;
        right: 10px;
        bottom: 10px;
        display: none;
      }
      &.right{
        float: right;
      }
      &.active{
        border: 1px solid #0033CC;
        .el-icon-success{
         display: block;
        }
      }
    }
    .mini-program-link{
      margin-top: 50px;
    }
  }
  .gray {
    color: #909399;
  }
  .gray-size {
    font-size: 12px;
    color: #909399;
  }

</style>
