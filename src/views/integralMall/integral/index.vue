<template>
  <div class="app-container integral-list">
    <div class="header-top">
      <el-row>
        <el-col :span="12"><span class="titles">积分规则</span></el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button style="margin: 10px 300px 0 0;" @click="go_integral_details">数据总览</el-button>
        </el-col>
      </el-row>
    </div>
    <header>
      <el-row>
        <el-col :span="24"><span>积分有效期</span></el-col>
      </el-row>
    </header>
    <el-row style="margin-bottom: 30px;">
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <el-row>
            <el-col :span="12">
              <div class="times">{{open_start_time}} -- {{open_end_time}}</div>
              <div class="times-up-btn"><el-button @click="changeTime">更改时间</el-button></div>
            </el-col>
          </el-row>
          <el-row v-if="set_times">
            <el-col :span="24">
              <el-form
                class="commodity-edit__form"
                :model="integralFm"
                :rules="frmRules"
                ref="commodityFrm"
                label-width="120px">
                <el-form-item prop="validate_start_time" label="开始时间">
                  <el-date-picker
                    :editable="false"
                    v-model="integralFm.validate_start_time"
                    type="datetime"
                    :picker-options="startPickerOptions"
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="validate_end_time" label="结束时间">
                  <el-date-picker
                    :editable="false"
                    :default-value="integralFm.validate_start_time"
                    v-model="integralFm.validate_end_time"
                    type="datetime"
                    :picker-options="sellEndPickerOptions"
                    placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.prevent.stop="save">保存</el-button>
                  <el-button @click.prevent.stop="changeTime">取消</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <header>积分兑换限制</header>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <el-row>
            <div :span="24" class="app-container">
              <el-form
                class="activity-edit__form"
                :model="integralFm"
                ref="integralFm"
                label-width="200px">
                <el-form-item label="每天每用户获取积分次数上限：">
                  <el-input
                    v-model="integralFm.day_times_limit"
                    placeholder="每天每用户获取积分次数上限："
                    name="day_times_limit"
                    @change="inputChange"
                    :clearable="true">
                  </el-input>
                </el-form-item>
                <el-form-item label="每天每用户获取积分值上限：">
                  <el-input
                    v-model="integralFm.day_integral_limit"
                    placeholder="每天每用户获取积分值上限："
                    name="day_integral_limit"
                    @change="inputChange"
                    :clearable="true">
                  </el-input>
                </el-form-item>
                <el-form-item v-if="set_limit">
                  <el-button type="primary" @click.prevent.stop="confirm">保存</el-button>
                  <el-button @click.prevent.stop="cancel">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import integral from '@/api/integralMall/integral';
  import { parseTime } from '@/utils';

  export default {
    name: 'integral-list',
    data() {
      return {
        set_times: false,
        tabLoading: false,
        set_limit: false,
        open_start_time: '2018-12-01 00:00:00',
        open_end_time: '2018-12-31 00:00:00',
        day_times_limit: '',
        day_integral_limit: '',
        integralFm: {
          validate_start_time: '2018-12-01 00:00:00',
          validate_end_time: '2018-12-31 00:00:00',
          day_times_limit: '',
          day_integral_limit: ''
        },
        startPickerOptions: {
          disabledDate(time) {
            const currentDate = new Date();
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        sellEndPickerOptions: {
          disabledDate: (time) => {
            let currentDate = new Date();
            if (this.integralFm.validate_start_time && (this.integralFm.validate_start_time !== '--')) {
              const currentStartDate = new Date(this.integralFm.validate_start_time);
              if ((+currentStartDate) > (+currentDate)) {
                currentDate = currentStartDate;
              }
            }
            const currentTime = +new Date(`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
            return (+time) < currentTime;
          }
        },
        frmRules: {
          validate_start_time: [
            {
              required: true, message: '请选择开始时间'
            }
          ],
          validate_end_time: [
            {
              required: true, message: '请选择结束时间'
            }
          ]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        integral.index().then(res => {
          res.data.validate_start_time = (res.data.validate_start_time === '' || res.data.validate_start_time * 1 === 0) ? '--' : parseTime(res.data.validate_start_time);
          res.data.validate_end_time = (res.data.validate_end_time === '' || res.data.validate_end_time * 1 === 0) ? '--' : parseTime(res.data.validate_end_time);
          this.integralFm = res.data;
          this.open_start_time = res.data.validate_start_time || '';
          this.open_end_time = res.data.validate_end_time || '';
          this.day_integral_limit = res.data.day_integral_limit;
          this.day_times_limit = res.data.day_times_limit;
          this.tabLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
          });
        });
      },
      go_integral_details() {
        this.$router.push({ name: 'integralOverview' });
      },
      changeTime() {
        this.set_times = !this.set_times;
        if (this.set_times) {
          if (this.integralFm.validate_start_time === '--') {
            this.integralFm.validate_start_time = '';
          }
          if (this.integralFm.validate_end_time === '--') {
            this.integralFm.validate_end_time = '';
          }
        }
      },
      save() {
        if (this.integralFm.validate_start_time && this.integralFm.validate_end_time) {
          integral.validate({
            id: this.integralFm.id,
            validate_start_time: this.integralFm.validate_start_time,
            validate_end_time: this.integralFm.validate_end_time
          }).then(res => {
            this.set_times = !this.set_times;
            this.getData();
          }).catch(err => {
            this.$message({
              type: 'info',
              message: err.message
            });
          });
        } else {
          this.$message({
            type: 'info',
            message: '请设置积分有效期'
          });
        }
      },
      inputChange() {
        this.set_limit = true;
      },
      cancel() {
        this.set_limit = false;
        Object.assign(this.integralFm, {
          day_times_limit: this.day_times_limit,
          day_integral_limit: this.day_integral_limit
        });
      },
      confirm() {
        if (this.integralFm.day_times_limit && this.integralFm.day_integral_limit) {
          integral.limit({
            id: this.integralFm.id,
            day_times_limit: this.integralFm.day_times_limit,
            day_integral_limit: this.integralFm.day_integral_limit
          }).then(res => {
            this.set_limit = false;
            this.getData();
          }).catch(err => {
            this.$message({
              type: 'info',
              message: err.message
            });
          });
        } else {
          this.$message({
            type: 'info',
            message: '请设置积分兑换限制'
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .overView{
    text-align: right;
    font-weight: bold;
    padding: 15px;
    margin-right: 30px;
  }
  .des{
    padding: 15px;
  }
  .times{
    display: inline-block;
    padding: 15px 15px 20px;
    vertical-align: middle;
    margin-left: 10px;
  }
  .times-up-btn{
    display: inline-block;
    padding: 15px 15px 20px;
    vertical-align: middle;
  }
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
  .header-top{
    padding: 15px 0;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 30px;
    .titles{
      display: block;
      margin-top: 20px;
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
