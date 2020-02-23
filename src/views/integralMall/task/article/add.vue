<template>
  <div class="app-container article-add">
    <el-form
      class="commodity-edit__form"
      :model="articleFrm"
      ref="articleFrm"
      label-width="120px">
      <el-form-item prop="title" label="文章名称">
        <el-input
          v-model="articleFrm.title"
          placeholder="请输入文章名称"
          :maxlength="40"
          name="title"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="author" label="文章作者">
        <el-input
          v-model="articleFrm.author"
          placeholder="请输入文章作者"
          :maxlength="40"
          name="author"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="url" label="文章链接">
        <el-input
          v-model="articleFrm.url"
          placeholder="请输入文章链接"
          :maxlength="40"
          name="url"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="cover" label="文章封面">
        <upload-prize-avatar @success="uploadSuccess" v-model="articleFrm.cover"></upload-prize-avatar>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent.stop="cancel">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    name: 'article-add',
    components: {
      uploadPrizeAvatar
    },
    props: {
      articleFrm: {
        type: Object
      }
    },
    data() {
      return {
      };
    },
    methods: {
      uploadSuccess(data) {
        this.articleFrm.pic = [];
        this.articleFrm.pic.push(data);
      },
      cancel() {
        this.$emit('sendArticle', 0);
      },
      save() {
        this.$emit('sendArticle', 1, this.articleFrm);
      }
    }
  };
</script>

<style scoped>

</style>
