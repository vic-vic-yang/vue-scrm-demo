<template>
  <div class="app-container communication">
    <div class="main">
      <div class="main_content">
        <div class="main_header">
          <div class="tab" @click="emoji_show = false">
            <div @click="selectTab(0)" :class="['tab_item', tab === 0 ? 'tab_item_selected' : '']">
              <span class="chat_item_icon"></span>
              <span>{{content_list.length}}</span>
              <span>人待回复</span>
            </div>
            <div @click="selectTab(1)" :class="['tab_item', tab === 1 ? 'tab_item_selected' : '']">
              <span class="wait_item_icon "></span>
              <span>{{wait_list.length}}</span>
              <span>人待接入</span>
            </div>
          </div>
          <div class="state" @click="emoji_show = false">
            <span class="state_icon online"></span>
            <span class="state_description">{{userInfo.user_name}}</span>
          </div>
        </div>
        <div class="main_body">
          <div v-if="tab === 0" class="chat_wrap">
            <div class="panel" @click="emoji_show = false">
              <div class="scrollbar-macosx scroll-content" style="height: 700px; margin-bottom: 0px; margin-right: 0px; max-height: none;">
                <template v-if="content_list">
                  <div :class="['card', cIndex == index ? 'card_selected' : '']" @click="selectContent(item, index)" v-for="(item, index) in content_list" :key="index">
                    <div class="card_pic">
                      <img :src="item.avatar" alt="">
                    </div>
                    <div class="card_content">
                      <div class="chat_content_header">
                        <span class="name">{{item.nickname}}</span>
                        <span v-if="item.msgNum > 0" class="card_message_state">{{item.msgNum}}</span>
                      </div>
                      <div class="card_content_chat">
                        <p class="card_content_detail">
                          <template v-if="item.msg_type == 'image'">
                            <img :src="item.pic_url" alt=""/>
                          </template>
                          <template v-if="item.msg_type == 'text'">
                            <div v-html="item.content"></div>
                          </template>
                        </p>
                        <p class="card_content_time">{{item.create_time}}</p>
                      </div>
                    </div>
                  </div>
                </template>
               </div>
            </div>
            <div v-if="content_list.length > 0">
              <div class="chat">
                <div class="chat_header" @click="emoji_show = false">
                  <div class="chat_header_items">
                    <span v-if="choice">{{choice.nickname}}</span>
                  </div>
                </div>

                <div class="chat_body" id="chatBody" @click="emoji_show = false">
                  <vuescroll :ops="ops" ref="vs" @handle-scroll="handleScroll">
                    <div class="scroll-content">
                      <div class="chat_body_inner" ref="scroll">
                        <div class="message-load" v-show="load">
                          <img src="/static/images/loading.gif" alt="loading"/>
                        </div>
                        <div :class="['message_box', item.type === 'send' || item.type == 1 ? 'from_self' : '']" v-for="(item, index) in msg_list" :key="index">
                          <img v-if="item.type === 'send' || item.type == 1" class="mssage_box_pic" :src="userInfo.avatar" alt=""/>
                          <img v-else class="mssage_box_pic" :src="choice.avatar" alt=""/>
                          <div class="message_content">
                            <span v-if="item.type === 'send' && item.status === 0" class="icon_error"></span>
                            <div class="message_content_inner">
                              <p class="text" v-if="item.msg_type === 'text'" v-html="item.content"></p>
                              <div class="img" v-if="item.msg_type === 'image'">
                                <img :src="item.pic_url" alt=""/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </vuescroll>
                </div>
                <div class="chat_edit" style="display: block;">
                  <div class="chat_edit_items">
                    <div class="chat_edit_icons">
                      <span @click="emojiClick" class="chat_edit_icon emoji"></span>
                      <span @click="cropClick" class="chat_edit_icon crop"></span>
                    </div>
                  </div>
                  <div class="chat_edit_input" @click="emoji_show = false">
                    <div class="edit_area" style="position: relative;">
                      <pre @keydown="sendMsgKeyDown" id="editor" ref="editor" class="edit_area_pre scroll-content" contenteditable="true" style="height: 80px; margin-bottom: 0px; margin-right: 0px; max-height: none;"></pre>
                    </div>
                  </div>
                  <div class="chat_edit_footer" @click="emoji_show = false">
                    <span style="display: inline-block;margin-right: 10px;">图片和文字只能分开发送,按Enter发送</span>
                    <button class="btn btn_primary" @click="sendMsg">发送</button>
                  </div>
                  <div class="emoji_popup" id="emoji" ref="emoji" v-show="emoji_show">
                    <div class="emoji_popup_header">
                      <span class="switch selected">QQ表情</span>
                    </div>
                    <div class="scroll-wrapper emoji_pop_body">
                      <div class="emoji_pop_body scroll-content" style="height: 232px; margin-bottom: 0px; margin-right: 0px; max-height: none;">
                        <div class="emoji_pop_inner">
                          <div class="qq_body">
                            <a href="#" v-for="(item, index) in emoji_list" :key="index" @click="selectEmoji(item)">
                              <img :src="item.url" :alt="item.text" :title="item.text">
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="chat chat_no_input">
              <div class="chat_not_pick">未选择聊天</div>
            </div>
          </div>
          <div v-if="tab === 1" class="waiting_wrap">
            <div class="waiting_inner">
              <div class="waiting_panel">
                <a href="#" class="setting_panel selected">待接入</a>
                <span class="btn btn_primary" @click="accessAll">全部接入</span>
              </div>
            </div>
            <div class="waiting_box">
              <div class="scroll-wrapper wait_list scrollbar-macosx">
                <div class="wait_list scrollbar-macosx scroll-content" style="height: 560px; margin-bottom: 0px; margin-right: 0px; max-height: none;">
                  <table cellspacing="0" class="empty">
                    <thead v-if="wait_list && wait_list.length > 0">
                      <tr>
                        <th>姓名</th>
                        <th>user</th>
                        <th>接收时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody class="wait_list_tbody">
                      <tr v-if="!wait_list || wait_list.length === 0">
                        <td class="wait_list_empty"> 暂无用户接入</td>
                      </tr>
                      <template v-else>
                        <tr v-for="(item, index) in wait_list" :key="index">
                          <td>{{item.nickname}}</td>
                          <td>{{item.user}}</td>
                          <td>{{item.create_time}}</td>
                          <td><button @click="access(item, 1)" class="btn btn_primary">接入</button></td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="选择上传的图片"
      :visible.sync="dialogVisible"
      width="40%">
      <div style="width: 160px;margin: 0 auto;text-align: center">
        <upload-prize-avatar v-model="picUrl" @success="successUpload"></upload-prize-avatar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { parseTime } from '@/utils';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import vuescroll from 'vuescroll';
  import emotion_data from '../../../../static/emoji/index';
  import qqfaceMap from '../../../../static/emoji/qqfaceMap';

  export default {
    name: 'service',

    components: {
      uploadPrizeAvatar,
      vuescroll
    },

    data() {
      return {
        cIndex: 0,
        aIndex: 0, // 接入之前得index
        tab: 0,
        repeat: null,
        content_list: [], // 回复中，左边回复栏的人
        msg_list: [], // 聊天记录
        wait_list: [], // 待接入的人
        choice: {}, // 选择聊天的对象
        app_id: this.$route.query.app_id || '', // 客服小程序 appid
        reply_user: '', // 选择聊天对象的user
        websock: null,
        emoji_show: false,
        emoji_list: [],
        select_emoji: [],
        dialogVisible: false,
        picUrl: '',
        pic_url: [],
        isImg: false,
        closed: true,
        scrollTop: null,
        massage_man: [],
        is_newMsg: false, // 新消息
        new_user: '', // 新消息得user
        load: false, // 加载
        ops: {
          bar: {
            background: '#999',
            size: '4px'
          }
        }
      };
    },

    watch: {
      dialogVisible(val) {
        if (!val) {
          this.picUrl = '';
        }
      }
    },

    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },

    beforeMount() {
      // 页面刚进入时开启长连接
      this.initWebSocket();
    },

    mounted() {
      this.setEmtion();
      this.msg_list = [];
      setTimeout(() => {
        if (this.content_list.length > 0 && !this.closed) {
          this.choice = this.content_list[0];
          this.selectContent(this.content_list[0], 0);
        }
      }, 1000);
    },

    destroyed() {
      // 页面销毁时关闭长连接
      this.websocketclose();
      clearInterval(this.scrollTop);
    },

    methods: {
      initWebSocket() { // 初始化weosocket
        var appId = this.$route.query.app_id;
        const url = 'ws://test.scrm.buerkongjian.com'; // 测试
        // const url = 'ws://c.scrm.buerkongjian.com'; // 线上
        const wsuri = `${url}:9999?app_id=${appId}&access_token=${this.userInfo.access_token}`; // ws地址

        this.websock = new WebSocket(wsuri);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },

      websocketonopen() {
        console.log('WebSocket连接成功');
        this.$message({
          type: 'success',
          message: 'WebSocket连接成功'
        });
        this.closed = false;
      },
      websocketonerror(e) { // 错误
        console.log('WebSocket连接发生错误');
        this.$message({
          type: 'error',
          message: 'WebSocket连接发生错误'
        });
      },
      websocketonmessage(e) { // 数据接收
        const redata = JSON.parse(e.data);
        // 注意：长连接我们是后台直接1秒推送一条数据，
        // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
        // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
        // console.log(redata);
        if (redata.type === 'wait') { // 待接入
          redata.create_time = parseTime(redata.create_time, '{m}-{d} {h}:{i}');
          this.set_wait_list(redata);
          this.setContentWait();
        } else if (redata.type === 'reply') { // 收到回复消息
          redata.create_time = parseTime(redata.send_time, '{m}-{d} {h}:{i}');
          this.setContentList(redata, 1);
          this.setMassage(redata);
          this.setMassageEmoji();
          if (this.reply_user === redata.user) {
            this.setScrollTop();
          }
        } else if (redata.type === 'access') { // 接入成功
          var obj = redata;
          obj = Object.assign(obj, redata.last_msg);
          redata.create_time = parseTime(redata.send_time, '{m}-{d} {h}:{i}');
          if (!this.repeat) {
            if (this.content_list.length > 0) {
              this.cIndex = this.aIndex + 1;
            } else {
              this.cIndex = 0;
            }
            this.content_list.unshift(obj);
            this.choice = this.content_list[this.cIndex];
            this.setMassageType(redata, 1);
            // this.getHistoryMsg(redata);
          }
          this.wait_list.splice(this.wait_list.indexOf(redata), 1);
        } else if (redata.type === 'send') { // 发送成功
          this.setMassage(redata);
          this.setMassageEmoji();
          this.setScrollTop();
          this.isImg = false;
          if (redata.status * 1 === 0) {
            this.$message({
              type: 'info',
              message: '发送失败'
            });
          }
        } else if (redata.type === 'history_user') { // 历史回复的人
          redata.create_time = parseTime(redata.create_time, '{m}-{d} {h}:{i}');
          this.content_list.push(redata);
          this.choice = this.content_list[0];
          this.content_list.map(item => {
            item['msgNum'] = 0;
          });
          this.setMassageType(redata);
          this.getHistoryMsg(redata);
          // this.setContentWait();
        } else if (redata.type === 'history_message') { // 历史消息
          redata.history_message = redata.history_message.reverse();
          this.setMassage(redata);
          this.setMassageEmoji();
          this.setContentList(redata, 0);
          this.load = false;
          this.$refs['vs'].scrollTo(
            {
              y: 20
            }
          );
        }
      },

      websocketsend(agentData) { // 数据发
        // console.log(agentData);
        this.websock.send(JSON.stringify(agentData));
      },
      websocketclose(e) { // 关闭
        this.closed = true;
        clearInterval(this.scrollTop);
        this.$message({
          type: 'info',
          message: '服务器已断开连接'
        });
      },

      // 发送消息
      sendMsgKeyDown(e) {
        if (e.keyCode === 13) {
          this.sendMsg();
          e.preventDefault();
          return false;
        }
      },

      sendMsg() {
        if (this.closed) {
          this.initWebSocket();
        } else if (this.$refs.editor.innerHTML.trim() !== '') {
          var content = this.$refs.editor.innerText.trim();
          if (this.isImg && this.pic_url.length > 0) {
            this.pic_url.map(item => {
              this.websocketsend({
                'access_token': this.userInfo.access_token,
                'app_id': this.app_id,
                'user': this.reply_user,
                'msg_type': 'image',
                'pic_url': item
              });
            });
            this.isImg = false;
          } else if (content !== '') {
            this.websocketsend({
              'access_token': this.userInfo.access_token,
              'app_id': this.app_id,
              'user': this.reply_user,
              'msg_type': 'text',
              'content': content
            });
          }
          this.$refs.editor.innerText = '';
        } else {
          this.$message({
            type: 'info',
            message: '请输入内容'
          });
        }
      },

      // 选择聊天对象
      selectContent(item, index) {
        this.cIndex = index;
        this.choice = item;
        this.reply_user = item.user;
        this.massage_man.map(data => {
          if (item.user === data.user) {
            this.msg_list = data.data;
          }
        });
        this.content_list[index].msgNum = 0;
        this.setScrollTop();
        this.access(item);
      },

      // 设置接入用户
      set_wait_list(data) {
        if (this.wait_list.length === 0) {
          this.wait_list.push(data);
        }
        this.wait_list.map(item => {
          if (data.user === item.user) {
            item = Object.assign(item, data);
          }
        });
      },

      // 接入
      access(data, type) {
        if (type === 1) {
          this.aIndex = this.cIndex;
        }
        this.repeat = false;
        this.websocketsend({
          'access_token': this.userInfo.access_token,
          'app_id': this.app_id,
          'user': data.user,
          'msg_type': 'access'
        });
      },

      // 接入所有
      accessAll() {
        this.repeat = false;
        this.aIndex = this.cIndex;
        if (this.wait_list.length > 0) {
          this.wait_list.map(item => {
            this.access(item);
          });
        }
      },

      // 获取历史消息
      getHistoryMsg(data) {
        this.websocketsend({
          'access_token': this.userInfo.access_token,
          'app_id': this.app_id,
          'user': data.user,
          'msg_type': 'history_message',
          'page': this.massage_man[this.cIndex].page || 1
        });
      },

      // 设置滚动条位置
      setScrollTop() {
        setTimeout(() => {
          var h = this.$refs.scroll.scrollHeight;
          this.$refs['vs'].scrollTo(
            {
              y: h
            },
            500,
            'easeInQuad'
          );
        }, 200);
      },

      handleScroll(nativeEvent) {
        if (nativeEvent.scrollTop <= 0) {
          this.paperScroll();
        }
      },

      // 滚动翻页
      paperScroll() {
        var isPageOut = Boolean(this.massage_man[this.cIndex].isPageOut);
        if (isPageOut) {
          this.load = true;
          this.massage_man[this.cIndex].page += 1;
          this.websocketsend({
            'access_token': this.userInfo.access_token,
            'app_id': this.app_id,
            'user': this.choice.user,
            'msg_type': 'history_message',
            'page': this.massage_man[this.cIndex].page
          });
          this.massage_man[this.cIndex].isPageOut = false;
        }
      },

      // 点击显示标签选择面板
      emojiClick() {
        this.emoji_show = !this.emoji_show;
      },

      // 选择表情
      selectEmoji(item) {
        // var content = this.$refs.editor.innerText.trim();
        // content = `${content}/${item.name}`;
        this.$refs.editor.innerText += item.code;
        this.emoji_show = false;
      },

      // 选择发送的图片
      cropClick() {
        this.dialogVisible = true;
        this.emoji_show = false;
      },

      // 确定选择的图片
      Sure() {
        this.isImg = true;
        var content = `<img style="max-width: 80px; height: auto;margin: 0;" src="${this.picUrl}"/>`;
        this.$refs.editor.innerHTML += content;
        this.dialogVisible = false;
      },

      // 上传图片成功,获取图片链接
      successUpload(data) {
        this.pic_url.push(data.url);
      },

      setContentList(data, type = 1) {
        if (type === 0) {
          this.content_list.map((item, i) => {
            if (item.user === data.user) {
              item = Object.assign(item, this.massage_man[i].data[this.massage_man[i].data.length - 1]);
            }
          });
        } else {
          this.content_list.map((item, index) => {
            if (item.user === data.user) {
              if (data.msg_type === 'text') {
                data.content = this.isQqFace(data.content);
              }
              item = Object.assign(item, data);
              if (this.reply_user !== data.user) {
                item.msgNum += 1;
                this.content_list.unshift(this.content_list.splice(index, 1)[0]);
                this.massage_man.unshift(this.massage_man.splice(index, 1)[0]);
                this.cIndex = this.content_list.indexOf(this.choice);
              }
            }
          });
        }
      },

      // 历史人数中与待接入中重复，重新接入
      setContentWait() {
        this.content_list.map((item, index) => {
          this.wait_list.map((val, i) => {
            if (val.user === item.user) {
              this.repeat = true;
              this.websocketsend({
                'access_token': this.userInfo.access_token,
                'app_id': this.app_id,
                'user': item.user,
                'msg_type': 'access'
              });
            }
          });
        });
      },

      // 接入后或者获取到历史人，设置消息格式
      setMassageType(data, type = 0) { // type === 1,接入，接入在插入在最前面, 0 - 历史，按照获取得历史展示
        var obj = {
          user: data.user,
          data: [],
          page: 1,
          isPageOut: false,
          create_time: data.create_time || ''
        };
        if (type === 1) {
          this.massage_man.unshift(obj);
        } else {
          this.massage_man.push(obj);
        }
      },

      // 设置历史消息
      setMassage(data) {
        this.massage_man.map(item => {
          if (item.user === data.user) {
            if (data.history_message) {
              item.data = data.history_message.concat(item.data);
              item.isPageOut = data.history_message.length < 10 ? 0 : 1;
            } else {
              item.data.push(data);
            }
          }
        });
        this.msg_list = this.massage_man[this.cIndex].data;
      },

      // 切换tab
      selectTab(data) {
        this.tab = data;
        if (data === 1) {
          clearInterval(this.scrollTop);
        } else if (data === 0 && !this.closed) {
          this.massage_man.map(item => {
            if (item.data.length === 0) {
              this.getHistoryMsg(item);
            }
          });
          if (this.massage_man.length > 0) {
            this.msg_list = this.massage_man[this.cIndex].data;
          }
        }
      },

      // 设置消息表情处理
      setMassageEmoji() {
        this.massage_man.map(item => {
          item.data.map(val => {
            if (val.msg_type === 'text') {
              val.content = this.isQqFace(val.content);
            }
          });
        });
      },

      // 设置标签
      setEmtion() {
        emotion_data.map((item, index) => {
          this.emoji_list.push({
            text: `[${item[0]}]`,
            url: `https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif`,
            code: item[1]
          });
        });
      },

      // 判断QQ表情的正则表达式
      isQqFace(content) {
        var str = "/::\\)|/::~|/::B|/::\\||/:8-\\)|/::<|/::$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:#-0|/:hiphot|/:kiss|/:<&|/:&>";
        var reg = new RegExp(str, 'g');
        var result = content.replace(reg, function(r) {
          return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${qqfaceMap[r]}.gif" style="vertical-align: middle;"/>`;
        });
        return result;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "../../../styles/service";
</style>
