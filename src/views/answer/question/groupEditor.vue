<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="title" label="题库名称">
        <el-input
          v-model="groupFrm.title"
          name="title"
          :clearable="true"
          placeholder="请输入题库名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="type" label="题库类型">
        <el-select placeholder="请选择题库类型" name="type" v-model="groupFrm.type">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="desc" label="题库说明">
        <el-input
          type="textarea"
          :rows="3"
          name="desc"
          placeholder="请输入题库说明"
          v-model="groupFrm.desc">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Question from '@/api/answer/question';

  export default {
    name: 'groupEditor',
    components: {},
    data() {
      return {
        groupId: this.$route.params.id,
        action: this.$route.params.id ? 'modify' : 'add',
        groupFrm: {
          title: '',
          type: '',
          desc: ''
        },
        frmRules: {
          title: [
            {
              required: true, message: '请输入题库名称'
            }
          ],
          type: [
            {
              required: true, message: '请选择题库类型'
            }
          ],
          desc: [
            {
              required: false, message: '请输入题库说明'
            }
          ]
        },
        typeOptions: [
          {
            label: '单选题',
            value: 1
          },
          {
            label: '多选题',
            value: 2
          }
        ]
      };
    },
    created() {
      if (this.groupId) {
        this.getData();
      }
    },
    methods: {
      getData() {
        Question.group.get(this.groupId).then(res => {
          this.groupFrm = {
            id: res.id,
            title: res.title,
            type: res.type,
            desc: res.desc
          };
        });
      },
      save() {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Question.group.edit(this.groupFrm)
              : Question.group.add(this.groupFrm)).then(() => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
