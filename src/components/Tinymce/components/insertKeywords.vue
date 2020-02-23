<template>
  <div class="upload-container">
    <el-button icon='el-icon-edit-outline' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="warning">添加替换文字
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <header>添加替换文字</header>
      <el-row>
        <el-form-item label="替换文字">
          <el-select v-model="field" placeholder="请选择替换文字">
            <el-option
              v-for="item in keywords"
              :key="item.id"
              :label="item.name"
              :value="item.field">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文字对应字段">
          <span :style="{color: field && field !== '' ? '#606266' : '#dcdfe6'}">{{field  || '请选择替换文字'}}</span>
        </el-form-item>
        <el-col :span="24" style="text-align: right;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'insertKeywords',
    props: {
      keywords: {
        type: Array,
        default: [
          {
            id: 0,
            name: '邀请者昵称',
            field: '{inviter_nickname}'
          },
          {
            id: 1,
            name: '受邀者昵称',
            field: 'invited_nickname'
          },
          {
            id: 2,
            name: '任务名称',
            field: 'mission_name'
          },
          {
            id: 3,
            name: '任务量',
            field: 'mission_count'
          },
          {
            id: 4,
            name: '未完成任务量',
            field: 'unfinished_mission_count'
          },
          {
            id: 5,
            name: '已完成任务量',
            field: 'finished_mission_count'
          },
          {
            id: 6,
            name: '任务奖励积分额',
            field: 'mission_reward_points'
          }
        ]
      }
    },
    data() {
      return {
        dialogVisible: false,
        field: '',
        color: {
          type: String,
          default: '#1890ff'
        }
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('successKeywords', this.field);
        this.field = '';
        this.dialogVisible = false;
      }
    }
  };
</script>

<style scoped>
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
