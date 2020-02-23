<template>
  <div class="activity-wrapper app-container">
        <el-form ref="activityForm" :rules="activityFormRules" :model="activityForm" label-width="80px">
          <el-form-item prop="name" label="活动标题">
            <el-input placeholder="" v-model="activityForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="activity_type" label="活动类型">
            <el-select placeholder=""  v-model="activityForm.activity_type" value="">
              <el-option
                v-for="(item, index) of this.eventTypes" :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="description" label="事件简介">
            <el-input type="textarea" placeholder="事件简介" v-model="activityForm.description"></el-input>
          </el-form-item>
          <el-form-item prop="join_time" label="活动时间">
            <el-date-picker
              v-model="activityForm.activity_time"
              style="width: 360px"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择参与时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="activity_cover" label="事件封面">
            <upload-prize-avatar v-model="activityForm.activity_cover"  @update:imageId=""></upload-prize-avatar>
          </el-form-item>
        </el-form>
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button type="danger" @click="close">取 消</el-button>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import {parseTime } from '@/utils/index';

  export default {
    name: 'growthEditActivity',
    components: {
      uploadPrizeAvatar,
      parseTime
    },
    data() {
      return {
        activityForm: {
          name: '',
          activity_cover: '',
          activity_type: '',
          activity_time: [],
          description: ''
        },
        activityFormRules: {
          name: [
            {required: true, message: '请填写正确活动名称'}
          ],
          activity_type: [
            {required: true, message: '请选择活动类型'}
          ],
          description: [
            {required: true, message: '请填写活动描述'}
          ],
          activity_cover: [
            {required: true, message: '请选择图片'}
          ]
        },
        eventTypes: [
          {
            value: 2,
            label: '线下讲座'
          }
        ]
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        const id = this.$route.params.id;
        if (id === 'new') {
          return;
        }
        USER_GROWTH_API.getActivity(id, {}).then(res => {
          this.activityForm.name = res.name;
          this.activityForm.description = res.description;
          this.activityForm.activity_cover = res.cover;
          this.activityForm.activity_type = res.activity_type;
          this.activityForm.activity_time = [parseTime(res.start_time), parseTime(res.end_time)];
        }).catch(e => {
          this.$message.error('请求失败');
        });
      },
      save() {
        const saveActivity = () => {
          const id = this.$route.params.id;
          console.log(this.activityForm.activity_time);
          const params = {
            name: this.activityForm.name,
            cover: this.activityForm.activity_cover,
            description: this.activityForm.description,
            activity_type: this.activityForm.activity_type,
            start_time: this.activityForm.activity_time[0],
            end_time: this.activityForm.activity_time[1]
          };

          if (id === 'new') {
            USER_GROWTH_API.addActivity(params).then(res => {
              if (res.code === 200) {
                this.$message({message: '操作成功', type: 'success'});
              }
            }).catch(e => {
              this.$message.error('请求失败');
            });
          } else {
            USER_GROWTH_API.editActivity(id, params).then(res => {
              if (res.code === 200) {
                this.$message({message: '操作成功', type: 'success'});
              }
            }).catch(e => {
              this.$message.error('请求失败');
            });
          }
          this.$router.back();
        };

        this.$refs.activityForm.validate((valid) => {
          if (valid) {
            saveActivity();
          }
        });
      },
      close() {
        this.$router.back();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
