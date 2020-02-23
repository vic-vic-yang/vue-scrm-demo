<template>
  <div class="app-container">
    <el-form
      :model="mainFrm"
      class="code-add__frm"
      ref="mainFrm"
      label-width="130px"
      v-if="mainFrm"
    >
      <el-form-item label="身份信息：">{{mainFrm.type == 1 ? '个人' : '企业'}}</el-form-item>
      <el-form-item label="名称：">{{mainFrm.name}}</el-form-item>
      
      <!-- 个人类型 -->
      <template v-if="mainFrm.type == 1">
        <el-form-item label="出生日期：">{{mainFrm.birthday}}</el-form-item>
        <el-form-item label="证件类型：">{{mainFrm.card_type == 1 ? '身份证' : '护照'}}</el-form-item>

        <!-- 身份证 -->
        <template v-if="mainFrm.card_type == 1">
          <el-form-item label="证件正面照：">
            <a :href="mainFrm.card_pic" class="works-link" target="__blank">查看文件</a>
          </el-form-item>
          <el-form-item label="证件背面照：">
            <a :href="mainFrm.card_back_pic" class="works-link" target="__blank">查看文件</a>
          </el-form-item>
        </template>
        <!-- 护照 -->
        <template v-else>
          <el-form-item label="护照图片：">
            <a :href="mainFrm.card_pic" class="works-link" target="__blank">查看文件</a>
          </el-form-item>
        </template>
      </template>

      <!-- 企业类型 -->
      <template v-else>
        <el-form-item label="营业执照：">
          <a :href="mainFrm.business_licence" class="works-link" target="__blank">查看文件</a>
        </el-form-item>
      </template>

      <el-form-item label="国籍：">{{mainFrm.nationality}}</el-form-item>
      <el-form-item label="地址：">{{mainFrm.address}}</el-form-item>
      <el-form-item label="电话：">{{mainFrm.phone}}</el-form-item>
      <el-form-item label="邮箱：">{{mainFrm.mail}}</el-form-item>

      <el-form-item label="标题：">{{mainFrm.title}}</el-form-item>
      <el-form-item label="描述：">{{mainFrm.describe}}</el-form-item>
      <el-form-item label="作品文件：">
        <a :href="mainFrm.production" class="works-link" target="__blank">查看文件</a>
      </el-form-item>

      <el-form-item label="附件：">
        <a v-if="mainFrm.other" :href="mainFrm.other" class="works-link" target="__blank">查看文件</a>
        <span v-else>用户未上传附件</span>
      </el-form-item>

      <el-form-item label="审核状态：">{{mainFrm.status}}</el-form-item>
      <el-form-item label="ip：">{{mainFrm.ip}}</el-form-item>
      <el-form-item label="提交时间：">{{mainFrm.date_time}}</el-form-item>

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
      Api.getOfficialDetails({
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
          Api.setOfficialExamine({
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
.works-link {
  color: #409eff;
  text-decoration: underline;
}
</style>
