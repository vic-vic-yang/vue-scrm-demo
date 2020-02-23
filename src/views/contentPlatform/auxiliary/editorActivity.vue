<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="type" label="活动类型">
        <el-select placeholder="活动类型"  v-model="groupFrm.type">
            <el-option
            v-for="(item, index) of matchModeOptions" :key="index"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <template v-if="groupFrm.type == 1">
          <el-form-item prop="activity_name" label="活动标题">
            <el-input
              v-model="groupFrm.activity_name"
              name="matchName"
              :clearable="true"
              placeholder="请输入活动标题">
            </el-input>
          </el-form-item>
          <el-form-item prop="time" label="活动时间">
            <el-date-picker
            :editable="false"
            v-model="groupFrm.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="left"
            unlink-panels
            :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item prop="activity_address" label="活动地址">
            <el-input
              v-model="groupFrm.activity_address"
              name="matchAddress"
              :clearable="true"
              placeholder="请输入活动地址">
            </el-input>
          </el-form-item>
          <el-form-item prop="sponsor" label="主办方">
            <el-input
              v-model="groupFrm.sponsor"
              name="sponsor"
              :clearable="true"
              placeholder="请输入主办方">
            </el-input>
          </el-form-item>
          <el-form-item prop="img" label="活动配图">
            <!-- <upload-commodity-pic v-if="!pageLoading" v-model="commodityFrm.pic"></upload-commodity-pic> -->
            <img-cropper :pic="groupFrm.img" @get_pic="get_pic" :width="750" :height="422"></img-cropper>
            <small class="text-999">建议尺寸：800*500像素，你可以拖拽图片调整顺序，最多上传15张</small>
          </el-form-item>
          <template v-if="if_mp_img">
            <el-form-item prop='authorizer_appid' label='公众号'>
              <el-select placeholder='请选择公众号' v-model='groupFrm.authorizer_appid'>
                <el-option
                  v-for='item in public_address_options'
                  :key='item.id'
                  :label='item.nick_name'
                  :value='item.authorizer_appid'>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="mp_img" label="公众号配图" label-width="90px">
              <upload-prize-avatar v-model="groupFrm.mp_img"></upload-prize-avatar>
            </el-form-item>
          </template>
          <el-form-item prop="entry_conditions" label="报名要求">
            <el-checkbox-group class="requirement" v-model="groupFrm.entry_conditions">
              <el-checkbox
                v-for="(item, index) in signGroupsOptions"
                :key="index"
                :label="item.title">
              </el-checkbox>
            </el-checkbox-group>
            <small class="text-999">多选为所有规则都需要满足才能报名，不选则为没有限制</small>
          </el-form-item>
          <el-form-item prop="manual_check" label="报名审核">
            <el-radio-group v-model="groupFrm.manual_check">
              <el-radio :label="0">关</el-radio>
              <el-radio :label="1">开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="description" label="活动详情">
            <tinymce placeholder="请输入活动详情" :height="300" v-model="groupFrm.description"/>
          </el-form-item>
      </template>
      <template v-else>
          <el-form-item v-if="groupFrm.type == 2" prop="link" label="活动链接">
            <el-input
              v-model="groupFrm.link"
              name="link"
              :clearable="true"
              placeholder="请输入活动链接">
            </el-input>
          </el-form-item>
          <template v-if="groupFrm.type == 3">
            <el-form-item prop="appid" label="appId">
              <el-input
                v-model="groupFrm.appid"
                name="appid"
                :clearable="true"
                placeholder="请输入小程序appId">
              </el-input>
            </el-form-item>
            <el-form-item prop="remark" label="备注">
              <el-input
                v-model="groupFrm.remark"
                name="remark"
                :clearable="true"
                placeholder="请输入备注">
              </el-input>
            </el-form-item>
            <el-form-item prop="link" label="小程序路径" label-width="90px">
              <el-input
                v-model="groupFrm.link"
                name="link"
                :clearable="true"
                placeholder="请输入小程序路径">
              </el-input>
            </el-form-item>
          </template>
          <el-form-item prop="show_type" label="展示方式">
            <el-radio-group v-model="groupFrm.show_type">
              <el-radio :label="1">图片</el-radio>
              <el-radio :label="2">活动卡片</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="activity_name" label="活动标题">
            <el-input
              v-model="groupFrm.activity_name"
              name="matchName"
              :clearable="true"
              placeholder="请输入活动标题">
            </el-input>
          </el-form-item>
          <el-form-item prop="img" label="活动配图">
            <img-cropper :pic="groupFrm.img" @get_pic="get_pic" type="only" :width="groupFrm.show_type == 1 ? 351 : 312" :height="groupFrm.show_type == 1 ? 217 : 234"></img-cropper>
          </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Task from '@/api/answer/task';
import Auxiliary from '@/api/contentPlatform/auxiliary';
import Tinymce from '@/components/Tinymce';
import uploadPrizeAvatar from '@/components/Upload/singleImage';
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import { parseTime } from '@/utils';

export default {
  name: 'contentEditorActivity',
  components: {
    Tinymce,
    imgCropper,
    uploadPrizeAvatar
  },
  data() {
    return {
      groupId: this.$route.params.id,
      action: this.$route.params.id ? 'modify' : 'add',
      images: [], // 裁剪图片
      public_address_options: [], // 公众号选择
      groupFrm: {
        activity_name: '', // 活动标题
        type: 1, // 活动类型
        time: [], // 活动时间
        activity_address: '', // 活动地址
        sponsor: '', // 主办方
        description: '', // 活动描述
        img: [], // 活动配图
        authorizer_appid: '', // 公众号
        mp_img: '', // 公众号配图
        entry_conditions: [], // 报名要求(文字)
        entry_condition: [], // 报名要求(数字)
        manual_check: 0, // 报名审核
        link: '', // 跳转链接
        appid: '', // appId
        remark: '', // 备注
        show_type: 1 // 展示方式
      },
      frmRules: {
        activity_name: [
          {
            required: true, message: '请输入活动标题'
          }
        ],
        type: [
          {
            required: true, message: '请选择活动类型'
          }
        ],
        time: [
          {
            required: true, message: '请输入活动时间'
          }
        ],
        img: [
          {
            required: true, message: '请上传活动配图'
          }
        ],
        authorizer_appid: [
          {
            required: true, message: '请选择公众号'
          }
        ],
        mp_img: [
          {
            required: true, message: '请上传公众号配图'
          }
        ],
        manual_check: [
          {
            required: true, message: '请选择是否开启报名审核'
          }
        ],
        link: [
          {
            required: true, message: '请输入活动链接'
          }
        ],
        appid: [
          {
            required: true, message: '请输入appId'
          }
        ],
        show_type: [
          {
            required: true, message: '请选择展示方式'
          }
        ],
        description: [
          {
            required: true, message: '请输入活动描述'
          }
        ]
      },
      matchModeOptions: [
        {
          value: 1,
          label: '报名活动'
        },
        {
          value: 2,
          label: '外部链接'
        },
        {
          value: 3,
          label: '小程序跳转'
        }
      ],
      signGroupsOptions: [
        {
          id: 1,
          title: '需要填写姓名'
        },
        {
          id: 2,
          title: '需要填写手机号'
        },
        {
          id: 3,
          title: '需要填写身份证号码'
        },
        {
          id: 4,
          title: '需要验证手机号'
        },
        {
          id: 5,
          title: '需要验证实名信息'
        },
        {
          id: 6,
          title: '需要选手关注公众号'
        }
      ],
      pickerOptions: { // 过去时间不可选
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  computed: {
    if_mp_img() {
      if (this.groupFrm.entry_conditions.includes('需要选手关注公众号')) return true;
      return false;
    }
  },
  created() {
    this.getAuthorizer();
    if (this.groupId) {
      this.getData();
    }
  },
  methods: {
    getData() {
      Auxiliary.activity.get(this.groupId).then(res => {
        this.groupFrm.activity_name = res.activity_name;
        this.groupFrm.type = res.type - 0;
        this.groupFrm.activity_address = res.address;
        this.groupFrm.description = res.detail;
        this.groupFrm.sponsor = res.sponsor;
        this.groupFrm.appid = res.appid;
        this.groupFrm.remark = res.remark;
        this.groupFrm.link = res.link;
        this.groupFrm.manual_check = res.apply_audit;
        this.groupFrm.mp_img = res.mp_img;
        this.groupFrm.show_type = res.show_type;
        this.groupFrm.authorizer_appid = res.authorizer_appid;
        if (res.start_time && res.end_time) {
          this.groupFrm.time = [parseTime(res.start_time), parseTime(res.end_time)];
        }
        this.groupFrm.img = res.images.map(item => {
          return {
            file_path: item
          };
        });
        this.groupFrm.entry_conditions = res.apply_condition;
        res.apply_condition.forEach(item => {
          for (const iterator of this.signGroupsOptions) {
            if (iterator.id === item - 0) {
              this.groupFrm.entry_conditions.push(iterator.title);
            }
          }
        });
      });
    },
    getAuthorizer() {
      Task.getAuthorizer().then(res => {
        this.public_address_options = res.data;
      });
    },
    get_pic(data) {
      this.groupFrm.img = data;
    },
    save() {
      const obj = {
        type: this.groupFrm.type,
        show_type: this.groupFrm.show_type,
        appid: this.groupFrm.appid,
        remark: this.groupFrm.remark,
        link: this.groupFrm.link,
        activity_name: this.groupFrm.activity_name,
        start_time: this.groupFrm.time[0],
        end_time: this.groupFrm.time[1],
        images: [],
        mp_img: this.groupFrm.mp_img,
        address: this.groupFrm.activity_address,
        sponsor: this.groupFrm.sponsor,
        detail: this.groupFrm.description,
        apply_condition: [],
        apply_audit: this.groupFrm.manual_check,
        authorizer_appid: this.groupFrm.authorizer_appid
      };
      if (this.groupId) {
        obj.id = this.groupId;
      }
      obj.images = this.groupFrm.img.map(item => {
        return item.file_path;
      });
      this.signGroupsOptions.forEach(item => {
        if (this.groupFrm.entry_conditions.includes(item.title)) {
          obj.apply_condition.push(item.id);
        }
      });
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          (this.action === 'modify'
            ? Auxiliary.activity.edit(obj)
            : Auxiliary.activity.add(obj)).then(res => {
            this.$router.back();
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.editor-item{
  display: flex;
  width: 470px;
  justify-content: space-between;
}
.requirement{
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.requirement .el-checkbox{
  margin-left: 0;
}
</style>
