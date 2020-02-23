<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="miniProgramInfo"
      :rules="frmRules"
      ref="activityFrm"
      label-width="120px">
      <header>链接阿拉丁</header>
      <el-form-item prop="app_id" label="app_id">
        <div class="input_app_id">
          <el-input
            v-model="miniProgramInfo.app_id"
            placeholder="请输入app_id"
            :maxlength="100"
            name="app_id"
            :clearable="true">
          </el-input>
        </div>
      </el-form-item>

      <el-form-item prop="app_key" label="app_key">
        <div class="input_app_key">
          <el-input
            v-model="miniProgramInfo.app_key"
            placeholder="请输入app_key"
            :maxlength="100"
            name="app_key"
            :clearable="true">
          </el-input>
        </div>
        <el-button type="text" @click="getAppKey">获取app_key</el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import ald from '@/api/aldInterface';
  export default {
    name: 'activityEditor',
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        id: 0,
        miniProgram: [
          {
            id: 0,
            label: '不二拼团'
          }
        ],
        miniProgramInfo: {
          id: 0,
          app_id: '',
          miniProgram_id: 0,
          app_key: ''
        },
        frmRules: {
          app_id: [
            {
              required: true, message: '请输入app_id'
            }
          ],
          app_key: [
            {
              required: true, message: '请输入app_key'
            }
          ]
        }
      };
    },
    computed: {},
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        this.pageLoading = true;
        if (this.action === 'add') return (this.pageLoading = false);
        ald.get(this.$route.params.id).then(res => {
          Object.assign(this.miniProgramInfo, res);
          this.pageLoading = false;
        });
      },
      save() {
        const aldDetails = {
          app_id: this.miniProgramInfo.app_id,
          app_key: this.miniProgramInfo.app_key
        };
        (this.action === 'modify' ? ald.edit(this.$route.params.id, aldDetails) : ald.add(aldDetails))
          .then(() => {
            this.$router.back();
          });
      },
      getAppKey() {
        console.log('get');
        var href = 'http://tongji.aldwx.com';
        window.open(href, '_blank');
      }
    }
  };
</script>

<style scoped>
  .input_app_key, .input_app_id{
    width: 400px;
    display: inline-block;
    margin-right: 10px;
  }
  .activity-edit__form header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
