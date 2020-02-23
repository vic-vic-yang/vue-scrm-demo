<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="templateFrm"
      :rules="frmRules"
      ref="templateFrm"
      label-width="100px">
      <el-form-item prop="articleName" label="文章名称">
          <el-input
            v-model="templateFrm.articleName"
            name="articleName"
            :clearable="true"
            placeholder="请输入文章名称">
          </el-input>
        </el-form-item>
        <el-form-item prop="type" label="跳转类型">
          <el-radio
            v-model="templateFrm.type"
            :label="1">普通文章
          </el-radio>
          <el-radio
            v-model="templateFrm.type"
            :label="2">公众号文章
          </el-radio>
          <!--<el-radio-->
            <!--v-model="templateFrm.type"-->
            <!--:label="3">公众号文章外跳-->
          <!--</el-radio>-->
        </el-form-item>
      <el-form-item prop="matches" label="所属比赛">
        <el-select placeholder="请选择" multiple v-model="templateFrm.matches">
          <el-option
            v-for="item in questionGroupsOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
      <template v-if="templateFrm.type !==1">
        <el-form-item prop="content" label="文章链接">
          <el-input
            name="info"
            placeholder="请输入文章链接"
            v-model="templateFrm.content">
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item prop="author" label="文章作者">
          <el-input
            v-model="templateFrm.author"
            name="author"
            :clearable="true"
            placeholder="请输入文章作者">
          </el-input>
        </el-form-item>
        <el-form-item prop="publish_time" label="文章日期">
          <el-date-picker
            v-model="templateFrm.publish_time"
            type="date"
            :editable="false"
            placeholder="请输入文章日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="content" label="文章内容">
          <tinymce placeholder="请输入文章内容" :height="300" v-model="templateFrm.content"/>
        </el-form-item>
      </template>
      <el-form-item prop="cover" label="文章封面(选题)">
        <upload-prize-avatar v-model="templateFrm.cover"></upload-prize-avatar>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Learning from '@/api/answer/learning';
  import Tinymce from '@/components/Tinymce';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    name: 'templateEditor',
    components: {
      uploadPrizeAvatar,
      Tinymce
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        questionGroupsOptions: [{
          title: '12',
          id: '156'
        }],
        templateFrm: {
          articleName: '',
          type: 1,
          matches: [],
          content: '',
          cover: '',
          author: '',
          publish_time: ''
        },
        frmRules: {
          articleName: [
            {
              required: true, message: '请输入文章名称'
            }
          ],
          type: [
            {
              required: true, message: '请选择跳转类型'
            }
          ],
          matches: [
            {
              required: true, message: '请选择所属比赛'
            }
          ],
          content: [
            {
              required: true, message: '请输入文章链接'
            }
          ],
          author: [
            {
              required: true, message: '请输入文章作者'
            }
          ],
          publish_time: [
            {
              required: true, message: '请输入文章日期'
            }
          ]
        }
      };
    },
    created() {
      this.getDetail();
    },
    computed: {
    },
    methods: {
      getDetail() {
        Learning.matchType().then(data => {
          this.questionGroupsOptions = (data.result || []).map(item => {
            return {
              title: item.matchName,
              id: item.id
            };
          });
          this.pageLoading = false;
        })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      save() {
        this.$refs.templateFrm.validate(valid => {
          if (valid) {
            Learning.newArticle(this.templateFrm).then(res => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style>

</style>
