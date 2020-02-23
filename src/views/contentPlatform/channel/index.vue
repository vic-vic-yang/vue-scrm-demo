<template>
      <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>新建频道
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @edit="editHandler"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>  
</template>

<script>
import customElTable from '@/components/customElTable';
import Channel from '@/api/contentPlatform/channel';

export default {
  name: 'contChannel',
  components: {
    customElTable
  },
  data() {
    return {
      tableData: [
        {
          id: '001',
          name: '频道',
          describe: '描述',
          index: 0
        }
      ],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      tableOptions: [
        {
          label: '序号',
          prop: 'id',
          width: 120
        },
        {
          label: '频道名称',
          prop: 'channel_name'
        },
        {
          label: '排列顺序',
          prop: 'sort'
        },
        {
          label: '频道描述',
          prop: 'description'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'edit',
            'del',
            {
              type: 'moveTopTask',
              options: this.getTaskTopBtnInfo,
              disableds: this.ifTopDisabled
            },
            {
              type: 'moveButtomTask',
              options: this.getTasButtomkBtnInfo,
              disableds: this.ifButtomDisabled
            }
          ]
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tabLoading = true;
      Channel.applet.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(data => {
        data.result.forEach((item, index) => {
          if (index === 0) {
            item.ifTopDisabled = true;
          } else {
            item.ifTopDisabled = false;
          }
          if (index === data.length - 1) {
            item.ifButtomDisabled = true;
          } else {
            item.ifButtomDisabled = false;
          }
        });
        this.tableData = data.result;
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      }).catch(() => {
        this.tabLoading = false;
      });
    },
    actionHandler(type, info) {
      if (type === 'moveTopTask') {
        Channel.applet.status({ id: info.id, type: 2 }).then(() => {
          this.getData();
        });
      } else if (type === 'moveButtomTask') {
        Channel.applet.status({ id: info.id, type: 1 }).then(() => {
          this.getData();
        });
      }
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
    ifTopDisabled(item) { // 是否禁用上移
      if (!item) {
        return false;
      }
      return item.ifTopDisabled;
    },
    ifButtomDisabled(item) { // 是否禁用下移
      if (!item) {
        return false;
      }
      return item.ifButtomDisabled;
    },
    getTaskTopBtnInfo(item) { // 操作按钮的样式
      if (!item) {
        return {
          btn: 'primary',
          label: '上移'
        };
      }
      return {
        btn: 'primary',
        label: '上移'
      };
    },
    getTasButtomkBtnInfo(item) { // 操作按钮的样式
      if (!item) {
        return {
          btn: 'primary',
          label: '下移'
        };
      }
      return {
        btn: 'primary',
        label: '下移'
      };
    },
    createGame() { // 新增
      this.$router.push({ name: 'addChannel' });
    },
    editHandler(info) { // 修改
      this.$router.push({
        name: 'modifyChannel',
        params: {
          id: info.id
        }
      });
    },
    deleteHandler(info) { // 删除
      this.$confirm(`确认删除频道 <b>${info.channel_name}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Channel.applet.del(info.id)
          .then(() => {
            this.getData();
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style scoped>

</style>

