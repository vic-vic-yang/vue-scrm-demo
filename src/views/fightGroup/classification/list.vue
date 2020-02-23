<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="classQueryFrm" :model="classQueryFrm">
        <el-form-item prop="grouping" label="分组" v-if="false">
          <el-select placeholder="全部" clearable v-model="classQueryFrm.grouping">
            <el-option
              v-for="item in groupingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sell_num" label="商品数" v-if="false">
          <el-input style="width: 80px" v-model.number="classQueryFrm.sell_num[0]"></el-input>
          <span class="mh-5">-</span>
          <el-input style="width: 80px" v-model.number="classQueryFrm.sell_num[1]"></el-input>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button type="primary" @click="searchCommodityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('classQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createCommodity" icon="el-icon-plus">新建分组</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @blurInput="blurInputHandler"
      @cell-click="cellClick"
      @popoverHandler="popoverHandler"
      @edit="editHandler"
      @delete="deleteHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import classification from '@/api/fightGroup/classification';
  import { parseTime } from '@/utils';

  export default {
    name: 'list',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '分组编号',
            prop: 'id',
            width: 80
          },
          {
            label: '类目名称',
            prop: 'name'
          },
          {
            label: '商品数量',
            prop: 'total'
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
            label: '创建时间',
            prop: 'create_time',
            sortable: true
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'edit',
                btn: 'primary',
                label: '编辑',
                disableds: (item) => {
                  return item.id * 1 === 1;
                }
              },
              {
                type: 'del',
                btn: 'danger',
                label: '删除',
                disableds: (item) => {
                  return item.id * 1 === 1;
                }
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        classQueryFrm: {
          grouping: '',
          sell_num: []
        },
        query: null,
        groupingOptions: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '出售中',
            value: 1
          },
          {
            label: '已售罄',
            value: 2
          },
          {
            label: '仓库中',
            value: 3
          }
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        classification.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
              disabled: item.id * 1 === 1
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      popoverHandler(scope, value) {
        if (Number(value) < 0) {
          this.$message({
            type: 'error',
            message: `最小只能输入0`
          });
          return;
        }
        const params = {
          id: scope.row.id,
          weight: value
        };
        classification.setWeight(params).then(res => {
          if (res.status) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.tableDataIndex = 1;
            this.getData();
          } else {
            this.$message.error(res.message);
          }
        });
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.classQueryFrm);
        const sell_num = this.query.sell_num || [];
        this.$set(this.query, 'sell_num_min', sell_num[0]);
        this.$set(this.query, 'sell_num_max', sell_num[1]);
        this.pageIndex = 1;
        this.getData();
      },
      createCommodity() {
        this.$router.push({ name: 'classificationCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'classificationModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除分类 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          classification.del({id: info.id}).then(res => {
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
