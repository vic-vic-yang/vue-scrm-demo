<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      v-loading="tabLoading"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="nickname" label="名称">
        <el-input
          v-model="groupFrm.nickname"
          name="nickname"
          :clearable="true"
          placeholder="请输入名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="username" label="账号">
        <el-input
          v-model="groupFrm.username"
          name="username"
          :clearable="true"
          placeholder="请输入账号">
        </el-input>
      </el-form-item>
      <el-form-item :prop="action === 'add' ? 'password' : ''" label="密码">
        <el-input
          type="password"
          v-model="groupFrm.password"
          name="password"
          :clearable="true"
          placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="role" label="角色配置">
        <el-checkbox-group class="requirement" v-model="groupFrm.roles">
          <el-checkbox 
            v-for="(item, index) in signGroupsOptions"
            :key="index"
            :label="item.role_name">
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Configure from '@/api/contentPlatform/configure';

  export default {
    name: 'contentEditorAccount',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        groupFrm: {
          id: this.$route.params.id,
          nickname: '', // 名称
          username: '', // 账号
          password: '', // 密码
          roles: [] // 角色
        },
        tabLoading: true,
        frmRules: {
          nickname: [
            {
              required: true, message: '请输入名称'
            }
          ],
          username: [
            {
              required: true, message: '请输入账号'
            }
          ],
          password: [
            {
              required: true, message: '请输入密码'
            }
          ]
        },
        signGroupsOptions: []
      };
    },
    created() {
      this.tabLoading = true;
      Configure.role.list({
        pageIndex: 100,
        pageSize: 1
      }).then(data => {
        this.signGroupsOptions = data.result;
        if (this.action === 'modify') {
          this.getData();
        }
        this.tabLoading = false;
      }).catch(() => {
        this.tabLoading = false;
      });
    },
    methods: {
      getData() { // 获取数据
        Configure.account.get(this.$route.params.id).then(res => {
          this.groupFrm.nickname = res.nickname;
          this.groupFrm.username = res.username;
          this.groupFrm.password = res.password;
          this.groupFrm.roles = res.roles.map(item => {
            for (let i = 0; i < this.signGroupsOptions.length; i++) {
              if (this.signGroupsOptions[i].id === item) {
                return this.signGroupsOptions[i].role_name;
              }
            }
          });
        });
      },
      save() {
        const obj = {
          id: this.groupFrm.id,
          username: this.groupFrm.username,
          nickname: this.groupFrm.nickname,
          password: this.groupFrm.password,
          roles: []
        };
        this.signGroupsOptions.forEach(item => {
          for (let i = 0; i < this.groupFrm.roles.length; i++) {
            if (this.groupFrm.roles[i] === item.role_name) {
              obj.roles.push(item.id);
            }
          }
        });
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Configure.account.edit(obj)
              : Configure.account.add(obj)).then(() => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
/* .requirement{
  width: 300px;
} */
/* .requirement .el-checkbox{
  margin-left: 0;
} */
</style>