<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="topicFrm"
      :rules="frmRules"
      ref="topicFrm"
      label-width="120px">
      <el-form-item prop="name" label="主题名称">
        <el-input
          v-model="topicFrm.name"
          placeholder="请输入主题名称"
          :maxlength="40"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="description" label="主题说明">
        <el-input
          v-model="topicFrm.description"
          placeholder="请输入主题说明"
          :maxlength="40"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="img" label="主题配图">
        <upload-prize-avatar v-model="topicFrm.img"></upload-prize-avatar>
        <small style="color: #999">建议尺寸630*454</small>
      </el-form-item>
      <el-form-item prop="content" label="主题内容">
        <tinymce placeholder="请输入主题内容" :height="300" v-model="topicFrm.content"/>
      </el-form-item>
      <el-form-item prop="video" label="添加视频">
        <upload-video v-model="topicFrm.video" @setVdo="setVdo" @delVdo="delVdo" uploadToOss="true"></upload-video>
      </el-form-item>
      <el-form-item prop="audio" label="添加音频">
        <upload-audio v-model="topicFrm.audio" @delAudio="delAudio"></upload-audio>
      </el-form-item>
      <el-form-item v-if="topicFrm.audio" prop="audio_name" label="音频名称">
        <el-input
          v-model="topicFrm.audio_name"
          maxlength="10"
          :clearable="true"
          placeholder="请输入音频名称-长度限制10字"
        />
      </el-form-item>
      <el-form-item prop="series_ids" label="所属系列">
        <el-select placeholder="请选择所属系列" style="width: 350px;" multiple v-model="topicFrm.series_ids">
          <el-option
            v-for="item in seriesOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import Tinymce from '@/components/Tinymce';
  import uploadVideo from '@/components/Upload/uploadVideo';
  import uploadAudio from '@/components/Upload/uploadAudio';
  import TOPIC from '@/api/readingClub/topic';
  import _ from 'lodash';

  export default {
    name: 'topicEditor',
    components: {
      uploadPrizeAvatar,
      Tinymce,
      uploadVideo,
      uploadAudio
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        topicFrm: {
          id: this.$route.params.id || 0,
          name: '',
          description: '',
          img: '',
          content: '',
          video: '',
          video_cover: '',
          audio: '',
          audio_name: '',
          duration: '',
          series_ids: ''
        },
        seriesOptions: [],
        frmRules: {
          name: [
            {
              required: true, message: '请输入主题名称'
            }
          ],
          description: [
            {
              required: true, message: '请输入主题说明'
            }
          ],
          img: [
            {
              required: true, message: '主题配图'
            }
          ],
          content: [
            {
              required: true, message: '请输入主题内容'
            }
          ],
          video: [
            {
              required: false, message: '添加视频'
            }
          ],
          audio: [
            {
              required: false, message: '添加音频'
            }
          ],
          audio_name: [
            {
              required: true, message: '请输入音频名称-长度限制10字'
            }
          ]
        }
      };
    },
    created() {
      this.getSeries();
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        TOPIC.topic.get(this.$route.params.id).then(res => {
          res.series_ids = res.series_ids ? res.series_ids.split(',') : [];
          this.topicFrm = _.assign({}, this.topicFrm, res);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      getSeries() {
        TOPIC.series.list({
          pageIndex: this.pageIndex,
          pageSize: 10000
        }).then(res => {
          this.seriesOptions = res.result || [];
        });
      },
      setVdo(url, cover) {
        this.topicFrm.video = url;
        this.topicFrm.video_cover = cover;
      },
      delVdo() {
        this.topicFrm.video = '';
      },
      delAudio() {
        this.topicFrm.audio = '';
      },
      save() {
        this.$refs.topicFrm.validate(valid => {
          if (valid) {
            // if (!this.topicFrm.video && !this.topicFrm.audio) {
            //   this.$message({
            //     type: 'info',
            //     message: '视频或音频二选一'
            //   });
            //   return;
            // }
            const topicFrm = Object.assign({}, this.topicFrm);
            topicFrm.series_ids = (topicFrm.series_ids.map(pic => pic)).join(',');
            (this.action === 'modify' ? TOPIC.topic.edit(topicFrm) : TOPIC.topic.add(topicFrm))
              .then(() => {
                this.cancel();
              });
          }
        });
      },
      cancel() {
        if (this.$route.query && this.$route.query.type === 'newAdd') {
          this.$router.replace({ name: 'topicListManagement' });
        } else {
          this.$router.back();
        }
      }
    }
  };
</script>

<style scoped>

</style>

