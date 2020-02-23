<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="commodityQueryFrm" :model="commodityQueryFrm">
        <el-form-item prop="name" label="商品名">
          <el-input placeholder="商品名" v-model="commodityQueryFrm.name"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="商品类型">
          <el-select placeholder="全部" clearable v-model="commodityQueryFrm.type">
            <el-option
              v-for="item in commodityTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="商品状态">
          <el-select placeholder="全部" clearable v-model="commodityQueryFrm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sell_num" label="总销售">
          <el-input style="width: 80px" v-model.number="commodityQueryFrm.sell_num[0]"></el-input>
          <span class="mh-5">-</span>
          <el-input style="width: 80px" v-model.number="commodityQueryFrm.sell_num[1]"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCommodityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('commodityQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setIntegralBill">设置商品积分兑换比列</el-button>
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
      :ifmultipleSelection="true"
      @handleSelectionChange="handleSelectionChange"
      @edit="editHandler"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>

    <el-dialog
        title="设置商品积分兑换比列"
        :visible.sync="dialogVisible"
        width="45%">
      <el-form
        class="commodity-edit__form"
        ref="integralFrm"
        label-width="120px">
          <el-form-item prop="integral" label="商品积分兑换比列">
            <el-input v-model="integral"
                      style="width: 300px;"
                      :clearable="true"></el-input>
            <small style="color: #999;display: block;">1元 = {{integral}} 积分</small>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Commodity from '@/api/fightGroup/commodity';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'commodityList',
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
            label: '商品名称/价格',
            prop: 'good_info',
            width: 300,
            options: {
              type: 'html'
            }
          },
          {
            label: '积分兑换比列',
            prop: 'ratio'
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
            prop: 'total_num'
          },
          {
            label: '总销量',
            prop: 'sell_num'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true
          },
          {
            label: '商品状态',
            prop: 'status_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'edit',
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
          status: 0,
          sell_num: []
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
        ],
        dialogVisible: false,
        integral: '',
        ids: ''
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Commodity.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              total_num: item.total_num * 1 - item.sell_num * 1,
              status_name: item.sell_status_info.sell_status_name,
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
              goods_view_all_and_user: `访客数：${item.goods_view_user}<br>浏览量：${item.goods_view_all}`,
              ratio: `1元=${item.ratio}积分`,
              good_info: `<div style="width: 300px;display: flex;">
              <div style="max-width: 90px; height: auto"><img style="max-width: 100%; height: auto;" src="${item.pic.length && item.pic[0].file_path}" alt=""/></div>
              <div style="width: 160px; margin-left: 30px; text-align: left;">
                <div style="width: 100%;">${item.name}</div>
                <div style="width: 100%;">￥${item.price}</div>
              </div>
              </div>`
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      setIntegralBill() {
        if (!this.ids) {
          this.$message({
            message: '请选择需要设置商品积分兑换比例的商品',
            type: 'warning'
          });
          return;
        }
        this.dialogVisible = true;
      },
      handleSelectionChange(data) {
        this.ids = (data.map(item => item.id)).join(',');
      },
      save() {
        Commodity.integralProportion({
          ids: this.ids,
          ratio: this.integral
        }).then(res => {
          if (res.data.status * 1) {
            this.dialogVisible = false;
            this.getData();
          } else {
            this.$message({
              message: '设置商品积分兑换比例失败',
              type: 'error'
            });
          }
        });
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.commodityQueryFrm);
        const sell_num = this.query.sell_num || [];
        this.$set(this.query, 'sell_num_min', sell_num[0]);
        this.$set(this.query, 'sell_num_max', sell_num[1]);
        this.pageIndex = 1;
        this.getData();
      },
      createCommodity() {
        this.$router.push({ name: 'fightGroupCommodityCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'fightGroupCommodityModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        this.$confirm(`确认删除商品 <b>${info.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Commodity.del(info)
            .then(() => {
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
            Commodity.status(info)
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
          this.$router.push({ name: 'commodityWriteCode', params: { id: info.id }});
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
        const status = item.sell_status_info.up_down_status * 1;
        if (status === 3) return false;
        return status === 2
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

<style scoped>
</style>
