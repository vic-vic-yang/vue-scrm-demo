<!--
 * @Description:
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-09-16 14:37:18
 -->
<template>
  <div class="activity-wrapper app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item label="活动类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择活动类型">
          <el-option v-for="(active, index) in activityType" :key="index" :label="active.value" :value="active.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchCommodityList" icon="el-icon-search">查询</el-button>
        <el-button @click="resetForm('form')" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createActivity">
          <i class="fs-13 el-icon-plus mr-5"></i>新建活动
        </el-button>
        <el-button type="primary" @click="goConfigure">
          发现页配置
        </el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @handleSelectChange2="statusChange"
      @action="actionHandler"
      @delete="deleteHandler"
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import ACTIVITY_API from '@/api/activityCenter/index';
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';

  export default {
    name: 'activityCenter',
    components: {
      customElTable
    },
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        form: {
          type: ''
        },
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 120
          },
          {
            label: '活动类型',
            prop: 'typeCh'
          },
          {
            label: '活动标题',
            prop: 'activity_name'
          },
          {
            label: '开始时间',
            prop: 'start_time'
          },
          {
            label: '结束时间',
            prop: 'end_time'
          },
          {
            label: '状态',
            prop: 'statusCh'
          },
          {
            label: '权重',
            prop: 'weight',
            max: 100,
            // editAble: true,
            // showInput: false,
            // type: 'Number',
            options: {
              type: 'edit'
            }
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'myedit',
                label: '编辑',
                btn: 'primary',
                // itemOnly: true
                disableds: (item) => {
                  return !(item.type * 1 === 5);
                }
              },
              {
                type: 'report',
                label: '报名管理',
                btn: 'primary',
                // itemOnly: true
                disableds: (item) => {
                  return !(item.type * 1 === 5);
                }
              },
              {
                width: 70,
                actionType: 'select',
                label: '是否启用权重',
                labels: [
                  {
                    value: 1,
                    label: '启用'
                  },
                  {
                    value: 0,
                    label: '禁用'
                  }
                  // {
                  //   value: 2,
                  //   label: '隐藏'
                  // }
                ]
              },
              'del'
            ]
          }
        ],
        activityType: [],
        query: null
      };
    },
    created() {
      this.getTypes().then(() => {
        this.init();
      }).catch(() => {
        this.init();
      });
    },
    methods: {
      goConfigure() {
        this.$router.push({ name: 'activityCenterConfig' });
      },
      createActivity() { // 新增
        this.$router.push({ name: 'contentAddActivity' });
      },
      statusChange(row, e) {
        const params = {
          type: row.type,
          id: row.id,
          status: row.status
        };
        ACTIVITY_API.setStatus(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.init();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      },
      getTypes() {
        return ACTIVITY_API.getTypes().then(res => {
          this.activityType = res;
          return res;
        }).catch(() => {
          return true;
        });
      },
      init() {
        const query = this.query || {};
        const params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          ...query
        };
        ACTIVITY_API.list(params).then(res => {
          this.tableData = (res.result || []).map((item, itemIndex) => {
            let typeCh = '';
            let statusCh = '';
            item.itemIndex = itemIndex; // 为了区分不同活动相同id在同一页
            this.activityType.map(val => {
              if (Number(val.id) === Number(item.type)) {
                typeCh = val.value;
              }
            });
            if (Number(item.status) === 1) {
              statusCh = '启用';
            } else if (Number(item.status) === 2) {
              statusCh = '隐藏';
            } else if (Number(item.status) === 0) {
              statusCh = '禁用';
            }
            item.weight = Number(item.weight);
            item.status = Number(item.status);
            return {
              ...item,
              old_weight: item.weight,
              typeCh,
              statusCh
            };
          });
          this.totalCount = res.totalCount * 1;
        });
      },
      searchCommodityList() {
        this.query = _.cloneDeep(this.form);
        this.pageIndex = 1;
        this.init();
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.init();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.init();
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
          type: scope.row.type,
          id: scope.row.id,
          weight: value
        };
        ACTIVITY_API.setWeight(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.init();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      },
      passHandler(scope) {
        console.log('pass', scope);
      },
      actionHandler(type, scope) {
        if (type === 'myedit') {
          this.$router.push({
            name: 'contentEditorActivity',
            params: {
              id: scope.id
            }
          });
        } else if (type === 'report') { // 报名管理
          this.$router.push({
            name: 'contentSignUp',
            params: {
              id: scope.id
            }
          });
        }
      },
      deleteHandler(scope) {
        const params = {
          id: scope.id,
          type: scope.type
        };
        ACTIVITY_API.del(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.init();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
