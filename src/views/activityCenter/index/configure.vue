<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="configureFrm"
      :rules="frmRules"
      ref="configureFrm"
      label-width="160px">
      <el-form-item prop="found_page_type" label="发现页展示方式">
        <el-radio-group v-model="configureFrm.found_page_type">
          <el-radio :label="1">瀑布流展示</el-radio>
          <el-radio :label="2">分类展示</el-radio>
          <el-radio :label="3">分栏目展示</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="activity" label="banner位置展示的活动"  v-if="configureFrm.found_page_type === 2 || configureFrm.found_page_type === 3">
        <el-select placeholder="请选择banner位置展示的活动" style="width: 260px" multiple clearable v-model="configureFrm.activity">
          <el-option
            v-for="(item, index) in activityOptions"
            :key="index"
            :label="item.activity_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="open_lottery" label="是否展示积分抽奖入口">
        <el-radio-group v-model="configureFrm.open_lottery">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="open_lottery" label="是否展示日历入口">
        <el-radio-group v-model="configureFrm.open_calendar">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ACTIVITY_API from '@/api/activityCenter/index';
  import _ from 'lodash';

  export default {
    name: 'configure',
    data() {
      return {
        pageLoading: true,
        configureFrm: {
          found_page_type: 1,
          activity: [],
          activity_list: [],
          open_lottery: 0,
          open_calendar: 0
        },
        activityOptions: [],
        frmRules: {
          found_page_type: [
            {
              required: true, message: '请选择发现页展示方式'
            }
          ],
          activity_id: [
            {
              required: false, message: '请选择banner位置展示的活动'
            }
          ],
          open_lottery: [
            {
              required: false, message: '是否展示积分抽奖入口'
            }
          ]
        }
      };
    },
    created() {
      this.getActivity();
      this.getData();
    },
    methods: {
      getData() {
        this.pageLoading = true;
        ACTIVITY_API.getConfig().then(res => {
          res.data.found_page_type = Number(res.data.found_page_type);
          res.data.open_lottery = Number(res.data.open_lottery);
          res.data.open_calendar = Number(res.data.open_calendar || 0);
          this.configureFrm = _.assign({}, this.configureFrm, res.data);
          this.configureFrm.activity = this.configureFrm.activity_list.map(item => {
            return item.activity_id;
          });
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      getActivity() {
        ACTIVITY_API.list({
          pageIndex: 1,
          pageSize: 10000
        }).then(res => {
          this.activityOptions = (res.result || []).filter(item => {
            return item.status * 1 === 1;
          });
        });
      },
      save() {
        const configureFrm = this.configureFrm;
        configureFrm.activity_list = [];
        this.activityOptions.map(item => {
          configureFrm.activity.map(val => {
            if (val === item.id) {
              configureFrm.activity_list.push({
                activity_id: item.id,
                app_type: item.type
              });
            }
          });
        });
        delete configureFrm.activity;
        ACTIVITY_API.saveConfig(configureFrm).then(res => {
          this.$router.back();
        });
      }
    }
  };
</script>

<style scoped>

</style>
