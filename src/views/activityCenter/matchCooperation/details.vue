<template>
  <div class="app-container">
    <el-form
      :model="mainFrm"
      class="code-add__frm"
      ref="mainFrm"
      label-width="130px"
      v-if="mainFrm"
    >
      <el-form-item label="流水号及提取码：">
        {{mainFrm.lsh}}
        <span style="margin-left: 20px;">{{mainFrm.code}}</span>
      </el-form-item>
      <el-form-item label="企业名称：">{{mainFrm.title}}</el-form-item>
      <el-form-item label="企业性质：">{{mainFrm.qyxz}}</el-form-item>
      <el-form-item label="行业类别：">{{mainFrm.hylb}}</el-form-item>
      <el-form-item label="主营业务：">{{mainFrm.zyyw}}</el-form-item>
      <el-form-item label="合作意向：">{{mainFrm.hzyx}}</el-form-item>
      <el-form-item label="联系人姓名：">{{mainFrm.name}}</el-form-item>
      <el-form-item label="手机号码：">{{mainFrm.phone}}</el-form-item>
      <el-form-item label="联系地址：">{{mainFrm.address}}</el-form-item>
      <el-form-item label="营业执照：">
        <a v-if="mainFrm.files" target="_blank" :href="mainFrm.files">
          <img :src="mainFrm.files" class="imgs" alt />
        </a>
        <span class="no_data" v-else>用户未上传Logo</span>
      </el-form-item>
      <el-form-item label="ip：">{{mainFrm.ip}}</el-form-item>
      <el-form-item label="提交时间：">{{mainFrm.date_time}}</el-form-item>
      <el-form-item label="状态：">{{mainFrm.status}}</el-form-item>

      <el-form-item label="审核意见：" style="word-break: break-word;">{{mainFrm.sh_content}}</el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" :autosize="{ minRows: 5}" placeholder="请输入备注" v-model="sh_content"></el-input>
      </el-form-item>

      <el-form-item prop="status" label="审核结果：">
        <el-radio-group v-model="status">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="margin-top: 20px;">
        <el-button type="primary" @click.prevent.stop="save">提交</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '@/api/activityCenter/match';
export default {
  data() {
    return {
      mainFrm: null,
      sh_content: '',
      status: 1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Api.getCooperDetails({
        id: this.$route.query.id
      }).then(res => {
        switch (Number(res.status)) {
          case 0:
            res.status = '待审核';
            break;
          case 1:
            res.status = '审核通过';
            break;
          case 2:
            res.status = '审核不通过';
            break;
        }
        this.mainFrm = res;
      });
    },
    save() {
      // 提交结果
      this.$confirm(`确认提交该审核吗？`, '提交审核', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.setCooperExamine({
            id: this.$route.query.id,
            status: this.status,
            sh_content: this.sh_content
          }).then(res => {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            this.$router.back();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.no_data {
  color: #909399;
}
.imgs {
  display: block;
  max-width: 500px;
}
</style>
