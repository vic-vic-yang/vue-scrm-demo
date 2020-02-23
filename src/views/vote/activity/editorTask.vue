 /* eslint-disable */ 
<template>
  <div class="app-container">
    <el-form :model="groupFrm"
             class="code-add__frm"
             :rules="frmRules"
             ref="groupFrm"
             label-width="80px">
      <el-form-item prop="mission_name"
                    label="任务名称">
        <el-input v-model="groupFrm.mission_name"
                  name="mission_name"
                  :clearable="true"
                  placeholder="请输入任务名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="intro"
                    label="任务简介">
        <el-input v-model="groupFrm.intro"
                  name="matchIntro"
                  :clearable="true"
                  placeholder="请输入任务简介">
        </el-input>
      </el-form-item>
      <el-form-item prop="type"
                    label="作品形式">
        <el-checkbox-group v-model="groupFrm.type">
          <el-checkbox :label="'1'">视频</el-checkbox>
          <el-checkbox :label="'2'">照片</el-checkbox>
          <el-checkbox :label="'3'">文字</el-checkbox>
          <el-checkbox :label="'4'">富文本</el-checkbox>
          <el-checkbox :label="'5'">音频</el-checkbox>
        </el-checkbox-group>
        <!-- <el-radio-group v-model="groupFrm.type"
                        style="width:500px">
          <el-radio :label="1">视频</el-radio>
          <el-radio :label="2">照片</el-radio>
          <el-radio :label="3">文字</el-radio>
          <el-radio :label="4">富文本</el-radio>
          <el-radio :label="5">音频</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Activity from '@/api/vote/activity';
import Tinymce from '@/components/Tinymce';
import lodash from 'lodash';
import uploadPrizeAvatar from '@/components/Upload/singleImage';

export default {
  name: 'groupEditor',
  components: {
    Tinymce,
    uploadPrizeAvatar
  },
  data() {
    return {
      haha: [],
      action: this.$route.params.id ? 'modify' : 'add',
      groupFrm: {
        stage_id: this.$route.params.stageId,
        id: this.$route.params.id,
        mission_name: '', // 任务标题
        intro: '', // 任务简介
        type: [] // 任务
      },
      frmRules: {
        mission_name: [
          {
            required: true, message: '请输入任务名称'
          }
        ],
        intro: [
          {
            required: true, message: '请输入任务简介'
          }
        ],
        type: [
          {
            required: true, message: '请选择作品形式'
          }
        ]
      }
    };
  },
  created() {
    if (this.action === 'modify') {
      this.getData();
    }
  },
  methods: {
    getData() {
      Activity.task.get(this.$route.params.stageId, this.$route.params.id).then(res => {
        this.groupFrm.mission_name = res.mission_name;
        this.groupFrm.intro = res.intro;
        this.groupFrm.type = res.type;
      });
    },
    save() {
      const obj = lodash.cloneDeep(this.groupFrm);
      obj.type = obj.type.join(',');
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          (this.action === 'modify'
            ? Activity.task.edit(obj)
            : Activity.task.add(obj)).then(() => {
            this.$router.replace({ name: 'voteTaskList', params: { stageId: this.$route.params.stageId } });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
