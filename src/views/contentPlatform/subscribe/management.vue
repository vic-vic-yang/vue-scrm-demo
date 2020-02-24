<template>
  <div class="app-container">
    <div>
      <div class="control-group">
        <el-form :inline="true" :model="searchKey">
          <el-form-item label="订阅类型">
            <el-select v-model="searchKey.type" placeholder="订阅类型">
              <el-option label="文章" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订阅平台">
            <el-select v-model="searchKey.platform" placeholder="订阅平台">
              <el-option label="微信公众号" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input placeholder="请输入名称" v-model="searchKey.keyword"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="left-table">
        <custom-el-table
          v-loading="tabLoading"
          v-model="pageIndex"
          tableNameTag="leftTable"
          :tableData="tableData"
          :tableOptions="tableOptions"
          :total="totalCount"
          @handleSelect="handleSelect"
          @size-change="sizeChangeHandler"
          @page-change="pageChangeHandler"
        ></custom-el-table>
      </div>
    </div>
    <div class="right-table">
      <h3 class="right-top">已选择（{{hasSelectData.length}}）条</h3>
      <div>
        <el-table :data="hasSelectData" border>
          <el-table-column prop="mp_name" align="center" label="名称"></el-table-column>
          <el-table-column prop="source_type" align="center" label="订阅平台"></el-table-column>
          <el-table-column prop="content_type" align="center" label="订阅类型"></el-table-column>
          <el-table-column label="操作" align="center" width="80" class-name="btn-td-content-right">
            <template slot-scope="scope">
              <el-button @click="delRow(scope, tableData)" size="small" type="danger">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="btn-row">
        <el-button class="action-btn" type="primary" @click="confirm">确定</el-button>
        <el-button class="action-btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import API from '@/api/contentPlatform/subscribe';
import _ from 'lodash';

export default {
  name: 'contentUser',
  components: {
    customElTable
  },
  data() {
    return {
      searchKey: {
        type: '1',
        platform: '1',
        keyword: ''
      },
      query: null,
      hasSelectData: [],
      mapSelectArr: [], // 映射已选择数据
      tableOptions: [
        {
          label: '',
          prop: 'SELECTION',
          align: 'center'
        },
        {
          label: '名称',
          prop: 'mp_name'
        },
        {
          label: '订阅平台',
          prop: 'source_type'
        },
        {
          label: '订阅类型',
          prop: 'content_type'
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    document.querySelector('.right-top').style.height =
      document.querySelector('.control-group').offsetHeight + 'px';
  },
  methods: {
    getData() {
      this.tableData = [
        {
          id: 1,
          name: '张三',
          nickname: '微信昵称',
          phone: '12312312321',
          address: '成都市武侯区天府二街'
        }
      ];
      this.tabLoading = true;
      API.unsubscribed({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        type: this.searchKey.type,
        source: this.searchKey.platform,
        name: this.searchKey.keyword.trim()
      })
        .then(data => {
          this.dataChange(data.result); // 转换数据
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;

          this.$nextTick(() => {
            // 隐藏全选框
            document.querySelector('.el-checkbox').style.display = 'none';
            // 默认选中
            data.result.forEach((item, index) => {
              if (this.mapSelectArr.indexOf(item.id) !== -1) {
                this.$children[1].$refs.customTable.toggleRowSelection(item);
              }
            });
          });
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    dataChange(data) {
      data.forEach((item) => {
        switch (item.content_type) {
          case '1':
            item.content_type = '文章';
            break;
        }
        switch (item.source_type) {
          case '1':
            item.source_type = '微信公众号';
            break;
        }
      });
    },
    searchUser() {
      // 查询
      this.query = _.cloneDeep(this.searchKey);
      this.pageIndex = 1;
      this.getData();
    },
    handleSelect(row) {
      console.log(row);
      const mapIndex = this.mapSelectArr.indexOf(row.id);
      if (mapIndex !== -1) {
        // 已有就删除
        this.hasSelectData.splice(mapIndex, 1);
        this.mapSelectArr.splice(mapIndex, 1);
      } else {
        this.hasSelectData.push(row);
        this.mapSelectArr.push(row.id);
      }
    },
    delRow(scope, tableData) {
      // 对应取消勾选
      // 翻页之后scope.row里面渲染的id跟之前不一致
      this.$children[1].$refs.customTable.data.forEach(item => {
        if (item.id === scope.row.id) {
          this.$children[1].$refs.customTable.toggleRowSelection(item, false);
        }
      });

      const mapIndex = this.mapSelectArr.indexOf(scope.row.id);
      this.hasSelectData.splice(mapIndex, 1);
      this.mapSelectArr.splice(mapIndex, 1);
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
    confirm() {
      const resultArr = [];
      this.hasSelectData.forEach(item => {
        resultArr.push(item.id);
      });
      API.add({
        ids: resultArr.join()
      }).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          // this.$router.push('/contentPlatform/subscribe/index');
          this.$router.push({
            name: 'subscribe'
          });
        } else {
          this.$message({
            type: 'error',
            message: '添加失败!'
          });
        }
      });
    },
    cancel(info) {
      this.$confirm('是否取消本次操作？', '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$router.push('/contentPlatform/subscribe/index');
        this.$router.push({
          name: 'subscribe'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  position: relative;
  padding-bottom: 100px;
  & > div {
    width: 50%;
  }
  & > div:first-child {
    border-right: 1px solid #eee;
    width: 60%;
    padding-right: 10px;
    margin-right: 10px;
  }
  .right-top {
    margin: 0;
  }
  .btn-row{
      position: absolute;
      bottom: 20px;
      width: 100%;
      text-align: center;
      .action-btn{
          width: 150px;
      }
  }
}
</style>
<style>
.btn-td-content-right{
  padding: 4px 0 !important;
}
</style>



