<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="livesFrm"
      :rules="frmRules"
      ref="livesFrm"
      label-width="120px">
      <el-form-item prop="time" label="事件发生时间">
        <el-date-picker
          :editable="false"
          v-model="livesFrm.time"
          type="datetime"
          placeholder="请选择事件发生时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="content" label="事件详情">
        <tinymce placeholder="请输入事件详情"
                 :video_show="true"
                 :height="300"
                 v-model="livesFrm.content"/>
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
    name: 'highlightEditor',
    components: {
      Tinymce
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        action: action,
        livesFrm: {
          id: this.$route.params.id || 0,
          time: '',
          content: ''
        },
        pageLoading: true,
        frmRules: {
          time: [
            {
              required: false, message: '请选择事件发生时间'
            }
          ],
          content: [
            {
              required: false, message: '请输入事件详情'
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
        if (this.action === 'add') return (this.pageLoading = false);
        activityInfo.get({
          id: this.livesFrm.id
        }).then(res => {
          this.livesFrm = _.assign({}, this.livesFrm, res.data);
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.livesFrm.validate(valid => {
          if (valid) {
            const livesFrm = Object.assign({}, this.livesFrm);
            // livesFrm.content = livesFrm.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
            var livesFrms = (({ id, time, content }) => ({ id, time, content }))(livesFrm);
            (this.action === 'modify' ? activityInfo.edit(livesFrms) : activityInfo.add(livesFrms))
              .then(() => {
                this.$router.back();
              });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
