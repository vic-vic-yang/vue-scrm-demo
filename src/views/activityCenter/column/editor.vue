<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="commodity-edit__form"
      :model="columnFrm"
      :rules="frmRules"
      ref="columnFrm"
      label-width="160px">
      <el-form-item prop="name" label="栏目名称">
        <el-input
          v-model="columnFrm.name"
          placeholder="请输入栏目名称"
          :maxlength="40"
          name="name"
          :disabled="name_disabled"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="activity" label="栏目活动">
        <el-select placeholder="请选择栏目活动" style="width: 300px;" multiple clearable v-model="columnFrm.activity">
          <el-option
            v-for="(item, index) in activityOptions"
            :key="index"
            :label="item.activity_name"
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
  import ACTIVITY_API from '@/api/activityCenter/index';
  import column from '@/api/activityCenter/column';
  import _ from 'lodash';

  export default {
    name: 'editor',
    data() {
      const action = this.$route.params.id ? 'modify' : 'add';
      return {
        pageLoading: true,
        action: action,
        columnFrm: {
          id: this.$route.params.id || 0,
          name: '',
          activity: [],
          activity_list: []
        },
        frmRules: {},
        activityOptions: [],
        name_disabled: false
      };
    },
    created() {
      this.getActivity();
      this.getData();
      if (this.$route.query.type * 1 === 1) {
        this.name_disabled = true;
      } else {
        this.name_disabled = false;
      }
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        column.get(this.$route.params.id).then(res => {
          this.columnFrm = _.assign({}, this.columnFrm, res.data);
          this.columnFrm.activity = this.columnFrm.activity_list.map(item => {
            return item.activity_id;
          });
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
        const columnFrm = Object.assign({}, this.columnFrm);
        columnFrm.activity_list = [];
        this.activityOptions.map(item => {
          this.columnFrm.activity.map(val => {
            if (val === item.id) {
              columnFrm.activity_list.push({
                activity_id: item.id,
                app_type: item.type
              });
            }
          });
        });
        delete columnFrm.activity;
        column.add(columnFrm).then(res => {
          this.$router.back();
        });
      }
    }
  };
</script>

<style scoped>

</style>
