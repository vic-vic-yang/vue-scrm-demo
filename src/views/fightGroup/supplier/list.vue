<template>
  <div class="app-container commodity-list">
    <div class="control-group">
      <el-form :inline="true" ref="supplierQueryFrm" :model="supplierQueryFrm">
        <el-form-item prop="name" label="供应商">
          <el-input placeholder="供应商名称" v-model="supplierQueryFrm.name"></el-input>
        </el-form-item>
        <el-form-item prop="total_num" label="商品数">
           <el-input style="width: 120px"
            v-model="supplierQueryFrm.goods_min" type="number" :maxlength="20">
          </el-input>
          <span class="mh-5">-</span>
          <el-input style="width: 120px"
            v-model="supplierQueryFrm.goods_max" type="number" :maxlength="20">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSupplierList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createSupplier">
            <i class="fs-13 el-icon-plus mr-5"></i>添加供应商
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table v-loading="tabLoading" v-model="pageIndex" :tableData="tableData" :tableOptions="tableOptions"
      :total="totalCount" @edit="editHandler" @delete="deleteHandler" @size-change="sizeChangeHandler" @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import SuppliersApi from '@/api/integralMall/suppliers';
  import _ from 'lodash';
  import {
    parseTime
  } from '@/utils';

  export default {
    name: 'supplier-list',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '供应商',
            prop: 'name'
          },
          {
            label: '商品数',
            prop: 'goods_num'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 200,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        supplierQueryFrm: {
          name: '',
          goods_min: '',
          goods_max: ''
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        SuppliersApi.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            return {
              ...item,
              create_time: (item.created_at === '' || item.created_at * 1 === 0) ? '--' : parseTime(item.created_at)
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        }).catch(err => {
          this.$message({
            type: 'info',
            message: err.message
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
      searchSupplierList() {
        this.query = _.cloneDeep(this.supplierQueryFrm);
        console.log(this.query);
        this.pageIndex = 1;
        this.getData();
      },
      editHandler(info) {
        this.$router.push({
          name: 'supplierModify',
          params: {
            id: info.id
          }
        });
      },
      createSupplier() {
        this.$router.push({
          name: 'supplierCreate'
        });
      },
      deleteHandler(info) {
        this.$confirm(`确认删除供应商 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          SuppliersApi.del(info.id)
            .then(() => {
              this.$message({
                type: 'success',
                message: `已删除商品${info.name}`
              });
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

<style>
</style>
