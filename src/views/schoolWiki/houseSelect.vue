/* eslint-disable */
<template>
  <el-dialog :visible.sync="houseSelectVisible" @close="dialogHide">
    <div class="control-group">
      <el-form :inline="true" :model="queryFrm">
        <el-form-item label="小区名称">
          <el-input placeholder="模糊匹配"
                    v-model="queryFrm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="queryHouse(0)"
                     icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table v-loading="tabLoading"
                     v-model="pageIndex"
                     :tableData="tableData"
                     :tableOptions="tableOptions"
                     :total="totalCount"
                     @action="actionHandler"
                     @page-change="pageChangeHandler">
    </custom-el-table>
  </el-dialog>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import HOUSE_API from '@/api/schoolWiki/house';
  import {zoneOptions, typeOptions, stageOptions} from './data.js';

  export default {
    name: 'houseSelect',
    components: {
      customElTable
    },
    props: ['houseSelectVisible'],
    data() {
      return {
        zones: zoneOptions,
        types: typeOptions,
        stages: stageOptions,
        queryFrm: {
        },
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tableData: [],
        schoolList: [],
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '小区名称',
            prop: 'name'
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'add',
                options: this.getAddOption
              }
            ]
          }
        ],
        tabLoading: true
      };
    },
    created() {
      this.getData({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
    },
    methods: {
      queryHouse(page) {
        const params = {
          name: this.queryFrm.name,
          pageIndex: page,
          pageSize: this.pageSize
        };
        this.getData(params);
      },
      getData(params) {
        this.tabLoading = true;
        HOUSE_API.list(params).then(res => {
          this.totalCount = parseInt(res.totalCount);
          this.houseList = res.result;
          this.tableData = this.houseList.map(item => {
            return {
              id: item.id,
              name: item.name,
              address: item.address
            };
          });
          console.log(this.tableData);
          this.pageIndex = parseInt(res.pageIndex);
          this.tabLoading = false;
        }).catch(e => {
          console.dir(e);
        });
      },
      actionHandler(type, info) {
        console.log('actionHandler', type, info);
        if (type === 'add') {
          const selectedItem = this.houseList.find(item => {
            return parseInt(item.id) === parseInt(info.id);
          });
          console.log('actionHandler', selectedItem);
          this.$emit('addHouseSuccess', selectedItem);
          this.dialogHide();
        }
      },
      pageChangeHandler(page) {
        this.queryHouse(page);
      },
      getAddOption(item) {
        return {
          btn: 'primary',
          label: '添加'
        };
      },
      dialogHide() {
        this.$emit('dialogHide');
      }
    }
  };
</script>

<style scoped>
</style>
