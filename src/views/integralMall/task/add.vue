<template>
  <div class="app-container task-list">
    <el-form
      class="activity-edit__form"
      :model="taskFm"
      :rules="frmRules"
      ref="taskFm"
      label-width="160px">

      <header>基本设置</header>

      <el-form-item prop="app_id" label="公众号App_Id">
        <el-input
          v-model="taskFm.app_id"
          placeholder="公众号App_Id"
          :maxlength="50"
          name="app_id"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="integral" label="任务达标奖励积分额度">
        <el-input
          v-model="taskFm.integral"
          placeholder="任务达标奖励积分额度"
          name="integral"
          :clearable="true">
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
  import integralTask from '@/api/integralMall/task';
  import _ from 'lodash';

  export default {
    name: 'taskAddEdit',
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        taskFm: {
          id: this.$route.params.id,
          app_id: '',
          integral: ''
        },
        frmRules: {
          app_id: [
            {
              required: true, message: '请填写公众号App_Id'
            }
          ],
          integral: [
            {
              required: true, message: '请填写任务规则'
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
        integralTask.details(this.$route.params.id).then(res => {
          this.taskFm = _.assign({}, this.taskFm, res);
          this.pageLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      save() {
        this.$refs.taskFm.validate(valid => {
          if (valid) {
            const options = {
              id: this.taskFm.id,
              value: this.taskFm.app_id,
              app_id: this.taskFm.app_id,
              integral: this.taskFm.integral
            };
            (this.action === 'modify' ? integralTask.edit(options) : integralTask.add(options))
              .then(() => {
                this.$router.back();
              });
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
