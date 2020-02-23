<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="managementQueryFrm" :model="managementQueryFrm">
        <el-form-item prop="card_number" label="电子卡劵">
          <el-input placeholder="电子卡劵" v-model="managementQueryFrm.card_number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchManagementData" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('managementQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :pagination="false"
      @action="actionHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import WriteOff from '@/api/fightGroup/writeOff';

  export default {
    name: 'writeOffManagement',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: '订单号',
            prop: 'order_number'
          },
          {
            label: '商品名',
            prop: 'goods_name'
          },
          {
            label: '价格',
            prop: 'goods_price'
          },
          {
            label: '用户',
            prop: 'nickname'
          },
          {
            label: '下单日期',
            prop: 'order_time'
          },
          {
            label: '有效期',
            prop: 'validate_time',
            width: 145
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'check',
                label: '立即核销',
                btn: 'primary'
              }
            ]
          }
        ],
        tableData: [],
        tabLoading: false,
        managementQueryFrm: {
          card_number: ''
        },
        query: null
      };
    },
    created() {

    },
    methods: {
      getData() {
        if (!this.query) return false;
        this.tabLoading = true;
        WriteOff.search(this.query).then(data => {
          if (!data || !data.order_number) {
            this.$message({
              type: 'error',
              message: '无效券码，请重新输入'
            });
          } else {
            // data.validate_time = data.start_time + '-' + data.end_time;
            this.tableData = [data];
          }
          this.tabLoading = false;
        });
      },
      searchManagementData() {
        this.query = this.managementQueryFrm.card_number;
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'check') {
          this.$confirm(`确认核销吗？`, '核销', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            WriteOff.check(info.card_number)
              .then(() => {
                this.tableData = [];
                this.totalCount = 0;
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消核销`
            });
          });
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>
</style>
