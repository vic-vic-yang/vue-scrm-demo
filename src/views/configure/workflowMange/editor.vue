<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <header>工作流配置</header>
      <div class="setting">
        <custom-el-table
          v-loading="pageLoading"
          v-model="pageIndex"
          :tableData="tableData"
          :tableOptions="tableOptions"
          :total="totalCount"
          @delete="deleteHandler"
          @edit="editHandler">
        </custom-el-table>
      </div>
      <el-button type="primary" @click="createHandler" style="margin-bottom: 50px">
        <i class="fs-13 el-icon-plus mr-5"></i>新增步骤
      </el-button>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>

    <add-step :dialogShow="dialogVisible"
              :step_id="step_id"
              :work_flow_id="formFrm.id"
              :addStepData="addStepData"
              @stepHandler="stepHandler"
              @stepHidden="dialogVisible = false"></add-step>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import addStep from './addStep';
  import WORKFLOW from '@/api/configure/workflow';
  import customElTable from '@/components/customElTable';

  export default {
    name: 'editor',
    components: {
      customElTable,
      Tinymce,
      addStep
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        formFrm: {
          id: this.$route.params.id || '',
          department_id: this.$route.query.department_id,
          name: '',
          type: 1,
          description: '',
          steps: ''
        },
        typeOptions: [],
        dialogVisible: false,
        addStepData: null,
        frmRules: {},
        step_id: '',
        tableOptions: [
          {
            label: '步骤名称',
            prop: 'name'
          },
          {
            label: '步骤描述',
            prop: 'description'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              'del'
            ]
          }
        ],
        tableData: [],
        existStepList: [], // 老的步骤列表，如果步骤发生变化需要提示用户
        pageIndex: 1,
        pageSize: 100,
        totalCount: 0
      };
    },
    created() {
      this.dialogVisible = false;
      this.getData();
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        WORKFLOW.works.get(this.$route.params.id).then(res => {
          this.formFrm = res;
          this.tableData = res.steps;
          this.existStepList = this.tableData.map(item => item.id).join(',');
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      stepHandler(data, oldId) {
        if ((this.tableData || []).find(item => Number(item.id) === Number(oldId))) {
          const index = this.tableData.findIndex(item => Number(item.id) === Number(oldId));
          this.tableData[index] = data;
        } else {
          this.tableData.push(data);
        }
        this.tableData = this.tableData.map(item => item);
        this.dialogVisible = false;
      },
      createHandler() {
        this.step_id = '';
        this.addStepData = null;
        this.dialogVisible = true;
      },
      editHandler(info) {
        this.step_id = info.id;
        this.dialogVisible = true;
      },
      deleteHandler(info) {
        var delMessage = `确认删除步骤 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // WORKFLOW.step.del({
          //   id: info.id
          // }).then(() => {
          //   // this.getData();
          // });
          var index = this.tableData.findIndex(item => Number(item.id) === Number(info.id));
          this.tableData.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            formFrm.steps = this.tableData.map(item => item.id).join(',');
            const apiSave = () => {
              (this.action === 'modify' ? WORKFLOW.works.edit(formFrm) : WORKFLOW.works.add(formFrm)).then(() => {
                this.$router.back();
              });
            };
            // 工作流变化需提示用户
            if (this.action === 'modify' && this.existStepList !== formFrm.steps) {
              this.$confirm(`修改工作流步骤后所有正在进行中的该工作流将会<b>回退到待审核</b>状态。您确认要修改工作流吗？`, '删除', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                apiSave();
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消保存'
                });
              });
            } else {
              apiSave();
            }
          }
        });
      }
    }
  };
</script>

<style scoped>
  .setting{
    padding: 30px 0 0;
  }
</style>
