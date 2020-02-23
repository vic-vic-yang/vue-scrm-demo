<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row>
      <el-col :span="16">
        <el-form :model="templateFrm" :rules="frmRules" class="from-style" ref="templateFrm" label-width="120px">
          <el-form-item label="小程序">
            <small v-if="mini_program">{{mini_program.nick_name}}</small>
          </el-form-item>

          <el-form-item prop="send_type" label="消息类型">
            <el-select v-model="templateFrm.send_type" :disabled="action == 'modify'" placeholder="请选择消息类型" @change="changTriggeEType">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <template v-if="templateFrm.send_type == 1">
            <el-form-item prop="send_users" label="推送对象">
              <el-select v-model="templateFrm.send_users" placeholder="请选择推送对象">
                <el-option
                  v-for="(val, key) in sendUsersOptions"
                  :key="key"
                  :label="val"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="frequency" label="推送频率">
              <el-select v-model="templateFrm.frequency" placeholder="请选择推送频率">
                <el-option
                  v-for="item in frequencyOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="time" label="推送时间">
              <el-time-picker
                v-model="templateFrm.time"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择推送时间">
              </el-time-picker>
            </el-form-item>
          </template>

          <template v-if="templateFrm.send_type == 2">
            <el-form-item prop="event" label="触发事件">
              <el-select v-model="templateFrm.event" placeholder="请选择触发事件" @change="changTriggeEvent">
                <el-option
                  v-for="item in eventsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <el-form-item label="需转换变量">
            <div v-if="placeholder">
                <span v-for="(vulue, key) in placeholder" style="display:inline-block; margin: 0 5px;">
                  {{key}}: {{vulue}}
                </span>
            </div>
            <small style="color: #999">可通过选择触发事件，查看对应需转换变量</small>
          </el-form-item>


          <el-form-item prop="template_id" label="选择模板">
            <el-select v-model="templateFrm.template_id" placeholder="请选择模板" @change="templateChange('change')">
              <el-option
                v-for="item in templateOptions"
                :key="item.template_id"
                :label="item.title"
                :value="item.template_id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键词">
            <template v-for="(item, index) in words">
              <el-form-item :key="index" :label="item" label-width="80px" class="key-words">
                <el-input
                  v-model="templateData[index]"
                  :placeholder="'请输入' + item"
                  :clearable="true"
                  @change="inputChange(index)">
                </el-input>
              </el-form-item>
            </template>
            <small style="color: #999">选择模板后，才会有对应的关键词</small>
          </el-form-item>

          <el-form-item prop="page" label="进入小程序页面">
            <el-select
              v-model="templateFrm.page"
              placeholder="请选择进入小程序页面">
              <el-option
                v-for="(item, index) in pageOptions"
                :key="index"
                :label="item.name"
                :value="item.page">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click.prevent.stop="$router.back()">取消</el-button>
            <el-button type="primary" @click.prevent.stop="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <preview :preview_list="preview_list" :title="title"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import msgPush from '@/api/templateMsg/msgPush';
  import { mapState } from 'vuex';
  import preview from '../preview';

  export default {
    name: 'message-push-editor',
    components: {
      preview
    },
    data() {
      return {
        pageLoading: false,
        templateData: [],
        action: this.$route.params.id ? 'modify' : 'add',
        words: [],
        templateFrm: {
          appid: this.$store.state.templateMsg.appid,
          id: this.$route.params.id || 0,
          event: '',
          page: '',
          send_type: 1,
          template_id: '',
          send_users: '',
          frequency: '',
          time: '',
          keywords: '',
          title: ''
        },
        eventsOptions: [],
        events: null,
        title: '',
        preview_list: [],
        placeholder: null,
        pageOptions: this.$store.state.templateMsg.pageOptions,
        typeOptions: this.$store.state.templateMsg.typeOptions,
        sendUsersOptions: [],
        frequencyOptions: [
          {
            id: 1,
            name: '每天一次'
          },
          {
            id: 2,
            name: '仅此一次'
          }
        ],
        templateOptions: [],
        frmRules: {}
      };
    },
    computed: {
      ...mapState({
        appid: state => state.templateMsg.appid,
        mini_program: state => state.templateMsg.mini_program
      })
    },
    created() {
      this.pageLoading = true;
      this.getTemplate().then(res => {
        this.getData();
      });
    },
    methods: {
      getData() {
        if (this.action === 'add') {
          this.changTriggeEType();
          this.pageLoading = false;
          return;
        }
        msgPush.details({
          id: this.templateFrm.id
        }).then(res => {
          res.send_type = res.send_type * 1;
          if (res.send_type === 1) {
            res.frequency = res.frequency * 1;
            res.time = res.hours + ':' + res.minutes;
          }
          this.templateFrm = Object.assign(this.templateFrm, res);
          this.templateData = res.keywords || [];
          this.title = res.data && res.data.title ? res.data.title : '';
          // 关键词
          var templateItem = this.templateOptions.find(item => {
            return item.template_id === this.templateFrm.template_id;
          });
          if (templateItem) {
            templateItem.example.map((item) => {
              this.preview_list.push({
                name: item.split('：')[0],
                example: item.split('：')[1]
              });
              this.words.push(item.split('：')[0]);
            });
            if (res.keywords) {
              res.keywords.map((item, index) => {
                this.preview_list[index]['example'] = item;
              });
            }
          } else {
            this.$message('该推送消息的模板消息已禁用或已不存在!');
          }
          this.changTriggeEType();
          this.pageLoading = false;
        });
      },
      getTemplate() {
        return msgPush.template_list({
          appid: this.appid
        }).then(res => {
          this.templateOptions = res || [];
          return res;
        });
      },
      getTrigger() {
        msgPush.trigger().then(res => {
          this.events = res;
          this.eventsOptions = [];
          for (var key in res) {
            this.eventsOptions.push({
              label: res[key].title,
              value: key
            });
          }
          this.changTriggeEvent();
          this.pageLoading = false;
        });
      },
      getSendUser() {
        msgPush.send_user().then(res => {
          this.sendUsersOptions = res;
          this.pageLoading = false;
        });
      },
      changTriggeEType() {
        this.placeholder = [];
        if (this.templateFrm.send_type === 2) {
          this.getTrigger();
        } else {
          this.getSendUser();
          this.getVariable();
        }
      },
      templateChange(type) {
        var item = this.templateOptions.find(item => {
          return item.template_id === this.templateFrm.template_id;
        });
        if (type === 'change') {
          this.templateFrm.title = item.title;
          this.templateData = [];
        }
        return this.setWord(item);
      },
      setWord(data) {
        this.words = [];
        this.preview_list = [];
        data.example.map((item) => {
          this.preview_list.push({
            name: item.split('：')[0],
            example: item.split('：')[1]
          });
          this.words.push(item.split('：')[0]);
        });
        return true;
      },
      changTriggeEvent() {
        var events = this.events;
        for (var key in events) {
          if (key === this.templateFrm.event) {
            this.placeholder = events[key].placeholder;
          }
        }
      },
      getVariable() {
        msgPush.variable().then(res => {
          this.placeholder = res;
        });
      },
      inputChange(index) {
        this.preview_list[index]['example'] = this.templateData[index];
      },
      save() {
        this.$refs.templateFrm.validate(valid => {
          if (valid) {
            if (this.templateData.length === this.words.length) {
              const options = this.templateFrm;
              options.keywords = this.templateData;
              if (options.send_type === 1) {
                var time = options.time.split(':');
                options.hours = time[0];
                options.minutes = time[1];
              }
              (this.action === 'modify' ? msgPush.edit(options) : msgPush.add(options)).then(() => {
                this.$router.back();
              });
            } else {
              this.$message('请完善模板消息内容');
            }
          }
        });
      }
    }
  };
</script>

<style scoped>
  .key-words {
    margin-bottom: 10px;
  }
</style>
