<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryFrm" :model="queryFrm">
      <div class="tabs">
        <div :class="{'tabs-item':true,'item-click':queryFrm.type=='1'}" @click="handleClick('1')"><span>待我审核</span></div>
        <div :class="{'tabs-item':true,'item-click':queryFrm.type=='2'}" @click="handleClick('2')">我发起的</div>
        <div :class="{'tabs-item':true,'item-click':queryFrm.type=='3'}" @click="handleClick('3')">我已审核</div>
      </div>

      <el-form-item prop="goods_name" label="内容标题">
        <el-input placeholder="商品名称" v-model="queryFrm.title" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="queryFrm.type!='1'" label='状态'>
        <el-select placeholder='全部' clearable v-model='queryFrm.status'>
          <el-option
            v-for='item in stateOptions'
            :key='item.value'
            :label='item.label'
            :value='item.value'
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="supplier" label="发布栏目">
        <el-cascader
          v-model="queryFrm.column_id"
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import { parseTime } from '@/utils';
import Approval from '@/api/contentPlatform/approval';
import ColumnsApi from '@/api/contentPlatform/columns';
export default {
  name: 'contentApprovalManagment',
  components: {
    customElTable
  },
  data() {
    return {
      queryFrm: {
        title: '',
        column_id: [],
        type: '1',
        status: ''
      },
      platfrom: [],
      stateOptions: [
        // 状态
        {
          value: 1,
          label: '已发布'
        },
        {
          value: 0,
          label: '审核通过'
        },
        {
          value: -1,
          label: '已删除 '
        },
        {
          value: 2,
          label: '待审核'
        },
        {
          value: 3,
          label: '审核中'
        },
        {
          value: 4,
          label: '审核驳回'
        }
      ],
      tableOptions: [
        {
          label: '内容ID',
          prop: 'id'
        },
        {
          label: '内容标题',
          prop: 'title'
        },

        {
          label: '发布栏目',
          prop: 'column'
        },
        {
          label: '发起人',
          prop: 'initiate_username'
        },
        {
          label: '来源',
          prop: 'author'
        },
        {
          label: '状态',
          prop: 'status_cn',
          options: {
            type: 'tag',
            prop: 'stageType'
          }
        },
        {
          label: '申请时间',
          prop: 'create_time'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              label: '查看',
              type: 'detail'
            }
          ]
        }
      ],
      tableData: [],
      selectData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      options: []
    };
  },
  created() {
    console.log('======s====');
    this.getData();
    this.getColumn();
  },
  beforeRouteLeave(to, from, next) { // 要在离开该组件的时候控制需要缓存的组件，否则将出现第一次不缓存的情况
    console.log(from);
    if (to.name === 'contentApproval') { // 去往详情页的时候需要缓存组件，其他情况下不需要缓存
      this.$store.commit('ADD_CACHED_VIEW', from);
    } else {
      this.$store.commit('DEL_VISITED_VIEWS', from);
    }
    next();
  },
  methods: {
    getData() {
      const _this = this;
      const query = this.queryFrm || {};
      this.tabLoading = true;
      const id =
        (query.column_id.length &&
          query.column_id[query.column_id.length - 1]) ||
        '';
      Approval.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        title: query.title,
        type: query.type,
        status: query.status,
        column_id: id
      })
        .then(data => {
          console.log(data);
          data.result.forEach(item => {
            if (item.create_time) {
              item.create_time = parseTime(item.create_time);
            }
            const status = _this.getstatus(Number(item.status));
            item.status_cn = status[0];
            item.stageType = status[1];
          });

          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    getColumn() {
      ColumnsApi.list().then(res => {
        const arr = [];
        this.generateColumnContentMenu(res, arr, this);
        console.log(arr);
        this.options = arr;
      });
    },
    generateColumnContentMenu(tData, resData, that) {
      if (Array.isArray(tData) && tData.length > 0) {
        tData.forEach(function(v, i) {
          resData[i] = v;
          resData[i].value = v.id;
          resData[i].label = v.name;
          const arr = [];
          that.generateColumnContentMenu(v.children, arr, that);
          if (arr.length) {
            resData[i].children = arr;
          }
        });
      }
    },
    getstatus(status) {
      let text = '';
      let stageType = 0;
      switch (status) {
        case 0:
          text = '审核通过';
          stageType = 1;
          break;
        case 1:
          text = '已发布';
          stageType = 1;
          break;
        case 2:
          text = '待审核';
          stageType = 3;
          break;
        case 3:
          text = '审核中';
          stageType = 3;
          break;
        case 4:
          text = '已驳回';
          stageType = 0;
          break;
      }
      return [text, stageType];
    },
    handleClick(index) {
      this.queryFrm = {
        title: '',
        column_id: [],
        type: index,
        status: ''
      };
      this.searchList();
    },
    actionHandler(type, info) {
      if (type === 'detail') {
        // 查看详情
        this.$router.push({
          name: 'contentApproval',
          params: {
            id: info.article_id,
            type: this.queryFrm.type,
            t_id: info.id
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
    searchList() {
      this.pageIndex = 1;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.control-group {
  text-align: right;
  margin-bottom: 20px;
}
.el-tabs__item {
  padding: 4px 100px;
}
.tabs{
  display: flex;
  margin-bottom: 20px;
  width: 100%
}
.tabs-item{
  height: 40px;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #fff;
  cursor: pointer;
}
.item-click{
  border-bottom: 2px solid #409EFF;
}
</style>

