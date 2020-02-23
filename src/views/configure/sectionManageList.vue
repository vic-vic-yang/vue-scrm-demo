<template>
  <div class="app-container">
<!--    <el-button type="text" @click="addRootChild(defaultData)">添加+</el-button>-->
    <el-button style="margin-bottom: 20px" type="primary" operate="create" icon="el-icon-plus" @click="() => append(currentNode, currentNodeData,false)">添加</el-button>
    <div style="display:flex;">
      <el-tree
        :highlight-current="true"
        style="width: 550px;"
        ref="tree"
        node-key="id"
        :load="loadNode"
        lazy
        @node-click="onNodeClick"
        :props="props"
        :data="treeData">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
<!--          <el-popover-->
<!--            width="200"-->
<!--            placement="right-start"-->
<!--            trigger="hover">-->
<!--            <el-button-->
<!--              type="text"-->
<!--              size="mini"-->
<!--              @click="() => append(node, data)">-->
<!--              添加子部门-->
<!--            </el-button>-->
<!--            <br/>-->
<!--            <el-button-->
<!--              type="text"-->
<!--              size="mini"-->
<!--              @click="() => edit(node, data)">-->
<!--              编辑-->
<!--            </el-button>-->
<!--            <br/>          -->
<!--            <el-button-->
<!--              type="text"-->
<!--              size="mini"-->
<!--              @click="() => remove(node, data)">-->
<!--              删除-->
<!--            </el-button>-->
<!--          <span slot="reference" style="font-weight: bold;">&nbsp;···</span>-->
<!--          </el-popover>-->
          <span>
          </span>
        </span>
      </el-tree>
      <div class="section-info">
        <el-form
          v-if="currentNodeData.name"
          label-width="80px">
          <el-form-item prop="type" label="部门名">
            <el-input class="section-pro" v-model="name" @change="dataChange" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="部门描述">
            <el-input class="section-pro" type="textarea" v-model="desc" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px" v-if="disabled">
            <el-button type="primary" operate="create" icon="el-icon-plus" @click="() => append(currentNode, currentNodeData)">添加子部门</el-button>
            <el-button type="primary" operate="update" icon="el-icon-edit" @click="() => edit(currentNode, currentNodeData)">编辑</el-button>
            <el-button type="danger" operate="delete" icon="el-icon-delete" @click="() => remove(currentNode, currentNodeData)">删除</el-button>
          </el-form-item>
          <el-form-item style="margin-top: 30px" v-else>
            <el-button type="primary" operate="update" @click="() => cancleSave()">保存</el-button>
            <el-button type="info" operate="info"  @click="() => sureCancle()">取消</el-button>
          </el-form-item>
        </el-form>
        <div  v-if="currentNodeData.name">
          <h4>部门成员</h4>
          <el-button type="primary" operate="create" @click="addMerber" style="margin-bottom:20px"><i class="el-icon-plus"></i>新增成员</el-button>
          <custom-el-table
            :tableData="userData"
            :tableOptions="tableOptions"
            @delete="deleteHandler">
          </custom-el-table>
        </div>
      </div>
    </div>
    <dialog-merber :dialogVisible="dialogVisible" :id="currentNodeData.id" :checkedIds="checkedIds" @submit="onMerberSave" @cancel="onCancel"/>
    <el-dialog
      :title="next&&addDepartmentFrm.data.name?(addDepartmentFrm.data.name + ' - 添加子部门'):'添加部门'"
      :visible.sync="departmentDialogVisible"
      width="40%">
      <el-form :inline="true" ref="addDepartmentFrm" :model="addDepartmentFrm" class="activity-edit__form" :rules="addDepartmentFrmRules" label-width="120px">
        <el-form-item prop="name" label="部门名" style="display: block">
          <el-input placeholder="请输入部门名" v-model="addDepartmentFrm.name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="部门描述"  style="display: block">
          <el-input placeholder="请输入部门描述" v-model="addDepartmentFrm.desc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="departmentDialogVisible = false">取 消</el-button>
        <el-button operate="update" type="primary" @click="addDepartmentHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { API_SECTION } from '@/api/setting';
import customElTable from '@/components/customElTable';
import dialogMerber from './components/dialogMerber.vue';
import { parseTime } from '@/utils';

export default {
  name: 'accountManageList',
  components: {
    dialogMerber,
    customElTable
  },
  data() {
    return {
      currentNodeData: {
        label: '',
        desc: ''
      },
      currentNode: {},
      treeData: [
      ],
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      defaultData: {
        name: '部门名',
        desc: '',
        pid: 0
      },
      departmentDialogVisible: false,
      addDepartmentFrm: {
        name: '',
        desc: '',
        data: '',
        node: ''
      },
      addDepartmentFrmRules: {
        name: [{required: true, message: '请输入部门名'}],
        desc: [{required: true, message: '请输入部门描述'}]
      },
      next: false,
      queryParams: {
        page_index: 1,
        page_size: 1000
      },
      tableOptions: [
        {
          label: '账号ID',
          prop: 'id'
        },
        {
          label: '姓名',
          prop: 'realname'
        },
        {
          label: '账号',
          prop: 'username'
        },
        {
          label: '关联时间',
          prop: 'created_at'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'del'
          ]
        }
      ],
      userData: [],
      dialogVisible: false,
      checkedIds: [],
      disabled: true,
      name: '',
      desc: ''
    };
  },
  mounted() {
    // this.getRootSection();
  },
  methods: {
    loadNode(node, resolve) {
      const id = node.level === 0 ? 0 : node.data.id;
      API_SECTION.getChild(id).then(res => {
        if (res.data.result && res.data.result.length) {
          res.data.result.forEach(item => {
            item.leaf = ~~item.child_count === 0;
          });
          if (resolve) {
            resolve(res.data.result);
          }
        } else {
          if (resolve) {
            resolve([]);
          }
        }
      });
    },
    addRootChild(params) {
      this.$router.push({
        name: 'sectionManageEdit',
        params: {}
      });
    },
    init() {
      this.treeData = [];
    },
    getRootSection() {
      API_SECTION.getChild().then(res => {
        this.treeData.push(...res.data.result);
      });
    },
    edit(node, data) {
      this.disabled = false;
      // this.$router.push({
      //   name: 'sectionManageEdit',
      //   params: data
      // });
    },
    append(node, data, next = true) {
      this.next = next;
      if (next) {
        // 添加子部门
        this.addDepartmentFrm.node = node;
        this.addDepartmentFrm.data = data;
      } else {
        // 添加同级部门
        this.addDepartmentFrm.node = data.parent && data.parent || {id: data.pid, level: 0};
        this.addDepartmentFrm.data = data;
      }
      this.departmentDialogVisible = true;
    },
    addDepartmentHandler() {
      this.$refs.addDepartmentFrm.validate(valid => {
        if (valid) {
          const params = {
            name: this.addDepartmentFrm.name,
            desc: this.addDepartmentFrm.desc,
            pid: this.next ? this.addDepartmentFrm.data.id : this.addDepartmentFrm.data.pid
          };
          this.addChild(params).then((res) => {
            try {
              this.$refs.tree.append({...params, id: res.data.id}, this.addDepartmentFrm.node);
            } catch (error) {
              throw Error(JSON.stringify(error));
            }
            this.loadNode(this.addDepartmentFrm.node);
            this.$refs.addDepartmentFrm.resetFields();
            this.departmentDialogVisible = false;
          }).catch(() => {
            this.$message.error('添加失败！');
            this.departmentDialogVisible = false;
          });
        }
      });
    },
    addChild(params) {
      return new Promise((resolve, reject) => {
        API_SECTION.add(params)
          .then(res => {
            this.$message.success('添加成功！请选择该部门去编辑添加部门成员');
            resolve(res);
          })
          .catch(() => reject());
      });
    },
    remove(node, data) {
      this.$confirm('删除该部门会同时删除部门下的所有子部门，是否确定删除该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API_SECTION.del(data.id).then(() => {
          this.$refs.tree.remove(node);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.currentNodeData = {};
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    onNodeClick(data, node, component) {
      this.currentNodeData = data;
      this.currentNode = node;
      this.name = this.currentNodeData.name;
      this.desc = this.currentNodeData.desc;
      this.getMerber();
      // API_SECTION.getChild(data.id).then(res => {
      //   if (res.data.result && res.data.result.length) {
      //     this.$refs.tree.append(...res.data.result, node);
      //   }
      // });
    },
    dataChange(value) {
      if (value) {
        const params = {
          id: this.currentNodeData.id,
          name: this.currentNodeData.name,
          desc: this.currentNodeData.desc
        };
        API_SECTION.modify(params);
      }
    },
    getMerber() {
      API_SECTION.getMerber(this.currentNodeData.id, this.queryParams)
        .then(res => {
          if (res.data && res.data.result) {
            this.userData = (res.data.result || []).map(item => {
              return {
                ...item,
                created_at: item.created_at * 1 > 0 ? parseTime(item.created_at) : '--'
              };
            });
            // this.checkedIds = this.tableData.map(item => item.id);
          }
        });
    },
    deleteHandler(item) {
      this.$confirm(`此操作将删除成员（${item.realname}）, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API_SECTION.delUser(this.currentNodeData.id, { users: JSON.stringify([item.id])})
          .then(() => {
            // this.init();
            this.getMerber();
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addMerber() {
      this.dialogVisible = true;
    },
    onMerberSave(data) {
      if (data && data.length) {
        const ids = Array.from(new Set(data.map(item => { return Number(item.id); })));
        this.onCancel();
        this.checkedIds = [];
        API_SECTION.addUser(this.currentNodeData.id, { users: JSON.stringify(ids)})
          .then(() => {
            // this.init();
            this.getMerber();
          });
      }
    },
    onCancel() {
      this.dialogVisible = false;
    },
    cancleSave() {
      this.disabled = true;
      const params = {
        id: this.currentNodeData.id,
        name: this.name,
        desc: this.desc
      };
      API_SECTION.modify(params).then(res => {
        this.loadNode(this.currentNodeData);
      });
    },
    sureCancle() {
      this.name = this.currentNodeData.name;
      this.desc = this.currentNodeData.desc;
      this.disabled = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.section-info {
  width: 1000px;
  padding: 10px;
  border-radius: 4px;
  margin-left:50px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    display: inline-block;
    width: 2px;
    height: 100%;
    background: #ccc;
    left: -40px;
    top: 0;
  }
}
</style>
