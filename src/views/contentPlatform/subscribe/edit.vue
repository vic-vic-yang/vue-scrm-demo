<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="发布模式">
        <el-select v-model="form.publish_type" placeholder="请选择发布模式">
          <el-option label="自动" value="2"></el-option>
          <el-option label="手动" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要分类">
        <el-select
          v-model="form.classify_type"
          :disabled="classify_type_dis"
          placeholder="请选择分类"
        >
          <el-option label="是" value="2"></el-option>
          <el-option label="否" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择频道">
        <el-select
          v-model="form.channel_id"
          multiple
          :disabled="channel_id_dis"
          placeholder="请选择频道"
        >
          <el-option
            v-for="(item,index) in channesList"
            :key="index"
            :label="item.channel_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import API from '@/api/contentPlatform/subscribe';

export default {
  name: 'userMatchRecord',
  components: {
    customElTable
  },
  data() {
    return {
      pageLoading: true,
      channesList: [],
      form: {
        publish_type: '1',
        classify_type: '1',
        channel_id: []
      }
    };
  },
  computed: {
    classify_type_dis() {
      return this.form.publish_type !== '2';
    },
    channel_id_dis() {
      return this.form.classify_type !== '1' || this.form.publish_type !== '2';
    }
  },
  created() {
    API.detail({
      gather_id: this.$route.params.id
    }).then(res => {
      this.form.publish_type = res.publish_type;
      this.form.classify_type = res.classify_type;
      if (res.channel_id !== '0' && res.channel_id) {
        this.form.channel_id = res.channel_id.split(',');
      }
      this.pageLoading = false;
      this.$nextTick(() => {
        API.getChannels({
          pageIndex: 1,
          pageSize: 20
        }).then(data => {
          this.channesList = data.result;
        });
      });
    });
  },
  methods: {
    onSubmit() {
      let classify_type, channel_id;

      if (this.classify_type_dis) {
        classify_type = '';
      } else {
        classify_type = this.form.classify_type;
      }

      if (this.channel_id_dis) {
        channel_id = '';
      } else if (!this.form.channel_id.length) {
        this.$message({
          type: 'error',
          message: '请选择频道!'
        });
        return;
      } else {
        channel_id = this.form.channel_id.join();
      }

      API.update({
        gather_id: this.$route.params.id,
        publish_type: this.form.publish_type,
        classify_type: classify_type,
        channel_id: channel_id
      }).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.$router.push({
            name: 'subscribe'
          });
        } else {
          this.$message({
            type: 'error',
            message: '修改失败!'
          });
        }
      });
    },
    cancel() {
      this.$router.push({
        name: 'subscribe'
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.item-detail-content {
  display: flex;
  height: auto;
  span {
    margin-top: 16px;
  }
  p {
    display: inline-block;
    margin-right: 40px;
    margin-bottom: 0;
  }
}
.item-detail {
  display: flex;
  flex-direction: column;
  height: auto;
}
.flex-box-autoFix {
  overflow: hidden;
}
</style>