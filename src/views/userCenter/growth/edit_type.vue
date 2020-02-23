<template>
  <div class="activity-wrapper app-container">
    <header >基本信息</header>
    <el-form ref="typeForm" :inline="true" :rules="frmRules" :model="typeForm" label-width="120px">
      <el-form-item prop="name" label="用户档案模型">
        <el-input placeholder="用户档案模型" v-model="typeForm.name"></el-input>
      </el-form-item>
    </el-form>
    <header>更多设置</header>
    <el-form ref="dynamicForms" :inline="true" :model="dynamicForms" label-width="120px">
      <div v-for="(item, index) in dynamicForms.addForms">
        <el-form-item prop="" label="" >
          <el-select placeholder="" :disabled="item.no_delete" v-model="item.id" value="">
            <el-option
              v-for="(tem, index) of dynamicForms.formTemplates" :key="index"
              :label="tem.name"
              :value="tem.id">
            </el-option>
          </el-select>
          <el-checkbox v-model="item.required" :disabled="item.no_delete">是否必填</el-checkbox>
          <el-button type="danger" :disabled="item.no_delete" @click="deleteForm(index)" icon="el-icon-delete" circle></el-button>
          <el-button v-if="index === dynamicForms.addForms.length - 1" type="primary" @click="addForm" icon="el-icon-plus" circle></el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-form ref="form" :inline="true" label-width="80px">
      <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      <el-button @click.prevent.stop="$router.back()">取消</el-button>
    </el-form>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  export default {
    name: 'userGrowthEditType',
    components: {},
    data() {
      return {
        id: 0,
        frmRules: {
          name: [
            {required: true, message: '请填写正确的档案模型'}
          ]
        },
        dynamicFormsRules: {
          name: [
            {required: true, message: '请填写正确的档案模型'}
          ]
        },
        typeForm: {
          name: ''
        },
        dynamicForms: {
          // 前端编辑后的表单数据
          addForms: [],
          // B端支持的所有表单类型
          formTemplates: [],
          // 接口查询到的当前的表单列表，由档案详情接口返回
          queriedForms: []
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        // this.query();
        this.queryForms();
      },
      queryForms() {
        const formTemplates = async params => {
          const formTemplates = await USER_GROWTH_API.getForms({});
          const requiredNames = await USER_GROWTH_API.getRequiredForm({});
          let queriedForms = [];
          this.id = this.$route.params.id;
          if (this.id) {
            const doc = await USER_GROWTH_API.getType(this.id, {});
            this.typeForm.name = doc.name;
            queriedForms = doc.config || [];
          }
          const requiredForms = this.formatType(formTemplates, requiredNames, queriedForms);
          for (const i in queriedForms) {
            queriedForms[i].required = (parseInt(queriedForms[i].is_require) === 1);
            if (!queriedForms[i].no_delete) {
              queriedForms[i].no_delete = false;
            }
          }

          console.log(queriedForms);
          this.dynamicForms.formTemplates = formTemplates;
          this.dynamicForms.queriedForms = queriedForms;
          if (queriedForms.length === 0) {
            this.dynamicForms.addForms = requiredForms;
          } else {
            this.dynamicForms.addForms = queriedForms;
          }
        };

        formTemplates().then(result => {
        });
      },
      formatType(formTemplates, requiredNames, queriedForms) {
        const requiredForms = [];
        for (const key in requiredNames) {
          const name = requiredNames[key];
          for (const k in formTemplates) {
            if (name === formTemplates[k].name) {
              let hasForm = false;
              for (const i in queriedForms) {
                if (queriedForms[i].id === formTemplates[k].id) {
                  queriedForms[i].no_delete = true;
                  hasForm = true;
                  break;
                }
              }
              if (!hasForm) {
                requiredForms.push({
                  id: formTemplates[k].id,
                  required: true,
                  no_delete: true
                });
              }
            }
          }
        }

        return requiredForms;
      },
      deleteForm(index) {
        this.dynamicForms.addForms.splice(index, 1);
      },
      addForm() {
        const addForms = this.dynamicForms.addForms;
        if (addForms.length > 0) {
          if (!(addForms[addForms.length - 1].id > 0)) {
            return;
          }
        }
        this.dynamicForms.addForms.push(
          {
            id: undefined,
            required: false
          }
        );
      },
      save() {
        const saveType = () => {
          const addForms = this.dynamicForms.addForms;
          if (addForms.length === 0) {
            this.$message.error('请选择至少一种表单数据');
            return;
          }

          const forms = addForms.filter(item => {
            return item.id > 0;
          }).map(item => {
            const is_require = item.required ? 1 : 0;
            return {
              is_require: is_require,
              id: item.id
            };
          });
          if (this.id) {
            const params = {name: this.typeForm.name, id: this.id, config: forms};
            USER_GROWTH_API.editType(this.id, params).then(this.onResponse);
          } else {
            const params = {name: this.typeForm.name, config: forms};
            USER_GROWTH_API.addType(params).then(this.onResponse);
          }
        };
        this.$refs.typeForm.validate((valid) => {
          if (valid) {
            saveType();
          }
        });
      },
      onResponse(res) {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.$router.back();
          // this.init();
        } else {
          this.$message.error('失败');
        }
      },
      checkName(rule, value, callback) {
        if (value === '') {
          callback(new Error('请填写正确的档案模型'));
        } else {
          if (this.form.name !== '') {
            this.$refs.typeForm.validateField('name');
          }
          callback();
        }
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
