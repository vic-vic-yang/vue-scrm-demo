<template>
  <el-dialog title="提示" class="export-dialog" width="40%" :visible.sync="show" @close="close">
    <div>
      <h3>由于报表数据可能过多，请选择您需要数据的进行导出</h3>
      <el-form :inline="true" :model="exportList" :rules="exportRules" ref="exportForm">
        <el-form-item label="从" prop="start">
          <el-input placeholder="开始位置" v-model="exportList.start" type="text">
             <template slot="append">名</template>
          </el-input>
        </el-form-item>
        <br/>
        <el-form-item label="至" prop="end">
          <el-input placeholder="结束位置" v-model="exportList.end" type="text">
            <template slot="append">名</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="exportData">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    max: Number
  },
  data() {
    var startValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入开始位置'));
      } else if (!/^\+?[1-9][0-9]*$/.test(value)) {
        callback(new Error('请输入正整数'));
      } else if (value > this.max) {
        callback(new Error('开始位置不能大于总数据条数'));
      } else {
        callback();
      }
    };
    var endValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入结束位置'));
      } else if (!/^\+?[1-9][0-9]*$/.test(value)) {
        callback(new Error('请输入为正整数'));
      } else if (value < this.exportList.start) {
        callback(new Error('结束位置不能小于开始位置'));
      } else if (value > this.max) {
        callback(new Error('结束位置不能大于总数据条数'));
      } else {
        callback();
      }
    };
    return {
      show: true,
      exportList: {
        start: '',
        end: ''
      },
      exportRules: {
        start: [{ validator: startValidate, trigger: 'change' }],
        end: [{ validator: endValidate, trigger: 'change' }]
      }
    };
  },
  methods: {
    exportData() {
      this.$refs['exportForm'].validate(valid => {
        if (valid) {
          this.$emit('submit', {
            ...this.exportList
          });
        }
      });
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style>
</style>