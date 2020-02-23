<template>
  <el-dialog
    title="栏目图片展示配置"
    :visible.sync="showWeight"
    width="35%"
    @close="closed">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="limit" label="权重前">
        <el-input v-model="formFrm.limit" placeholder="请输入" :maxlength="50" name="limit" :clearable="true" style="width: 200px;">
        </el-input>
        名在迷你导航-{{name}}中展示图片
      </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
      <el-button @click="closed">取 消</el-button>
      <el-button type="primary" @click="saveWeight">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'weight',
    props: ['show', 'name', 'number'],
    data() {
      return {
        showWeight: false,
        formFrm: {
          limit: this.number || ''
        },
        frmRules: {
          limit: [{required: true, message: `请输入权重前几名在迷你导航-${this.name}中展示图片`}]
        }
      };
    },
    watch: {
      show(val) {
        this.showWeight = val;
        this.formFrm.limit = this.number;
      }
    },
    methods: {
      saveWeight() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            this.$emit('saveWeight', this.formFrm);
          }
        });
      },
      closed() {
        this.$emit('closed');
      }
    }
  };
</script>

<style scoped>

</style>
