<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row>
      <el-col :span="16">
        <el-form :model="templateFrm" :rules="frmRules" class="from-style" ref="templateFrm" label-width="120px">
          <el-form-item label="小程序">
            <small v-if="mini_program">{{mini_program.nick_name}}</small>
          </el-form-item>

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

          <el-form-item label="需转换变量">
            <div v-if="placeholder">
              <span v-for="(vulue, key) in placeholder" style="display:inline-block; margin: 0 5px;">
                {{key}}: {{vulue}}
              </span>
            </div>
            <small style="color: #999">可通过选择触发事件，查看对应需转换变量</small>
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
          </el-form-item>

          <el-form-item prop="page" label="小程序页面">
            <el-input
              v-model="templateFrm.page"
              placeholder="请输入小程序页面"
              :maxlength="50"
              :clearable="true">
            </el-input>
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
  import templateMsg from '@/api/templateMsg/index';
  import { mapState } from 'vuex';
  import preview from '../preview';

  export default {
    name: 'my-template-editor',
    components: {
      preview
    },
    data() {
      return {
        pageLoading: false,
        templateData: [],
        words: [],
        templateFrm: {
          id: this.$route.params.id || 0,
          event: '',
          page: ''
        },
        template_info: null,
        eventsOptions: [],
        title: '',
        preview_list: [],
        placeholder: null,
        frmRules: {
          event: [
            {
              required: true, message: '请选择触发事件'
            }
          ],
          page: [
            {
              required: true, message: '请输入小程序页面'
            }
          ]
        }
      };
    },
    computed: {
      ...mapState({
        appid: state => state.templateMsg.appid,
        mini_program: state => state.templateMsg.mini_program
      })
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        templateMsg.details({
          id: this.templateFrm.id
        }).then(res => {
          this.template_info = res;
          this.words = res.words;
          this.templateData = res.data.keywords || [];
          this.templateFrm.event = res.data.event || '';
          this.templateFrm.page = res.data.page || '';
          this.title = res.data && res.data.title ? res.data.title : '';
          for (var key in res.events) {
            this.eventsOptions.push({
              label: res.events[key].title,
              value: key
            });
          }
          var example = res.data.example || '';
          res.words.map((item, index) => {
            this.preview_list.push({
              name: item,
              example: example[index].split('：')[1]
            });
          });
          if (res.data.keywords) {
            res.data.keywords.map((item, index) => {
              this.preview_list[index]['example'] = item;
            });
          }
          this.pageLoading = false;
        });
      },
      changTriggeEvent() {
        var events = this.template_info.events;
        for (var key in events) {
          if (key === this.templateFrm.event) {
            this.placeholder = events[key].placeholder;
          }
        }
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
              templateMsg.edit(options).then(() => {
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
