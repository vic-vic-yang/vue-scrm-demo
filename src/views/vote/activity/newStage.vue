 /* eslint-disable */
<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
    <el-form-item prop="stage_name" label="活动阶段">
        <el-select placeholder="请选择活动阶段" v-model="groupFrm.stage_name">
        <el-option
            v-for="item in matchModeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="time" label="阶段时间">
        <el-date-picker
        :editable="false"
        v-model="groupFrm.time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        align="left"
        unlink-panels>
        </el-date-picker>
    </el-form-item>
    <el-form-item prop="promotion_persons" label="晋级人数">
        <el-input
          v-model="groupFrm.promotion_persons"
          name="matchName"
          :clearable="true"
          style="width:100px"
          placeholder="晋级人数">
        </el-input> 人
    </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import Activity from '@/api/vote/activity';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import { parseTime } from '@/utils';

  export default {
    name: 'groupEditor',
    components: {
      Tinymce,
      uploadPrizeAvatar
    },
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        groupFrm: {
          activity_id: this.$route.params.activityId,
          id: this.$route.params.id,
          time: [], // 活动时间
          stage_name: '默认', // 活动阶段
          promotion_persons: '' // 晋级人数
        },
        frmRules: {
          time: [
            {
              required: true, message: '请选择阶段时间'
            }
          ],
          stage_name: [
            {
              required: true, message: '请选择活动阶段'
            }
          ],
          promotion_persons: [
            {
              required: true, message: '请输入晋级人数'
            }
          ]
        },
        matchModeOptions: [
          {
            value: '默认',
            label: '默认'
          },
          {
            value: '初赛',
            label: '初赛'
          },
          {
            value: '复赛',
            label: '复赛'
          },
          {
            value: '决赛',
            label: '决赛'
          }
        ],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      };
    },
    created() {
      if (this.action === 'modify') {
        this.getData();
      }
    },
    methods: {
      getData() {
        Activity.stage.get(this.groupFrm).then(res => {
          this.groupFrm.time = [parseTime(res.start_time), parseTime(res.end_time)];
          this.groupFrm.stage_name = res.stage_name;
          this.groupFrm.promotion_persons = res.promotion_persons;
        });
      },
      save() {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            this.groupFrm.start_time = this.groupFrm.time[0];
            this.groupFrm.end_time = this.groupFrm.time[1];
            (this.action === 'modify'
              ? Activity.stage.edit(this.groupFrm)
              : Activity.stage.add(this.groupFrm)).then(res => {
              if (this.action === 'modify') {
                this.$router.replace({ name: 'stageList', params: { id: this.groupFrm.activity_id }});
                return;
              }
              this.$confirm('添加阶段成功，是否开始添加任务？', '确认信息', {
                distinguishCancelAndClose: true,
                closeOnClickModal: false,
                confirmButtonText: '是',
                cancelButtonText: '否'
              }).then((action) => {
                this.$router.replace({ name: 'voteNewStage', params: { stageId: res.data.id }});
              }).catch(action => {
                this.$router.replace({ name: 'stageList', params: { id: this.groupFrm.activity_id }});
              });
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
