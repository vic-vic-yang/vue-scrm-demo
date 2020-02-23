<template>
  <div class="app-container">
    <el-form
      :model="mainFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="mainFrm"
      label-width="100px"
    >
      <el-form-item prop="name" label="广告位名称">
        <el-input v-model="mainFrm.name" :clearable="true" placeholder="请输入广告位名称"></el-input>
      </el-form-item>

      <el-form-item prop="type" label="广告位类型">
        <el-select placeholder="请选择广告位类型" v-model="mainFrm.type">
          <el-option
            v-for="(item, index) in classify"
            :key="index"
            :label="item.name"
            :value="item.val"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="margin-top: 20px;">
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '@/api/contentPlatform/advertising';
export default {
  data() {
    return {
      mainFrm: {
        name: '', // 广告位名称
        type: ''
      },
      classify: [
        {
          name: '首页顶部banner',
          val: '1'
        },
        {
          name: '特别推荐广告位',
          val: '2'
        }
      ],
      class_page_info: {
        pageIndex: 1,
        pageSize: 999,
        totalCount: 1
      },
      frmRules: {
        name: [
          {
            required: true,
            message: '请输入广告位名称'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择广告类型'
          }
        ]
      }
    };
  },
  computed: {
    positionId() {
      return this.$route.query.id;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.positionId) {
        Api.positionDetails({
          id: this.positionId
        }).then(data => {
          data.type = String(data.type);
          this.mainFrm = data;
        });
      }
    },
    save() {
      this.$refs.mainFrm.validate(valid => {
        if (valid) {
          this.submit().then(res => {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.$router.back();
          });
        }
      });
    },
    submit(params) {
      if (this.positionId) {
        return Api.editPosition({
          ...this.mainFrm,
          id: this.positionId
        });
      } else {
        return Api.addPosition(this.mainFrm);
      }
    }
  }
};
</script>

<style lang="scss">
.inline_form_197{
  display: block;
  display: flex;
}
</style>
