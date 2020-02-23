<template>
  <div class="upload-container">
    <el-button icon='el-icon-share' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="info">小程序链接
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <header>添加小程序链接</header>
      <el-row>
        <el-form-item label="文字">
          <el-input
            v-model="miniLinkData.title"
            placeholder="文字"
            name="applets_link_text"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="app_id">
          <el-input
            v-model="miniLinkData.app_id"
            placeholder="app_id"
            name="app_id"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="链接跳转路径">
          <el-input
            v-model="miniLinkData.path"
            placeholder="链接跳转路径"
            name="applets_link_page"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input
            v-model="miniLinkData.url"
            placeholder="小程序打不开时，跳转链接地址"
            name="applets_link_url"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-col :span="24" style="text-align: right;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'miniLink',
    data() {
      return {
        dialogVisible: false,
        color: {
          type: String,
          default: '#1890ff'
        },
        miniLinkData: {
          title: '',
          app_id: '',
          path: 'pages/index/index',
          url: 'http://www.qq.com'
        }
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('successMiniLink', this.miniLinkData);
        this.miniLinkData = {};
        this.dialogVisible = false;
      }
    }
  };
</script>

<style scoped>
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
