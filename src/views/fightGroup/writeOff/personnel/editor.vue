<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="personnelFrm"
      :rules="frmRules"
      ref="personnelFrm"
      label-width="120px">
      <el-form-item prop="user_id" label="用户ID">
        <el-input
          v-model="personnelFrm.user_id"
          placeholder="请输入用户ID"
          :maxlength="40"
          name="user_id"
          :clearable="true">
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
  import customElTable from '@/components/customElTable';
  import WriteOff from '@/api/fightGroup/writeOff';
  import _ from 'lodash';

  export default {
    name: 'commodityEditor',
    components: {
      customElTable
    },
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        personnelFrm: {
          id: this.$route.params.id || 0,
          user_id: ''
        },
        frmRules: {
          user_id: [
            {
              required: true, message: '请输入用户ID'
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
        WriteOff.personnel_get({ id: this.personnelFrm.id })
          .then(res => {
            this.personnelFrm = _.assign({}, this.personnelFrm, res);
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      save() {
        this.$refs.personnelFrm.validate(valid => {
          if (valid) {
            const personnelFrm = Object.assign({}, this.personnelFrm);
            (this.action === 'modify' ? WriteOff.personnel_edit(personnelFrm) : WriteOff.personnel_add(personnelFrm))
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
  .limit-count__input {
    width: 66px;
  }

  .limit-count__input > input {
    padding: 0 10px;
    text-align: center;
  }
</style>
