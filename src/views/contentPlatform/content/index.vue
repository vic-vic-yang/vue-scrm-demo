<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-25 15:14:40
 * @LastEditTime: 2019-08-30 15:29:23
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" :model="classListQueryFrm">
        <el-form-item label="标题">
          <el-input placeholder="标题" v-model="classListQueryFrm.title"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-input placeholder="来源" v-model="classListQueryFrm.source"></el-input>
        </el-form-item>
        <el-form-item label="频道">
          <!-- <el-select placeholder="全部" clearable v-model="classListQueryFrm.channel">
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select> -->
          <el-select placeholder="全部" style="width:230px" clearable v-model="classListQueryFrm.channel">
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.channel_name"
              :value="item.id">
            </el-option>
            <div class="article_pages">
              <el-pagination
                v-loading="channeifiCation_page_info.tabLoading"
                :page-size="channeifiCation_page_info.pageSize"
                :pager-count="selectSize"
                :current-page="channeifiCation_page_info.pageIndex"
                @current-change="currentChangechannel"
                layout="prev, pager, next"
                :total="channeifiCation_page_info.totalCount">
              </el-pagination>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="形式">
          <el-select placeholder="全部" clearable v-model="classListQueryFrm.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select placeholder="全部" style="width:230px" clearable v-model="classListQueryFrm.class">
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.classify_name"
              :value="item.id">
            </el-option>
            <div class="article_pages">
              <el-pagination
                v-loading="classifiCation_page_info.tabLoading"
                :page-size="classifiCation_page_info.pageSize"
                :pager-count="selectSize"
                :current-page="classifiCation_page_info.pageIndex"
                @current-change="currentChangeClass"
                layout="prev, pager, next"
                :total="classifiCation_page_info.totalCount">
              </el-pagination>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部" clearable v-model="classListQueryFrm.state">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="置顶">
          <el-select placeholder="全部" clearable v-model="classListQueryFrm.top">
            <el-option
              v-for="item in topOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐">
          <el-select placeholder="全部" clearable v-model="classListQueryFrm.recommend">
            <el-option
              v-for="item in topOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            :editable="false"
            v-model="classListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGameList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="createContent">
            <el-button operate="" type="primary">
              <i class="fs-13 el-icon-plus mr-5"></i>添加内容
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">手动添加</el-dropdown-item>
              <el-dropdown-item command="b">内容池导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <div class="control-group">
      <el-form :inline="true">
        <el-form-item>
          <el-button perate="" @click="globalOperation(1)" type="primary">发布</el-button>
        </el-form-item>
        <el-form-item>
          <el-button perate="" @click="globalOperation(2)" type="info">撤销</el-button>
        </el-form-item>
        <el-form-item>
          <el-button operate="" @click="globalOperation(3)" type="primary">推荐</el-button>
        </el-form-item>
        <el-form-item>
          <el-button operate="" @click="globalOperation(4)" type="info">取消推荐</el-button>
        </el-form-item>
        <el-form-item>
          <el-button operate="" @click="globalOperation(5)" type="danger">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :ifmultipleSelection="true"
      @handleSelectionChange="handleSelectionChange"
      @edit="editHandler"
      @delete="deleteHandler"
      @action="actionHandler"
      @more="moreHandler"
      @popoverHandler="popoverHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import Content from '@/api/contentPlatform/content';
  import Channel from '@/api/contentPlatform/channel';
  import { parseTime } from '@/utils';

  export default {
    name: 'contentList',
    components: {
      customElTable
    },
    data() {
      return {
        selectSize: 5,
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
            label: '权重',
            prop: 'weight',
            max: 100,
            options: {
              type: 'edit'
            }
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'status',
                options: this.getStatusBtnInfo
              },
              'edit',
              'del',
              {
                type: 'MORE',
                label: '更多操作',
                operations: [
                  {
                    prop: 'top_cn',
                    operate: ''
                  },
                  {
                    prop: 'recommend_cn',
                    operate: ''
                  },
                  '查看评论'
                ]
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        classListQueryFrm: { // 查询条件
          title: '',
          source: '',
          channel: '',
          type: '',
          class: '',
          state: '',
          time: [],
          top: '',
          recommend: ''
        },
        multipleSelection: [], // 选中的数据
        query: null,
        pickerOptions: { // 时间选择器
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
        },
        channelOptions: [], // 频道
        classOptions: [], // 分类
        channeifiCation_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1,
          tabLoading: true
        },
        classifiCation_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1,
          tabLoading: true
        },
        typeOptions: [ // 形式
          {
            value: 1,
            label: '图文'
          },
          {
            value: 2,
            label: '视频'
          }
        ],
        stateOptions: [ // 状态
          {
            value: 1,
            label: '已发布'
          },
          {
            value: 0,
            label: '未发布'
          }
        ],
        topOptions: [ // 置顶
          {
            value: 1,
            label: '是'
          },
          {
            value: 0,
            label: '否'
          }
        ],
        recommendOptions: [ // 推荐
          {
            value: 1,
            label: '是'
          },
          {
            value: 0,
            label: '否'
          }
        ]
      };
    },
    created() {
      this.getData();
      this.getClassifications();
      this.getCurrentifications();
    },
    methods: {
      getData() {
        const query = this.query || {};
        // this.tabLoading = true;
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
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      searchGameList() { // 查询
        this.query = {
          title: this.classListQueryFrm.title,
          author: this.classListQueryFrm.source,
          channelId: this.classListQueryFrm.channel,
          articleType: this.classListQueryFrm.type,
          classifyId: this.classListQueryFrm.class,
          status: this.classListQueryFrm.state,
          top: this.classListQueryFrm.top,
          recommend: this.classListQueryFrm.recommend,
          startTime: this.classListQueryFrm.time ? this.classListQueryFrm.time[0] : '',
          endTime: this.classListQueryFrm.time ? this.classListQueryFrm.time[1] : ''
        };
        this.pageIndex = 1;
        this.getData();
      },
      currentChangechannel(e) { // 分页频道
        this.classifiCation_page_info.pageIndex = e;
        this.getCurrentifications();
      },
      currentChangeClass(e) { // 分页分类
        this.classifiCation_page_info.pageIndex = e;
        this.getClassifications();
      },
      getCurrentifications() { // 获取频道列表
        this.channeifiCation_page_info.tabLoading = true;
        Channel.applet.list({
          pageIndex: this.channeifiCation_page_info.pageIndex,
          pageSize: this.channeifiCation_page_info.pageSize
        }).then(data => {
          this.channelOptions = data.result;
          this.channeifiCation_page_info.totalCount = data.totalCount * 1;
          this.channeifiCation_page_info.tabLoading = false;
        });
      },
      getClassifications() { // 获取分类列表
        this.classifiCation_page_info.tabLoading = true;
        Content.class.list({
          pageIndex: this.classifiCation_page_info.pageIndex,
          pageSize: this.classifiCation_page_info.pageSize
        }).then(data => {
          this.classOptions = data.result;
          this.classifiCation_page_info.totalCount = data.totalCount * 1;
          this.classifiCation_page_info.tabLoading = false;
        });
      },
      createContent(command) { // 新增
        if (command === 'a') { // 手动添加
          this.$router.push({ name: 'addContent' });
        } else { // 自动编辑
          this.$router.push({ name: 'contentCenter' });
        }
      },
      editHandler(info) { // 编辑
        this.$router.push({
          name: 'modifyContent',
          params: {
            id: info.id
          }
        });
      },
      deleteHandler(info) { // 删除
        this.$confirm(`确认删除 <b>${info.title}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Content.list.del([info.id])
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
      handleSelectionChange(data) {
        this.multipleSelection = data;
      },
      globalOperation(type) { // 全部操作
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'info',
            message: '请选择对应的项目！'
          });
          return;
        }
        let title = '发布';
        let src = 'status';
        if (type === 2) {
          title = '撤销';
          src = 'revoke';
        } else if (type === 3) {
          title = '推荐';
          src = 'recommend';
        } else if (type === 4) {
          title = '取消推荐';
          src = 'cancel';
        } else if (type === 5) {
          title = '删除';
          src = 'del';
        }
        this.$confirm(`确认${title}？`, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const id = this.multipleSelection.map(item => item.id);
          Content.list[src](id)
            .then(() => {
              this.getData();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      actionHandler(type, info) {
        if (!info.channels && info.status === '0') {
          this.$message({
            type: 'info',
            message: '请先设置发布频道'
          });
          return;
        }
        if (type === 'status') {
          this.$confirm(`确认${info.status - 0 === 0 ? '发布' : '撤销'} <b>${info.title}</b> 吗？`, '发布', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const src = info.status - 0 === 0 ? 'status' : 'revoke';
            Content.list[src]([info.id])
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },
      moreHandler(type, info) { // 更多操作
        if (type === 'top_cn') { // 置顶
          this.$confirm(`确认${info.top - 0 === 0 ? '置顶' : '取消置顶'} <b>${info.title}</b> 吗？`, info.top - 0 === 0 ? '置顶' : '取消置顶', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Content.list.top(info.id)
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else if (type === 'recommend_cn') { // 推荐
          this.$confirm(`确认${info.recommend - 0 === 0 ? '推荐' : '取消推荐'} <b>${info.title}</b> 吗？`, info.recommend - 0 === 0 ? '推荐' : '取消推荐', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const src = info.recommend - 0 === 0 ? 'recommend' : 'cancel';
            Content.list[src]([info.id])
              .then(() => {
                this.getData();
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else if (type === '查看评论') {
          this.$router.push({
            name: 'contentComment',
            params: {
              id: info.id
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
      getStatusBtnInfo(item) { // 发布按钮样式
        if (!item) {
          return {
            btn: 'info',
            label: '撤销',
            operate: 'publish'
          };
        }
        const status = item.status * 1;
        return {
          btn: status === 0 ? 'primary' : 'info',
          label: status === 0 ? '发布' : '撤销',
          operate: status === 0 ? 'publish' : 'cancel'
        };
      },
      // 修改权重
      popoverHandler(scope, value) {
        if (Number(value) < 0) {
          this.$message({
            type: 'error',
            message: `最小只能输入0`
          });
          return;
        }
        const params = {
          id: scope.row.id,
          weight: value
        };

        Content.list.weight(params).then(res => {
          if (res.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.tableDataIndex = undefined;
            this.getData();
          } else {
            this.$message.error('意料之外的错误');
          }
        });
      }
    }
  };
</script>

<style scoped>
</style>

