<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="name" label="事件集名称">
        <el-input
          v-model="formFrm.name"
          placeholder="请输入事件集名称"
          :maxlength="50"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="cover" label="封面">
        <single-image v-model="formFrm.cover" showDelImage @del="formFrm.cover = ''"/>
      </el-form-item>
      <el-form-item prop="event_ids" label="关联事件">
        <related-events v-model="formFrm.event_ids"/>
      </el-form-item>
      <el-form-item prop="describe" label="事件集介绍">
        <tinymce placeholder="请输入事件集介绍"
                 :height="300"
                 v-model="formFrm.describe"/>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import singleImage from '@/components/Upload/singleImage';
  import relatedEvents from '../components/relatedEvents/index';
  import Tinymce from '@/components/Tinymce';
  import CALENDAR from '@/api/contentPlatform/calendar';
  import _ from 'lodash';

  export default {
    name: 'editor',
    components: {
      singleImage,
      relatedEvents,
      Tinymce
    },
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        pageLoading: true,
        formFrm: {
          cid: this.$route.params.id || 0,
          name: '',
          cover: '',
          event_ids: [],
          describe: ''
        },
        frmRules: {
          name: [{required: true, message: '请输入事件名称'}],
          cover: [{required: true, message: '请上传封面'}]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        CALENDAR.collection.get(this.formFrm.cid).then(res => {
          this.formFrm = _.assign({}, this.formFrm, res);
          this.formFrm.event_ids = this.formFrm.events.map(item => item.id);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            (this.action === 'modify' ? CALENDAR.collection.edit(formFrm) : CALENDAR.collection.add(formFrm))
              .then(() => {
                if (!this.$route.matched.length) {
                  this.$router.replace({name: 'eventCollectionMagage'});
                } else {
                  this.$router.back();
                }
              });
          }
        });
      }
    }
  };
</script>

<style>

</style>
