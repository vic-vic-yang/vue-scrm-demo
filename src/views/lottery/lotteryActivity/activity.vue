<template>
  <div class="app-container">
    <div class="control-group mb-20">
      <el-button type="primary" @click="createLotteryActivity">
        <i class="el-icon-plus mr-5 fs-13"></i> 新建活动
      </el-button>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
      @edit="editHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
    <el-dialog
      class="activity-preview-dialog"
      title="活动预览"
      :visible.sync="previewDialogVisible">
      <div class="preview-wrapper mb-30 ph-20">
        <p class="fs-16">活动链接：</p>
        <div class="d-flex flex-justify-space flex-align-center">
          <div class="flex-box-autoFix">
            <el-input disabled v-model="previewActivity.url"></el-input>
          </div>
          <el-button slot="append" type="primary" class="ml-10 d-block" @click="copyPreviewUrl">复制</el-button>
        </div>
        <p class="fs-16">扫码二维码访问</p>
        <div class="activity-qr" v-loading="previewImgLoading">
          <img @load="previewImgLoading=false" @error="previewImgLoading=false" :src="previewActivity.image"/>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import lotteryActivityManager from '@/api/lottery/lotteryActivityManager';
  import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'lotteryList',
    components: {
      customElTable
    },
    data() {
      return {
        tableOptions: [
          {
            label: 'ID',
            prop: 'id',
            width: '50'
          },
          {
            label: '活动标题',
            prop: 'name'
          },
          {
            label: '对应规则',
            prop: 'lottery_rule_name'
          },
          {
            label: '状态',
            prop: 'statusTxt',
            options: {
              type: 'tag',
              prop: 'status'
            }
          },
          {
            label: '关联码段',
            prop: 'code_num'
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
                type: 'record',
                label: '中奖纪录'
              },
              {
                type: 'preview',
                label: '预览'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        previewDialogVisible: false,
        previewActivity: {},
        previewImgLoading: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.tabLoading = true;
        lotteryActivityManager.list({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(data => {
          this.tableData = (data.result || []).map(item => {
            return _.merge(item, {
              code_num: item.code_id ? item.code_id.split(',').length : 0,
              statusTxt: ['停用', '启用'][item.status],
              create_time: parseTime(item.create_time)
            });
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      createLotteryActivity() {
        this.$router.push({ name: 'lotteryActivityCreate' });
      },
      copyPreviewUrl() {
        this.$copyText(this.previewActivity.url).then(() => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
        }, () => {
          this.$message({
            message: '复制失败',
            type: 'error'
          });
        });
      },
      actionHandler(type, item) {
        if (type === 'preview') {
          lotteryActivityManager.preview(item.id).then(res => {
            this.previewActivity = res;
            this.previewImgLoading = true;
            this.previewDialogVisible = true;
          });
        } else if (type === 'record') {
          this.$router.push({ name: 'activityAwardRecord', params: { activityId: item.id }});
        }
      },
      editHandler(item) {
        this.$router.push({ name: 'lotteryActivityModify', params: { id: item.id }});
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .activity-qr {
    width: 150px;
    height: 150px;
    line-height: 0;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
    }
  }
</style>
