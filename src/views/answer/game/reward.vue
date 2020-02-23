<template>
  <div class="app-container">
    <el-form :data="form">
      <el-form-item class="rel"
                    label="预估奖励">
        <el-tooltip class="item abs"
                    effect="dark"
                    content="排行榜中是否显示预估奖励"
                    placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
        <el-radio-group v-model="form.award_switch"
                        style="width:500px">
          <el-radio :label="0">关</el-radio>
          <el-radio :label="1">开</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div v-if="form.award_switch && form.award_data && form.award_data.length">
      <div v-for="(item, index) in form.award_data"
           :key="index"
           class="rewark-item mt-20">
        <div>
          <el-input style="width: 120px;"
                    type="number"
                    placeholder="单行输入"
                    v-model="item.start"></el-input>
          <span>至</span>
          <el-input style="width: 120px;"
                    type="number"
                    placeholder="单行输入"
                    v-model="item.end"></el-input>
          <span>名&nbsp;&nbsp;&nbsp;奖励：</span>
          <el-input style="width: 120px;"
                    placeholder="单行输入"
                    v-model="item.award"
                    maxlength="6"></el-input>
        </div>
        <image-upload v-model="item.imgUrl"
                      class="mt-8" />
        <el-input type="textarea"
                  class="mt-8"
                  placeholder="多行输入"
                  style="width: 350px;"
                  rows="6"
                  v-model="item.remark"></el-input>
        <span class="gtextbtn"
              @click="rewardAdd(index)"
              v-if="index === (form.award_data.length - 1)">添加</span>
        <span class="gtextbtn__del"
              @click="rewardDel(index)"
              v-if="(index > 0) || (index === 0 && form.award_data.length > 1)">删除</span>
      </div>
    </div>
    <div class="mt-20">
      <el-button type="primary"
                 @click="save()">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>
<script>
import Game from '@/api/answer/game';
import imageUpload from '@/components/Upload/singleImage';
export default {
  name: '',
  data() {
    return {
      gameId: this.$route.params.gameId,
      form: {
        award_data: [],
        award_switch: 1
      }
    };
  },
  created() { },
  mounted() {
    this.formFill();
  },
  components: { imageUpload },
  methods: {
    save(e) {
      const form = this.form;
      let legal = true;
      if (this.form.award_switch === 1) {
        const len = this.form.award_data.length;
        for (let i = 0; i < len; i++) {
          if (!this.verify(this.form.award_data[i], true).status) {
            legal = false;
            break;
          }
        }
      } else {
        form.award_data = [];
      }

      if (legal) {
        Game.editReward(this.gameId, this.form).then(() => {
          this.$router.back();
        });
      }
    },
    deleteImg(type = 'share_img') {
      this.form[type] = '';
    },
    verify(obj, showError = false) {
      let tips = '';
      if (!obj.start || !obj.end || !obj.award) {
        tips = '请检查名次与奖励是否填写正确';
        if (showError) {
          this.$message.error(tips);
        }
        return { status: false, tips: tips };
      }
      if (obj.award.length > 16) {
        tips = '奖励信息文字不能操过16字';
        if (showError) {
          this.$message.error(tips);
        }
        return { status: false, tips: tips };
      }
      if (obj.remark.length > 200) {
        tips = '描述文字不能操过200字';
        if (showError) {
          this.$message.error(tips);
        }
        return { status: false, tips: tips };
      }
      return { status: true };
    },
    formFill() {
      Game.getReward(this.gameId).then(res => {
        const obj = {
          start: '',
          end: '',
          award: '',
          imgUrl: '',
          remark: ''
        };
        if (res.data) {
          this.form = res.data;
          if (!res.data.award_data) {
            this.form.award_data = [obj];
          }
          if (res.data.award_switch === null) {
            this.form.award_switch = 1;
          }
        } else {
          this.form.award_data = [obj];
          this.form.award_switch = 1;
        }
      });
    },
    rewardAdd(index) {
      const obj = {
        start: '',
        end: '',
        award: '',
        imgUrl: '',
        remark: ''
      };
      if (this.verify(this.form.award_data[index], true).status) {
        this.form.award_data.push(obj);
      }
    },
    rewardDel(index) {
      this.$confirm('此操作删除本行奖励配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.award_data.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    }
  }
};
</script>
<style lang="scss">
.rewark-item {
}
</style>
