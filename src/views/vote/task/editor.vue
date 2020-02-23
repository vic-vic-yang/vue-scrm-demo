<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="taskFrm"
      :rules="frmRules"
      ref="taskFrm"
      label-width="120px">
      <el-form-item prop="title" label="任务名称">
        <el-input
          v-model="taskFrm.title"
          placeholder="请输入任务名称"
          :maxlength="50"
          name="title"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="description" label="任务描述">
        <el-input
          v-model="taskFrm.description"
          placeholder="请输入任务描述"
          :maxlength="50"
          name="description"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="type" label="任务类型">
        <el-select placeholder="请选择任务类型" v-model.num="taskFrm.type" @change="typeChange">
          <el-option
            v-for="item in taskTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="mp_appid" label="公众号">
        <el-select placeholder="请选择公众号" v-model.num="taskFrm.mp_appid">
          <el-option
            v-for="item in publicNumberOptions"
            :key="item.authorizer_appid"
            :label="item.nick_name"
            :value="item.authorizer_appid">
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="taskFrm.type == 1">
        <el-form-item prop="img" label="分享海报">
          <upload-prize-avatar v-model="taskFrm.img"></upload-prize-avatar>
          <el-button v-if="taskFrm.img" @click="deleteImg('share_poster')" type="danger">删除图片</el-button>
        </el-form-item>
        <el-form-item prop="tickets" label="每次邀请好友可获得票数">
          <el-input-number
            v-model="taskFrm.tickets"
            placeholder="请输入每次邀请好友可获得票数"
            :maxlength="50"
            name="tickets"
            :clearable="true">
          </el-input-number>
        </el-form-item>
        <el-form-item prop="time_limit" label="邀请次数上限">
          <el-input-number
            v-model="taskFrm.time_limit"
            placeholder="请输入邀请次数上限"
            :maxlength="50"
            name="time_limit"
            :clearable="true">
          </el-input-number>
        </el-form-item>
      </template>

      <template v-if="taskFrm.type == 2">
        <el-form-item prop="img" label="阅读引导图">
          <upload-prize-avatar v-model="taskFrm.img"></upload-prize-avatar>
          <el-button v-if="taskFrm.img" @click="deleteImg('share_poster')" type="danger">删除图片</el-button>
        </el-form-item>
        <el-form-item prop="tickets" label="每天可获得票数">
          <el-input-number
            v-model="taskFrm.tickets"
            placeholder="请输入每天可获得票数"
            :maxlength="50"
            name="tickets"
            :clearable="true">
          </el-input-number>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadPrizeAvatar from '@/components/Upload/singleImage';
import prizeTask from '@/api/vote/prizeTask';
import Task from '@/api/answer/task';

export default {
  name: 'editor-task',
  components: {
    uploadPrizeAvatar
  },
  data() {
    return {
      pageLoading: true,
      action: this.$route.params.id ? 'modify' : 'add',
      taskFrm: {
        id: this.$route.params.id || 0,
        title: '',
        description: '',
        type: 1,
        mp_appid: '',
        img: '',
        tickets: '',
        time_limit: ''
      },
      taskTypeOptions: [
        {
          value: 1,
          label: '关注公众号'
        },
        {
          value: 2,
          label: '阅读文章'
        }
      ],
      publicNumberOptions: [
        {
          value: 0,
          label: '成都日报'
        }
      ],
      frmRules: {
        title: [
          {
            required: true, message: '请输入任务名称'
          }
        ],
        description: [
          {
            required: true, message: '请输入任务描述'
          }
        ],
        type: [
          {
            required: true, message: '请选择任务类型'
          }
        ],
        mp_appid: [
          {
            required: true, message: '请选择公众号'
          }
        ],
        img: [
          {
            required: true, message: '分享海报'
          }
        ],
        tickets: [
          {
            required: true, message: '请输入每次邀请好友可获得票数'
          }
        ],
        time_limit: [
          {
            required: true, message: '请输入邀请次数上限'
          }
        ]
      }
    };
  },
  created() {
    this.getData();
    if (this.task_type === 1) {
      this.frmRules['img'][0].message = '阅读引导图';
      this.frmRules['tickets'][0].message = '请输入每天可获得票数';
    }
  },
  methods: {
    getData() {
      if (this.action === 'add') {
        if(this.taskFrm.type) {
          this.getAuthorizer({type: this.taskFrm.type});
        }
        this.pageLoading = false;
        return;
      }
      prizeTask.get(this.taskFrm.id)
        .then(data => {
          data.type = data.type * 1;
          this.taskFrm = data;
          this.getAuthorizer({type: data.type});
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    getAuthorizer(options) {
      options.type = options.type * 1 === 1 ? 2 : 1;
      Task.getAuthorizer(options).then(res => {
        this.publicNumberOptions = res.data;
      });
    },
    typeChange() {
      this.getAuthorizer({type: this.taskFrm.type});
    },
    deleteImg(data) {
      this.taskFrm[data] = '';
    },
    save() {
      this.$refs.taskFrm.validate(valid => {
        if (valid) {
          const taskFrm = Object.assign({}, this.taskFrm);
          (this.action === 'modify' ? prizeTask.edit(taskFrm) : prizeTask.add(taskFrm))
            .then(() => {
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
