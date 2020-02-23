<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="classify_name" label="分类名称">
        <el-input
          v-model="groupFrm.classify_name"
          name="classify_name"
          :clearable="true"
          placeholder="请输入分类名称">
        </el-input>
      </el-form-item>
        <el-form-item prop="description" label="分类描述">
        <el-input
          v-model="groupFrm.description"
          name="matchIntro"
          :clearable="true"
          placeholder="请输入分类描述">
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
  import Content from '@/api/contentPlatform/content';

  export default {
    name: 'editorClass',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        groupFrm: {
          id: this.$route.params.id,
          classify_name: '', // 分类名称
          description: '' // 分类描述
        },
        frmRules: {
          classify_name: [
            {
              required: true, message: '请输入分类名称'
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
      getData() { // 获取频道数据
        Content.class.get(this.$route.params.id).then(res => {
          this.groupFrm.classify_name = res.classify_name;
          this.groupFrm.description = res.description;
        });
      },
      save() {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Content.class.edit(this.groupFrm)
              : Content.class.add(this.groupFrm)).then(() => {
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