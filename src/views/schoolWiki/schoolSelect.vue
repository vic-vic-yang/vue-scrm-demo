/* eslint-disable */
<template>
  <el-dialog :visible.sync="schoolSelectVisible" @close="dialogHide">
    <div class="control-group">
      <el-form :inline="true" :model="queryFrm">
        <el-form-item label="学校名称">
          <el-input placeholder="模糊匹配"
                    v-model="queryFrm.name"></el-input>
        </el-form-item>
        <el-form-item label="区">
          <el-select placeholder="全部" clearable v-model="queryFrm.zone">
            <el-option v-for="item in zones"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性质">
          <el-select placeholder="全部" clearable v-model="queryFrm.type">
            <el-option v-for="item in types"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学段">
          <el-select placeholder="全部" disabled v-model="queryFrm.stage">
            <el-option v-for="item in stages"
                       :key="item.alias"
                       :label="item.label"
                       :value="item.alias">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="querySchool(0)"
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
  import SCHOOL_API from '@/api/schoolWiki/school';
  import {zoneOptions, typeOptions, stageOptions} from './data.js';
  import {value2Label} from '@/utils/enum';

  export default {
    name: 'schoolSelect',
    components: {
      customElTable
    },
    props: ['schoolSelectVisible', 'selectedMiddleSchools', 'stage'],
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
            label: '学校名称',
            prop: 'name'
          },
          {
            label: '类型',
            prop: 'type_name'
          },
          {
            label: '学段',
            prop: 'stage_name'
          },
          {
            label: '区',
            prop: 'zone_name'
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
      this.queryFrm.stage = this.stage;
    },
    methods: {
      querySchool(page) {
        const params = {
          name: this.queryFrm.name,
          stage: this.queryFrm.stage,
          zone: this.queryFrm.zone,
          type: this.queryFrm.type,
          pageIndex: page,
          pageSize: this.pageSize
        };
        this.getData(params);
      },
      getData(params) {
        this.tabLoading = true;
        SCHOOL_API.list(params).then(res => {
          this.totalCount = parseInt(res.totalCount);
          this.schoolList = res.result;
          this.tableData = this.schoolList.map(item => {
            return {
              id: item.id,
              name: item.name,
              type_name: value2Label(this.types, item.type),
              stage_name: this.stage_names(item.stage),
              zone_name: value2Label(this.zones, item.zone)
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
          const selectedItem = this.schoolList.find(item => {
            return parseInt(item.id) === parseInt(info.id);
          });
          this.$emit('addSchoolSuccess', selectedItem);
          this.dialogHide();
        }
      },
      pageChangeHandler(page) {
        this.querySchool(page);
      },
      stage_names(stage) {
        const names = [];
        for (let i = 0; i < this.stages.length; i++) {
          if ((parseInt(stage) & this.stages[i].value) === this.stages[i].value) {
            names.push(this.stages[i].label);
          }
        }
        return names.join(',');
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
