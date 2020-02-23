<!--
 * @Description: 商城设置
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-10-21 18:32:29
 -->
<template>
  <div class="app-container integral-rule" v-loading="pageLoading">
    <header>基本设置</header>
    <el-form
      :model="ruleFm"
      ref="frmRules"
      label-width="100px">
      <el-form-item prop="content" label="积分规则">
        <tinymce placeholder="请输入积分规则" :height="300" :toolbar="toolbar" v-model="ruleFm.content"/>
      </el-form-item>
      <el-form-item label="任务选择">
        <el-form-item v-for="(item,index) of ruleFm.missions" :key="index">
          <!--<el-select placeholder="请选择任务" style="width:350px;margin-bottom:8px;margin-right:12px" v-model="item.mission_id" @change="typeChange(item.mission_id, index)">-->
            <!--<el-option-->
              <!--v-for="item in taskOptions"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <div style="display: inline-block;width:350px;margin-bottom:8px;margin-right:12px">
            <select-task v-model="item.mission_id"
                         :parameter="{id: item.mission_id, index}"
                         :multiple="false"
                         @taskHandler="typeChange"/>
          </div>
          <i
            :span="2"
            v-if="ruleFm.missions.length > 1"
            class="el-icon-delete"
            @click.stop="delLine(index)"
            style="color:#fff;background-color: #f56c6c;padding:10px;border-radius:50%;margin-left:22px;vertical-align:top;"
          ></i>
          <i
            :span="2"
            v-if="index === ruleFm.missions.length - 1"
            class="el-icon-plus"
            @click.stop="addLine"
            style="color:#fff;background-color: #409eff;padding:10px;border-radius:50%;vertical-align:top;"
          ></i>
          <el-form-item v-if='item.show'>
            <el-select v-model="item.activity_id" style="width:350px;margin-bottom:22px" placeholder="请选择关联活动">
              <el-option
                v-for="item in item.activityDetail"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import integral from '@/api/integralMall/integral';
import Task from '@/api/task/index';
import Game from '@/api/answer/game';
import VoteActivity from '@/api/vote/activity';
import Readingactivity from '@/api/readingClub/activityManagement';
import selectTask from '@/components/task/index';

export default {
  name: 'integralRule',
  components: {
    Tinymce,
    selectTask
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 100,
      ruleFm: {
        id: '',
        content: '',
        missions: []
      },
      taskOptions: [],
      answerActivity: [],
      voteActivity: [],
      readingActivity: [],
      pageLoading: true,
      toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample fontsizeselect', 'hr bullist numlist link image charmap	 preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen']
    };
  },
  created() {
    Promise.all([
      this.getAnswerActiv(),
      this.getReadingactivity(),
      this.getVoteActivity()
    ])
      .then(res => {
        this.getPrizeTask();
        this.pageLoading = false;
      })
      .catch(() => {
        this.pageLoading = false;
      });
  },
  methods: {
    getData() {
      integral.get_rule().then(res => {
        this.initRule(res.data);
        this.pageLoading = false;
      }).catch(err => {
        this.pageLoading = false;
        this.$message({
          type: 'info',
          message: err.message
        });
      });
    },
    initRule(data) {
      this.ruleFm = Object.assign(this.ruleFm, data);
      this.ruleFm.id = data.integral_desc.id;
      this.ruleFm.content = data.integral_desc.content;
      if (data.missions && data.missions.length > 0) {
        for (let i = 0; i < data.missions.length; i++) {
          this.initMission(i);
        }
      }
      if (!this.ruleFm.missions) {
        this.ruleFm.missions = [];
      }
      if (this.ruleFm.missions.length === 0) {
        this.addLine();
      }
      console.log('missions');
      console.log(this.ruleFm.missions);
      this.ruleFm.content = this.ruleFm.content ? this.ruleFm.content.replace(/\<img/gi, '<img style="max-width:90%;height:auto"') : '';
    },
    initMission(index) {
      const mission_id = String(this.ruleFm.missions[index].mission_id);
      const activity_id = String(this.ruleFm.missions[index].activity_id);
      for (const item of this.taskOptions) {
        if (item.id === mission_id) {
          this.ruleFm.missions[index].taskDetail = item;
          break;
        }
      }
      if (activity_id && activity_id !== '0') {
        this.ruleFm.missions[index].show = true;
      }
      this.ruleFm.missions[index].mission_id = mission_id;
      this.ruleFm.missions[index].activity_id = activity_id;
      this.ruleFm.missions[index].taskDetail && this.getActive(Number(this.ruleFm.missions[index].taskDetail.type_small), index);
    },
    getPrizeTask() {
      Task.getTasks({
        page_index: 1,
        page_size: 1000
      }).then(data => {
        console.log(data);
        this.taskOptions = data.result;
        this.getData();
      });
    },
    edit() {
    },
    delLine(index) {
      if (this.ruleFm.missions.length > 1) {
        this.ruleFm.missions.splice(index, 1);
      }
    },
    addLine() {
      this.ruleFm.missions.push({
        mission_id: '',
        taskDetail: [],
        activity_id: '',
        activityDetail: []
      });
    },
    getMissions() {
      let missions = {};
      let i = 0;
      for (const item of this.ruleFm.missions) {
        if (item.mission_id) {
          if ((item.taskDetail.type * 1 === 6 || item.taskDetail.type * 1 === 8) && !item.activity_id) {
            this.$message({
              type: 'error',
              message: `请选择任务"${item.taskDetail.name}"的关联活动`
            });
            return 'error';
          }
          missions[i] = {
            mission_id: item.mission_id,
            activity_id: item.activity_id
          };
          i++;
        }
      }
      if (i === 0) {
        missions = '';
      } else {
        missions = JSON.stringify(missions);
      }
      return missions;
    },
    save() {
      const missions = this.getMissions();
      if (missions === 'error') {
        return;
      }
      integral.edit_rule({
        id: this.ruleFm.id,
        content: this.ruleFm.content,
        missions: missions
      }).then(res => {
        this.$router.back();
      }).catch(err => {
        this.$message({
          type: 'info',
          message: err.message
        });
      });
    },
    typeChange({id, index}) {
      for (const item of this.taskOptions) {
        console.log(item);
        if (Number(item.id) === Number(id)) {
          this.ruleFm.missions[index].taskDetail = item;
          if (this.ruleFm.missions[index].taskDetail.type * 1 === 6 || this.ruleFm.missions[index].taskDetail.type * 1 === 8) {
            this.ruleFm.missions[index].activity_id = '';
            this.ruleFm.missions[index].show = true;
            this.activeList = [];
            this.getActive(Number(this.ruleFm.missions[index].taskDetail.type_small), index);
          } else {
            this.ruleFm.missions[index].show = false;
            this.ruleFm.missions[index].activity_id = '';
          }
          break;
        }
      }
    },
    getActive(type_small, index) {
      switch (type_small) {
        case 601: this.ruleFm.missions[index].activityDetail = this.answerActivity; break;
        case 605: this.ruleFm.missions[index].activityDetail = this.readingActivity; break;
        case 603:
        case 606: this.ruleFm.missions[index].activityDetail = this.voteActivity; break;
      }
    },
    getReadingactivity() {
      Readingactivity.activityList({
        page_index: this.pageIndex,
        page_size: this.pageSize
      }).then(res => {
        this.readingActivity = res.result || [];
      });
    },
    getVoteActivity() {
      VoteActivity.activity.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.voteActivity = (res.result || []).map(item => {
          return {
            ...item,
            name: item.activity_name
          };
        });
      });
    },
    getAnswerActiv() {
      Game.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.answerActivity = (res.result || []).map(item => {
          return {
            ...item,
            name: item.matchName
          };
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  header{
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
  .content{
    max-width: 90%;
    margin:  0 auto;
    overflow: hidden;
    img{
      max-width: 100%;
      height: auto;
    }
  }
</style>
