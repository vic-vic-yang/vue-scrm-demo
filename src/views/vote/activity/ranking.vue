<template>
  <div class="app-container">
    <div>
      <span>活动阶段</span>
      <el-select v-model="stageId" @change="changestage">
        <el-option
          v-for="(item, index) in stages"
          :key="index"
          :label="item.stage_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 20px;"
        type="primary"
        @click="exportDialogShow = true"
        icon="el-icon-document"
      >导出</el-button>
      <!-- 导出排行榜的dialog -->
      <export-dialog v-if="exportDialogShow" @submit="exportData" @close="closeDialog" :max="totalCount" />
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler"
      style="width: 600px;"
      class="mt-20"
    ></custom-el-table>
  </div>
</template>
<script>
import customElTable from "@/components/customElTable";
import Activity from "@/api/vote/activity";
import exportDialog from "@/components/exportDialog.vue";
export default {
  name: "",
  props: {},
  mixins: [],
  components: { 
    customElTable,
    exportDialog
  },
  data() {
    return {
      activityId: this.$route.params.id,
      tabLoading: false,
      stageId: "",
      stages: [],
      tableData: [],
      tableOptions: [
        {
          label: "用户名称",
          prop: "nickname",
          width: 80
        },
        {
          label: "排名",
          prop: "ranking"
        },
        {
          label: "票数",
          prop: "tickets"
        }
      ],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 1,
      exportDialogShow: false
    };
  },
  created() {},
  mounted() {
    this.getstages();
  },
  methods: {
    exportData(obj) {
      window.open(
        `${process.env.BASE_API}/ugc/v1/compositions/export?activityId=${this.activityId}&start=${obj.start}&end=${obj.end}`
      );
      this.closeDialog();
    },
    closeDialog(){
      this.exportDialogShow = false;
    },
    changestage() {
      this.getData();
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
    getstages() {
      Activity.stage
        .list(this.activityId, {
          pageIndex: 1,
          pageSize: 100
        })
        .then(res => {
          this.stages = res.result;
          this.getData();
        });
    },
    getData() {
      const obj = {
        // stage: this.stageId,
        activityId: this.activityId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      Activity.rank.activeRankList(obj).then(res => {
        this.totalCount = res.totalCount * 1;
        this.tableData = res.result;
      });
    }
  }
};
</script>
<style lang="scss">
</style>