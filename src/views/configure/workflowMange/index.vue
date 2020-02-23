<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="searchQueryFrm" :model="searchQueryFrm">
        <el-form-item v-if="false">
          <el-button type="primary" @click="createHandler">状态管理</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="workFlow">
      <el-tree
        ref="tree"
        node-key="id"
        :load="loadNode"
        lazy
        :props="props"
        :data="treeData">
        <div class="custom-tree-node" slot-scope="{ node, data }">
         <span>{{ node.label }}</span>
          <span class="operation">
             <el-button operate="create"
               type="text"
               size="mini"
               @click="() => editHandler(node, data)">
              编辑
            </el-button>
          </span>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import { API_SECTION } from '@/api/setting';
  import WORKFLOW from '@/api/configure/workflow';
  export default {
    name: 'index',
    components: {},
    data() {
      return {
        tabLoading: true,
        searchQueryFrm: {},
        department_id: 0,
        treeData: [],
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        workflow: []
      };
    },
    created() {
    },
    methods: {
      loadNode(node, resolve) {
        const id = node.level === 0 ? 0 : node.data.id;
        API_SECTION.getChild(id).then(res => {
          if (res.data.result && res.data.result.length) {
            res.data.result.forEach(item => {
              item.leaf = ~~item.child_count === 0;
            });
            resolve(res.data.result);
          } else {
            resolve([]);
          }
        });
      },
      editHandler(node, info) {
        WORKFLOW.works.list({
          department_id: info.id
        }).then(res => {
          this.workflow = res;
          if (this.workflow && this.workflow.length) {
            this.tips = '编辑';
            this.$router.push({ name: 'modifyWorkflow', params: { id: this.workflow[0].id }, query: {department_id: info.id}});
          } else {
            this.tips = '新增';
            this.$router.push({ name: 'createWorkflow', params: { id: this.workflow[0].id }, query: {department_id: info.id}});
          }
        });
        // this.$router.push({ name: 'workflowTemplateMange', params: { id: info.id }});
      },
      createHandler() {
        this.$router.push({ name: 'workflowStateMange' });
      }
    }
  };
</script>

<style scoped>
  .workFlow{
    width: 60%;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding: 0 8px 0 0;
  }
  .operation{
    float: right;
  }
</style>
