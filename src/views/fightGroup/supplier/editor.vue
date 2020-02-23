<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="commodityFrm"
      :rules="frmRules"
      ref="commodityFrm"
      label-width="120px">
  
     <el-form-item prop="name" label="供应商名称">
       <el-input
         v-model="commodityFrm.name"
         placeholder="请输入供应商名称"
         :maxlength="40"
         name="name"
         :clearable="true">
       </el-input>
     </el-form-item>
     <el-form-item prop="contact_user" label="联系人">
       <el-input
         v-model="commodityFrm.contact_user"
         placeholder="请输入联系人"
         :maxlength="40"
         name="contact_user"
         :clearable="true">
       </el-input>
     </el-form-item>
     <el-form-item prop="phone" label="手机号码">
       <el-input
         v-model="commodityFrm.phone"
         placeholder="请输入手机号码"
         :maxlength="11"
         name="phone"
         type="number"
         :clearable="true">
       </el-input>
     </el-form-item>
     <el-form-item prop="username" label="B端账号">
       <el-input
         v-model="commodityFrm.username"
         placeholder="请输入B端账号"
         :maxlength="20"
         name="username"
         :clearable="true">
       </el-input>
     </el-form-item>
     <el-form-item prop="password" label="密码">
       <el-input
         v-model="commodityFrm.password"
         placeholder="请输入密码"
         :maxlength="20"
         name="password"
         :clearable="true"
         >
         <svg-icon icon-class="eye"/>
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
  import SuppliersApi from '@/api/integralMall/suppliers.js';
  import _ from 'lodash';
  export default {
    name: 'add',
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        commodityFrm: {
          name: '',
          contact_user: '',
          phone: '',
          username: '',
          password: ''
        },
        frmRules: {
          name: [
            {
              required: true, message: '请输入供应商名称'
            }
          ],
          contact_user: [
            {
              required: true, message: '请输入联系人名称'
            }
          ],
          phone: [
            { required: true, message: '请输入手机号' },
            { min: 11, max: 11, message: '手机号长度必须是11位', trigger: 'blur' }
          ],
          username: [
            {
              required: true, message: '请输入B端账号'
            }
          ],
          password: [
            {
              required: action === 'add', message: '请输入密码'
            }
          ]
        }
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        SuppliersApi.get(this.$route.params.id)
          .then(res => {
            this.commodityFrm = _.assign({}, this.commodityFrm, res.data);
            console.log(this.commodityFrm);
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      save() {
        this.$refs.commodityFrm.validate(valid => {
          if (valid) {
            const commodityFrm = Object.assign({}, this.commodityFrm);
            (this.action === 'modify' ? SuppliersApi.edit(commodityFrm, this.$route.params.id) : SuppliersApi.add(commodityFrm))
              .then(() => {
                this.$router.back();
              });
          }
        });
      }
    }
  };
</script>

<style>
</style>
