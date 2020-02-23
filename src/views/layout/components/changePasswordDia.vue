<template>
  <el-dialog title="修改密码" :visible.sync="changeFrmShow" @close="$emit('closed')" :close-on-click-modal="false">
      <el-form :model="changeFrm" :rules="changeFrmRules" ref="changeFrm">
        <el-form-item prop="old" label="旧密码">
          <el-input v-model.trim="changeFrm.old" maxlength="20" type="password" placeholder="请输入你的旧密码"></el-input>
        </el-form-item>
        <el-form-item prop="new" label="新密码">
          <el-input v-model.trim="changeFrm.new" maxlength="20" type="password" placeholder="请输入你的新密码"></el-input>
        </el-form-item>
        <el-form-item prop="reNew" label="重复新密码">
          <el-input v-model.trim="changeFrm.reNew" maxlength="20" type="password" placeholder="请再次输入你的新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeFrmShow = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </div>
    </el-dialog>
</template>

<script>
import API from '@/api/user/user';
export default {
  data() {
    return {
      changeFrm: {
        old: '',
        new: '',
        reNew: ''
      },
      changeFrmShow: true,
      changeFrmRules: {
        old: [
          {
            required: true, message: '请输入你的旧密码'
          }
        ],
        new: [
          { validator: this.checkNew }
        ],
        reNew: [
          { validator: this.checkReNew }
        ]
      }
    };
  },
  methods: {
    changePassword() {
      this.$refs.changeFrm.validate(valid => {
        if (valid) {
          API.changePassword({
            old_pass: this.changeFrm.old,
            new_pass: this.changeFrm.new
          }).then(res => {
            // cdsb_dyh
            this.logout();
          });
        }
      });
    },
    logout() {
      this.$alert('修改密码成功，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'success',
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        this.changeFrmShow = false;
        this.$store.dispatch('LogOut').then(() => {
          location.reload();
        });
      });
    },
    checkNew(rule, value, callback) {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value)) {
        return callback(new Error('密码必须包含数字和英文，长度6-20'));
      }
      callback();
    },
    checkReNew(rule, value, callback) {
      if (!value) {
        return callback(new Error('请再次输入你的新密码'));
      }
      if (value !== this.changeFrm.new) {
        return callback(new Error('两次输入密码不一致'));
      }
      callback();
    }
  }
};
</script>

<style>

</style>