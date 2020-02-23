<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="container-content">
      <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 15px;">
        <el-step title="基本信息"></el-step>
        <el-step title="菜单权限"></el-step>
      </el-steps>
      <template  v-if="activeStep === 1">
        <!--<h3>基本信息</h3>-->
        <div>
          <el-form :model="formData" :rules="rules" class="form-account-base" ref="form">
            <el-form-item clearable label="角色名称" prop="role_name">
              <el-input v-model="formData.role_name" placeholder="请输入" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item clearable label="描述" prop="desc">
              <el-input type="textarea" v-model="formData.desc" placeholder="请输入" style="width: 220px;"></el-input>
            </el-form-item>
          </el-form>
          <div class="btns" style="margin-top: 20px;">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="next(1)">下一步</el-button>
          </div>
        </div>
      </template>
      <template v-if="activeStep === 2">
        <div style="margin-bottom: 20px">
          <el-button type="primary" @click="setTreeExpanded(true)">展开</el-button>
          <el-button type="primary" @click="setTreeExpanded(false)">收起</el-button>

          <template>
            <p>内容栏目功能模块统一操作</p>
            <el-checkbox v-model="contentModule[0]" @change="setTreeChecked($event,0)">详情</el-checkbox>
            <el-checkbox v-model="contentModule[1]" @change="setTreeChecked($event,1)">新增</el-checkbox>
            <el-checkbox v-model="contentModule[2]" @change="setTreeChecked($event,2)">更新</el-checkbox>
            <el-checkbox v-model="contentModule[3]" @change="setTreeChecked($event,3)">删除</el-checkbox>
          </template>
        </div>
        <!--<h3>菜单权限</h3>-->
        <el-tree
          ref="tree"
          :default-expand-all="viewAll"
          :data="treeData"
          :check-strictly="false"
          :props="props"
          node-key="id"
          :default-checked-keys="treeCheckedNodeIds"
          show-checkbox>
        </el-tree>
        <div class="btns" style="margin-top: 20px;">
          <el-button @click="next(-1)">上一步</el-button>
          <el-button type="primary" @click="saveJurisdiction">确定</el-button>
        </div>
      </template>
     </div>
  </div>
</template>

<script>
// import data from './data/menu.json';
import TreeMenu from '@/utils/treeMenu';
import { API_ROLE } from '@/api/setting';
import ColumnsApi from '@/api/contentPlatform/columns';
import { getContentColumnMenuFlat } from '@/router/columnRoutes';

export default {
  name: 'accountManageEdit',
  data() {
    return {
      action: this.$route.query.id ? 'modify' : 'add',
      pageLoading: false,
      activeStep: 1,
      haha: '',
      viewAll: false,
      treeCheckedNodeIds: [],
      treeData: [],
      activeName: 'base',
      contentModule: [false, false, false, false], // 初始化时，内容栏目功能模块的checkbox是否选中
      formData: {
        role_name: '',
        desc: ''
      },
      menu: '',
      props: {
        label: 'title',
        children: 'children'
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入角色名称描述', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      },
      role_id: 0,
      operationName: {
        'view': '详情',
        'create': '新增',
        'update': '更新',
        'delete': '删除',
        'import': '导入',
        'export': '导出',
        'audit': '审核'
      }
    };
  },
  mounted() {
    // const tree = new TreeMenu(data.data);
    // this.treeData = tree.getTree();
    // this.treeCheckedNodeIds = tree.getAllCheckedNode();
  },
  created() {
    this.role_id = this.$route.query.id || 0;
    this.getRoleInfo();
  },
  methods: {
    // 编辑时获取详情
    getRoleInfo() {
      this.pageLoading = true;
      if (this.action === 'add') return (this.pageLoading = false);
      API_ROLE.getFirst(this.$route.query.id).then(res => {
        const data = res.data;
        this.formData = (({role_name, desc}) => ({role_name, desc}))(data);
        this.pageLoading = false;
        this.getPermissions();
      }).catch(() => {
        this.pageLoading = false;
      });
    },
    getPermissions() {
      API_ROLE.permissions(this.role_id).then(res => {
        const permissions = res.data.permissions;
        const operates = res.data.operates;
        // 添加内容栏目菜单
        ColumnsApi.list({
          set_auth: 1 // 获取所有语言栏目
        }).then(res => {
          const columnFlat = getContentColumnMenuFlat(res, this.getContentColumnId(permissions));
          const dataList = permissions.concat(columnFlat);
          this.generateMenuTree(dataList, operates);
        });
      });
    },
    generateMenuTree(dataList, operates) {
      // 角色操作权限
      const roleOperatesSet = this.formatRoleOperate(operates);
      dataList = this.addOperatePermissions(dataList, roleOperatesSet);
      dataList = dataList.map(item => {
        item.title = item.title + (parseInt(item.is_menu) === 1 ? '' : '#');
        return item;
      });
      const tree = new TreeMenu(dataList);
      const treeData = tree.getTree();

      this.treeCheckedNodeIds = tree.getAllCheckedNode();
      this.treeData = treeData;

      // 获取内容模块统一操作的多选框是否选中
      treeData.map(item => {
        if (Number(item.id) === 610) {
          this.setContentModule(item.children);
        }
      });
    },
    getContentColumnId(asyncRouterMap) {
      for (const item of asyncRouterMap) {
        if (item.name === 'contentColumn') {
          return item.id;
        }
      }
    },
    setContentModule(data) { // 递归遍历子菜单看是否选中
      const child = data.find(item => {
        if (item.children.length !== 0) {
          this.setContentModule(item.children);
        } else {
          return item.checked === true;
        }
      });

      if (child && !this.contentModule[0]) {
        this.setContentChecked(data);
      }
    },
    setContentChecked(child) {
      child.map(item => {
        if (!item.checked) {
          return;
        }
        if (item.title.indexOf('详情') >= 0) {
          this.$set(this.contentModule, 0, true);
        }
        if (item.title.indexOf('新增') >= 0) {
          this.$set(this.contentModule, 1, true);
        }
        if (item.title.indexOf('更新') >= 0) {
          this.$set(this.contentModule, 2, true);
        }
        if (item.title.indexOf('删除') >= 0) {
          this.$set(this.contentModule, 3, true);
        }
      });
    },
    setTreeChecked(val, type) {
      // val返回true和false选中状态
      const treeRef = this.$refs.tree;

      // console.log(treeRef.getNode(610))
      this.setChildrensChecked(treeRef.getNode(610), type, val, treeRef);
    },
    setChildrensChecked(data, type, val, treeRef) { // 递归出，设置所有的详情/新增/更新/删除
      data.childNodes.map((item, index) => {
        if (item.childNodes.length !== 0) {
          this.setChildrensChecked(item, type, val, treeRef);
        } else if ((data.indeterminate || data.checked) && index === type) {
          treeRef.setChecked(data.childNodes[type].key, val, false);
        }
      });
    },
    addOperatePermissions(dataList, roleOperatesSet) {
      let nodes = [];
      // 根据节点具有的操作权限，生成绑定操作的节点
      for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        if (!data.operates) { continue; }

        const position = data.position;
        const operates = data.operates;
        const operateNodes = this.createOperateNodes(position, operates, data.id, roleOperatesSet);
        nodes = nodes.concat(operateNodes);
      }
      dataList = dataList.concat(nodes);
      return dataList;
    },
    createOperateNodes(position, operates, pid, roleOperatesSet) {
      const nodeOperates = operates.split(',');
      const operateNodes = [];
      for (let j = 0; j < nodeOperates.length; j++) {
        const checked = (!!roleOperatesSet[position] && roleOperatesSet[position].has(nodeOperates[j]));
        const title = this.getOperateName(nodeOperates[j]);
        operateNodes.push({
          type: 'operate',
          operate: nodeOperates[j],
          parentPosition: position,
          id: -Math.floor(Math.random() * 10000000) - 1000000,
          is_menu: '0',
          name: position,
          pid: pid,
          position: '',
          checked: checked,
          title: title
        });
      }
      return operateNodes;
    },
    getOperateName(operate) {
      let title = this.operationName[operate];
      if (!title) {
        title = '操作' + operate;
      }
      return title;
    },
    formatRoleOperate(roleOperates) {
      const roleOperatesSet = {};
      for (const key in roleOperates) {
        if (roleOperates.hasOwnProperty(key)) {
          roleOperatesSet[key] = new Set(roleOperates[key].split(','));
        }
      }
      return roleOperatesSet;
    },
    next(data) {
      if (data === 1) {
        this.$refs.form.validate(validate => {
          if (validate) {
            this.saveInfo();
          }
        });
      } else {
        this.activeStep += Number(data);
      }
    },
    cancel() {
      this.$confirm('确定要放弃修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back();
      }).catch();
    },
    saveInfo() {
      const formData = Object.assign({}, this.formData);
      (this.action === 'modify' ? API_ROLE.modify({
        id: this.$route.query.id,
        ...formData
      }) : API_ROLE.add(formData))
        .then(res => {
          if (this.action !== 'modify') {
            this.role_id = res.data.id;
            this.getPermissions();
          }
          this.activeStep += 1;
        });
    },
    saveJurisdiction() {
      const {data, operates} = this.makeSaveParameters();
      console.log('checkedNodes', data, operates);
      API_ROLE.modifyPermission({
        id: this.role_id,
        permissions: JSON.stringify(data),
        operates: JSON.stringify(operates)
      }).then(() => {
        this.$router.back();
      });
    },
    makeSaveParameters() {
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true);
      const data = checkedNodes.filter(item => item.type !== 'operate').map(item => item.position);
      const operates = {};
      checkedNodes.filter(item => item.type === 'operate').map(item => {
        if (!operates[item.parentPosition]) {
          operates[item.parentPosition] = item.operate;
        } else {
          operates[item.parentPosition] += (',' + item.operate);
        }
      });

      return {data: data, operates: operates};
    },
    setTreeExpanded(expanded = true) {
      console.log('setTreeExpanded', expanded);
      const nodes = this.$refs.tree.store._getAllNodes();
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].expanded = expanded;
      }
      this.viewAll = expanded;
      console.log('setTreeExpanded success', expanded);
    }
  }
};
</script>

<style>
  .form-account-base .el-form-item__label {
    display: inline-block;
    width: 120px;
    text-align: left;
  }
  .container-content{
    width: 60%;
  }
</style>
