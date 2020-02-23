<template>
  <div class="activity-wrapper app-container">
    <el-form ref="dynamicFormRuleForm" :rules="dynamicFormRules" v-model="dynamicFormRuleForm" label-width="80px">
            <el-form-item prop="activity" label="表单名称">
              <el-input placeholder="名称" v-model="dynamicFormRuleForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="activity" label="表单类型">
              <el-select v-model="dynamicFormRuleForm.type" value="">
                <el-option
                  v-for="(type, index) of formTypes" :key="index"
                  :label="type.label"
                  :value="type.value">
                </el-option>
              </el-select>
            </el-form-item>
      <div v-if="dynamicFormRuleForm.type === 'input'">
        <el-form-item prop="activity" label="长度">
          <el-input placeholder="" v-model="dynamicFormRuleForm.name"></el-input>
        </el-form-item>
      </div>
      <div v-if="dynamicFormRuleForm.type === 'select'">
        <el-form-item v-for="(item, index) in dynamicFormRuleForm.select" prop="activity" label="选项">
          <el-input placeholder="" v-model="dynamicFormRuleForm.select[index]"></el-input>
          <el-button @click="" type="primary" icon="el-icon-plus" ></el-button>
          <el-button @click="" type="danger" icon="el-icon-minus"></el-button>
        </el-form-item>
      </div>
      <div v-if="dynamicFormRuleForm.type === 'image-upload'">
        <el-form-item prop="detail" label="参与详情">
          <upload-prize-avatar v-model="recordForm.detail"  @update:imageId=""></upload-prize-avatar>
        </el-form-item>
      </div>
    </el-form>
<!--    <p>暂未开放该功能，请联系技术人员支持。</p>-->
    <el-form ref="form" :inline="true" label-width="80px">
      <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      <el-button @click.prevent.stop="$router.back()">取消</el-button>
    </el-form>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    name: 'userGrowthEditType',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        dynamicFormRuleForm: {
          type: '',
          name: '',
          input: {
            length: 0
          },
          select: [
            '初中'
          ],
          image_upload: {
            min_size: {
              name: '',
              value: 0
            },
            max_size: {
              name: '',
              value: 0
            }
          }
        },
        dynamicFormRules: {
        },
        formTypes: [
          {
            value: 'input',
            label: '输入'
          },
          {
            value: 'select',
            label: '选项'
          },
          {
            value: 'image-upload',
            label: '图片上传'
          },
          {
            value: 'time-pick',
            label: '时间点选择'
          },
          {
            value: 'date-pick',
            label: '日期选择'
          },
          {
            value: 'time-pick',
            label: '时间段选择'
          },
          {
            value: 'time-pick',
            label: '地区选择'
          }
        ]
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.id = this.$route.params.id;
        if (this.id) {
          USER_GROWTH_API.getType(this.id, {}).then(
            res => {
              if (res && res.code === 200) {
                this.typeForm.name = res.name;
              }
            });
        }
      },
      save() {
        const saveType = () => {
          if (this.id) {
            const params = {name: this.typeForm.name, id: this.id};
            USER_GROWTH_API.editType(this.id, params).then(this.onResponse);
          } else {
            const params = {name: this.typeForm.name};
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
        if (res && res.code === 200) {
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

</style>
