<template>
  <div class="app-container">
    <div>
      <div>
        <el-button type="primary"
                   @click="tagAdd">新建标签</el-button>
      </div>
      <custom-el-table v-loading="tabLoading"
                       v-model="pageIndex"
                       :tableData="tableData"
                       :tableOptions="tableOptions"
                       :total="totalCount"
                       @edit="editHandler"
                       @delete="deleteHandler"
                       @action="actionHandler"
                       @size-change="sizeChangeHandler"
                       @page-change="pageChangeHandler"
                       style="width: 600px;"
                       class="mt-20">
      </custom-el-table>
    </div>
    <dialog-tag :edit="edit"
                :tag="tag"
                :dialogShow="dialogShow"
                :handleClose="handleClose" />
  </div>
</template>
<script>
import Works from '@/api/vote/works';
import dialogTag from './dialogTag';
import customElTable from '@/components/customElTable';
export default {
  name: '',
  props: {
  },
  mixins: [],
  components: { customElTable, dialogTag },
  data() {
    return {
      tag: {},
      dialogShow: false,
      edit: false,
      tabLoading: false,
      tableData: [],
      tableOptions: [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '标签名称',
          prop: 'name',
          width: 80
        },
        {
          label: '状态',
          prop: 'statusText'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            'edit',
            {
              type: 'status',
              options: this.getStatusBtnInfo
            },
            'del'
          ]
        }
      ],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 1
    };
  },
  created() { },
  mounted() {
    this.getData();
  },
  methods: {
    getStatusBtnInfo(item) {
      if (!item) {
        return {
          btn: 'danger',
          label: '禁用'
        };
      }
      const status = item.status * 1;
      return {
        btn: status === 2 ? 'primary' : 'danger',
        label: status === 1 ? '禁用' : '启用'
      };
    },
    tagAdd() {
      this.edit = false;
      this.dialogShow = true;
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
    getData() {
      const obj = {
        page_index: this.pageIndex,
        page_size: this.pageSize
      };
      Works.tags(obj)
        .then(res => {
          this.totalCount = parseInt(res.totalCount);
          this.tableData = res.result;
          this.tableData.forEach((item, index) => {
            item.statusText = ~~item.status === 1 ? '启用' : '禁用';
            item.index = index + 1;
          });
        });
    },
    handleClose() {
      this.dialogShow = false;
      this.getData();
    },
    editHandler(info) {
      this.tag = info;
      this.edit = true;
      this.dialogShow = true;
    },
    deleteHandler(info) {
      const tips = '确定要删除该标签吗';
      this.$confirm(tips, '是否确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Works.tagDel(info.id)
          .then(() => {
            this.getData();
          });
      });
    },
    actionHandler(type, info) {
      const that = this;
      switch (type) {
        case 'status':
          enable(info);
          break;
      }
      function enable(item) {
        const status = ~~info.status === 1 ? 2 : 1;
        let tips = '确定要启用该标签吗';
        if (~~info.status === 1) {
          tips = '确定要禁用该标签吗';
        }
        that.$confirm(tips, '是否确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Works.tagStatus(info.id, status)
            .then(() => {
              that.$message.success('操作成功');
              that.getData();
            });
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
