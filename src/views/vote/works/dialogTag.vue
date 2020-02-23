<template>
  <el-dialog :title="edit ? '编辑标签' : '新建标签'"
             :close-on-click-modal="false"
             :visible.sync="dialogShow"
             width="500px"
             :before-close="preHandleClose">
    <el-form :model="dialogForm"
             :rules="rules"
             ref="dialogForm"
             label-width="100px">
      <el-form-item label="标签名称："
                    prop="name">
        <el-input v-model="dialogForm.name"
                  placeholder="请填写标签名称，少于22个字"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="preHandleClose">取消</el-button>
      <el-button type="primary"
                 @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Works from '@/api/vote/works';
export default {
  name: 'dialogTag',
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    tag: Object,
    dialogShow: Boolean,
    handleClose: Function
  },
  mixins: [],
  components: {},
  data() {
    return {
      dialogForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写标签名称', trigger: 'blur' },
          { min: 1, max: 22, message: '长度在1到22个字符', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    dialogShow: function(o, n) {
      if (o) {
        this.formFill();
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    init() {
      this.dialogForm = {
        name: ''
      };
    },
    sure() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.edit) {
            Works.tagEdit(this.tag.id, this.dialogForm)
              .then(() => {
                this.preHandleClose();
              });
          } else {
            Works.tagAdd(this.dialogForm)
              .then(() => {
                this.preHandleClose();
              });
          }
        }
      });
    },
    preHandleClose() {
      this.$refs.dialogForm.resetFields();
      this.init();
      this.handleClose();
    },
    formFill() {
      if (this.edit) {
        this.dialogForm.name = this.tag.name;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
