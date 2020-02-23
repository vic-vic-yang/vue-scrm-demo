<template>
  <div class="app-container" v-loading="tabLoading">
    <div class="control-group">
      <el-form :inline="true" ref="activityQueryFrm" :model="activityQueryFrm">
        <el-form-item prop="active_name" label="活动名称">
          <el-input placeholder="活动名称" v-model="activityQueryFrm.active_name"></el-input>
        </el-form-item>
        <el-form-item prop="active_status" label="活动状态">
          <el-select placeholder="全部" clearable v-model="activityQueryFrm.active_status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            :editable="false"
            v-model="activityQueryFrm.time"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('activityQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createActivity">
            <i class="fs-13 el-icon-plus mr-5"></i>新建活动
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
  import Activity from '@/api/fightGroup/activity';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'activityList',
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
            label: '活动名称',
            prop: 'active_name'
          },
          {
            label: '商品名信息',
            prop: 'good_info',
            width: 300,
            options: {
              type: 'html'
            }
          },
          {
            label: '状态',
            prop: 'active_status_name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
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
                type: 'commodity',
                label: '查看商品'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        activityQueryFrm: {
          active_name: '',
          active_status: 0,
          time: []
        },
        query: null,
        statusOptions: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '未开始',
            value: 1
          },
          {
            label: '进行中',
            value: 2
          },
          {
            label: '结束',
            value: 3
          },
          {
            label: '禁用',
            value: 4
          }
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
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
        Activity.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return {
              ...item,
              active_status_name: item.status_info.active_status_name,
              create_time: item.create_time * 1 !== 0 ? parseTime(item.create_time) : '--',
              good_info: `<div style="width: 300px;display: flex;align-items: center">
              <div style="max-width: 90px; height: auto"><img style="max-width: 100%; height: auto;" src="${item.goods_info.pic && item.goods_info.pic.length && item.goods_info.pic[0].file_path}" alt=""/></div>
              <div style="width: 160px; margin-left: 30px; text-align: left;">
                <div style="width: 100%;">${item.goods_info.name}</div>
              </div>
              </div>`
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        });
      },
      searchActivityList() {
        this.query = _.cloneDeep(this.activityQueryFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'create_start_time', time[0] || '');
        this.$set(this.query, 'create_end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      createActivity() {
        this.$router.push({ name: 'fightGroupActivityCreate' });
      },
      editHandler(info) {
        this.$router.push({ name: 'fightGroupActivityModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        let delMessage = `确认删除活动 <b>${info.active_name}</b> 吗？`;
        if (info.can_delete * 1 === 1) {
          delMessage = '有拼团正在进行当中，' + delMessage;
        }
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Activity.del(info)
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
          let disableMessage = `确认${title}活动 <b>${info.active_name}</b> 吗？`;
          if (info.status * 1 === 0) {
            info.can_disable * 1 === 1 && (disableMessage = '有拼团正在进行当中，' + disableMessage);
          } else {
            if (info.enable_status * 1 === 2) {
              return this.$alert('活动时间已结束，请编辑后再启用。', '提示', {
                confirmButtonText: '知道了'
              });
            }
          }
          this.$confirm(disableMessage, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Activity.status(info)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'commodity') {
          this.$router.push({
            name: 'fightGroupCommodityModify',
            params: {
              id: info.goods_id
            }
          });
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
            label: '禁用'
          };
        }
        const status = item.status * 1;
        return status === 0
          ? {
            btn: 'danger',
            label: '禁用'
          }
          : {
            btn: 'primary',
            label: '启用'
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
