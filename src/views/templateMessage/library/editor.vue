<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row>
      <el-col :span="16">
        <el-form :model="templateFrm" :rules="frmRules" class="from-style" ref="templateFrm" label-width="120px" @submit.native.prevent>
          <el-form-item label="小程序">
            <div v-if="mini_program">{{mini_program.nick_name}}</div>
            <small style="color: #999">你可用该标题的模板搭配不同的关键词使用，配置提交后关键词种类和顺序将不能修改</small>
          </el-form-item>
          <el-form-item prop="search_name" label="配置关键词">
            <el-input
              v-model="search_name"
              placeholder="请输入关键词筛选"
              :maxlength="50"
              style="width: 300px;"
              @keydown.enter.native="search_code">
            </el-input>
            <el-button style="margin-left: 15px;" type="primary" @click="search_code" icon="el-icon-search">搜索</el-button>
          </el-form-item>

          <el-form-item prop="select_search" label="">
            <el-checkbox-group  v-model="select_search" :max="10" @change="keywordListChange">
              <el-checkbox v-for="(item, index) in keyword_list"
                           :key="index"
                           :label="item.keyword_id"
                           style="min-width: 100px">
                {{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item prop="keywords" label="已选关键词">
            <el-checkbox-group v-model="templateFrm.keywords" @change="keywordsChange">
              <draggable :list="select_keyword_list"  class="dragArea">
                <el-checkbox v-for="(item, index) in select_keyword_list"
                             :checked="item.checked"
                             :key="index"
                             :label="item.keyword_id"
                             style="min-width: 100px">{{item.name}}</el-checkbox>
              </draggable>
            </el-checkbox-group>
            <small style="color: #999">可拖动关键词调整顺序；最多只能选择10个关键词</small>
          </el-form-item>

          <el-form-item>
            <el-button @click.prevent.stop="$router.back()">取消</el-button>
            <el-button type="primary" @click.prevent.stop="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <preview :preview_list="select_keyword_list" :title="template_info.title" tips="预览"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import templateMsg from '@/api/templateMsg/index';
  import draggable from 'vuedraggable';
  import { mapState } from 'vuex';
  import preview from '../preview';

  export default {
    name: 'my-template-editor',
    components: {
      draggable,
      preview
    },
    data() {
      return {
        pageLoading: false,
        action: this.$route.params.id ? 'modify' : 'add',
        template_info: {
          title: ''
        },
        templateFrm: {
          id: this.$route.params.id || 0,
          keywords: [],
          appid: this.$store.state.templateMsg.appid
        },
        search_name: '',
        keyword_list: [],
        select_search: [],
        select_keyword_list: [],
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
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        if (this.action === 'add') return (this.pageLoading = false);
        templateMsg.templates_detail({
          id: this.templateFrm.id
        }).then(res => {
          this.template_info = res;
          this.keyword_list = res.keyword_list;
          this.pageLoading = false;
        });
      },
      keywordListChange() {
        if (this.select_search.length > 10) {
          this.$message({
            message: '最多只能选择10个关键词',
            type: 'warning'
          });
          return false;
        }
        if (this.select_search.length === 10) {
          this.$message({
            message: '最多只能选择10个关键词',
            type: 'warning'
          });
        }
        this.select_keyword_list = [];
        this.select_search.map(val => {
          this.keyword_list.map(item => {
            if (item.keyword_id === val) {
              item['checked'] = true;
              this.select_keyword_list.push(item);
            }
          });
        });
      },
      keywordsChange() {
        this.select_keyword_list = [];
        this.templateFrm.keywords.map(val => {
          this.keyword_list.map(item => {
            if (item.keyword_id === val) {
              this.select_keyword_list.push(item);
            }
          });
        });
        this.select_search = this.templateFrm.keywords;
      },
      search_code() {
        if (!this.search_name) {
          this.getData();
        } else {
          var keyword_list = this.keyword_list;
          var arr = [];
          keyword_list.map(item => {
            if (item.name.indexOf(this.search_name) >= 0) {
              arr.push(item);
            }
          });
          this.keyword_list = arr;
        }
      },
      save() {
        if (this.templateFrm.keywords.length === 0) {
          this.$message('请选择关键词');
          return false;
        }
        if (this.templateFrm.keywords.length < 2) {
          this.$message({
            message: '请至少选择两个关键词',
            type: 'warning'
          });
          return false;
        }
        const options = {
          id: this.templateFrm.id,
          keywords: [],
          appid: this.templateFrm.appid
        };
        this.select_keyword_list.map(item => {
          options.keywords.push(item.keyword_id);
        });
        templateMsg.add(options).then(() => {
          this.$router.back();
        });
      }
    }
  };
</script>

<style scoped>
  .el-checkbox{
    margin-left: 0;
    margin-right: 30px;
  }
</style>
