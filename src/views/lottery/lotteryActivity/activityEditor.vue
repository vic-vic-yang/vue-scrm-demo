<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="activityFrm"
      :rules="frmRules"
      ref="activityFrm"
      label-width="120px">
      <header>活动基本信息</header>
      <el-form-item prop="activity_type" label="活动形式">
        <el-select v-model="activityFrm.activity_type" placeholder="请选择活动形式">
          <el-option
            v-for="item in activityTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="活动名称">
        <el-input
          v-model="activityFrm.name"
          placeholder="请输入活动名称"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="activityFrm.start_time"
          type="datetime"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00">
        </el-date-picker>
        <span> ~ </span>
        <el-date-picker
          v-model="activityFrm.end_time"
          type="datetime"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="company_name" label="主办单位">
        <el-input
          v-model="activityFrm.company_name"
          placeholder="请输入主办单位"
          name="company_name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="company_url" label="官网地址">
        <el-input
          v-model="activityFrm.company_url"
          placeholder="请输入官网地址"
          type="url"
          name="company_url"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="info" label="活动说明">
        <el-input
          type="textarea"
          :rows="2"
          name="info"
          placeholder="请输入活动说明"
          v-model="activityFrm.info"></el-input>
      </el-form-item>
      <el-form-item prop="join_people_num" label="基础参加人数">
        <el-input-number
          v-model="activityFrm.join_people_num"
          :min="0"
          name="join_people_num"
          placeholder="基础参加人数">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="single_people_num" label="单人抽奖次数限制" label-width="auto">
        <el-radio
          v-model="singlePeopleEnable"
          :label="0">不限
        </el-radio>
        <el-radio
          v-model="singlePeopleEnable"
          :label="1">
          限制每人最多
          <el-input
            class="limit-count__input"
            type="num"
            v-model="singlePeopleCustom"
            name="host"
            :min="0"
            size="mini"
            :disabled="singlePeopleEnable===0">
          </el-input>
          次
        </el-radio>
      </el-form-item>

      <header>参与机会获得</header>
      <el-form-item prop="join_get_num" label="参与即可获得">
        <el-input-number
          :min="0"
          v-model="activityFrm.join_get_num"
          name="join_get_num">
        </el-input-number>
        <span class="ml-5 text-666">次</span>
      </el-form-item>
      <el-form-item prop="day_get_num" label="每日额外获得">
        <el-input-number
          :min="0"
          v-model="activityFrm.day_get_num"
          name="day_get_num">
        </el-input-number>
        <span class="ml-5 text-666">次</span>
      </el-form-item>
      <el-form-item prop="share_get_num" label="每次分享获得">
        <el-input-number
          :min="0"
          v-model="activityFrm.share_get_num"
          name="share_get_num">
        </el-input-number>
        <span class="ml-5 text-666">次</span>
      </el-form-item>
      <el-form-item prop="share_num" label="每人最多分享">
        <el-input-number
          :min="0"
          v-model="activityFrm.share_num"
          name="share_num">
        </el-input-number>
        <span class="ml-5 text-666">次</span>
      </el-form-item>
      <el-form-item prop="share_total" label="总共最多分享">
        <el-input-number
          :min="0"
          v-model="activityFrm.share_total"
          name="share_total">
        </el-input-number>
        <span class="ml-5 text-666">次</span>
      </el-form-item>

      <header>参与条件限制</header>
      <el-form-item label="用户信息提交">
        <el-form-item label="微信授权">
          <el-checkbox v-model="activityFrm.user_info[0]" disabled></el-checkbox>
        </el-form-item>
        <el-form-item label="姓名">
          <el-checkbox v-model="activityFrm.user_info[1]"></el-checkbox>
        </el-form-item>
        <el-form-item label="手机号">
          <el-checkbox v-model="activityFrm.user_info[2]"></el-checkbox>
        </el-form-item>
        <el-form-item label="短信验证">
          <el-radio
            v-model="activityFrm.check_phone"
            :label="0">关
          </el-radio>
          <el-radio
            v-model="activityFrm.check_phone"
            :label="1">开
          </el-radio>
        </el-form-item>
      </el-form-item>
      <el-form-item label="关注微信公众号">
        <el-radio
          v-model="activityFrm.attention_wx"
          :label="1">无要求
        </el-radio>
        <el-radio
          v-model="activityFrm.attention_wx"
          :label="2">可选关注
        </el-radio>
        <el-radio
          v-model="activityFrm.attention_wx"
          :label="3">必须关注
        </el-radio>
      </el-form-item>
      <el-form-item
        label="微信公众号二维码"
        label-width="125px"
        v-if="activityFrm.attention_wx !== 1">
        <single-image-upload
          width="120px"
          height="120px"
          v-model="activityFrm.attention_wx_image">
        </single-image-upload>
      </el-form-item>

      <header>活动奖品规则</header>
      <el-form-item prop="lottery_rule_id" label="活动规则">
        <el-select v-model="activityFrm.lottery_rule_id" placeholder="请选择活动规则">
          <el-option
            v-for="item in ruleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="code_id" label="关联码段">
        <el-select
          v-model="activityFrm.code_id"
          multiple
          placeholder="请选择码段">
          <el-option
            v-for="item in codeOptions"
            :key="item.id+''"
            :label="item.name"
            :value="item.id+''">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="每次扫码获得">
        <el-input-number
          class="mr-10"
          v-model="activityFrm.san_get_num">
        </el-input-number>
        <span class="ml-5 text-666">次参加机会</span>
      </el-form-item>

      <header>前端显示相关</header>
      <activity-resource-item
        label="背景图"
        v-model="activityFrm.background_image">
      </activity-resource-item>
      <activity-resource-item
        label="活动标题图"
        v-model="activityFrm.title_image">
      </activity-resource-item>
      <activity-resource-item
        label="转盘图"
        v-model="activityFrm.turntable_image">
      </activity-resource-item>
      <activity-resource-item
        label="公司LOGO"
        v-model="activityFrm.logo_image">
      </activity-resource-item>
      <activity-resource-item
        label="背景音乐图标"
        v-model="activityFrm.music_image">
      </activity-resource-item>
      <activity-resource-item
        label="活动细则图标"
        v-model="activityFrm.rule_image">
      </activity-resource-item>
      <activity-resource-item
        label="背景音乐音频"
        type="audio"
        v-model="activityFrm.music_path">
      </activity-resource-item>
      <el-form-item label="是否开启启动页">
        <el-radio
          v-model="activityFrm.start_page"
          :label="0">否
        </el-radio>
        <el-radio
          v-model="activityFrm.start_page"
          :label="1">是
        </el-radio>
      </el-form-item>
      <el-form-item label="启动页URL" v-if="activityFrm.start_page===1">
        <el-input v-model="activityFrm.start_page_url" type="url"></el-input>
      </el-form-item>

      <activity-resource-item
        label="分享图标"
        v-model="activityFrm.share_image">
      </activity-resource-item>

      <header>分享文字（微信规定分享标题不能包含“红包”、“分享”等关键词）</header>
      <el-form-item label="标题" prop="share_title">
        <el-input v-model="activityFrm.share_title"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="share_abstract">
        <el-input v-model="activityFrm.share_abstract"></el-input>
      </el-form-item>

      <el-form-item prop="status" label="活动启用">
        <el-radio
          v-model="activityFrm.status"
          :label="1">是
        </el-radio>
        <el-radio
          v-model="activityFrm.status"
          :label="0">否
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import lotteryActivityManager from '@/api/lottery/lotteryActivityManager';
  import CodeManager from '@/api/lottery/codeManager';
  import { LotteryRule } from '@/api/lottery/lotteryRule';
  import customElTable from '@/components/customElTable';
  import singleImageUpload from '@/components/Upload/singleImage';
  import activityResourceItem from './activityResourceItem';
  import _ from 'lodash';

  export default {
    name: 'activityEditor',
    components: {
      customElTable,
      activityResourceItem,
      singleImageUpload
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        activityFrm: {
          id: this.$route.params.id || 0,
          name: '',
          activity_type: '',
          start_time: '',
          end_time: '',
          company_name: '',
          company_url: '',
          info: '',
          join_people_num: 0,
          single_people_num: 0,
          join_get_num: 0,
          day_get_num: 0,
          share_get_num: 0,
          share_num: 0,
          share_total: 0,
          user_info: [true, false, false],
          check_phone: 0,
          attention_wx: 1,
          attention_wx_image: '',
          lottery_rule_id: '',
          code_id: [],
          san_get_num: [],
          background_image: '',
          title_image: '',
          turntable_image: '',
          logo_image: '',
          music_image: '',
          rule_image: '',
          music_path: '',
          start_page: 0,
          start_page_url: '',
          share_image: '',
          share_title: '',
          share_abstract: '',
          status: 0,
          need_lbs: 1
        },
        singlePeopleEnable: 0,
        singlePeopleCustom: 0,
        ruleOptions: [],
        activityTypeOptions: [],
        codeOptions: [],
        tableOptions: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '码段名称',
            prop: 'name'
          },
          {
            label: '总量',
            prop: 'total'
          },
          {
            label: '状态',
            prop: 'status'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            width: '150px',
            sortable: true
          },
          {
            prop: 'USER_ACTION',
            actions: ['del']
          }
        ],
        selectedCodeSegments: [],
        addCodeSegmentsErr: true,
        frmRules: {
          activity_type: [
            {
              required: true, message: '活动形式为必选项'
            }
          ],
          name: [
            {
              required: true, message: '名称必填'
            }
          ],
          company_name: [
            {
              required: true, message: '主办单位必填'
            }
          ],
          company_url: [
            {
              required: true, message: '官网地址必填'
            }
          ],
          lottery_rule_id: [
            {
              required: true, message: '活动规则为必选项'
            }
          ],
          share_title: [
            {
              required: true, message: '分享标题必填'
            }
          ],
          share_abstract: [
            {
              required: true, message: '分享摘要必填'
            }
          ]
        }
      };
    },
    watch: {},
    computed: {},
    created() {
      Promise.all([
        CodeManager.selectList(),
        LotteryRule.selectList(),
        lotteryActivityManager.typeList()
      ])
        .then(res => {
          this.codeOptions = res[0] || [];
          this.ruleOptions = res[1] || [];
          this.activityTypeOptions = res[2] || [];
          this.getDetail();
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        lotteryActivityManager.get(this.activityFrm.id)
          .then(res => {
            this.activityFrm = _.assign({}, this.activityFrm, res);
            this.$set(this.activityFrm, 'start_time', res.start_time * 1000);
            this.$set(this.activityFrm, 'end_time', res.end_time * 1000);
            if (res) {
              this.singlePeopleCustom = res.single_people_num;
              this.singlePeopleEnable = res.single_people_num === 0 ? 0 : 1;
              this.$set(this.activityFrm, 'code_id', res.code_id ? res.code_id.split(',') : []);
              const tmpUserInfo = res.user_info.map(item => {
                return !!(item * 1);
              });
              this.$set(this.activityFrm, 'user_info', tmpUserInfo);
              this.pageLoading = false;
            }
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      save() {
        this.$refs.activityFrm.validate(valid => {
          if (valid) {
            const activityFrmData = Object.assign({}, this.activityFrm);
            activityFrmData.start_time = activityFrmData.start_time / 1000 || '';
            activityFrmData.end_time = activityFrmData.end_time / 1000 || '';
            activityFrmData.single_people_num = this.singlePeopleEnable === 0 ? 0 : this.singlePeopleCustom;
            activityFrmData.user_info = activityFrmData.user_info.map((item, index) => {
              return item ? Math.pow(2, index) : 0;
            });
            activityFrmData.code_id = activityFrmData.code_id.length > 0 ? activityFrmData.code_id.join(',') : '';
            lotteryActivityManager.operation(activityFrmData)
              .then(() => {
                this.$router.back();
              });
          }
        });
      },
      addActivityCode() {
        console.log('add');
      },
      deleteActivityCodeHandler(item) {
        console.log('delete : ', item);
      }
    }
  };
</script>

<style>
  .limit-count__input {
    width: 66px;
  }

  .limit-count__input > input {
    padding: 0 10px;
    text-align: center;
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
