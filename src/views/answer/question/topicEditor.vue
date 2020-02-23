<template>
  <div class="app-container">
    <el-form
      :model="topicFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="topicFrm"
      label-width="100px">
      <el-form-item prop="title" label="题目名称">
        <el-input
          v-model="topicFrm.title"
          name="title"
          placeholder="题目名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="answer" label="题目答案">
        <el-row
          :class="{'mb-20': index!==topicFrm.answers.length-1}"
          v-for="(answer,index) in topicFrm.answers" :key="index">
          <el-col :span="12">
            <el-input
              v-model="answer.title"
              :name="'answerTitle'+index"
              :clearable="true"
              placeholder="请输入答案">
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-checkbox v-if="type == 2" v-model="answer.isTrue" class="ml-20 mr-10">正确答案</el-checkbox>
            <el-radio v-if="type == 1" v-model="selectAnswerIndex" class="ml-20 mr-10" :label="index">正确答案</el-radio>
            <template v-if="index===topicFrm.answers.length-1">
              <el-button v-if="topicFrm.answers.length<5" type="text" icon="el-icon-plus" @click="addAnswer">添加</el-button>
              <el-button v-if="topicFrm.answers.length>2" type="text" icon="el-icon-delete" @click="deleteAnswer(index)">删除</el-button>
            </template>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="groups" label="所属题库">
        <el-select placeholder="请选择所属题库" disabled v-model="topicFrm.groupId">
          <el-option
            v-for="item in questionGroupsOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="groups_page_info.pageSize"
              :pager-count="Math.ceil(groups_page_info.totalCount / groups_page_info.pageSize)"
              :current-page="groups_page_info.pageIndex"
              @current-change="currentChangeGroups"
              layout="prev, pager, next"
              :total="groups_page_info.totalCount">
            </el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item prop="groups" label="关联文章">
        <el-select placeholder="请选择关联文章" filterable v-model="topicFrm.article_id">
          <el-option
            v-for="item in articles"
            :key="item.id"
            :label="item.article_name"
            :value="item.id">
          </el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="articl_page_info.pageSize"
              :pager-count="Math.ceil(articl_page_info.totalCount / articl_page_info.pageSize)"
              :current-page="articl_page_info.pageIndex"
              @current-change="currentChangeArticle"
              layout="prev, pager, next"
              :total="articl_page_info.totalCount">
            </el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item prop="desc" label="题目说明">
        <el-input
          type="textarea"
          :rows="3"
          name="desc"
          placeholder="请输入题目说明"
          v-model="topicFrm.desc">
        </el-input>
      </el-form-item>
      <el-form-item prop="imageUrl" label="题目配图(选填)">
        <upload-prize-avatar v-model="topicFrm.picUrl"></upload-prize-avatar>
        <el-button v-if="topicFrm.picUrl" @click="deleteImg" type="danger">删除图片</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Question from '@/api/answer/question';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import Learning from '@/api/answer/learning';
  import _ from 'lodash';

  export default {
    name: 'topicEditor',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        topicId: this.$route.params.id,
        action: this.$route.params.id ? 'modify' : 'add',
        type: this.$route.query.type * 1, // 题目类型
        topicFrm: {
          title: '',
          answers: [
            {
              title: '',
              isTrue: false
            },
            {
              title: '',
              isTrue: false
            },
            {
              title: '',
              isTrue: false
            },
            {
              title: '',
              isTrue: false
            }
          ],
          groupId: this.$route.query.group * 1 || '',
          desc: '',
          picUrl: '',
          article_id: null
        },
        frmRules: {
          title: [
            {
              required: true, message: '请输入题目名称'
            }
          ],
          groupId: [
            {
              required: true, message: '请选择所属题库'
            }
          ],
          desc: [
            {
              required: false, message: '请输入题库说明'
            }
          ]
        },
        selectAnswerIndex: -1,
        questionGroupsOptions: [],
        articles: [],
        pageLoading: true,
        groups_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1
        },
        articl_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1
        }
      };
    },
    watch: {
      selectAnswerIndex(index) {
        this.topicFrm.answers.map((item, i) => {
          this.$set(this.topicFrm.answers[i], 'isTrue', i === index);
        });
      }
    },
    created() {
      Promise.all([this.getGroups(), this.getArticle(), this.getData()]);
    },
    methods: {
      changeAnswer(data) {
        this.topicFrm.answers.map(item => {
          if (data.title === item.title) {
            item.isTrue = true;
          }
        });
      },
      currentChangeGroups(e) {
        this.groups_page_info.pageIndex = e;
        this.getGroups();
      },
      currentChangeArticle(e) {
        this.articl_page_info.pageIndex = e;
        this.getArticle();
      },
      getGroups() {
        var options = {
          pageIndex: this.groups_page_info.pageIndex,
          pageSize: this.groups_page_info.pageSize
        };
        Question.group.list(options).then(res => {
          this.questionGroupsOptions = res.items;
          this.pageLoading = false;
          this.groups_page_info = {
            pageIndex: res.pageIndex * 1,
            pageSize: res.pageSize * 1,
            totalCount: res.totalCount * 1
          };
        }).catch(err => {
          console.log('game editor get data error : ', err);
          this.pageLoading = false;
        });
      },
      getData() {
        if (!this.topicId) return Promise.resolve();
        Question.topic.get(this.topicId).then(res => {
          if (this.type === 1) { // 单选
            this.selectAnswerIndex = _.findIndex(res.data.answers, 'isTrue', true);
            if (this.selectAnswerIndex === -1) {
              this.selectAnswerIndex = 0;
              console.log(this.selectAnswerIndex);
            }
          }
          this.topicFrm = {
            ...res.data
          };
          this.topicFrm.article_id = parseInt(this.topicFrm.article_id, 10);
        });
      },
      getArticle() {
        var options = {
          pageIndex: this.articl_page_info.pageIndex,
          pageSize: this.articl_page_info.pageSize
        };
        Learning.list(options).then(data => {
          this.articl_page_info = {
            pageIndex: data.pageIndex * 1,
            pageSize: data.pageSize * 1,
            totalCount: data.totalCount * 1
          };
          this.articles = data.result.map(item => {
            return {
              ...item,
              id: parseInt(item.id)
            };
          });
        });
      },
      save() {
        this.$refs.topicFrm.validate(valid => {
          if (valid) {
            const frmData = Object.assign({}, this.topicFrm);
            (this.action === 'modify'
              ? Question.topic.edit(frmData)
              : Question.topic.add(frmData)).then(() => {
              this.$router.back();
            });
          }
        });
      },
      addAnswer() {
        if (this.topicFrm.answers.length < 5) {
          this.topicFrm.answers.push({
            title: '',
            isTrue: false
          });
        }
      },
      deleteAnswer(index) {
        if (this.topicFrm.answers.length > 2) {
          this.topicFrm.answers.splice(index, 1);
        }
      },
      deleteImg() {
        this.topicFrm.picUrl = '';
      }
    }
  };
</script>

<style scoped>
  .article_pages{
    text-align: right;
    margin: 5px 0 0;
  }
</style>
