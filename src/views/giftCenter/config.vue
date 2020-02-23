<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 09:51:20
 * @LastEditTime: 2019-08-30 14:35:06
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :model="templateFrm"
      :rules="frmRules"
      ref="templateFrm"
      label-width="120px">
      <el-form-item prop="type" label="奖品类型">
        <el-select v-model="templateFrm.type" placeholder="请选择">
          <el-option
            v-for="item in prizeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="奖品名称">
        <el-input
          v-model="templateFrm.name"
          placeholder="请输入奖品名称"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="pic" label="奖品图片">
        <upload-prize-avatar v-model="templateFrm.pic"  @update:imageId="getGiftImgId"></upload-prize-avatar>
      </el-form-item>
      <template v-if="templateFrm.type === 6">
        <el-form-item prop="worth_type" label="奖品价值">
          <el-input
            v-model="templateFrm.worth"
            :min="0"
            name="worth"
            placeholder="奖品价值"></el-input>
        </el-form-item>
      </template>
      <template v-if="templateFrm.type !== 1 && templateFrm.type !== 101">
        <el-form-item prop="worth_type" label="奖品价值">
          <el-radio-group v-model="templateFrm.worth_type">
            <el-radio :label="1">定额</el-radio>
            <el-radio :label="2">随机</el-radio>
          </el-radio-group>
        </el-form-item>
        <template>
          <el-form-item prop="worth" label="" v-if="templateFrm.worth_type === 1">
            <el-input
              v-model="templateFrm.worth"
              :min="0"
              name="worth"
              placeholder="奖品价值">
              <label slot="append" class="text-999">{{company}}</label>
            </el-input>
          </el-form-item>
          <el-form-item v-else>
            <el-row>
              <el-col :span="7">
                <el-form-item prop="worth_rand_min">
                  <el-input
                    v-model="templateFrm.worth_rand_min"
                    :min="0"
                    name="worth_rand_min"
                    placeholder="奖品价值">
                    <label slot="append" class="text-999">{{company}}</label>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center;">-</el-col>
              <el-col :span="7">
                <el-form-item prop="worth_rand_max">
                  <el-input
                    v-model="templateFrm.worth_rand_max"
                    :min="0"
                    name="worth_rand_max"
                    placeholder="奖品价值">
                    <label slot="append" class="text-999">{{company}}</label>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </template>

      <el-form-item prop="store" label="奖品库存">
        <el-input
          v-model="templateFrm.store"
          placeholder="请输入奖品库存"
          name="store"
          :clearable="true">
        </el-input>
      </el-form-item>
      <template v-if="templateFrm.type === 101">
        <el-form-item prop="groups" label="包含奖品">
          <el-select placeholder="请选择礼包包含奖品" multiple v-model="selected_prize_list" style="width: 660px">
            <el-option v-for="item in prizeList" :key="item.id" :label="item.name" :value="item.id * 1"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <!-- 电子卡券才有兑换码 -->
      <template v-if="templateFrm.type === 6">
        <el-form-item prop="card_number_type" label="核销码">
          <el-radio-group v-model="templateFrm.card_number_type">
            <el-radio :label="1">系统自动生成</el-radio>
            <el-radio :label="2">批量导入</el-radio>
          </el-radio-group>
          <small style="color: #999;display: block">批量导入请在奖品列表操作栏中点击“核销码”去设置核销码</small>
        </el-form-item>
      </template>
      <el-form-item prop="time"
                    label="有效时间">
        <el-date-picker :editable="false"
                        v-model="prizeTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        unlink-panels>
        </el-date-picker>
      </el-form-item>
      <template v-if="templateFrm.type !== 1">
        <el-form-item prop="limit_status" label="发送限制">
          <el-radio-group v-model="templateFrm.limit_status">
            <el-radio :label="2">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="templateFrm.limit_status * 1 === 1">
          <el-form-item prop="day_limit" label="奖品总数每天限制">
            <el-input placeholder="系统每天可发送的奖品总数" v-model="templateFrm.day_limit" type="number"></el-input>
          </el-form-item>
          <el-form-item prop="user_day_limit" label="单个用户每天限制">
            <el-input placeholder="系统每天可向单个用户发送的奖品数" v-model="templateFrm.user_day_limit" type="number"></el-input>
          </el-form-item>
        </template>
      </template>
      <el-form-item prop="warning" label="告警设置" v-if="templateFrm.type !== 1">
        <el-radio
          v-model="templateFrm.warning"
          :label="2">关闭
        </el-radio>
        <el-radio
          v-model="templateFrm.warning"
          :label="1">开启
        </el-radio>
      </el-form-item>
      <template v-if="templateFrm.warning === 1 && templateFrm.type !== 1">
        <el-form-item prop="warning_value" label="警戒值设置">
          <el-input
            v-model="templateFrm.warning_value"
            name="warning_value"
            placeholder="奖品数量低于该数值时，系统进行短信提醒">
          </el-input>
        </el-form-item>
        <el-form-item prop="warning_user" label="联系人">
          <el-input
            v-model="templateFrm.warning_user"
            name="warning_user"
            placeholder="请输入联系人">
          </el-input>
        </el-form-item>
        <el-form-item prop="warning_phone" label="联系电话">
          <el-input
            v-model="templateFrm.warning_phone"
            name="warning_phone"
            type="text"
            placeholder="请输入手机号码">
          </el-input>
        </el-form-item>
        <el-form-item prop="warning_ding_talk_url" label="联系钉钉群">
          <el-input
            v-model="templateFrm.warning_ding_talk_url"
            name="warning_ding_talk_url"
            type="text"
            placeholder="请输入钉钉群对应的机器人Webhook地址，系统可通过钉钉群进行缺货提醒">
          </el-input>
        </el-form-item>
        <el-form-item prop="warning_message" label="钉钉告警提示文案">
          <el-input
            v-model="templateFrm.warning_message"
            name="warning_message"
            type="textarea"
            :placeholder="setWarning">
          </el-input>
          <small style="color: #999">文案消息可通过短信、钉钉群渠道送达对应的联系人；自定义编辑下需要用{prize_name}代替奖品名称，{warning_value}代替警戒值</small>
        </el-form-item>
      </template>
      <el-form-item prop="description"
                    label="奖品介绍">
        <tinymce placeholder="请输入奖品介绍"
                 :height="300"
                 v-model="templateFrm.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import GIFTCENTER_API from '@/api/giftcenter/index';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import Tinymce from '@/components/Tinymce';
  import qs from 'qs';
  import { parseTime } from '@/utils';

  export default {
    name: 'templateEditor',
    components: {
      uploadPrizeAvatar,
      Tinymce
    },
    data() {
      var validateContact = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系人'));
        } else if (!(/^[a-zA-Z\u4E00-\u9FA5]{1,10}$/).test(value)) {
          callback(new Error('请输入正确联系人格式,只能输入中文或字母'));
        } else {
          callback();
        }
      };
      var validateDinging = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系钉钉群'));
        } else if (!(/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/).test(value)) {
          callback(new Error('请输入正url格式'));
        } else {
          callback();
        }
      };
      return {
        pageLoading: true,
        uploadResultDialog: false,
        uploadCurrentPageErrorData: [],
        action: this.$route.query.id ? 'modify' : 'add',
        prizeList: [],
        selected_prize_list: [],
        prizeTime: null,
        prizeTypeOptions: [
          {
            label: '谢谢参与',
            value: 1
          },
          {
            label: '红包',
            value: 2
          },
          {
            label: '积分',
            value: 3
          },
          {
            label: '答题次数',
            value: 4
          },
          {
            label: '投票次数',
            value: 5
          },
          {
            label: '电子卡券',
            value: 6
          },
          {
            label: '奖品礼包',
            value: 101
          }
        ],
        templateFrm: {
          id: this.$route.query.id || 0,
          name: '',
          type: '',
          pic: '',
          worth_type: 1,
          worth: '',
          worth_rand_min: '',
          worth_rand_max: '',
          store: '',
          limit_status: 2,
          day_limit: '',
          user_day_limit: '',
          warning: 2,
          warning_value: '',
          warning_user: '',
          warning_phone: '',
          warning_ding_talk_url: '',
          warning_message: '告急！该活动下的奖品不足，请及时补充！',
          card_number_type: 1, // 1=自动，2=批量导入
          sub_prize_list: '', // 礼包商品列表
          description: '', // 奖品介绍
          start_time: '', // 有效期开始时间
          end_time: '' // 有效期结束时间
        },
        frmRules: {
          type: [
            {
              required: true, message: '请选择奖品类型'
            }
          ],
          name: [
            {
              required: true, message: '名称必填'
            }
          ],
          worth_type: [
            {
              required: true, message: '奖品价值必填'
            }
          ],
          pic: [
            {
              required: true, message: '奖品图片必填'
            }
          ],
          card_number_type: [
            {
              required: true, message: '核销码必填'
            }
          ],
          store: [
            {
              required: true, message: '库存必填'
            }
          ],
          warning_user: [
            {
              required: true, message: '请输入联系电话'
            },
            { validator: validateContact, trigger: 'blur' }
          ],
          warning_ding_talk_url: [
            {
              required: true, message: '请输入联系钉钉群'
            },
            { validator: validateDinging, trigger: 'blur' }
          ],
          warning_value: [
            {
              required: true, message: '奖品数量低于该数值时，系统进行短信提醒'
            }
          ],
          warning_message: [
            {
              required: true, message: '钉钉告警提示文案'
            }
          ],
          day_limit: [
            {
              required: true, message: '系统每天可发送的奖品总数'
            }
          ],
          user_day_limit: [
            {
              required: true, message: '每天可向用户发送的奖品数'
            }
          ]
        }
      };
    },
    watch: {
      selected_prize_list(val) {
        this.templateFrm.sub_prize_list = val.join(',');
      },
      prizeTime(val) {
        if (this.prizeTime) {
          this.templateFrm.start_time = new Date(this.prizeTime[0]).getTime() / 1000;
          this.templateFrm.end_time = new Date(this.prizeTime[1]).getTime() / 1000;
        } else {
          this.templateFrm.start_time = 0;
          this.templateFrm.end_time = 0;
        }
        console.log(this.templateFrm.start_time, this.templateFrm.end_time);
      }
    },
    computed: {
      setWarning() {
        return `告急！该活动下的${this.templateFrm.name}剩余数量低于${this.templateFrm.warning_value}，请及时补充！`;
      },
      company() {
        switch (this.templateFrm.type * 1) {
          case 1:
            return '（元）';
          case 2:
            return '（元）';
          case 3:
            return '（积分）';
          case 4:
            return '（次）';
          case 5:
            return '（次）';
          default:
            return '（次）';
        }
      }
    },
    created() {
      if (this.$route.query.id) {
        this.getDetail();
      } else {
        this.pageLoading = false;
      }
      this.getGiftLIst();
    },
    methods: {
      getGiftImgId(id) {
        this.giftImgId = id;
      },
      getGiftLIst() {
        const params = {
          page_size: 200,
          page_index: 1
        };
        GIFTCENTER_API.list(params).then(res => {
          this.prizeList = res.result.map(item => {
            return {
              id: item.id,
              name: item.name,
              type: parseInt(item.type)
            };
          }).filter(item => {
            return parseInt(item.type) !== 101;
          });
        }).catch(e => {
          console.log(e);
        });
      },
      getDetail() {
        GIFTCENTER_API.getOneById(this.$route.query.id).then(res => {
          this.pageLoading = false;
          this.giftImgId = res.pic && res.pic[0].id;
          res.pic = res.pic && res.pic[0].file_path;
          Object.assign(this.templateFrm, res);
          if (this.templateFrm.sub_prize_list) {
            this.selected_prize_list = this.templateFrm.sub_prize_list.split(',').map(item => {
              return parseInt(item);
            });
          }
          if (this.templateFrm.start_time > 0 || this.templateFrm.end_time > 0) {
            this.prizeTime = [parseTime(this.templateFrm.start_time), parseTime(this.templateFrm.end_time)];
          }
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.templateFrm.validate(valid => {
          if (valid) {
            if (this.templateFrm.worth_type * 1 === 2 && this.templateFrm.worth_rand_min * 1 >= this.templateFrm.worth_rand_max * 1) {
              this.$message({
                message: '奖品价值输入有误',
                type: 'error'
              });
              return;
            }
            const params = Object.assign({}, this.templateFrm);
            params.pic = this.giftImgId;
            if (params.limit_status * 1 === 2) {
              delete params.day_limit;
              delete params.user_day_limit;
            }
            if (params.warning * 1 === 2) {
              delete params.warning_value;
              delete params.warning_user;
              delete params.warning_phone;
              delete params.warning_ding_talk_url;
              delete params.warning_message;
            }
            const query = qs.stringify(params);
            const url = this.action === 'modify' ? GIFTCENTER_API.edit(this.templateFrm.id, query) : GIFTCENTER_API.add(query);
            url.then(res => {
              if (res.status === 1) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.cancel();
              }
            }).catch(e => {
              this.$message.error(e.errorMessage);
            });
          }
        });
      },
      cancel() {
        if (this.$route.query && this.$route.query.type === 'newAdd') {
          this.$router.replace({ name: 'giftManage' });
        } else {
          this.$router.back();
        }
      }
    }
  };
</script>

<style>
</style>
