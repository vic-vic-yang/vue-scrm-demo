<template>
  <div class="app-container">
    <el-form
      :model="advertFrm"
      :rules="frmRules"
      ref="advertFrm"
      label-width="80px">
      <el-form-item prop="status" label="广告开关">
        <el-radio-group v-model="advertFrm.status">
          <el-radio :label="1">开</el-radio>
          <el-radio :label="0">关</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="description" label="广告标题">
        <el-input
          name="description"
          placeholder="请输入广告标题"
          v-model="advertFrm.description">
        </el-input>
      </el-form-item>
      <el-form-item prop="position" label="广告位置">
        <el-select v-model="advertFrm.location" placeholder="请选择">
          <el-option
            v-for="item in advertPositionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="rel" prop="showLabel" label="标签">
        <el-tooltip class="abs" style="left:-55px" effect="dark" content="选择显示/隐藏前端广告位的标签" placement="top-start"><i class="el-icon-question"></i></el-tooltip>
        <el-radio-group v-model="advertFrm.show_label">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="link" label="广告链接">
        <el-input
          name="link"
          placeholder="请输入广告链接"
          v-model="advertFrm.link">
        </el-input>
        <small class="text-999">广告链接为空,小程序中该广告将不会跳转,仅做图片展示</small>
      </el-form-item>
      <el-form-item prop="image_url" label="广告图片">
        <upload-prize-avatar v-model="advertFrm.image_url"></upload-prize-avatar>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Advert from '@/api/answer/advert';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    name: 'groupEditor',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        advertId: this.$route.params.id,
        action: this.$route.params.id ? 'modify' : 'add',
        advertFrm: {
          status: 1,
          description: '',
          location: 0,
          link: '',
          image_url: '',
          show_label: 1 // 广告标签默认开启
        },
        frmRules: {
          description: [
            {
              required: true, message: '请输入广告标题'
            }
          ],
          link: [
            {
              type: 'url', required: false, message: '请输入正确的广告链接'
            }
          ],
          image_url: [
            {
              required: true, message: '请上传广告图片'
            }
          ]
        },
        advertPositionOptions: [
          {
            label: '首页',
            value: 0
          },
          {
            label: '答题结束页',
            value: 1
          }
        ]
      };
    },
    created() {
      if (this.advertId) {
        this.getData();
      }
    },
    methods: {
      getData() {
        Advert.get(this.advertId).then(res => {
          this.advertFrm = {
            ...res,
            image_url: res.imageUrl
          };
        });
      },
      save() {
        this.$refs.advertFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Advert.edit(this.advertFrm)
              : Advert.add(this.advertFrm)).then(() => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
.rel{
  position: relative;
}
.abs{
  position: absolute;
  left:-80px;
  top:10px
}
</style>
