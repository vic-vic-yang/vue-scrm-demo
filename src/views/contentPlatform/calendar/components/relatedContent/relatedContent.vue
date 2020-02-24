<template>
  <el-dialog
    title="关联内容"
    :visible.sync="dialogVisible"
    width="70%"
    top="5vh"
    @close="handleClose">
    <div v-if="tags_list && tags_list.length" class="list-content">
      <div v-for="(item, index) in tags_list" :key="index" class="list">
        <item-card v-if="item"
                   :taskItem="item"
                   :index="index"
                   :name="item.title"
                   :desc="item.channels"
                   type="calendar-content"
                   @editHandler="editHandler"
                   @delHandler="closeHandler"/>
      </div>
    </div>

    <div class="app-container">
      <div class="control-group" style="margin-bottom: 15px;">
        <el-form :inline="true" ref="searchFrm" :model="searchFrm">
          <el-form-item prop="title" label="标题">
            <el-input
              v-model="searchFrm.title"
              placeholder="请输入标题"
              :maxlength="50"
              name="title"
              :clearable="true">
            </el-input>
          </el-form-item>
          <el-form-item prop="time" label="创建时间">
            <el-date-picker
              :editable="false"
              v-model="searchFrm.time"
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
            <el-button type="primary" @click="searchHandler" icon="el-icon-search">查询</el-button>
            <el-button @click="resetForm('searchFrm')" icon="el-icon-refresh">重置</el-button>
            <el-button @click="saveContent" type="primary">确认选择</el-button>
          </el-form-item>
        </el-form>
      </div>
      <custom-el-table
        v-loading="tabLoading"
        v-model="pageIndex"
        :tableData="tableData"
        :tableOptions="tableOptions"
        :total="totalCount"
        @action="actionHandler"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
    </div>
  </el-dialog>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import _ from 'lodash';
  import itemCard from '@/components/card/item-card';
  import Content from '@/api/contentPlatform/content';
  import { parseTime } from '@/utils';

  export default {
    name: 'relatedContent',
    components: {
      customElTable,
      itemCard
    },
    props: ['show', 'list', 'multiple'],
    data() {
      return {
        dialogVisible: false,
        searchFrm: {
          title: '',
          time: ''
        },
        query: null,
        tagsOptions: [],
        tableOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '发布频道',
            prop: 'channels'
          },
          {
            label: '标题',
            prop: 'title'
          },
          {
            label: '形式',
            prop: 'article_type'
          },
          {
            label: '分类',
            prop: 'classify_name'
          },
          {
            label: '来源',
            prop: 'author'
          },
          {
            label: '发布时间',
            prop: 'publish_time',
            sortable: true,
            width: 105,
            className: 'ph-6'
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
            prop: 'USER_ACTION',
            width: 100,
            actions: [
              // {
              //   type: 'detail',
              //   label: '详情'
              // },
              {
                type: 'checkbox',
                label: ''
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        tags_list: ''
      };
    },
    watch: {
      show(val) {
        this.dialogVisible = val;
        if (val) {
          this.tags_list = JSON.parse(this.list);
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      saveContent() {
        this.$emit('saveContent', this.tags_list);
      },
      closeHandler(index) {
        this.tags_list.split(index, 1);
        this.setChecked();
      },
      handleClose() {
        this.dialogVisible = false;
        this.$emit('handleClose');
      },
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        Content.list.listB({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ...query
        }).then(data => {
          data.result.forEach(item => {
            if (item.publish_time) {
              item.publish_time = parseTime(item.publish_time);
            }
            item.article_type = item.article_type - 0 === 1 ? '图文' : '视频';
            item.status_cn = item.status - 0 === 0 ? '未发布' : '已发布';
            item.stageType = item.status - 0 === 0 ? 2 : 1;
            item.top_cn = item.top - 0 === 0 ? '置顶' : '取消置顶';
            item.recommend_cn = item.recommend - 0 === 0 ? '推荐' : '取消推荐';
            item.title = item.recommend - 0 === 1 ? '[推荐] ' + item.title : item.title;
            item.title = item.top - 0 === 1 ? '[置顶] ' + item.title : item.title;
            item.checked = false;
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
          this.setChecked();
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      setChecked() {
        this.tableData.map(item => {
          item.checked = false;
          this.tags_list.map(val => {
            if (item.id === val.id) {
              item.checked = true;
            }
          });
        });
      },
      searchHandler() {
        this.query = _.cloneDeep(this.searchFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'startTime', time[0]);
        this.$set(this.query, 'endTime', time[1]);
        this.pageIndex = 1;
        this.getData();
      },
      editHandler(info) {
        const { href } = this.$router.resolve({name: 'modifyContent', params: {id: info.id}});
        window.open(href, '_blank');
      },
      deleteHandler(info) {
        var delMessage = `确认删除事件标签 <b>${info.name}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      actionHandler(type, info) {
        if (type === 'checkbox') {
          if (info.checked) {
            var item = this.tags_list.find(item => item.id === info.id);
            if (!item) {
              if (this.multiple) {
                this.tags_list.push(info);
              } else {
                this.tags_list = [];
                this.tags_list.push(info);
                this.tableData.map(item => {
                  item.checked = false;
                  if (item.id === info.id) {
                    item.checked = true;
                  }
                });
              }
            }
          } else {
            var index = this.tags_list.findIndex(item => item.id === info.id);
            this.tags_list.splice(index, 1);
          }
        } else if (type === 'detail') {
          console.log('详情');
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-content {
    display: flex;
    flex-wrap: wrap;
  .list{
    margin:0 10px 10px 0
  }
  }
</style>
