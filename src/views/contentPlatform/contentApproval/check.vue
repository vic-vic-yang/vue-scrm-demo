<!--
 * @Description: 审核详情
 * @Autor: shao bo
 * @Date: 2019-12-03 16:39:14
 -->
<template>
  <div class="app-container app-row">
    <div class="app-container" style="flex:3;border-right: 1px solid #ccc;">
      <manualAddContNew v-if="editFlag" :check="true" :detail="detail" @bandClick="bandClick"/>
      <template v-else>
        <header>内容信息</header>
        <el-form class="code-add__frm" label-width="80px">
          <el-form-item prop="channel_name" label="内容标题">
            <span>{{detail.title}}</span>
          </el-form-item>
          <el-form-item prop="channel_name" label="内容标签">
            <span>{{tags}}</span>
          </el-form-item>
          <el-form-item prop="channel_name" label="内容摘要">
            <span>{{detail.digest}}</span>
          </el-form-item>
          <el-form-item prop="channel_name" label="数据来源">
            <span>{{detail.author}}</span>
          </el-form-item>
          <el-form-item prop="channel_name" label="封面">
            <img :src="detail.cover" style="max-width:600px;" />
          </el-form-item>
          <el-form-item prop="channel_name" label="内容">
            <!-- <el-button type="primary">
              <a :href="previewUrl" target="_blank" class="">预览</a>
            </el-button> -->
            <a :href="previewUrl" target="_blank" class="yulan">预览</a>
            <el-button v-if="type=='1'" type='primary' @click='editFlag=true'>编辑</el-button>
          </el-form-item>
        </el-form>
      </template>

      <header>审批信息</header>
      <el-form
        ref="groupFrm"
        class="code-add__frm"
        label-width="80px"
        :rules="frmRules"
        :model="groupFrm"
      >
        <el-form-item prop="channel_name" label="正在进行">
          <el-card v-if="detail.next_step" style="margin-left: 20px">
            <div class="card">
              <div class="row between">
                <span class="name">{{detail.next_step.name}}</span>
                <span class="wait">待审核</span>
              </div>
              <div>{{nextStepOperators}}</div>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item prop="channel_name" label="批注列表">
          <div class="radio">
            <el-radio-group v-model="reverse">
              <el-radio :label="true">倒序</el-radio>
              <el-radio :label="false">正序</el-radio>
            </el-radio-group>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(item,index) of detail.audit_list"
              :key="index"
              :timestamp="item.create_time"
              placement="top"
            >
              <el-card>
                <div class="card">
                  <div class="row between">
                    <span class="name">{{item.step_name}}：{{item.realname}}-部门({{item.department}})</span>
                    <span>
                      <span v-if="parseInt(item.type) === 1" class="ag">同意</span>
                      <span v-else-if="parseInt(item.type) === 3" class="audit">发起审核</span>
                      <span v-else-if="parseInt(item.type) === 4" class="re">回退</span>
                      <span v-else-if="parseInt(item.type) === 5" class="re">撤销审核</span>
                      <span v-else class="re">拒绝</span>
                      <span v-if="index === detail.audit_list.length - 1">(最近)</span>
                    </span>

                  </div>
                  <div v-if="parseInt(item.type) != 3" class="row">
                    <span class="e-title">批注内容：</span>
                    <span style="width:88%">{{item.reason}}</span>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
        <el-form-item v-if="type=='1'" label="我的批注">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="groupFrm.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="type=='1'" type="primary" @click.prevent.stop="save(1)" :disabled="submintDisbled">同意</el-button>
          <el-button v-if="type=='1'" type="danger" @click.prevent.stop="save(2)" :disabled="submintDisbled">拒绝</el-button>
          <el-button v-if="type=='1' && detail.next_step_id > 0" type="danger" @click.prevent.stop="backWork">退回</el-button>
          <el-button @click="backTop">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="flex:2;margin-left:20px">
      <header>修改记录</header>
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
    </div>
    <el-dialog title='选择退回节点' :visible.sync='backShow' @close='backCancel'>
      <el-radio-group v-model="radio">
        <el-radio v-for="item of workFlow" :label="item.id" :key="item.id" :disabled="!item.allow_check" >{{item.name}}</el-radio>
      </el-radio-group>    
      <div slot='footer' class='dialog-footer'>
        <el-button @click='backCancel'>取 消</el-button>
        <el-button type='primary' @click='backSave'>确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title='文章详情' :visible.sync='detailShow' @close='detailCancle'>
      <el-form class="code-add__frm" label-width="80px">
        <el-form-item prop="channel_name" label="内容标题">
          <span>{{curDetail.title}}</span>
        </el-form-item>
        <el-form-item prop="channel_name" label="内容标签">
          <span>{{curDetail.tags}}</span>
        </el-form-item>
        <el-form-item prop="channel_name" label="内容摘要">
          <span>{{curDetail.digest}}</span>
        </el-form-item>
        <el-form-item prop="channel_name" label="数据来源">
          <span>{{curDetail.author}}</span>
        </el-form-item>
        <el-form-item prop="channel_name" label="封面">
          <img :src="curDetail.cover" style="max-width:100%;" />
        </el-form-item>
        <el-form-item prop="channel_name" label="内容">
          <!-- <el-button type="primary">
            <a :href="previewUrl" target="_blank" class="">预览</a>
          </el-button> -->
          <a :href="curDetail.preUrl" target="_blank" class="yulan">预览</a>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='detailCancle'>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import Content from '@/api/contentPlatform/content';
import Tinymce from '@/components/Tinymce';
import imgCropper from '@/components/Upload/imgCropper'; // 裁剪
import uploadVideo from '@/components/Upload/uploadVideo.vue';
import Approval from '@/api/contentPlatform/approval';
import ColumnsApi from '@/api/contentPlatform/columns';
import { parseTime } from '@/utils';
import Auxiliary from '@/api/contentPlatform/auxiliary';
import customElTable from '@/components/customElTable';
import manualAddContNew from '@/views/contentPlatform/content/manualAddContNew.vue';
export default {
  components: {
    Tinymce,
    imgCropper,
    uploadVideo,
    customElTable,
    manualAddContNew
  },
  data() {
    return {
      id: this.$route.params.id,
      t_id: this.$route.params.t_id,
      detail: {},
      nextStepOperators: '',
      previewUrl: '',
      draftUrl: '',
      type: this.$route.params.type,
      groupFrm: {
        content: ''
      },
      frmRules: {
        content: [
          {
            required: true,
            message: '请输入批注内容'
          }
        ]
      },
      tags: '',
      reverse: true,
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      tabLoading: true,
      editFlag: false,
      tableOptions: [
        {
          label: '姓名',
          prop: 'realname'
        },
        {
          label: '日期',
          prop: 'create_time'
        },
        {
          prop: 'USER_ACTION',
          actions: [
            {
              label: '查看',
              type: 'detail'
            }
          ]
        }
      ],
      backShow: false,
      radio: '',
      workFlow: [],
      curDetail: {},
      detailShow: false,
      submintDisbled: false // 防止同意和拒绝按钮的多次点击造成的多次提交
    };
  },
  created() {
    this.getData();
    this.getChangeList();
  },
  methods: {
    getStepList(id) {
      Approval.step({
        id: id
      })
        .then(data => {
          this.backShow = true;
          // const next_step = this.detail.next_step;
          // let flag = true;
          // for (const item of data) {
          //   if (item.id === next_step.id) {
          //     flag = false;
          //   }
          //   if (flag) {
          //     item.click = true;
          //   } else {
          //     item.click = false;
          //   }
          // }
          this.workFlow = data;
        });
    },
    getChangeList() {
      ColumnsApi.draft({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        article_id: this.$route.params.id
      })
        .then(data => {
          data.result.forEach(item => {
            if (item.create_time) {
              item.create_time = parseTime(item.create_time);
            }
          });
          this.tableData = data.result;
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    getData() {
      // 获取频道数据
      ColumnsApi.get(this.$route.params.id).then(res => {
        // res.show_type = Number(res.show_type)
        console.log(res);
        this.previewUrl = res.preUrl;
        this.draftUrl = res.draftPreUrl;
        res.audit_list.forEach(item => {
          if (item.create_time) {
            item.create_time = parseTime(item.create_time);
          }
        });
        this.detail = res;
        if (this.detail && this.detail.next_step && this.detail.next_step.users) {
          const users = this.detail.next_step.users;
          this.nextStepOperators = users.map(item => {
            return item.username + '(' + item.realname + ')';
          }).join(',');
        }
        this.getLabelifiCations();
      });
    },
    getLabelifiCations() {
      // 获取标签信息
      Auxiliary.label
        .list({
          pageIndex: 1,
          pageSize: 1000
        })
        .then(data => {
          this.labelifiCations = data.result;
          if (this.labelifiCations.length > 0) {
            let tags = '';
            this.detail.tags && this.detail.tags.map(item => {
              this.labelifiCations.map(data => {
                if (item === data.id) {
                  tags += data.tag_name + '，';
                }
              });
            });
            if (tags) {
              this.tags = tags.substr(0, tags.length - 1);
            }
          }
        });
    },
    backWork() {
      this.getStepList(this.detail.draft_id);
    },
    save(status) {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          this.submintDisbled = true;

          const params = {
            draft_id: status === 1 ? this.t_id : this.$route.params.t_id,
            type: status,
            reason: this.groupFrm.content || (status === 1 ? '同意' : '拒绝')
          };
          Approval.audit(params).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.$router.back();
            this.submintDisbled = false;
          });
        }
      });
    },
    sizeChangeHandler(size) {
      this.pageSize = size;
      this.pageIndex = 1;
      this.getChangeList();
    },
    pageChangeHandler(page) {
      this.pageIndex = page;
      this.getChangeList();
    },
    actionHandler(type, info) {
      if (type === 'detail') {
        // 查看详情
        this.detailShow = true;
        ColumnsApi.draftDetail({id: info.id, column_id: this.detail.column_id}).then(res => {
          // res.show_type = Number(res.show_type)
          console.log(res);
          if (this.labelifiCations.length > 0) {
            let tags = '';
            this.detail.tags && this.detail.tags.map(item => {
              this.labelifiCations.map(data => {
                if (item === data.id) {
                  tags += data.tag_name + '，';
                }
              });
            });
            if (tags) {
              res.tags = tags.substr(0, tags.length - 1);
            }
          }
          this.curDetail = res;
        });
      }
    },
    detailCancle() {
      this.detailShow = false;
    },
    backCancel() {
      this.backShow = false;
      this.radio = '';
    },
    backSave() {
      if (!this.radio) return;
      const params = {
        draft_id: this.detail.draft_id,
        step_id: this.radio
      };
      Approval.roolback(params).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.$router.back();
      });
      this.backCancel();
    },
    bandClick(data) {
      this.editFlag = false;
      console.log(data);
      if (data) {
        this.detail = data;
        let tags = '';
        this.detail.tags && this.detail.tags.map(item => {
          this.labelifiCations.map(data => {
            if (item === data.id) {
              tags += data.tag_name + '，';
            }
          });
        });
        if (tags) {
          this.tags = tags.substr(0, tags.length - 1);
        }
        this.previewUrl = this.draftUrl;
      }
    },
    backTop() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-row{
  display: flex

}
.content {
  height: 400px;
  overflow: auto;
  border: 1px solid #ccc;
  width: 800px;
}
header {
  margin-bottom: 20px;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 15px;
  color: #999;
}
.url{
  width: 100px;
  color: blue;
}
.card{
  display: flex;
  flex-direction: column
}
.row{
  display: flex;
  flex-direction: row;
  min-height: 14px;
}
.between{
  justify-content:space-between;
}
.el-card__body{
  padding: 8px 20px;
}
.name{
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.ag{
  color:rgb(26, 207, 231)
}
.re{
  color: red
}
.audit{
  color: rgb(135, 231, 14)
}
.wait{
  color: rgb(231, 206, 36)
}
.yulan{
    background: #409EFF;
    border-color: #66b1ff;
    color: #FFF;
    padding:10px 20px;
    border-radius:4px;
    :active{
      background: #66b1ff;
    }
}
</style>
