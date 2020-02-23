<template>
  <el-dialog title="选择商品" :visible.sync="dialogSelectCommodityVisible" class="select-commodity-dialog">
    <div class="control-group">
      <el-form :inline="true" :model="commodityQueryFrm" size="mini">
        <el-form-item label="商品名">
          <el-input placeholder="商品名" v-model="commodityQueryFrm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select placeholder="全部" clearable v-model="commodityQueryFrm.choose_status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCommodityList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createCommodity">
            <i class="fs-13 el-icon-plus mr-5"></i>发布商品
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
      :pageSizes="[]"
      :size="pageSize"
      maxHeight="455"
      @action="actionHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </el-dialog>
</template>

<script>
  import _ from 'lodash';
  import customElTable from '@/components/customElTable';
  import Activity from '@/api/fightGroup/activity';
  import { parseTime } from '@/utils';

  export default {
    name: 'selectCommodity',
    model: {
    },
    props: {
      value: {},
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
      customElTable
    },
    data() {
      return {
        commodityQueryFrm: {
          name: '',
          choose_status: ''
        },
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: 80
          },
          {
            label: '商品',
            prop: 'name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 140
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                options: this.getStatusBtnInfo
              }
            ]
          }
        ],
        query: null,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        tabLoading: true,
        statusOptions: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '可选取',
            value: 1
          },
          {
            label: '不可选',
            value: 2
          }
        ]
      };
    },
    computed: {
      dialogSelectCommodityVisible: {
        set(val) {
          this.$emit('update:show', val);
        },
        get() {
          return this.show;
        }
      }
    },
    watch: {
      show(val) {
        if (val) {
          this.getData();
        }
      }
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Activity.goods({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              create_time: parseTime(item.create_time)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      cancel() {
        this.dialogSelectCommodityVisible = false;
      },
      ok() {
        this.dialogSelectCommodityVisible = false;
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.commodityQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createCommodity() {
        this.$router.push({ name: 'fightGroupCommodityCreate' });
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '不可选'
          };
        }
        const status = item.can_choose * 1;
        return status === 1
          ? {
            btn: 'primary',
            label: '选取',
            disabled: true
          } : {
            btn: 'danger',
            label: '不可选'
          };
      },
      actionHandler(type, info) {
        if (type === 'status' && (info.can_choose * 1) === 1) {
          this.$confirm(`确认选取商品 <b>${info.name}</b> 吗？`, '确认', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('input', info);
            this.$emit('update-data', info);
            this.dialogSelectCommodityVisible = false;
          }).catch(() => {
            console.log('取消选取');
          });
        }
      }
    }
  };
</script>

<style>
  .select-commodity-dialog .el-dialog{
    min-width: 800px;
  }
</style>
