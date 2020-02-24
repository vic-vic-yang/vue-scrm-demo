<template>
  <div class="app-container">
    <div class="control-group">
      <el-button type="primary" @click="$router.push({ name: 'subscribeManagement' });">订阅管理</el-button>
      <el-button @click="deleteHandler" type="danger">解除</el-button>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @handleSelectionChange="handleSelectionChange"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import {parseTime} from '@/utils/index';
import API from '@/api/contentPlatform/subscribe';

export default {
  name: 'contentUser',
  components: {
    customElTable
  },
  data() {
    return {
      searchKey: {
        type: '文章',
        platform: '微信公众号',
        keyword: ''
      },
      query: null,
      tableOptions: [
        {
          label: '',
          prop: 'SELECTION',
          align: 'center'
        },
        {
          label: '订阅类型',
          prop: 'content_type'
        },
        {
          label: '订阅平台',
          prop: 'source_type'
        },
        {
          label: '名称',
          prop: 'mp_name'
        },
        {
          label: '发布模式',
          prop: 'publish_type'
        },
        {
          label: '订阅时间',
          prop: 'create'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              label: '解除',
              type: 'del'
            },
            {
              label: '编辑',
              type: 'detail'
            }
          ]
        }
      ],
      tableData: [],
      selectData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tableData = [
        {
          id: 1,
          name: '张三',
          nickname: '微信昵称',
          phone: '12312312321',
          address: '成都市武侯区天府二街'
        }
      ];
      this.tabLoading = true;
      API.subscribed({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
        .then(data => {
          this.dataChange(data.result); // 转换数据
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    dataChange(data) {
      data.forEach(item => {
        switch (item.content_type) {
          case '1':
            item.content_type = '文章';
            break;
        }
        switch (item.source_type) {
          case '1':
            item.source_type = '微信公众号';
            break;
        }
        switch (item.publish_type) {
          case '1':
            item.publish_type = '手动';
            break;
          default:
            item.publish_type = '自动';
            break;
        }
        item.create = parseTime(item.create);
      });
    },
    actionHandler(type, info) {
      if (type === 'detail') {
        // 查看详情
        this.$router.push({
          name: 'contentSubscribeEdit',
          params: { id: info.id }
        });
      }
    },
    handleSelectionChange(data) {
      console.log(data);
      const arr = [];
      data.forEach(item => {
        arr.push(item.id);
      });
      this.selectData = arr;
    },
    deleteHandler(info) {
      let msg = '';
      let gather_id = '';
      // 删除单个
      if (info.id) {
        msg = `确认解除 <b>${info.mp_name}</b> 吗？`;
        gather_id = info.id;
      } else {
        // 删除多个
        if (this.selectData.length === 0) {
          this.$message({
            type: 'info',
            message: '请选择订阅项目'
          });
          return;
        }
        msg = `确认解除所有已选择的订阅吗？`;
        gather_id = this.selectData.join();
      }
      this.$confirm(msg, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.delete({
          gather_id: gather_id
        })
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '解除成功!'
              });
              this.getData(); // 重新拉数据
            } else {
              this.$message({
                type: 'error',
                message: '解除失败!'
              });
            }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.control-group {
  text-align: right;
  margin-bottom: 20px;
}
</style>

