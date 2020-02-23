<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="introduceFrm"
      :rules="frmRules"
      ref="introduceFrm"
      label-width="120px">
      <el-form-item prop="content" label="现场活动介绍">
        <tinymce placeholder="请输入现场活动介绍" :height="300" v-model="introduceFrm.content"/>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import activityInfo from '@/api/fightGroup/activityInfo';
  import _ from 'lodash';

  export default {
    name: 'introduce',
    components: {
      Tinymce
    },
    data() {
      return {
        introduceFrm: {
          content: '',
          key: 'LIVE_INTRODUCTION'
        },
        pageLoading: true,
        frmRules: {
          content: [
            {
              required: false, message: '请输入现场活动介绍'
            }
          ]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        activityInfo.operation({
          key: this.introduceFrm.key
        }).then(res => {
          this.introduceFrm = _.assign({}, this.introduceFrm, res.data);
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.introduceFrm.validate(valid => {
          if (valid) {
            const introduceFrm = Object.assign({}, this.introduceFrm);
            // introduceFrm.content = introduceFrm.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
            activityInfo.operation_edit({
              content: introduceFrm.content,
              key: introduceFrm.key
            }).then(() => {
              this.getData();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
