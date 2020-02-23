<template>
  <div class="app-container">
    <!-- <el-button type="text" @click="addRootChild(defaultData)">添加+</el-button> -->
    <div style="display:flex;">
      <el-tree
        style="width: 350px;"
        ref="tree"
        node-key="id"
        :load="loadNode"
        lazy        
        @node-click="onNodeClick"
        :props="props"
        :data="treeData">
      </el-tree>
      <div class="section-info">
        <p>
          <span>当前部门：</span>
          <span>{{currentSection.name}}</span>
        </p>
        <p>
          <span>更改为：</span>
          <span style="color: rgb(64, 158, 255);font-weight: 600;">{{currentNodeData.name}}</span>
        </p>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>    
  </div>
</template>

<script>
import { API_SECTION, API_USER } from '@/api/setting';
export default {
  name: 'accountManageList',
  data() {
    return {
      currentNodeData: {
        label: '',
        desc: ''
      },
      treeData: [
      ],
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      id: '',
      currentSection: {}
    };
  },
  created() {
    this.id = this.$route.params.id || '';
  },
  mounted() {
    this.getUserSection();
  },
  methods: {
    cancel() {
      this.$router.push({name: 'accountManageList'});
    },
    submit() {
      if (!this.currentNodeData.id) {
        this.cancel();
      } else {
        const params = {
          id: this.id,
          department_id: this.currentNodeData.id
        };
        API_USER.modifySection(params)
          .then(() => {
            this.$message.success('修改成功');
            this.cancel();
          });
      }
    },
    getUserSection() {
      API_USER.getSection(this.id)
        .then(res => {
          if (res.data && res.data.length) {
            this.currentSection = res.data.pop();
          }
        });
    },
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
    init() {
      this.treeData = [];
    },
    getRootSection() {
      API_SECTION.getChild().then(res => {
        this.treeData.push(...res.data.result);
      });
    },
    onNodeClick(data, node, component) {
      this.currentNodeData = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.section-info {
  border: 1px solid #ccc;
  width: 200px;
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
.btns {
  margin-top: 20px;
}
</style>