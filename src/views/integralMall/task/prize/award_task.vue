<template>
  <div class="app-container task-list">
    <el-form
      class="activity-edit__form"
      :model="taskFm"
      :rules="frmRules"
      ref="taskFm"
      label-width="160px">
      <div class="step-title">
        <el-steps :active="active" finish-status="success">
          <el-step title="基本设置"></el-step>
          <el-step title="海报设置"></el-step>
          <el-step title="提醒设置"></el-step>
        </el-steps>
      </div>

      <!--基本设置-->
      <div v-if="active === 0">
        <el-form-item prop="app_id" label="公众号App_Id">
          <el-input
            v-model="taskFm.app_id"
            placeholder="公众号App_Id"
            :maxlength="50"
            name="app_id"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="fans" label="任务达标粉丝数">
          <el-input
            v-model="taskFm.fans"
            placeholder="任务达标粉丝数"
            name="fans"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="integral" label="任务达标奖励积分额度">
          <el-input
            v-model="taskFm.integral"
            placeholder="任务达标奖励积分额度"
            name="integral"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="rule" label="任务规则">
          <!--<el-input-->
            <!--v-model="taskFm.rule"-->
            <!--placeholder="任务规则"-->
            <!--name="rule"-->
            <!--type="textarea"-->
            <!--rows="4"-->
            <!--:clearable="true">-->
          <!--</el-input>-->
          <tinymce placeholder="请输入任务规则" :height="300" v-model="taskFm.rule"/>
        </el-form-item>
      </div>

      <!--海报设置-->
      <div v-if="active === 1">
        <el-form-item prop="pic" label="商品图片">
          <div class="commodity-pic">
            <upload-prize-avatar
              :disabled="true"
              :showDelImage="true"
              class="avatar-uploader"
              :key="taskFm.pic[0].id || 0"
              :image-id.sync="taskFm.pic[0].id || 0"
              v-model="taskFm.pic[0].file_path"
              @success="successUpload"
              @del="delHandler()">
            </upload-prize-avatar>
            <small class="text-999">建议尺寸：750*1260，仅支持jpg格式，大小不超过2M</small>
          </div>
        </el-form-item>
      </div>

      <!--提醒设置-->
      <div v-if="active === 2">
        <header class="tips-header">（当前仅支持客服消息类型）</header>
        <ul class="msg-set">
          <li class="msg-list" v-for="(item) in msg_list" :key="item.id">
            <div class="title">
              <span style="display: inline-block;margin-right: 15px;">{{item.name}}</span>
              <el-switch
                v-model="item.status"
                :active-value="1"
                :inactive-value="2"
                @change="changeStatus(item)">
              </el-switch>
            </div>
            <div class="cont">
              <div class="msg">{{item.msg}}</div>
              <div class="operatin">
                <el-button @click="module_show(item)">自定义编辑</el-button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!--底部按钮-->
      <el-form-item>
        <el-button v-if="active > 0 && active <= 2" @click="prev">上一步</el-button>
        <el-button v-if="active <= 0" style="margin-top: 12px;" @click.prevent.stop="$router.back()">取消</el-button>
        <el-button v-if="active <= 0" style="margin-top: 12px;" @click="next">下一步</el-button>
        <el-button v-if="active >= 1 && active < 2" style="margin-top: 12px;" @click="next_pic">下一步</el-button>
        <el-button v-if="active === 2" type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>

    <!--提示设置-->
    <el-dialog
      :title="module_cont.name"
        :visible.sync="dialogVisible"
        top="5vh"
        width="70%">
      <header>编辑提示
        <small>涉及到可变的数据字段，请用以下动态字符进行替换</small>
      </header>
      <el-row style="padding: 10px 0 20px;">
        <el-col :span="12">
          <div> 邀请者昵称： {inviter_nickname}</div>
          <div>受邀者昵称： {invited_nickname}</div>
          <div>任务名称： {mission_name}</div>
          <div>任务量： {mission_count}</div>
        </el-col>
        <el-col :span="12">
          <div>未完成任务量： {unfinished_mission_count}</div>
          <div>已完成任务量： {finished_mission_count}</div>
          <div>任务奖励积分额： {mission_reward_points}</div>
        </el-col>
      </el-row>

      <header>{{module_cont.name}}</header>
      <el-form
        class="activity-edit__form_tips"
        :model="module_cont"
        ref="taskFm"
        label-width="160px">
        <el-form-item label="文本信息">
          <el-input
            v-model="module_cont.content"
            placeholder="文本信息"
            type="textarea"
            rows="6"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="添加文字链接">
              <el-checkbox
                :true-label="1"
                :false-label="0"
                v-model="module_cont.text_link.show"
                @change="checkLink('url')"
                name="show_left_num">
              </el-checkbox>
              <small style="margin-left: 10px;">文字链接加在文本信息末尾</small>
            </el-form-item>
            <template v-for="(item, index) in module_cont.text_link.data">
              <el-row style="margin-top: 10px;">
                <el-col :span="20">
                  <template v-if="module_cont.text_link.show == 1">
                    <el-form-item label="文字">
                      <el-input
                        v-model="item.title"
                        placeholder="文字"
                        name="text_link_text"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="链接地址">
                      <el-input
                        v-model="item.url"
                        placeholder="链接地址"
                        name="text_link_link"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-col>
                <el-col :span="4" style="text-align: right;" v-if="module_cont.text_link.show == 1">
                  <el-button @click="addLink(module_cont.text_link.data.length, 'url')" type="primary" v-if="index == module_cont.text_link.data.length-1" icon="el-icon-plus" circle></el-button>
                  <el-button @click="delLink(item, 'url')" style="margin-bottom: 20px;" v-if="module_cont.text_link.data.length != 1" type="danger" icon="el-icon-delete" circle></el-button>
                </el-col>
              </el-row>
            </template>
          </el-col>

          <el-col :span="12">
            <el-form-item label="添加小程序链接">
              <el-checkbox
                :true-label="1"
                :false-label="0"
                v-model="module_cont.applets_link.show"
                @change="checkLink('mini')"
                name="show_left_num">
              </el-checkbox>
              <small style="margin-left: 10px;">小程序链接加在文本信息末尾</small>
            </el-form-item>
            <template v-for="(item, index) in module_cont.applets_link.data">
              <el-row style="margin-top: 10px;">
                <el-col :span="20">
                  <template v-if="module_cont.applets_link.show == 1">
                    <el-form-item label="文字">
                      <el-input
                        v-model="item.title"
                        placeholder="文字"
                        name="applets_link_text"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="app_id">
                      <el-input
                        v-model="item.app_id"
                        placeholder="app_id"
                        name="app_id"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="链接跳转路径">
                      <el-input
                        v-model="item.path"
                        placeholder="链接跳转路径"
                        name="applets_link_page"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="链接地址">
                      <el-input
                        v-model="item.url"
                        placeholder="小程序打不开时，跳转链接地址"
                        name="applets_link_url"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-col>
                <el-col :span="4" style="text-align: right;" v-if="module_cont.applets_link.show == 1">
                  <el-button @click="addLink(module_cont.text_link.data.length, 'mini')" type="primary" v-if="index == module_cont.applets_link.data.length-1" icon="el-icon-plus" circle></el-button>
                  <el-button @click="delLink(item, 'mini')" style="margin-bottom: 20px;" type="danger" icon="el-icon-delete" v-if="module_cont.applets_link.data.length != 1" circle></el-button>
                </el-col>
              </el-row>
            </template>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="module_determine">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import integralTask from '@/api/integralMall/task';
  import _ from 'lodash';
  import Tinymce from '@/components/Tinymce';

  export default {
    name: 'taskAddEdit',
    data() {
      return {
        active: 0,
        pageLoading: true,
        action: this.$route.query.aId ? 'modify' : 'add',
        taskFm: {
          id: this.$route.query.aId,
          app_id: '',
          rule: '',
          fans: '',
          integral: '',
          pic: []
        },
        dialogVisible: false,
        module_cont: {
          show: false,
          id: 0,
          name: '',
          content: '',
          text_link: {
            show: 0,
            data: []
          },
          applets_link: {
            show: 0,
            data: []
          }
        },
        small_program: [
          {
            id: 0,
            name: '小程序1'
          },
          {
            id: 1,
            name: '小程序2'
          }
        ],
        msg_list: [
          {
            id: 1,
            type: 1,
            name: '自动回复',
            msg: '海报生成时系统发送的提示消息，可作为活动的整体描述。',
            status: 2,
            text_link: {
              show: 0,
              data: []
            },
            applets_link: {
              show: 0,
              data: []
            }
          },
          {
            id: 2,
            type: 2,
            name: '受邀助力成功提示',
            msg: '受邀用户提示；当用户受邀关注公众号完成任务后，系统向受邀用户推送的通知消息。',
            status: 2,
            text_link: {
              show: 0,
              data: []
            },
            applets_link: {
              show: 0,
              data: []
            }
          },
          {
            id: 3,
            type: 3,
            name: '新用户助力成功提示（任务完成前）',
            msg: '分享者提示；当有其他人通过分享着的二维码关注公众号后，系统向分享者推送的通知消息。',
            status: 2,
            text_link: {
              show: 0,
              data: []
            },
            applets_link: {
              show: 0,
              data: []
            }
          },
          {
            id: 4,
            type: 4,
            name: '新用户助力成功提示（任务完成后）',
            msg: '分享者提示；当有其他人通过分享着的二维码关注公众号后，系统向分享者推送的通知消息。',
            status: 2,
            text_link: {
              show: 0,
              data: []
            },
            applets_link: {
              show: 0,
              data: []
            }
          },
          {
            id: 5,
            type: 5,
            name: '任务提示',
            msg: '分享者提示；当分享着达到任务完成条件后，系统向分享者推送的通知消息。',
            status: 2,
            text_link: {
              show: 0,
              data: []
            },
            applets_link: {
              show: 0,
              data: []
            }
          },
          {
            id: 6,
            type: 6,
            name: '活动结束提示',
            msg: '活动关闭或结束后，用户扫描海报二维码关注公众号后，系统向用户推送的通知消息。',
            status: 2,
            text_link: {
              show: 0,
              data: []
            },
            applets_link: {
              show: 0,
              data: []
            }
          }
        ],
        frmRules: {
          app_id: [
            {
              required: true, message: '请填写公众号App_Id'
            }
          ],
          rule: [
            {
              required: true, message: '请填写任务规则'
            }
          ],
          fans: [
            {
              required: true, message: '请填写任务达标分数数'
            }
          ],
          integral: [
            {
              required: true, message: '请填写任务达标奖励积分额度'
            }
          ],
          pic: [
            {
              required: true, message: '请上传海报图片'
            }
          ]
        },
        module_cont_rules: []
      };
    },
    components: {
      uploadPrizeAvatar,
      Tinymce
    },
    watch: {
      dialogVisible(val) {
        if (!val) {
          this.module_cont.text_link.show = false;
          this.module_cont.text_link.data = [];
          this.module_cont.applets_link.show = false;
          this.module_cont.applets_link.data = [];
        }
      }
    },
    created() {
      this.getStatus();
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        integralTask.awardDetails().then(res => {
          res.pic = res.pic.length !== 0 ? res.pic : [{ id: 0, file_path: '' }];
          this.taskFm = _.assign({}, this.taskFm, res);
          this.pageLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      prev() {
        if (this.active-- < 0) this.active = 0;
      },
      next() {
        this.$refs.taskFm.validate(valid => {
          if (valid) {
            if (this.active++ > 1) this.active = 0;
            this.$refs.taskFm.clearValidate();
          }
        });
      },
      next_pic() {
        if (this.active >= 1 && this.taskFm.pic[0].file_path !== '') {
          if (this.active++ > 2) this.active = 0;
        } else {
          this.$message({
            type: 'info',
            message: '请上传海报'
          });
        }
      },
      successUpload(data) {
        Object.assign(this.taskFm.pic[0], data);
      },
      delHandler() {
        Object.assign(this.taskFm.pic[0], { id: 0, file_path: '' });
      },
      save() {
        this.$refs.taskFm.validate(valid => {
          if (valid) {
            const taskFm = Object.assign({}, this.taskFm);
            taskFm.pic = (taskFm.pic.map(pic => pic.id)).join(',');
            (this.action === 'modify' ? integralTask.edit(taskFm) : integralTask.add(taskFm))
              .then(() => {
                this.$router.back();
              });
          }
        });
      },
      checkLink(type = 'url') {
        if (this.module_cont.applets_link.show || this.module_cont.text_link.show) {
          this.addLink(0, type);
        }
        if (!this.module_cont.applets_link.show) {
          this.module_cont.applets_link.data = [];
        }
        if (!this.module_cont.text_link.show) {
          this.module_cont.text_link.data = [];
        }
      },
      addLink(len, type = 'url') {
        if (type === 'mini') {
          this.module_cont.applets_link.data.push({
            id: len + 1,
            title: '',
            url: ''
          });
        } else if (type === 'url') {
          this.module_cont.text_link.data.push({
            id: len + 1,
            title: '',
            url: ''
          });
        }
      },
      delLink(item, type = 'url') {
        const tFm = this.module_cont;
        if (type === 'mini') {
          tFm.applets_link.data.map((val, index) => {
            if (val.id === item.id && val.title === item.title && val.url === item.url && val.app_id === item.app_id && tFm.applets_link.data.length > 1) {
              tFm.applets_link.data.splice(index, 1);
            }
          });
        } else if (type === 'url') {
          tFm.text_link.data.map((val, index) => {
            if (val.id === item.id && val.title === item.title && val.url === item.url && tFm.text_link.data.length > 1) {
              tFm.text_link.data.splice(index, 1);
            }
          });
        }
      },
      module_show(data) {
        const dataFm = data;
        integralTask.get_reply({
          mission_id: this.taskFm.id,
          type: data.type
        }).then(res => {
          var contFm = res.data;
          var url_i = 0;
          var mini_i = 0;
          if (contFm.ext) {
            if (contFm.ext.url instanceof Array) {
              contFm.ext.url.map(item => {
                dataFm.text_link.data.push({
                  ...item,
                  id: url_i += 1,
                  url: decodeURIComponent(item.url)
                });
              });
            } else {
              for (var key in contFm.ext.url) {
                dataFm.text_link.data.push({
                  ...contFm.ext.url[key],
                  id: url_i += 1,
                  url: decodeURIComponent(contFm.ext.url[key].url)
                });
              }
            }

            if (contFm.ext.url instanceof Array) {
              contFm.ext.mini.map(item => {
                dataFm.applets_link.data.push({
                  ...item,
                  id: mini_i += 1,
                  url: decodeURIComponent(item.url)
                });
              });
            } else {
              for (var item in contFm.ext.mini) {
                dataFm.applets_link.data.push({
                  ...contFm.ext.mini[item],
                  id: mini_i += 1,
                  url: decodeURIComponent(contFm.ext.mini[item].url)
                });
              }
            }
          }

          dataFm.text_link.show = dataFm.text_link.data.length > 0 ? 1 : 0;
          dataFm.applets_link.show = dataFm.applets_link.data.length > 0 ? 1 : 0;
          Object.assign(this.module_cont, dataFm);
          Object.assign(this.module_cont, res.data);
          this.dialogVisible = true;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      module_determine() {
        this.msg_list.map(item => {
          if (item.id === this.module_cont.id) {
            Object(item, this.module_cont);
          }
        });
        const tFm = this.module_cont;
        var ext_json = {
          url: {},
          mini: {}
        };
        // 文字提交,先判断是否设置文字跳转，然后在处理数据上传
        if (!tFm.text_link.show) {
          ext_json.url = {};
        }
        tFm.text_link.data.map((item, index) => {
          ext_json.url[index] = {
            ...item,
            url: encodeURIComponent(item.url)
          };
        });
        // 小程序提交，先判断是否设置小程序跳转，然后在处理数据上传
        if (!tFm.applets_link.show) {
          ext_json.mini = {};
        }
        tFm.applets_link.data.map((item, index) => {
          ext_json.mini[index] = {
            ...item,
            url: encodeURIComponent(item.url),
            path: item.path || 'pages/index/index'
          };
        });

        var ext = JSON.stringify(ext_json);
        integralTask.edit_reply({
          id: tFm.id,
          content: tFm.content,
          ext: ext
        }).then(res => {
          this.dialogVisible = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      // 获取消息开关状态
      getStatus() {
        this.msg_list.map(item => {
          integralTask.get_reply({
            mission_id: this.taskFm.id,
            type: item.type
          }).then(res => {
            Object.assign(item, res.data);
          });
        });
      },
      // 消息提示开关
      changeStatus(data) {
        integralTask.reply_status({
          id: data.id,
          status: data.status * 1 === 1 ? 1 : 2
        }).then(res => {
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .step-title{
    margin-bottom: 40px;
  }
  .tips-header{
    padding: 20px;
    border-bottom: 1px solid #e7e7e7;
    font-size: 14px;
  }
  .upload-container {
    margin-left: 20px;
  }

  .msg-set{
    .msg-list{
      list-style: none;
      padding: 20px 15px;
      border: 1px solid #e7e7e7;
      margin-bottom: 20px;
      .title{
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 14px;
      }
      .cont{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .msg{
          max-width: 80%;
          font-size: 14px;
        }
        .operatin{
          margin-right: 15px;
        }
      }
    }
  }

  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }

  .activity-edit__form_tips{
    max-width: 100% !important;
  }

  .text-link-cont{
    position: relative;
    .add-link{
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

</style>
