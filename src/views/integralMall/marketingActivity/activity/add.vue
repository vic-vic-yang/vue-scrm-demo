<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="activityFrm"
      :rules="frmRules"
      ref="activityFrm"
      label-width="140px">
      <el-form-item prop="type_id" label="活动形式">
        <el-select v-model="activityFrm.type_id" clearable placeholder="请选择活动形式">
          <el-option
            v-for="item in formOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="活动名称">
        <el-input v-model="activityFrm.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item prop="active_time" label="活动有效期">
        <el-date-picker
          :editable="false"
          v-model="activityFrm.active_time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="活动说明">
        <tinymce placeholder="请输入活动说明" :height="300" v-model="activityFrm.desc"/>
      </el-form-item>
      <el-form-item prop="rule_id" label="活动规则">
        <el-select v-model="activityFrm.rule_id" clearable placeholder="请选择活动规则">
          <el-option
            v-for="item in ruleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="pageSize"
              :current-page="pageIndex"
              @current-change="currentChangeRule"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item prop="integral" label="每次参与消耗积分额">
        <el-input-number
          v-model="activityFrm.integral"
          :min="0"
          placeholder="请输入每次参与消耗积分额"
          name="integral">
        </el-input-number>
        <span class="ml-5 text-666">积分</span>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import activity from '@/api/integralMall/activity';
  import rule from '@/api/integralMall/rule';
  import _ from 'lodash';
  export default {
    name: 'activity_create',
    components: {
      Tinymce
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        activityFrm: {
          id: this.$route.params.id || 0,
          type_id: '',
          name: '',
          active_time: [],
          desc: '',
          rule_id: '',
          integral: ''
        },
        frmRules: {
          type_id: [
            {
              required: true, message: '请选择活动形式'
            }
          ],
          name: [
            {
              required: true, message: '请输入活动名称'
            }
          ],
          active_time: [
            {
              required: true, message: '请选择活动有效期'
            }
          ],
          rule_id: [
            {
              required: true, message: '请选择活动规则'
            }
          ],
          integral: [
            {
              required: true, message: '请输入每次参与消耗积分额'
            }
          ]
        },
        formOptions: [],
        ruleOptions: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        startPickerOptions: {
          disabledDate(time) {
            const currentDate = new Date();
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        }
      };
    },
    created() {
      this.getType();
      this.getRule();
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        activity.get({ id: this.activityFrm.id })
          .then(res => {
            if (!res.data) {
              this.$message('未获取到活动信息');
            }
            this.activityFrm = _.assign({}, this.activityFrm, res.data);
            // this.activityFrm.type_id = this.activityFrm.type_id + '';
            this.activityFrm.rule_id = this.activityFrm.rule_id + '';
            this.activityFrm.active_time.push(res.data.start_time);
            this.activityFrm.active_time.push(res.data.end_time);
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      getRule() {
        rule.list({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }).then(res => {
          this.ruleOptions = (res.result || []).map(item => {
            return {
              id: item.id,
              name: item.name
            };
          });
          this.totalCount = res.totalCount * 1;
        });
      },
      getType() {
        activity.getType().then(res => {
          this.formOptions = res.data;
        });
      },
      currentChangeRule(e) {
        this.pageIndex = e;
        this.getRule();
      },
      save() {
        this.$refs.activityFrm.validate(valid => {
          if (valid) {
            const activityFrm = Object.assign({}, this.activityFrm);
            activityFrm.start_time = activityFrm.active_time[0];
            activityFrm.end_time = activityFrm.active_time[1];
            (this.action === 'modify' ? activity.edit(activityFrm) : activity.add(activityFrm))
              .then(() => {
                this.$router.back();
              });
          }
        });
      }
    }
  };
</script>

<style scoped>
  .article_pages{
    text-align: right;
    margin: 5px 0 0;
  }
  .wrapper{
    display: flex;
  }
</style>
