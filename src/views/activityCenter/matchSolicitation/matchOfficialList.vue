<template>
  <div class="app-container">
    <el-form :inline="true" ref="taskFrm" :model="mainFrm">
      <el-form-item label="姓名">
        <el-input placeholder="请输入姓名" v-model="mainFrm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="作品名称">
        <el-input placeholder="请输入作品名称" v-model="mainFrm.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input placeholder="请输入手机号码" v-model="mainFrm.phone" clearable></el-input>
      </el-form-item>
      <el-form-item label="作品状态">
        <el-select placeholder="请选择" v-model="mainFrm.status">
          <el-option label="全部" value></el-option>
          <el-option label="待审核" :value="0"></el-option>
          <el-option label="审核通过" :value="1"></el-option>
          <el-option label="审核未通过" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="mainFrm.time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-tooltip class="item" effect="dark" content="导出表格中已勾选的数据" placement="top">
          <el-button operate="export" type="primary" @click="exportData">批量导出</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出符合搜索条件的所有数据" placement="top">
          <el-button operate="export" type="primary" @click="exportData('all')">全部导出</el-button>
        </el-tooltip>
        <el-button operate="delete" type="danger" @click="batchDel">批量删除</el-button>
      </el-form-item>
    </el-form>

    <custom-el-table
      v-loading="tabLoading"
      v-model="page_index"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :ifmultipleSelection="true"
      @handleSelectionChange="handleSelectionChange"
      @delete="deleteHandler"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
    ></custom-el-table>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Api from '@/api/activityCenter/match';
// import {parseTime} from '@/utils/index'
export default {
  components: {
    customElTable
  },
  data() {
    return {
      mainFrm: {
        name: '',
        title: '',
        phone: '',
        status: '',
        time: ''
      },
      tableData: [],
      hasSelected: [],
      page_index: 1,
      page_size: 20,
      totalCount: 0,
      tabLoading: true,
      tableOptions: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '作品名称',
          prop: 'title'
        },
        {
          label: '手机号码',
          prop: 'phone'
        },
        {
          label: '提交时间',
          prop: 'date_time'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'examine',
              options: () => {
                return {
                  btn: 'primary',
                  label: '审核',
                  operate: 'audit'
                };
              }
            },
            'del'
          ]
        }
      ]
    };
  },
  computed: {
    start_time() {
      if (this.mainFrm.time && this.mainFrm.time.length !== 0) {
        return this.mainFrm.time[0];
      }
      return '';
    },
    end_time() {
      if (this.mainFrm.time && this.mainFrm.time.length !== 0) {
        return this.mainFrm.time[1];
      }
      return '';
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tabLoading = true;
      Api.getOfficial({
        ...this.mainFrm,
        column_id: 166,
        start_time: this.start_time,
        end_time: this.end_time,
        page_index: this.page_index,
        page_size: this.page_size
      })
        .then(data => {
          // 列表展示图片时需要处理图片数据
          data.result.map(item => {
            switch (Number(item.status)) {
              case 0:
                item.status = '待审核';
                break;
              case 1:
                item.status = '审核通过';
                break;
              case 2:
                item.status = '审核未通过';
                break;
            }

            // item.create_time = parseTime(item.create_time)
          });

          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    sizeChangeHandler(size) {
      this.page_size = size;
      this.page_index = 1;
      this.getData();
    },
    pageChangeHandler(page) {
      this.page_index = page;
      this.getData();
    },
    deleteHandler(info) {
      // 删除
      this.$confirm(`确认删除 <b>${info.name}</b> 的作品吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.delOfficial({
            id: info.id
          }).then(() => {
            this.getData();
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleSelectionChange(data) {
      this.hasSelected = data;
    },
    actionHandler(type, info) {
      if (type === 'examine') {
        this.$router.push(
          `/activityCenter/matchSolicitation/matchOfficialDetails?id=${info.id}`
        );
      }
    },
    exportData(type) {
      const arr = []; // id数组

      if (type !== 'all') {
        // 批量导出
        if (this.hasSelected.length === 0) {
          this.$message({
            type: 'info',
            message: '请先选择要导出的内容'
          });
          return;
        }

        this.hasSelected.map(item => {
          arr.push(item.id);
        });
      }

      const urlObj = {
        ...this.mainFrm,
        column_id: 166,
        start_time: this.start_time,
        end_time: this.end_time,
        ids: arr.join()
      };

      let url = `${process.env.BASE_API}/content/util/document-collects/export?`;
      for (const key in urlObj) {
        if (urlObj.hasOwnProperty(key) && key !== 'time') {
          const item = urlObj[key];
          url += `${key}=${item}&`;
        }
      }
      url = url.substring(0, url.length - 1);
      console.log(url);
      window.open(url);
    },
    batchDel() {
      // 批量删除
      if (this.hasSelected.length === 0) {
        this.$message({
          type: 'info',
          message: '请先选择要删除的内容'
        });
        return;
      }

      // 删除
      this.$confirm(
        `确认删除<b>${this.hasSelected.length}条</b>数据吗？`,
        '删除',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 请求
          const arr = [];
          this.hasSelected.map(item => {
            arr.push(item.id);
          });
          Api.batchDelOfficial({
            id: arr
          }).then(res => {
            this.getData();
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    search() {
      this.page_index = 1;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
