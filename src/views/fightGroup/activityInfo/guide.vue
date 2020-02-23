<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="guideFrm"
      :rules="frmRules"
      ref="guideFrm"
      label-width="120px">
      <el-form-item prop="content" label="动指南">
        <tinymce placeholder="请输入活动指南" :height="300" v-model="guideFrm.content"/>
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
    name: 'wrc',
    components: {
      Tinymce
    },
    data() {
      return {
        guideFrm: {
          content: '',
          key: 'ACTIVE_GUIDE'
        },
        pageLoading: true,
        frmRules: {
          content: [
            {
              required: false, message: '请输入活动指南'
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
          key: this.guideFrm.key
        }).then(res => {
          this.guideFrm = _.assign({}, this.guideFrm, res.data);
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.guideFrm.validate(valid => {
          if (valid) {
            const guideFrm = Object.assign({}, this.guideFrm);
            // guideFrm.content = guideFrm.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
            activityInfo.operation_edit({
              content: guideFrm.content,
              key: guideFrm.key
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
