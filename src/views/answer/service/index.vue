<template>
    <div class="app-container">
    <el-form :model="templates" ref="templates" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="type" label="跳转类型">
          <el-radio
            v-model="templates.msg_type"
            :label="1">图片
          </el-radio>
          <el-radio
            v-model="templates.msg_type"
            :label="2">文字
          </el-radio>
          <el-radio
            v-model="templates.msg_type"
            :label="3">图文
          </el-radio>
          <el-radio
            v-model="templates.msg_type"
            :label="4">网址
          </el-radio>
          <el-button style="margin-left: 50px" type="primary" @click="go_serviceCommunication" plain>客服沟通</el-button>
        </el-form-item>
        <el-form-item prop="imageUrl" label="本地图片">
        <upload-prize-avatar v-model="templates.picUrl" @success="obtain"></upload-prize-avatar>
        <el-button v-if="templates.picUrl" @click="deleteImg" type="danger">删除图片</el-button>
      </el-form-item>
        <el-form-item prop="text" label="appId">
        <el-input
            v-model='templates.app_id'
            name='ption'
            placeholder='请输入appId'>
          </el-input>
      </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
import uploadPrizeAvatar from '@/components/Upload/singleImage';
import Task from '@/api/answer/task';
import wxManager from '@/api/authorize/wxManager';

export default {
  name: 'service',
  components: {
    uploadPrizeAvatar
  },
  data() {
    return {
      templates: {
        msg_type: 1,
        picUrl: '',
        app_id: '',
        pic: ''
      },
      app_type: null,
      app_type_name: '答题',
      app_id: null
    };
  },
  created() {
    Promise.all([this.getData(), this.getFeaturesList()]).then(res => {
      var features_list = res[0];
      var authStatus = res[1];
      authStatus.data.map(item => {
        if (item.app_type_name === this.app_type_name) {
          this.app_type = item.app_type;
        }
      });
      features_list.map(val => {
        if (val.app_type * 1 === this.app_type * 1) {
          this.app_id = val.authorizer_appid;
        }
      });
    });
  },
  methods: {
    submitForm(formName) {
      Task.newService(this.templates);
    },
    getData() {
      return wxManager.getThirdAuthInfo({ type: 1 }); // 1 - 小程序,2 - 公众号
    },
    getFeaturesList() {
      return wxManager.getTemplate();
    },
    deleteImg() {
      this.templates.picUrl = '';
    },
    obtain(data) {
      this.templates.pic = data.id;
    },
    go_serviceCommunication() {
      if (this.app_id && this.app_id !== '') {
        this.$router.push({ name: 'answerServiceCommunication', query: { app_id: this.app_id }});
      }
    }
  }
};
</script>

<style>
</style>

