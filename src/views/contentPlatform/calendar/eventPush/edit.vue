<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="time" label="事件前推送时间">
            <el-input-number
              v-model="formFrm.time"
              placeholder="请输入事件前推送时间"
              :maxlength="50"
              name="time"
              :precision="0"
              :clearable="true">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="unit" label="单位">
            <el-select placeholder="请选择单位" v-model="formFrm.unit" clearable>
              <el-option
                v-for="item in unitOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="type" label="推送方式">
        <el-select placeholder="请选择推送方式" v-model="formFrm.type" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CALENDAR from '@/api/contentPlatform/calendar';
  import _ from 'lodash';

  export default {
    name: 'editor',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        pageLoading: true,
        formFrm: {
          push_id: this.$route.params.id || 0,
          time: '',
          unit: '',
          type: ''
        },
        typeOptions: [
          {
            id: '1',
            name: '模板消息'
          }
        ],
        unitOptions: [
          {
            id: 'd',
            name: '天'
          },
          {
            id: 'h',
            name: '小时'
          },
          {
            id: 'm',
            name: '分钟'
          }
        ],
        frmRules: {
          time: [{pattern: /^[1-9]\d{0,3}$/, required: true, message: '请输入事件前推送时间,4位内正数'}],
          unit: [{required: true, message: '请输入单位'}],
          type: [{required: true, message: '请输选择推送方式'}]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        CALENDAR.push.get(this.formFrm.push_id).then(res => {
          this.formFrm = _.assign({}, this.formFrm, res);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            (this.action === 'modify' ? CALENDAR.push.edit(formFrm) : CALENDAR.push.add(formFrm))
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

</style>
