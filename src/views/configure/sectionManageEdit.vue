<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base"></el-tab-pane>
      <!-- <el-tab-pane label="部门成员" name="merber"></el-tab-pane> -->
    </el-tabs>
    <div class="container-content">
      <div class="section-info" v-if="activeName === 'base'">
        <div style="display:flex;align-items: center;">
          <span class="label">部门名：</span>
          <el-input v-model="detail.name" style="width: 220px;" clearable></el-input>
        </div>
        <div style="margin-top: 15px;display:flex;align-items: center;">
          <span class="label">部门描述：</span>
          <el-input v-model="detail.desc" style="width: 220px;" type="textarea" clearable></el-input>
        </div>
      </div>
      <div v-if="activeName === 'merber'">
        <div>
          <el-button type="primary" @click="addMerber"><i class="el-icon-plus"></i>新增成员</el-button>
          <h4>部门成员</h4>
          <custom-el-table
            v-loading="tabLoading"
            :tableData="tableData"
            :tableOptions="tableOptions"
            @delete="deleteHandler">
          </custom-el-table>
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
    <dialog-merber :dialogVisible="dialogVisible" :id="id" :checkedIds="checkedIds" @submit="onMerberSave" @cancel="onCancel"/>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import dialogMerber from './components/dialogMerber.vue';
import { API_SECTION } from '@/api/setting';
export default {
  name: 'accountManageList',
  components: {
    dialogMerber,
    customElTable
  },
  data() {
    return {
      dialogVisible: false,
      tabLoading: false,
      tableData: [],
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
      checkedIds: [],
      activeName: 'base',
      id: '',
      queryParams: {
        page_index: 1,
        page_size: 1000
      },
      detail: {}
    };
  },
  created() {
    const data = this.$route.params;
    this.id = data.id || '';
    if (this.id) {
      this.getDetail();
      this.getMerber();
    }
  },
  methods: {
    onCancel() {
      this.dialogVisible = false;
    },
    init() {},
    onMerberSave(data) {
      const ids = Array.from(new Set(this.tableData.concat(data).map(item => item.id)));
      this.onCancel();
      API_SECTION.setUser(this.id, { users: JSON.stringify(ids)})
        .then(() => {
          this.init();
          this.getMerber();
        });
    },
    addMerber() {
      this.dialogVisible = true;
    },
    getMerber() {
      API_SECTION.getMerber(this.id, this.queryParams)
        .then(res => {
          if (res.data && res.data.result) {
            this.tableData = res.data.result;
            this.checkedIds = this.tableData.map(item => item.id);
          }
        });
    },
    findIndex(obj, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (obj.id === arr[i].id) {
          return i;
        }
      }
      return -1;
    },
    deleteHandler(item) {
      this.$confirm('此操作将删除该部门成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.findIndex(item, this.tableData);
        if (index !== -1) {
          this.tableData.splice(index, 1);
        } else {
          console.error('没有找到该条记录');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    submit() {
      const Ids = Array.from(new Set(this.tableData.map(item => item.id)));
      const params = {
        id: this.id,
        name: this.detail.name,
        desc: this.detail.desc
      };
      if (this.id) {
        API_SECTION.modify(params).then(res => {
          API_SECTION.setUser(this.id, {users: JSON.stringify(Ids)}).then(() => {
            this.$router.push({name: 'sectionManage'});
          });
        });
      } else {
        API_SECTION.add(params).then(res => {
          this.$message.success('添加成功！');
          // this.treeData.push({...this.defaultData, id: res.data.id});
          this.$router.push({name: 'sectionManage'});
          // this.afterSave();
        });
      }
    },
    afterSave() {
      if (this.activeName === 'merber') {
        this.$router.back();
        // this.$router.push({name: 'sectionManage'});
      }
      // this.activeName = 'merber';
    },
    nextStep() {
      this.activeName = 'merber';
    },
    getDetail() {
      API_SECTION.getDetail(this.id)
        .then(res => {
          this.detail = res.data;
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.section-info {
  width: 400px;
  padding: 10px;
  border-radius: 4px;
  margin-left:10px;
  position: relative;
  .label {
    display: inline-block;
    width: 90px;
    text-align: left;
  }
}

.btns {
  margin-top: 20px;
}
</style>
