<template>
  <div class="fission-powder" v-if="active === 1">
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
          <div>任务奖励奖品价值： {mission_reward_points}</div>
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
            <template v-for="(item, index) in module_cont.text_link.data" >
              <el-row style="margin-top: 10px;">
                <el-col :span="20">
                  <template v-if="module_cont.text_link.show == 1">
                    <el-form-item label="链接标题">
                      <el-input
                        v-model="item.title"
                        placeholder="链接标题"
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
            <small style="margin-left: 10px;">用户填写联系信息网页地址：https://scrm.buerkongjian.com/h5/user/index，如果不是不二社群空间公众号，需在url后面加上“?appId=对应公众号id”</small>
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
              <el-row style="margin-top: 10px;" :key='index'>
                <el-col :span="20">
                  <template v-if="module_cont.applets_link.show == 1">
                    <el-form-item label="文字">
                      <el-input
                        v-model="item.title"
                        placeholder="文字"
                        name="applets_link_text"
                        :clearable="true">
                      </el-input>
                      <small style="color: #999;">点击文字会打开小程序指定路径的页面</small>
                    </el-form-item>
                    <el-form-item label="app_id">
                      <el-input
                        v-model="item.app_id"
                        placeholder="请输入小程序的appId"
                        name="app_id"
                        :clearable="true">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="小程序跳转路径">
                      <el-input
                        v-model="item.path"
                        placeholder="pages/index/index"
                        name="applets_link_page"
                        :clearable="true">
                      </el-input>
                      <small style="color: #999;">默认跳转小程序首页，可更改</small>
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
  import TASK_API from '@/api/task/index';

  export default {
    name: 'fission',
    props: {
      missionId: {
        type: [String, Number],
        default: ''
      },
      active: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        msg_list_content: [
          '{invited_nickname}，你好！\n' +
          '欢迎关注，邀请{mission_count}位好友扫码关注公众号，即可免费领取{mission_reward_points}积分！\n' +
          '你的专属海报已经生成，赶快邀请好友扫码吧！',

          '@{invited_nickname}，你成功为{inviter_nickname}助力！\n' +
          '他正在参加{mission_name}任务！',

          '{invited_nickname}来支持你啦~\n' +
          '你还差{unfinished_mission_count}个好友支持，就能领取{mission_reward_points}积分了！',

          '{invited_nickname}来支持你啦~\n' +
          '不过你已经完成任务啦，请前往商城查看积分余额！',

          '恭喜你完成{mission_name}！\n' +
          '第{finished_mission_count}个好友 @{invited_nickname}是你的关键先生哦！',

          '本次活动已结束，敬请期待下次活动。',

          'Hello,欢迎关注！',

          '很遗憾，由于你不是新用户，本次为 {inviter_nickname}助力失败！'
        ],
        msg_list: [
          {
            id: 7,
            type: 7,
            name: '被关注后回复提示',
            msg: '用户关注公众号后，用户即收到该类型的消息提醒（无需用户输入任务活动关键词）',
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
            id: 1,
            type: 1,
            name: '关键字回复',
            msg: '用户输入关键词，系统发送的提示消息（包含海报）。',
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
          },
          {
            id: 8,
            type: 8,
            name: '用户助力失败提示',
            msg: '用户A邀请用户B扫码关注公众号完成任务，用户B扫码后/（订阅号需要回复身份码）助力失败，即可收到该类型提醒消息。（一般情况下，用户为公众号老用户才能导致助力失败）。',
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
        pageLoading: true,
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
        dialogVisible: false
      };
    },
    methods: {
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
        TASK_API.get_reply({
          mission_id: this.missionId,
          type: data.type
        }).then(res => {
          var contFm = res.data;
          var url_i = 0;
          var mini_i = 0;
          if (contFm.ext) {
            dataFm.text_link.data = [];
            dataFm.applets_link.data = [];
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
          if (this.module_cont && !this.module_cont.content) {
            this.module_cont.content = this.msg_list_content[this.module_cont.type * 1 - 1] || '';
          }
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
        TASK_API.edit_reply({
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
        console.log('getStatus');
        this.msg_list.map(item => {
          TASK_API.get_reply({
            mission_id: this.missionId,
            type: item.type
          }).then(res => {
            Object.assign(item, res.data);
          });
        });
      },
      // 消息提示开关
      changeStatus(data) {
        TASK_API.reply_status({
          id: data.id,
          status: data.status * 1 === 1 ? 1 : 2
        }).then(res => {
          if (Number(data.status) === 1) {
            this.module_show(data);
          }
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

  .tips-header{
    padding: 20px;
    border-bottom: 1px solid #e7e7e7;
    font-size: 14px;
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

  .form_e{
    max-width: 100%;
  }

  .activity-edit__form_tips{
    max-width: 100% !important;
  }

</style>
