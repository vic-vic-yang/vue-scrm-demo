<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="gameListQueryFrm" :model="gameListQueryFrm">
        <el-form-item prop="matchName" label="比赛名称">
          <el-input placeholder="比赛名称" v-model="gameListQueryFrm.matchName"></el-input>
        </el-form-item>
        <el-form-item prop="matchMode" label="游戏模式">
          <el-select placeholder="全部" clearable v-model="gameListQueryFrm.matchMode">
            <el-option v-for="item in matchModeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="matchType" label="比赛模式">
          <el-select placeholder="全部" clearable v-model="gameListQueryFrm.matchType">
            <el-option v-for="item in matchTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="选择状态">
          <el-select v-model="gameListQueryFrm.status" clearable placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="选择时间">
          <el-date-picker
            :editable="false"
            v-model="gameListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGameList" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('gameListQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>新增
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
      @page-change="pageChangeHandler"
    ></custom-el-table>
    <el-dialog title="前置条件" :visible.sync="prepositionShow">
      <el-form :model="preposition">
        <el-form-item prop="is_from" label="是否需要填写表单">
          <el-switch
            name="is_from"
            v-model="preposition.is_from">
          </el-switch>
        </el-form-item>
        <template v-if="preposition.is_from == 1">
          <el-form-item prop="is_from" label="表单元素">
            <el-tag
              style="margin-left: 10px;"
              v-for="(item, index) in preposition.from"
              :key="index"
              closable
              @close="handleClose(index)">
              {{item}}
            </el-tag>
          </el-form-item>
          <el-form-item prop="is_from" label="">
            <el-input style="width: 200px;" v-model="prepositionInput" placeholder="新增元素"></el-input>
            <i @click="addElement" style="font-size: 16px;vertical-align:middle;cursor: pointer;font-weight: bold;margin-left: 15px;" class="el-icon-plus"></i>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="prepositionShow = false">取 消</el-button>
        <el-button type="primary" @click="prepositionSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customElTable from '@/components/customElTable';
import Game from '@/api/answer/game';
import { parseTime } from '@/utils';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  name: 'gameList',
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
          label: '比赛名称',
          prop: 'matchName'
        },
        {
          label: '游戏模式',
          prop: 'matchMode'
        },
        {
          label: '比赛模式',
          prop: 'matchType'
        },
        {
          label: '状态',
          prop: 'statusTxt',
          options: {
            type: 'tag',
            prop: 'status'
          },
          width: 120
        },
        {
          label: '开始时间',
          prop: 'startTime',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          label: '结束时间',
          prop: 'endTime',
          sortable: true,
          width: 105,
          className: 'ph-6'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              type: 'detail',
              label: '排名'
            },
            {
              type: 'name',
              label: '称号'
            },
            {
              type: 'view',
              label: '界面'
            },
            {
              type: 'reward',
              label: '奖励'
            },
            {
              type: 'preposition',
              label: '前置'
            },
            'edit',
            // {
            //   type: 'status',
            //   options: this.getStatusBtnInfo
            // },
            'del'
          ]
        }
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      gameListQueryFrm: {
        matchName: '',
        matchMode: '',
        matchType: '',
        status: '',
        time: []
      },
      query: null,
      preposition: {
        match_id: '',
        is_from: 0,
        from: ''
      },
      prepositionInput: '',
      prepositionShow: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState({
      matchModeOptions: state => state.game.matchMode,
      matchTypeOptions: state => state.game.matchType,
      statusOptions: state => state.game.status
    })
  },
  methods: {
    getData() {
      const query = this.query || {};
      this.tabLoading = true;
      Game.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...query
      }).then(data => {
        this.tableData = (data.result || []).map(item => {
          return {
            ...item,
            matchMode: this.$store.getters.getMatchMode(item.matchMode),
            matchType: this.$store.getters.getMatchType(item.matchType),
            statusTxt: this.$store.getters.getStatusTxt(item.status),
            startTime: parseTime(item.startTime),
            endTime: parseTime(item.endTime)
          };
        });
        this.totalCount = data.totalCount * 1;
        this.tabLoading = false;
      });
    },
    searchGameList() {
      this.query = _.cloneDeep(this.gameListQueryFrm);
      let startTime = '';
      let endTime = '';
      if (this.query.time && this.query.time.length === 2) {
        const time = this.query.time;
        startTime = time[0];
        endTime = time[1];
      }
      this.$set(this.query, 'startTime', startTime);
      this.$set(this.query, 'endTime', endTime);
      this.$delete(this.query, 'time');
      this.pageIndex = 1;
      this.getData();
    },
    createGame() {
      this.$router.push({ name: 'gameCreate' });
    },
    editHandler(info) {
      this.$router.push({ name: 'gameModify', params: { id: info.id }});
    },
    deleteHandler(info) {
      this.$confirm(`确认删除比赛 <b>${info.matchName}</b> 吗？`, '删除', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Game.del(info).then(() => {
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    actionHandler(type, info) {
      if (type === 'status') {
        const title = this.$store.getters.getStatusTxt(!(info.status * 1));
        this.$confirm(`确认${title}比赛 <b>${info.matchName}</b> 吗？`, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            Game.status(info).then(() => {
              this.getData();
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
      } else if (type === 'name') {
        this.$router.push({
          name: 'gameNameList',
          params: {
            gameId: info.id
          }
        });
      } else if (type === 'detail') {
        this.$router.push({
          name: 'gameDetail',
          params: {
            gameId: info.id
          }
        });
      } else if (type === 'view') {
        this.$router.push({
          name: 'gameView',
          params: {
            gameId: info.id
          }
        });
      } else if (type === 'reward') {
        this.$router.push({
          name: 'gameReward',
          params: {
            gameId: info.id
          }
        });
      } else if (type === 'preposition') {
        this.preposition.match_id = info.id;
        this.preposition.from = info.from;
        this.preposition.is_from = Boolean(info.is_from);
        this.prepositionShow = true;
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
      return {
        btn: status === 0 ? 'primary' : 'danger',
        label: this.$store.getters.getStatusTxt(!status)
      };
    },
    addElement() {
      if (this.prepositionInput) {
        this.preposition.from.push(this.prepositionInput);
        this.prepositionInput = '';
      }
    },
    handleClose(index) {
      this.preposition.from.splice(index, 1);
    },
    prepositionSave() {
      Game.preposition.add(this.preposition).then(res => {
        this.prepositionShow = false;
        this.getData();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
</style>
