<template>
  <div class="app-container">
    <h4 >基本信息</h4>
    <div class="container-content">
      <div>
        <el-form :model="formData" :rules="rules" class="form-account-base" ref="form">
          <el-form-item label="账号" prop="username">
            <el-input v-model="formData.username" placeholder="请输入" style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholder="请输入" style="width: 220px;" autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input v-model="formData.repassword" type="password" placeholder="请输入" style="width: 220px;" autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="formData.realname" placeholder="请输入" style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.email" placeholder="请输入" style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formData.phone" placeholder="请输入" style="width: 220px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { API_USER } from '@/api/setting';
export default {
  name: 'accountManageEdit',
  data() {
    const regPassWord = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    const validatePass = (rule, value, callback) => {
      if (this.action === 'modify') {
        if (value) {
          // 编辑 修改密码
          if (!regPassWord.test(value)) {
            // 1.编辑不合法
            callback(new Error('密码必须包含数字和英文，长度6-20'));
          } else {
            // 2.编辑合法
            callback();
          }
        } else {
          // 编辑，不修改密码
          callback();
        }
      } else {
        if (!regPassWord.test(value)) {
          // 新建 不合法
          callback(new Error('密码必须包含数字和英文，长度6-20'));
        } else {
          callback();
        }
      }
    };
    const validatePassRe = (rule, value, callback) => {
      if (this.action === 'modify') {
        if (value) {
          // 编辑 修改密码
          if (value !== this.formData.password) {
            // 1.编辑不合法
            callback(new Error('两次输入密码不一致!'));
          } else {
            // 2.编辑合法
            callback();
          }
        } else {
          // 编辑，不修改密码
          callback();
        }
      } else {
        if (value !== this.formData.password) {
          // 1.新建不一致
          callback(new Error('两次输入密码不一致!'));
        } else {
          // 2.新建一致
          callback();
        }
      }
    };
    return {
      action: this.$route.params.id ? 'modify' : 'add',
      dialogVisible: false,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 1,
      tabLoading: false,
      type: 'base',
      formData: {
        id: this.$route.params.id || 0,
        username: '',
        realname: '',
        password: '',
        repassword: '',
        email: '',
        phone: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
          { validator: validatePassRe, trigger: 'blur' }
        ]
      },
      tableData: [
        {
          user: 'haha'
        }
      ],
      editable: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.pageLoading = true;
      if (this.action === 'add') return (this.pageLoading = false);
      API_USER.getFirst(this.$route.params.id).then(res => {
        this.formData = res.data;
        this.pageLoading = false;
        this.getPermissions();
      }).catch(() => {
        this.pageLoading = false;
      });
    },
    prompt(id) {
      this.$confirm('账号创建成功，您现在可以为该账号绑定角色以及设置部门', '提示', {
        confirmButtonText: '绑定角色',
        cancelButtonText: '设置部门',
        type: 'info'
      }).then(() => {
        this.$router.push({
          name: 'accountMerber',
          params: {id: id}
        });
      }).catch(() => {
        this.$router.push({
          name: 'accountSection',
          params: {id: id}
        });
      });
    },
    submit() {
      let server, tips;
      if (this.action === 'modify') {
        server = API_USER.modify;
        tips = '修改成功';
      } else {
        server = API_USER.add;
        tips = '创建成功';
      }
      this.$refs.form.validate(validate => {
        if (validate) {
          const formData = Object.assign({}, this.formData);
          formData.username = formData.username.replace(/\s*/g, '');
          server(formData).then(res => {
            if (this.action !== 'modify') {
              this.prompt(res.data.id);
            } else {
              this.$message.success(tips);
              this.$router.back();
            }
          });
        }
      });
    }
  }
};
</script>

<style>
.form-account-base .el-form-item__label {
  display: inline-block;
  width: 120px;
  text-align: left;
}
</style>
