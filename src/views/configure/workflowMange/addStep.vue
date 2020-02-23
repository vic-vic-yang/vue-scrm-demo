<template>
  <el-dialog
    title="步骤"
    :visible.sync="show"
    top="3vh"
    width="50%"
    @close="cancel">
    <div class="app-container">
      <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
        <el-form-item prop="name" label="步骤名称">
          <el-input v-model="formFrm.name" placeholder="请输入步骤名称" :maxlength="50" name="name" :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item prop="operators" label="操作用户">
          <el-button type="primary" @click="relatedAccount">关联账户</el-button>
        </el-form-item>
        <el-form-item label="已关联账户">
          <custom-el-table
            v-loading="tabLoading"
            v-model="pageIndex"
            :tableData="tableData"
            :tableOptions="tableOptions"
            :total="totalCount"
            @delete="deleteHandler"
            @size-change="sizeChangeHandler"
            @page-change="pageChangeHandler">
          </custom-el-table>
        </el-form-item>
        <el-form-item prop="description" label="步骤描述">
          <!--<Tinymce placeholder="请输入步骤描述" :height="200" v-model="formFrm.description"></Tinymce>-->
          <el-input v-model="formFrm.description" placeholder="请输入步骤描述" name="description" type="textarea" :clearable="true" :rows="5">
          </el-input>
        </el-form-item>
        <el-form-item prop="back_level" label="退回到" v-if="false">
          <el-select placeholder="请选择退回到" v-model="formFrm.back_level">
            <el-option v-for="item in back_level_options"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent.stop="save">保存</el-button>
          <el-button @click.prevent.stop="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      width="60%"
      title="选择账户"
      top="4vh"
      :visible.sync="innerVisible"
      append-to-body
      @close="innerVisible = false">
      <relation :show="innerVisible" :relationData="JSON.stringify(tableData)" @accountHandler="accountHandler"></relation>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import WORKFLOW from '@/api/configure/workflow';
  import customElTable from '@/components/customElTable';
  import relation from '../components/relation';

  export default {
    name: 'addStep',
    props: ['dialogShow', 'step_id', 'work_flow_id'],
    components: {
      Tinymce,
      customElTable,
      relation
    },
    data() {
      return {
        pageLoading: true,
        show: false,
        formFrm: {
          id: this.step_id || '',
          name: '',
          description: '',
          operators: '',
          work_flow_id: this.work_flow_id
          // back_level: ''
        },
        moduleOptions: [],
        back_level_options: [
          {
            id: 0,
            name: '发起者'
          }
          // {
          //   id: -1,
          //   name: '上一级'
          // },
          // {
          //   id: 22,
          //   name: '上两级'
          // }
        ],
        tableOptions: [
          {
            label: '姓名',
            prop: 'realname'
          },
          {
            label: '账号',
            prop: 'username'
          },
          {
            label: '部门',
            prop: 'department_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        innerVisible: false,
        accountList: [],
        frmRules: {
          name: [{required: true, message: '请输入步骤名称'}]
        }
      };
    },
    watch: {
      dialogShow(val) {
        this.show = val;
        if (val) {
          this.getData();
        } else {
          this.$refs.formFrm.resetFields();
          this.tableData = [];
        }
      }
    },
    created() {
      this.show = false;
      this.getUserList();
    },
    methods: {
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            if (!this.tableData || !this.tableData.length) {
              this.$message({
                type: 'info',
                message: '至少关联一个操作账户！'
              });
              return;
            }
            const formFrm = Object.assign({}, this.formFrm);
            formFrm.operators = this.tableData.map(item => item.id).join(',');
            if (this.step_id) {
              WORKFLOW.step.edit(formFrm).then(res => {
                this.$emit('stepHandler', res, this.step_id);
              });
            } else {
              WORKFLOW.step.add(formFrm).then(res => {
                this.$emit('stepHandler', res, this.step_id);
              });
            }
          }
        });
      },
      accountHandler(data) {
        this.tableData = data;
        this.innerVisible = false;
      },
      relatedAccount() {
        this.innerVisible = true;
      },
      getData() {
        if (this.step_id) {
          WORKFLOW.step.get(this.step_id).then(res => {
            this.formFrm = Object.assign({}, res);
            this.setAccountList();
            this.totalCount = 0;
            this.tabLoading = false;
          });
        }
        this.tabLoading = false;
      },
      setAccountList() {
        const operators = this.formFrm.operators.split(',');
        this.tableData = this.accountList.filter(item => operators.includes(item.id));
      },
      deleteHandler(info) {
        const delMessage = `确认要从工作流步骤中删除账户 <b>${info.realname}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const index = this.tableData.findIndex(item => item.id === info.id);
          this.tableData.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      cancel() {
        this.show = false;
        this.$emit('stepHidden');
      },
      getUserList() {
        WORKFLOW.account.list({
          page_index: 1,
          page_size: 10000
        }).then(res => {
          this.accountList = (res.result || []).map(item => {
            return {
              ...item,
              department_name: this.setDepartmentName(item.department),
              check: false
            };
          });
        });
      },
      setDepartmentName(data) {
        let department = '';
        data.map((item, index) => {
          department += index > 0 ? ' - ' + item.name : item.name;
        });
        return department;
      }
    }
  };
</script>

<style scoped>

</style>
