<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="seriesFrm"
      :rules="frmRules"
      ref="seriesFrm"
      label-width="120px">
      <el-form-item prop="name" label="系列名称">
        <el-input
          v-model="seriesFrm.name"
          placeholder="请输入系列名称"
          :maxlength="40"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="topic_ids" label="所有主题">
        <topic v-model="seriesFrm.topic_ids" :multiple="true" @change="changeTopic"/>
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
  import TOPIC from '@/api/readingClub/topic';
  import _ from 'lodash';
  import topic from '../../components/topic';

  export default {
    name: 'seriesEditor',
    components: {
      uploadPrizeAvatar,
      Tinymce,
      topic
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        seriesFrm: {
          id: this.$route.params.id || 0,
          name: '',
          topic_ids: []
        },
        topicOptions: [],
        frmRules: {
          name: [
            {
              required: true, message: '请输入系列名称'
            }
          ],
          topic_ids: [
            {
              required: false, message: '请选择主题'
            }
          ]
        }
      };
    },
    created() {
      // this.getTopic();
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        TOPIC.series.get(this.$route.params.id).then(res => {
          res.topic_ids = res.topic_list ? res.topic_list.split(',') : [];
          this.seriesFrm = _.assign({}, this.seriesFrm, res);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      getTopic() {
        TOPIC.topic.list({
          pageIndex: this.pageIndex,
          pageSize: 10000
        }).then(res => {
          this.topicOptions = res.result || [];
        });
      },
      save() {
        this.$refs.seriesFrm.validate(valid => {
          if (valid) {
            const seriesFrm = (({id, name, topic_ids}) => ({id, name, topic_ids}))(this.seriesFrm);
            seriesFrm.topic_ids = (seriesFrm.topic_ids.map(pic => pic)).join(',');
            (this.action === 'modify' ? TOPIC.series.edit(seriesFrm) : TOPIC.series.add(seriesFrm))
              .then(() => {
                if (this.action === 'modify') {
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  });
                }
                this.cancel();
              });
          }
        });
      },
      cancel() {
        if (this.$route.query && this.$route.query.type === 'newAdd') {
          this.$router.replace({ name: 'topicSeriesManagement' });
        } else {
          this.$router.back();
        }
      },
      changeTopic() {
        this.$refs.seriesFrm.validateField(['topic_ids']);
      }
    }
  };
</script>

<style scoped>

</style>
