<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="interpretationQueryFrm" :model="interpretationQueryFrm">
        <el-form-item prop="book_name" label="书籍名称">
          <el-input placeholder="书籍名称" v-model="interpretationQueryFrm.book_name"></el-input>
        </el-form-item>
        <el-form-item prop="book_classify" label="分类">
          <el-select placeholder="全部" clearable v-model="interpretationQueryFrm.book_classify">
            <el-option
              v-for="item in classifyOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="explain_name" label="解读人">
          <el-input placeholder="解读人" v-model="interpretationQueryFrm.explain_name"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            :editable="false"
            v-model="interpretationQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="mechanism" label="所属机构">
          <el-select placeholder="全部" clearable v-model="interpretationQueryFrm.mechanism">
            <el-option
              v-for="item in mechanismOptions"
              :key="item.business_name"
              :label="item.business_name"
              :value="item.business_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="book_id" label="书籍ID">
          <el-input placeholder="书籍ID" v-model="interpretationQueryFrm.book_id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivityList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('interpretationQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createActivity">
            <i class="fs-13 el-icon-plus mr-5"></i>新建解读
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
  import explain from '@/api/readingClub/explain';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'interpretationList',
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
            label: '书籍ID',
            prop: 'book_id'
          },
          {
            label: '书籍名称',
            prop: 'name'
          },
          {
            label: '书籍封面',
            prop: 'cover',
            options: {
              type: 'html'
            }
          },
          {
            label: '分类',
            prop: 'classify'
          },
          {
            label: '解读人',
            prop: 'explain_name'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
          },
          {
            label: '所属机构',
            prop: 'business_name'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'del'
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        interpretationQueryFrm: {
          book_name: '',
          book_classify: '',
          explain_name: '',
          time: [],
          mechanism: '',
          book_id: ''
        },
        query: null,
        classifyOptions: [],
        mechanismOptions: [],
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
      Promise.all([this.get_mechanism(), this.get_classify(), this.getData()])
        .then(() => {
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        explain.list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(res => {
          this.tableData = (res.records || []).map((item, index) => {
            return {
              ...item,
              cover: `<img style="width: 60px;;height: 60px;" src="${item.cover[0].file_path}">`,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--',
              index: this.pageSize * (this.pageIndex - 1) + index + 1
            };
          });
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
        });
        setTimeout(() => {
          this.tabLoading = false;
        }, 1500);
      },
      get_mechanism() {
        explain.mechanism().then(res => {
          this.mechanismOptions = res;
        });
      },
      get_classify() {
        explain.classify().then(res => {
          this.classifyOptions = res;
        });
      },
      searchActivityList() {
        this.query = _.cloneDeep(this.interpretationQueryFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', this.timestamp(time[0]) || '');
        this.$set(this.query, 'end_time', this.timestamp(time[1]) || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      timestamp(date) {
        if (date) {
          var dateTmp = date.replace(/-/g, '/');
          return Date.parse(dateTmp) / 1000;
        } else {
          return '';
        }
      },
      createActivity() {
        this.$router.push({ name: 'readingClubSelectBook' });
      },
      editHandler(info) {
        this.$router.push({ name: 'readingClubInterpretationModify', params: { id: info.id }});
      },
      deleteHandler(info) {
        var delMessage = `确认删除书籍 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          explain.del({ id: info.id }).then(() => {
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
          let disableMessage = `确认${title}书籍 <b>${info.name}</b> 吗？`;
          if (info.status * 1 === 0) {
            info.can_disable * 1 === 1 && (disableMessage = '有书籍正在进行当中，' + disableMessage);
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
            explain.status({
              id: info.id,
              status: info.status * 1 === 1 ? '0' : '1'
            }).then(() => {
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
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
