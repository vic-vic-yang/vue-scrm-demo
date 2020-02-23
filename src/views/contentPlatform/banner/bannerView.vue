<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:36:22
 * @LastEditTime: 2019-11-14 16:34:00
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="taskFrm" :model="taskFrm">
        <el-form-item>
          <el-button type="primary" @click="createActivity">新建banner</el-button>
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
      @page-change="pageChangeHandler"
      @cell-click="cellClick"
      @blurInput="blurInputHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import BannerApi from '@/api/contentPlatform/banner';
  import customElTable from '@/components/customElTable';

  export default {
    name: 'taskOverview',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 100
          },
          {
            label: '图片预览',
            prop: 'banner_img',
            options: {
              type: 'html'
            }
          },
          {
            label: '权重',
            prop: 'weight',
            max: 1000,
            editAble: true,
            showInput: false,
            type: 'Number'
          },
          {
            prop: 'USER_ACTION',
            width: 300,
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
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        taskFrm: {
          type: '',
          name: '',
          time: '',
          status: ''
        },
        query: null,
        statusOptions: [
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 2
          }
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        };
        BannerApi.list(params).then(res => {
          this.tableData = (res.result || []).map((item, itemIndex) => {
            let statusCh = '';
            item.itemIndex = itemIndex; // 为了区分不同活动相同id在同一页
            if (Number(item.status) === 1) {
              statusCh = '启用';
            } else if (Number(item.status) === 2) {
              statusCh = '隐藏';
            } else if (Number(item.status) === 0) {
              statusCh = '禁用';
            }
            item.weight = Number(item.weight);
            item.status = Number(item.status);
            return {
              ...item,
              old_weight: item.weight,
              statusCh,
              banner_img: item.cover ? `<img style="max-width: 120px;height: auto" src="${item.cover}"/>` : ''

            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
  
      createActivity() {
        this.$router.push({ name: 'editBanner' });
      },
      editHandler(info) {
        this.$router.push({ name: 'editBanner', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除banner <b>序号=${info.id}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BannerApi.del({
            id: info.id
          }).then(() => {
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          var disableMessage = `确认${title}banner <b>序号=${info.id}</b> 吗？`;
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            BannerApi.status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            }).then(res => {
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
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
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '启用'
          };
        }
        const status = item.status * 1;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          }
          : {
            btn: 'primary',
            label: '启用'
          };
      },
      cellClick(index, column) {
        this.tableDataIndex = index;
        var isEditAble = this.tableOptions.some((item, idx) => {
          if (item.prop === column && item.editAble) {
            this.idx = idx;
            return true;
          } else {
            return false;
          }
        });
        if (isEditAble) {
          this.tableOptions[this.idx].showInput = true;
        }
      },
      // 监听失去焦点事件
      blurInputHandler(scope, value) {
        console.log();
        if (value > this.tableOptions[2].max) {
          value = this.tableOptions[2].max;
        }
        // 隐藏input输入框，并给weights赋值
        this.tableOptions[this.idx].showInput = false;
        if (Number(value) === Number(scope.row.old_weight)) {
          return;
        }
        const params = {
          id: scope.row.id,
          weight: value
        };
        BannerApi.weight(params).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.tableDataIndex = undefined;
          this.getData();
        });
      }
    }
  };
</script>


<style scoped>
</style>
