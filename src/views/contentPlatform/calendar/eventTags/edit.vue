<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="name" label="标签名称">
        <el-input
          v-model="formFrm.name"
          placeholder="请输入标签名称 - 不能超过15个字符"
          :maxlength="15"
          :minLength="1"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="describe" label="标签描述">
        <el-input
          v-model="formFrm.describe"
          placeholder="请输入标签描述 - 不能超过50个字符"
          :maxlength="50"
          name="describe"
          type="textarea"
          :rows="5"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CALENDAR from '@/api/contentPlatform/calendar';
  import _ from 'lodash';

  export default {
    name: 'editor',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        pageLoading: true,
        formFrm: {
          tag_id: this.$route.params.id || 0,
          name: '',
          describe: ''
        },
        frmRules: {
          name: [{required: true, message: '请输入标签名称'}],
          describe: [{required: true, message: '请输入标签描述'}]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        CALENDAR.tag.get(this.formFrm.tag_id).then(res => {
          this.formFrm = _.assign({}, this.formFrm, res);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            (this.action === 'modify' ? CALENDAR.tag.edit(formFrm) : CALENDAR.tag.add(formFrm))
              .then(() => {
                if (!this.$route.matched.length) {
                  this.$router.replace({name: 'eventTags'});
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

<style scoped>

</style>
