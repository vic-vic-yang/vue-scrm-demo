<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="name" label="状态名称">
        <el-input v-model="formFrm.name" placeholder="请输入状态名称" name="name" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="description" label="描述">
        <!--<Tinymce placeholder="请输入描述" :height="300" v-model="formFrm.description"></Tinymce>-->
        <el-input v-model="formFrm.description" placeholder="请输入描述" name="description" type="textarea" :clearable="true" :rows="5">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import WORKFLOW from '@/api/configure/workflow';

  export default {
    name: 'editor',
    components: {
      Tinymce
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        formFrm: {
          id: this.$route.params.id || 0,
          name: '',
          description: ''
        },
        frmRules: {}
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        WORKFLOW.state.get(this.$route.params.id).then(res => {
          this.formFrm = res;
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            console.log(formFrm);
            (this.action === 'modify' ? WORKFLOW.state.edit(formFrm) : WORKFLOW.state.add(formFrm))
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
