<template>
  <div class="app-container commodity-list">
    <div class="control-group">
      <el-form :inline="true" ref="commodityQueryFrm" :model="commodityQueryFrm">
        <el-form-item prop="name" label="商品名">
          <el-input placeholder="商品名" v-model="commodityQueryFrm.name"></el-input>
        </el-form-item>
        <!--<el-form-item label="商品类型">-->
          <!--<el-select placeholder="全部" clearable v-model="commodityQueryFrm.type">-->
            <!--<el-option-->
              <!--v-for="item in commodityTypeOptions"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item prop="status" label="商品状态">
          <el-select placeholder="全部商品" clearable v-model="commodityQueryFrm.status">
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
          <el-button @click="resetForm('commodityQueryFrm')" icon="el-icon-refresh">重置</el-button>
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
  import integralCommodity from '@/api/integralMall/commodity';
  import _ from 'lodash';
  import { parseTime } from '@/utils';

  export default {
    name: 'commodity-list',
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
            label: '商品',
            prop: 'goods',
            width: 400,
            options: {
              type: 'html'
            }
          },
          {
            label: '访问量',
            prop: 'goods_view_all_and_user',
            options: {
              type: 'html'
            }
          },
          {
            label: '库存',
            prop: 'total_num',
            width: 120
          },
          {
            label: '已兑换',
            prop: 'sell_num'
          },
          {
            label: '商品状态',
            prop: 'status_name'
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
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del',
              {
                type: 'code',
                label: '核销码',
                disableds: (item) => {
                  return !(item.type * 1 === 2 && item.card_number_type * 1 === 2);
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
        commodityQueryFrm: {
          name: '',
          type: 0,
          status: 0
        },
        query: null,
        commodityTypeOptions: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '实物',
            value: 1
          },
          {
            label: '电子卡卷',
            value: 2
          }
        ],
        statusOptions: [
          {
            label: '全部商品',
            value: 0
          },
          {
            label: '已上架',
            value: 1
          },
          {
            label: '已下架',
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
        integralCommodity.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.result || []).map(item => {
            const pic = (item.pic && item.pic.length) ? item.pic[0] : null;
            return {
              ...item,
              goods: `<div class="goods-info" style="display: flex;justify-content: flex-start;align-items: center;margin: 0 15px;">
                        <div class="img">${pic ? `<img width="144" height="120" src="${pic.file_path}" />` : ''}</div>
                        <div class="content" style="margin-left: 30px;display: flex;flex-direction: column;justify-content: space-between;">
                          <p class="name" style="text-align: left">${item.name}</p>
                          <p class="text" style="display: flex;justify-content: space-between;align-items: center;">
                            <span>￥${item.price}</span>
                            <span style="display: inline-block;margin-left: 50px;">${item.integral}积分</span>
                          </p>
                        </div>
                      <div>`,
              total_num: item.total_num * 1 - item.sell_num * 1,
              status_name: item.status * 1 === 1 ? '已上架' : '已下架',
              create_time: (item.create_time === '' || item.create_time * 1 === 0) ? '--' : parseTime(item.create_time),
              goods_view_all_and_user: `访客数：${item.goods_view_user}<br>浏览量：${item.goods_view_all}`
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
      searchCommodityList() {
        this.query = _.cloneDeep(this.commodityQueryFrm);
        this.pageIndex = 1;
        this.getData();
      },
      createCommodity() {
        this.$router.push({ name: 'integralCommodityCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'integralCommodityModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除商品 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          integralCommodity.del(info.id)
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
      },
      actionHandler(type, info) {
        if (type === 'status') {
          const title = this.getStatusBtnInfo(info).label;
          this.$confirm(`确认立即${title}商品 <b>${info.name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            integralCommodity.status({
              id: info.id,
              status: info.status * 1 === 1 ? '2' : '1'
            })
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'code') {
          this.$router.push({ name: 'integralCommodityWriteCode', query: { id: info.id } });
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
            label: '下架'
          };
        }
        const status = item.status * 1;
        if (status === 3) return false;
        return status === 1
          ? {
            btn: 'danger',
            label: '下架'
          } : {
            btn: 'primary',
            label: '上架'
          };
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
