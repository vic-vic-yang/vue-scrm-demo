<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      v-loading="tabLoading"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="tag_name" label="标签名称">
        <el-input
          v-model="groupFrm.tag_name"
          name="tag_name"
          :clearable="true"
          placeholder="请输入标签名称">
        </el-input>
      </el-form-item>
        <el-form-item prop="description" label="标签描述">
        <el-input
          v-model="groupFrm.description"
          name="description"
          :clearable="true"
          placeholder="请输入标签描述">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Auxiliary from '@/api/contentPlatform/auxiliary';

  export default {
    name: 'editorLabel',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        tabLoading: false,
        groupFrm: {
          id: this.$route.params.id,
          tag_name: '', // 标签名称
          description: '' // 标签描述
        },
        frmRules: {
          tag_name: [
            {
              required: true, message: '请输入标签名称'
            }
          ]
        }
      };
    },
    created() {
      if (this.action === 'modify') {
        this.getData();
      }
    },
    methods: {
      getData() { // 获取标签数据
        this.tabLoading = true;
        Auxiliary.label.get(this.$route.params.id).then(res => {
          this.groupFrm.tag_name = res.tag_name;
          this.groupFrm.description = res.description;
          this.tabLoading = false;
        });
      },
      save() {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Auxiliary.label.edit(this.groupFrm)
              : Auxiliary.label.add(this.groupFrm)).then(() => {
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