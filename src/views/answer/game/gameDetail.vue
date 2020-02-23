<template>
  <div class="app-container" v-loading="pageLoading">
    <detail-card :title="gameDetail.matchName">
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="item-detail-content">
            <p>游戏模式 : {{gameDetail.matchModeTxt}}</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item-detail-content">
            <p>比赛模式 : {{gameDetail.matchTypeTxt}}</p>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="exportDialogShow = true" icon="el-icon-document">导出</el-button>
        </el-col>
      </el-row>
    </detail-card>
    <!-- 导出排行榜的dialog -->
    <export-dialog v-if="exportDialogShow" @submit="exportData" @close="closeDialog" :max="totalCount" />
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
    <user-detail-modal :detail="userDetailInfo" :show.sync="userDetailDialog"></user-detail-modal>
    <el-dialog title="提示" width="470px" :visible.sync="dialogVisible">
      <el-form :model="rewardUsers" ref="rewardUsers" label-width="60px">
        <el-form-item prop="appid" label="小程序">
          <el-select placeholder="请选择小程序" v-model="rewardUsers.appid">
            <el-option
              v-for="item in appIdList"
              :key="item.authorizer_appid"
              :label="item.nick_name"
              :value="item.authorizer_appid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="money" label="金额">
          <el-input class="text" v-model="rewardUsers.money" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="ranking" label="排名">
          <el-input class="text" v-model="rewardUsers.ranking" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import DetailCard from '@/components/DetailCard';
import exportDialog from '@/components/exportDialog.vue';
import userDetailModal from './../user/userDetailModal';
import Game from '@/api/answer/game';
import { parseTime } from '@/utils';

export default {
  name: 'gameDetail',
  components: {
    customElTable,
    DetailCard,
    userDetailModal,
    exportDialog
  },
  data() {
    return {
      gameId: this.$route.params.gameId,
      gameDetail: {},
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      pageLoading: true,
      userDetailInfo: {},
      rewardUsers: {
        id: '',
        money: '',
        ranking: '',
        appid: ''
      },
      userDetailDialog: false,
      dialogVisible: false,
      appIdList: [],
      exportDialogShow: false
    };
  },
  computed: {
    gameMatchType() {
      return this.gameDetail ? this.gameDetail.matchType - 0 : 1;
    },
    tableOptions() {
      return [
        {
          label: '编号',
          prop: 'id',
          width: 80
        },
        {
          label: this.gameMatchType === 1 ? '用户名称' : '团队名称',
          prop: 'name'
        },
        {
          label: '排行',
          prop: 'ranking'
        },
        {
          label: '积分',
          prop: 'score'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              label: '查看详情',
              type: 'detail'
            },
            {
              type: 'status',
              options: this.getStatusBtnInfo
            },
            {
              label: '发奖',
              type: 'prizes',
              disableds: this.ifDisableds
            }
          ]
        }
      ];
    }
  },
  created() {
    Promise.all([Game.get(this.gameId), this.getData(), this.getAppIdList()])
      .then(res => {
        const gameDetail = res[0];
        gameDetail.matchModeTxt = this.$store.getters.getMatchMode(
          gameDetail.matchMode
        );
        gameDetail.matchTypeTxt = this.$store.getters.getMatchType(
          gameDetail.matchType
        );
        this.gameDetail = gameDetail;
        this.pageLoading = false;
      })
      .catch(() => {
        this.pageLoading = false;
      });
  },
  methods: {
    exportData(obj) {
      window.open(
        `${process.env.BASE_API}/v1/quiz/match/matches/${this.gameId}/ranking-export?start=${obj.start}&end=${obj.end}`
      );
      this.closeDialog();
    },
    closeDialog() {
      this.exportDialogShow = false;
    },
    getData() {
      this.tabLoading = true;
      return Game.rank(this.gameId, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
        .then(data => {
          this.tableData = (data.items || []).map(item => {
            return {
              ...item,
              id: item.player.id,
              playerId: item.id,
              name: item.player.name,
              createTime: parseTime(item.createTime)
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
          return data;
        })
        .catch(err => {
          this.tabLoading = false;
          return Promise.reject(err);
        });
    },
    getAppIdList() {
      Game.appIdList().then(res => {
        this.appIdList = res.data;
      });
    },
    actionHandler(type, info) {
      if (type === 'detail') {
        if (this.gameMatchType === 1) {
          this.userDetailInfo = {
            userName: info.name,
            userId: info.id
          };
          this.userDetailDialog = true;
        } else if (this.gameMatchType === 2) {
          this.$router.push({ name: 'teamDetail', params: { id: info.id } });
        }
      } else if (type === 'prizes') {
        this.rewardUsers = {
          id: info.playerId,
          ranking: info.ranking
        };
        this.dialogVisible = true;
      } else if (type === 'status') {
        const text = info.status - 0 === 0 ? '已发' : '未发';
        this.$confirm(`确认修改为${text}吗？`, info.statusTxt, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            Game.revise({
              id: info.playerId
            }).then(res => {
              if (res.code === 200) {
                this.getData();
                this.$message({
                  type: 'success',
                  message: `已修改`
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: `已取消`
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
    cancel() {
      this.dialogVisible = false;
    },
    save() {
      Game.prizes(this.rewardUsers).then(res => {
        if (res.code === 200) {
          this.getData();
          this.$message({
            type: 'success',
            message: `奖金发放成功`
          });
        }
      });
      this.dialogVisible = false;
    },
    getStatusBtnInfo(item) {
      if (!item) {
        return {
          btn: 'danger',
          label: '已发'
        };
      }
      return {
        btn: item.status * 1 === 0 ? 'primary' : 'danger',
        label: item.status * 1 === 0 ? '未发' : '已发'
      };
    },
    ifDisableds(item) {
      if (!item) {
        return false;
      }
      let cont = true;
      if (item.status * 1 === 0) {
        cont = false;
      }
      return cont;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.text {
  width: 80%;
}
</style>
<style lang="scss">
.export-dialog {
  /* 谷歌 */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  /* 火狐 */
  input {
    -moz-appearance: textfield;
  }
}
</style>
