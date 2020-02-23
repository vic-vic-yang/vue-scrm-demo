<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="dataView" :model="dataView">
        <el-form-item prop="app_name" label="小程序名">
          <el-input placeholder="小程序名" v-model="dataView.app_name"></el-input>
        </el-form-item>
        <el-form-item prop="app_key" label="app_key">
          <el-input placeholder="app_key" v-model="dataView.app_key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAldList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('dataView')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createCommodity">
            <i class="fs-13 el-icon-plus mr-5"></i>新增数据
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
      @action="actionHandler"
      @edit="editHandler"
      @delete="deleteHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import ald from '@/api/aldInterface';
  import _ from 'lodash';

  export default {
    name: 'dataView',
    data() {
      return {
        dataView: {
          app_name: '',
          app_key: ''
        },
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '小程序名称',
            prop: 'app_name'
          },
          {
            label: 'app_key',
            prop: 'app_key'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '创建者',
            prop: 'create_user_name'
          },
          {
            label: '修改时间',
            prop: 'update_time',
            sortable: true,
            width: 160,
            className: 'ph-6'
          },
          {
            label: '修改者',
            prop: 'update_user_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              // {
              //   type: 'see',
              //   options: this.seeDataView
              // },
              {
                type: 'see',
                label: '查看'
              },
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
        query: null,
        tabLoading: true
      };
    },
    components: {
      customElTable
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        ald.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          res.result.update_user_name = (res.result.update_user_name || res.result.update_user_name !== '') ? res.result.update_user_name : '无';
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              update_user_name: item.update_user_name !== '' ? item.update_user_name : '无',
              app_name: item.app_name !== '' ? item.app_name : '未知'
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchAldList() {
        this.query = _.cloneDeep(this.dataView);
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'see') {
          var href = `http://tongji.aldwx.com/publice/miniapp-day?app_key=${info.app_key}&auth_type=0`;
          // var href = 'http://tongji.aldwx.com/publice/miniapp-day?app_key=163c71a2214123d1c660662af7ca3111&auth_type=0';
          window.open(href, '_blank');
        } else if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          this.$confirm(`确认立即${title}商品 <b>${info.app_name}</b>数据统计 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ald.status(info.id, info.status).then((res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'info',
                  duration: 1500,
                  message: `${info.status * 1 === 1 ? '启用' : '禁用'}成功!`
                });
                setTimeout(() => {
                  this.getData();
                }, 1000);
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        }
      },
      createCommodity() {
        this.$router.push({ name: 'fightGroupDataViewSetting' });
      },
      editHandler(info) {
        this.$router.push({ name: 'fightGroupDataViewModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除此条数据配置吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ald.del(info.id).then(() => {
            this.getData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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
            label: '启用'
          } : {
            btn: 'primary',
            label: '禁用'
          };
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>
  .ald_view{
    width: 100%;
    /*height: 1700px;*/
    height: 1200px;
  }
</style>
