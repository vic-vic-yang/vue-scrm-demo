<template>
  <div class="app-container">
    <div class="flex-container">
      <span class="label required">红包功能:</span>
      <div>
        <el-radio v-model="form.status"
                  label="1">开启</el-radio>
        <el-radio v-model="form.status"
                  label="2">关闭</el-radio>
      </div>
    </div>
    <div class="flex-container mt-20"
         v-if="form.status == 1">
      <span class="label"
            style="line-height: 2.2;">红包金额配置:</span>
      <div>
        <div v-for="(item, index) in form.detail"
             :class="{mt10: index !== 0}"
             style="display: flex;align-items: center;"
             :key="index">
          <span class="config-label">配置{{index + 1}}：</span>
          <el-input v-model="item.start_range"
                    class="input-width120">
            <template slot="append">元</template>
          </el-input>
          <span>&nbsp;至&nbsp;</span>
          <el-input v-model="item.end_range"
                    class="input-width120"
                    style="margin-right: 10px;">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="item.stock"
                    class="input-width120">
            <template slot="append">个</template>
          </el-input>
          <el-button type="primary"
                     @click="configAdd"
                     style="margin-left: 10px;"
                     v-if="index === form.detail.length - 1">+添加</el-button>
          <el-button type="danger"
                     style="margin-left: 10px;"
                     @click="rewardDel(index)"
                     v-if="(index > 0) || (index === 0 && form.detail.length > 1)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="flex-container mt-20"
         v-if="form.status == 1">
      <span class="label">获取红包配置:</span>
      <div style="display: flex; flex-direction: column;">
        <el-checkbox v-model="form.vote_success"
                     :true-label="1"
                     :false-label="0">投票成功获得红包</el-checkbox>
        <el-checkbox v-model="form.pull_success"
                     :true-label="1"
                     :false-label="0"
                     style="margin-left: 0;">拉票成功获得红包</el-checkbox>
      </div>
    </div>
    <div class="flex-container mt-20 align-center"
         v-if="form.status == 1 && form.vote_success">
      <span class="label">每天每人投票获得红包限制:</span>
      <el-input v-model="form.vote_user_day_limit"
                placeholder="每天每用户投票获得红包次数上限，0为不限制"
                style="width:350px;"
                type="number"></el-input>
    </div>
    <div class="flex-container mt-20 align-center"
         v-if="form.status == 1 && form.vote_success">
      <span class="label">每天总体投票获得红包限制:</span>
      <el-input v-model="form.vote_day_limit"
                placeholder="每天全部用户投票获得红包次数上限，0为不限制"
                style="width:350px;"
                type="number"></el-input>
    </div>
    <div class="flex-container mt-20 align-center"
         v-if="form.status == 1 && form.pull_success">
      <span class="label">每天每人拉票获得红包限制:</span>
      <el-input v-model="form.pull_user_day_limit"
                placeholder="每天每用户拉票获得红包次数上限，0为不限制"
                style="width:350px;"
                type="number"></el-input>
    </div>
    <div class="flex-container mt-20 align-center"
         v-if="form.status == 1 && form.pull_success">
      <span class="label">每天总体拉票获得红包限制:</span>
      <el-input v-model="form.pull_day_limit"
                placeholder="每天全部用户拉票获得红包次数上限，0为不限制"
                style="width:350px;"
                type="number"></el-input>
    </div>
    <p style="color:red;margin-left:20px;">* 投票、拉票限制默认值为0，即不限制</p>
    <div class="flex-container mt-20">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="save"
                 type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
import Operation from '@/api/vote/operation';
export default {
  name: '',
  props: {
  },
  mixins: [],
  components: {},
  data () {
    return {
      form: {
        status: '',
        detail: [],
        vote_success: '',
        vote_user_day_limit: 0, // 投票每人每天限制,0=不限制
        vote_day_limit: 0, // 投票每天限制
        pull_success: '',
        pull_user_day_limit: 0, // 拉票每人每天限制
        pull_day_limit: 0
      }
    };
  },
  created () { },
  mounted () {
    this.getData();
  },
  methods: {
    configAdd () {
      this.form.detail.push({
        start_range: '',
        end_range: '',
        stock: ''
      });
    },
    save () {
      const obj = {
        status: this.form.status,
        detail: JSON.stringify(this.form.detail),
        vote_success: this.form.vote_success ? 1 : 0,
        pull_success: this.form.pull_success ? 1 : 0,
        vote_user_day_limit: this.form.vote_user_day_limit,
        vote_day_limit: this.form.vote_day_limit,
        pull_user_day_limit: this.form.pull_user_day_limit,
        pull_day_limit: this.form.pull_day_limit
      };
      Operation.update(obj)
        .then(() => {
          this.getData();
        });
    },
    getData () {
      Operation.get()
        .then((res) => {
          res.status = res.status * 1 ? '' + res.status : '2';
          res.vote_success = res.vote_success * 1;
          res.pull_success = res.pull_success * 1;
          this.form = res;
          if (this.form.detail.length === 0) {
            this.configAdd();
          }
        });
    },
    rewardDel (index) {
      this.$confirm('此操作删除本行奖励配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.detail.splice(index, 1);
        this.$message.success('删除成功,点击保存成效');
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.align-center {
  align-items: center;
}
.flex-container {
  display: flex;
  .input-width120 {
    width: 120px;
  }
  .config-label {
    display: inline-block;
    width: 80px;
    text-align: left;
    margin-right: 5px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .label {
    width: 150px;
    margin-right: 10px;
    display: inline-block;
    text-align: right;
    position: relative;
  }
  .label.required::before {
    position: absolute;
    content: "*";
    color: red;
    right: 70px;
    top: 3px;
  }
}
</style>
