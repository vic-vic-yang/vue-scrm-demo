<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="searchQueryFrm" :model="searchQueryFrm">
        <el-form-item prop="name" label="栏目名称">
          <el-input placeholder="栏目名称" v-model="searchQueryFrm.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('searchQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button operate="create" type="primary" @click="createHandler">
            <i class="fs-13 el-icon-plus mr-5"></i> 新增
          </el-button>
          <el-button type="primary" @click="weightHandler">栏目图片展示配置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="deleteHandler"
      @action="actionHandler"
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>

    <add-column :show="addColumnShow"
                :id="id"
                :relationData="JSON.stringify(tableData)"
                @closed="addColumnShow = false"
                @addColumnHandler="addColumnHandler"/>
    <weight :show="showWeight"
            :name="$route.meta.title"
            :number="number"
            @closed="showWeight = false"
            @saveWeight="saveWeight"/>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import MININAVIGATION from '@/api/contentPlatform/miniNavigation';
  import addColumn from './editor';
  import weight from './weight';

  export default {
    name: 'competition',
    components: {
      customElTable,
      addColumn,
      weight
    },
    data() {
      return {
        tableOptions: [
          {
            label: '栏目ID',
            prop: 'id',
            width: 80
          },
          {
            label: '栏目名称',
            prop: 'name'
          },
          {
            label: '权重',
            prop: 'weight',
            max: 100,
            options: {
              type: 'edit'
            }
          },
          {
            label: '是否展示图片',
            prop: 'show_pic_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        searchQueryFrm: {
          name: ''
        },
        query: null,
        addColumnShow: false,
        showWeight: false,
        id: 1, // 1:比赛中心 2参与其中 3关于我们',
        number: '' //  权重配置
      };
    },
    created() {
      this.id = this.$route.meta.id;
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        setTimeout(() => {
          this.tabLoading = false;
        }, 1500);
        MININAVIGATION.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          id: this.id,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              show_pic_name: item.show_pic * 1 !== 0 ? '展示' : '不展示',
              weight: item.weight || 0
            };
          });
          this.number = res.number;
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
      },
      weightHandler() {
        this.showWeight = true;
      },
      saveWeight(data) {
        MININAVIGATION.limit({
          id: this.id,
          ...data
        }).then(() => {
          this.$message({
            type: 'success',
            message: '权重配置成功！'
          });
          this.getData();
        });
        this.showWeight = false;
      },
      popoverHandler(scope, value) {
        var weight = Number(value);
        if (weight < 0) {
          this.$message({
            type: 'error',
            message: `最小只能输入0`
          });
          return;
        }
        const params = {
          column_id: scope.row.id,
          id: this.id,
          weight
        };
        MININAVIGATION.weight(params).then(() => {
          this.$message({
            type: 'success',
            message: '修改权重成功！'
          });
          this.getData();
        });
      },
      addColumnHandler(data) {
        var column_id = data.map(item => item.id);
        MININAVIGATION.add({
          column_id,
          id: this.id
        }).then(() => {
          this.getData();
        });
        this.addColumnShow = false;
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createHandler() {
        this.addColumnShow = true;
      },
      deleteHandler(info) {
        var delMessage = `确认删除栏目 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          MININAVIGATION.del({
            columnId: info.id,
            id: this.id
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
