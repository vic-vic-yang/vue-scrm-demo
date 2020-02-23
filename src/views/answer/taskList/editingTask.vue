<template>
  <div class='app-container' v-loading='pageLoading'>
    <el-form
      :model='templateFrm'
      ref='templateForm'
      label-width="120px">
      <el-form-item prop='mission_name' label='任务名称'>
          <el-input
            v-model='templateFrm.mission_name'
            name='name'
            :clearable='true'
            placeholder='请输入任务名称'>
          </el-input>
        </el-form-item>
      <el-form-item prop='description' label='任务描述'>
        <el-input
          v-model='templateFrm.description'
          name='ption'
          :clearable='true'
          placeholder='请输入任务描述'>
        </el-input>
      </el-form-item>
      <el-form-item prop='prize_type' label='任务类型'>
        <el-select placeholder='请选择' v-model='templateFrm.type' @change="typeChange">
          <el-option
            v-for='item in taskType'
            :key='item.id'
            :label='item.title'
            :value='item.id'>
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="templateFrm.type==4 || templateFrm.type==3 || templateFrm.type==1">
        <el-form-item prop='authorizer_id' label='公众号'>
          <el-select placeholder='请选择公众号' v-model='templateFrm.authorizer_id'>
            <el-option
              v-for='item in public_address_options'
              :key='item.id'
              :label='item.nick_name'
              :value='item.id'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="image" :label="templateFrm.type==3 ? '关注引导流程图' : (templateFrm.type==1 ? '阅读引导流程图' : '邀请关注公众号背景图片')">
          <upload-prize-avatar v-model="templateFrm.image"></upload-prize-avatar>
          <el-button v-if="templateFrm.image" @click="deleteImg('image')" type="danger">删除图片</el-button>
        </el-form-item>
        <el-form-item label-width='110px' v-if='templateFrm.type==1' prop='sign' label='每天可获得次数'>
          <el-input
            v-model='templateFrm.sign'
            name='sign'
            style='width:100px;margin-right:18px;text-align:center'>
          </el-input>次
        </el-form-item>
        <template v-if='templateFrm.type==4'>
          <el-form-item label-width='120px' prop='invite_start' label='邀请好友关注获得答题次数区间'>
            <el-input
              v-model='templateFrm.invite_start'
              name='sign'
              style='width:100px;margin-right:18px;text-align:center'>
            </el-input> -
            <el-input
              v-model='templateFrm.invite_end'
              name='sign'
              style='width:100px;margin-left:18px;text-align:center'>
            </el-input>次
          </el-form-item>
          <el-form-item lbel-width='120px' prop='invite_limit' label='邀请好友关注获得答题次数上限'>
            <el-input
              v-model='templateFrm.invite_limit'
              name='total_sign'
              style='width:100px;margin-right:18px;text-align:center'>
            </el-input>次
          </el-form-item>
        </template>
      </template>
      <template v-else>
        <el-form-item style="width:900px" prop='answer' label='金额'>
          <el-row
            :class="{'mb-20': index!==templateFrm.prizes.length-1}"
            v-for='(answer,index) in templateFrm.prizes' :key='index'>
            <template>
            <el-col :span='4'>
              <el-input
                v-model='answer.start_range'
                style='width:100px;margin-right:18px'
                :name="'answerTitle'+index"
                :clearable='true'
                label='元'
                placeholder='请输入金额'>
              </el-input>至
            </el-col>
            <el-col :span='4'>
              <el-input
                v-model='answer.end_range'
                style='width:100px;margin-right:18px'
                :name="'answerTitle'+index"
                :clearable='true'
                placeholder='请输入金额'>
              </el-input>元
            </el-col>
            <el-col :span='5'>
              <el-input
                v-model='answer.stock'
                style='width:100px;margin-right:18px'
                :name="'answerTitle'+index"
                :clearable='true'
                placeholder='请输入个数'>
              </el-input>个/天
            </el-col>
            </template>
            <el-col :span='11'>
                当天发送数量：{{answer.today_send_count}}&nbsp&nbsp 总发送数量：{{answer.send_count}}&nbsp&nbsp
              <template v-if='index===templateFrm.prizes.length-1'>
                <el-button type='text' icon='el-icon-plus' @click='addAnswer'>添加</el-button>
                <el-button v-if='templateFrm.prizes.length>1' type='text' icon='el-icon-delete' @click='deleteAnswer(index)'>删除</el-button>
              </template>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="保底金额">
          <el-input
                v-model='templateFrm.default_value'
                style='width:100px;margin-right:18px'
                :clearable='true'
                placeholder='请输入金额'>
              </el-input>元 <span style="margin-left:25px">当天发送数量：{{templateFrm.today_send_count}}&nbsp&nbsp 总发送数量：{{templateFrm.send_count}}&nbsp&nbsp</span>
        </el-form-item>
        <el-form-item label="首页红包">
        <el-radio-group v-model="templateFrm.red_pack">
            <el-radio label="0">隐藏</el-radio>
            <el-radio label="1">显示</el-radio>
          </el-radio-group>
      </el-form-item>
      </template>
      <el-form-item prop="share_desc" v-if='templateFrm.type==2 || templateFrm.type==4' :label="templateFrm.type==2 ? '红包海报邀请标题' : '公众号海报邀请标题'">
        <el-input
          v-model="templateFrm.share_desc"
          name="share_desc"
          :clearable="true"
          :placeholder="templateFrm.type==2 ? '请输入红包海报邀请标题' : '请输入公众号海报邀请标题'">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='save'>保存</el-button>
        <el-button @click='$router.back()'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Task from '@/api/answer/task';
import uploadPrizeAvatar from '@/components/Upload/singleImage';

export default {
  name: 'templateEditor',
  components: {
    uploadPrizeAvatar
  },
  data() {
    return {
      pageLoading: true,
      action: this.$route.params.id,
      taskType: [
        {
          title: '阅读任务',
          id: '1'
        },
        {
          title: '红包任务',
          id: '2'
        },
        {
          title: '关注公众号任务',
          id: '3'
        },
        {
          title: '邀请好友关注公众号任务',
          id: '4'
        }
      ],
      templateFrm: {
        mission_name: '',
        description: '',
        type: '1',
        sign: 1,
        total_sign: 1,
        default_value: 0,
        today_send_count: 0,
        send_count: 0,
        prizes: [
          {
            stock: '0',
            start_range: '0',
            end_range: '0',
            today_send_count: '0', // 当天发送数量
            send_count: '0' // 总发送数量
          }
        ],
        red_pack: '0', // 是否开启首页红包
        authorizer_id: '', // 公众号id
        image: '',
        share_desc: '',
        invite_start: '',
        invite_end: '',
        invite_limit: ''
      },
      public_address_options: []
    };
  },
  created() {
    this.getDetail();
  },
  computed: {
  },
  methods: {
    getDetail() {
      if (!this.action) {
        if (this.templateFrm.type) {
          this.getAuthorizer({type: this.templateFrm.type});
        }
        this.pageLoading = false;
        return;
      }
      Task.taskDetails(this.action)
        .then(data => {
          data.authorizer_id = data.authorizer_id * 1;
          this.templateFrm = data;
          if (!(this.templateFrm.prizes.length > 0)) {
            this.templateFrm.prizes = [
              {
                stock: '0',
                start_range: '0',
                end_range: '0',
                today_send_count: '0', // 当天发送数量
                send_count: '0' // 总发送数量
              }
            ];
          }
          this.getAuthorizer({ type: data.type });
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    getAuthorizer(options) {
      if (options.type * 1 === 2) return;
      options.type = options.type * 1 === 3 || options.type * 1 === 4 ? 2 : 1;
      Task.getAuthorizer(options).then(res => {
        this.public_address_options = res.data;
      });
    },
    typeChange() {
      this.getAuthorizer({type: this.templateFrm.type});
    },
    save() {
      // const obj = {
      //   type: this.templateFrm.taskType,
      //   mission_name: this.templateFrm.taskName,
      //   description: this.templateFrm.askDescription,
      //   default_value: this.templateFrm.default_value
      // };
      // if (this.templateFrm.taskType === '1') {
      //   obj.sign = this.templateFrm.num;
      // } else {
      //   obj.prize = this.templateFrm.answers;
      // }
      if (this.action) { // 修改
        Task.reviseTask(this.action, this.templateFrm).then(
          res => {
            this.$router.back();
          }
        );
      } else { // 添加
        Task.newTask(this.templateFrm).then(
          res => {
            this.$router.back();
          }
        );
      }
    },
    addAnswer() {
      this.templateFrm.prizes.push({
        stock: '0',
        start_range: '0',
        end_range: '0',
        today_send_count: '0', // 当天发送数量
        send_count: '0' // 总发送数量
      });
    },
    deleteAnswer(index) {
      if (this.templateFrm.prizes.length > 1) {
        this.templateFrm.prizes.splice(index, 1);
      }
    },
    deleteImg(data) {
      this.templateFrm[data] = '';
    }
  }
};
</script>

<style scoped>
</style>
