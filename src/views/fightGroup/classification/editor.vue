<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="classFrm"
      :rules="frmRules"
      ref="classFrm"
      label-width="120px">
      <el-form-item prop="name" label="分类名称">
        <el-input
          v-model="classFrm.name"
          placeholder="请输入分类名称"
          :maxlength="40"
          name="name"
          style="width: 300px"
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
  import classification from '@/api/fightGroup/classification';
  import _ from 'lodash';

  export default {
    name: 'editor',
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        name: '',
        classFrm: {
          id: this.$route.params.id || 0,
          name: ''
        },
        frmRules: {}
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        classification.get(this.classFrm.id).then(res => {
          this.classFrm = _.assign({}, this.classFrm, res);
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.classFrm.validate(valid => {
          if (valid) {
            const classFrm = {
              id: this.classFrm.id,
              name: this.classFrm.name
            };
            if (this.action === 'add') {
              delete classFrm.id;
            }
            classification.add(classFrm).then(() => {
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
