<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="title" label="角色名称">
        <el-input
          v-model="groupFrm.title"
          name="title"
          :clearable="true"
          placeholder="请输入角色名称">
        </el-input>
      </el-form-item>
      <el-form-item label="功能权限">
        <el-tree
          :data="funData"
          show-checkbox
          node-key="id"
          ref="tree"
          default-expand-all
          :default-checked-keys="arrData"
          :props="defaultProps">
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Configure from '@/api/contentPlatform/configure';

  export default {
    name: 'contentEditorRole',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        arrData: [], // 默认选中
        groupFrm: {
          id: this.$route.params.id,
          title: '', // 角色名称
          rules: []
        },
        funData: [],
        pageLoading: true,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        frmRules: {
          title: [
            {
              required: true, message: '请输入角色名称'
            }
          ]
        }
      };
    },
    created() {
      this.pageLoading = true;
      if (this.action === 'modify') {
        this.getData();
      }
      Configure.role.nodes().then(res => {
        this.funData = res.nodes;
        this.pageLoading = false;
      });
    },
    methods: {
      getData() { // 获取数据
        Configure.role.get(this.$route.params.id).then(res => {
          this.arrData = res.checked;
          this.groupFrm.title = res.role_name;
        });
      },
      save() {
        const data = this.$refs.tree.getCheckedKeys();
        let arr = [];
        if (data.length > 0) {
          arr.push('1');
        }
        if (data.length >= 66) {
          arr = data;
        } else {
          data.forEach(item => {
            if (item.length > 3) {
              const i = item.substring(0, 3);
              if (!arr.includes(i)) {
                arr.push(i);
              }
            }
            if (item.length > 5) {
              const i = item.substring(0, 5);
              if (!arr.includes(i)) {
                arr.push(i);
              }
            }
            if (item.length > 7) {
              const i = item.substring(0, 7);
              if (!arr.includes(i)) {
                arr.push(i);
              }
            }
            if (!arr.includes(item)) {
              arr.push(item);
            }
          });
        }
        const obj = {
          id: this.groupFrm.id,
          role_name: this.groupFrm.title,
          real: arr,
          fake: data
        };
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Configure.role.edit(obj)
              : Configure.role.add(obj)).then(() => {
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
