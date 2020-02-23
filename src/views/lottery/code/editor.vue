<template>
  <div class="app-container">
    <el-form
      :model="codeSegmentFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="codeSegmentFrm"
      label-width="80px">
      <el-form-item prop="name" label="码段名称">
        <el-input
          v-model="codeSegmentFrm.name"
          name="name"
          :clearable="true"
          placeholder="请输入码段名称">
        </el-input>
      </el-form-item>
      <el-form-item v-if="action==='add'" prop="totalCount" label="申请数量">
        <el-input-number
          v-model="codeSegmentFrm.totalCount"
          :min="1"
          name="totalCount"
          placeholder="申请数量">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="remark" label="备注说明">
        <el-input
          type="textarea"
          :rows="2"
          name="remark"
          placeholder="请输入备注说明"
          v-model="codeSegmentFrm.remark">
        </el-input>
      </el-form-item>
      <el-form-item prop="status" label="启用码段">
        <el-select v-model="codeSegmentFrm.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="enabledTime" label="定时启用" v-if="codeSegmentFrm.status===2">
        <el-date-picker
          v-model="codeSegmentFrm.enabledTime"
          type="datetime"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          :editable='false'
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CodeManager from '@/api/lottery/codeManager';

  export default {
    name: 'codeEditor',
    components: {},
    data() {
      return {
        codeId: this.$route.params.id,
        action: this.$route.params.id ? 'modify' : 'add',
        codeSegmentFrm: {
          name: '',
          totalCount: '',
          remark: '',
          status: 0,
          enabledTime: ''
        },
        statusOptions: [
          {
            label: '停用',
            value: 0
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '定时启用',
            value: 2
          }
        ],
        frmRules: {
          name: [
            {
              required: true, message: '名称必填'
            }
          ],
          totalCount: [
            {
              required: true, message: '申请数量必填'
            }
          ],
          enabledTime: [
            {
              required: true, message: '定时开启时间必填'
            }
          ]
        }
      };
    },
    created() {
      if (this.codeId) {
        this.getData();
      }
    },
    methods: {
      getData() {
        CodeManager.get(this.codeId).then(codeSegment => {
          this.codeSegmentFrm = {
            name: codeSegment.name,
            totalCount: codeSegment.total_count,
            remark: codeSegment.remark,
            status: (codeSegment.enabled_time && codeSegment.status * 1 !== 0) ? 2 : codeSegment.status,
            enabledTime: codeSegment.enabled_time * 1000
          };
        });
      },
      save() {
        this.$refs.codeSegmentFrm.validate(valid => {
          if (valid) {
            const frmData = Object.assign({}, this.codeSegmentFrm);
            if (frmData.status === 2) {
              frmData.enabledTime = frmData.enabledTime / 1000;
            }
            if (this.action === 'modify') {
              frmData.id = this.codeId;
            }
            (this.action === 'modify'
              ? CodeManager.edit(frmData)
              : CodeManager.add(frmData)).then(() => {
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
