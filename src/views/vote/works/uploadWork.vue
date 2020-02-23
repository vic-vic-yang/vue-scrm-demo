<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-20 10:22:49
 * @LastEditTime : 2020-01-09 15:07:21
 * @LastEditors  : Please set LastEditors
 -->
<template>
  <div class="app-container">
    <el-form
      :model="topicFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px"
    >
      <el-form-item prop="activity_id" label="活动名称">
        <el-select placeholder="请选择活动名称" v-model="topicFrm.activity_id" @change="getStage">
          <el-option
            v-for="item in wotks"
            :key="item.id"
            :label="item.activity_name"
            :value="item.id"
          ></el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="wotks_page_info.pageSize"
              :current-page="wotks_page_info.pageIndex"
              @current-change="currentChangeActivity"
              layout="prev, pager, next"
              :total="wotks_page_info.totalCount"
            ></el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item prop="stage_id" label="阶段名称">
        <el-select placeholder="请选择活动名称" v-model="topicFrm.stage_id" @change="getTask">
          <el-option v-for="item in stage" :key="item.id" :label="item.stage_name" :value="item.id"></el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="stage_page_info.pageSize"
              :current-page="stage_page_info.pageIndex"
              @current-change="currentChangeStage"
              layout="prev, pager, next"
              :total="stage_page_info.totalCount"
            ></el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item prop="mission_id" label="任务名称">
        <el-select placeholder="请选择活动名称" v-model="topicFrm.mission_id" @change="getType">
          <el-option v-for="item in task" :key="item.id" :label="item.name" :value="item.id"></el-option>
          <div class="article_pages">
            <el-pagination
              :page-size="task_page_info.pageSize"
              :current-page="task_page_info.pageIndex"
              @current-change="currentChangeTask"
              layout="prev, pager, next"
              :total="task_page_info.totalCount"
            ></el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item prop="type" label="作品类型">
        <el-select placeholder="请选择作品类型" v-model="topicFrm.type">
          <el-option
            v-for="item in type_options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" label="作品名称">
        <el-input v-model="topicFrm.title" name="title" :clearable="true" placeholder="请输入作品名称"></el-input>
      </el-form-item>
      <el-form-item prop="description" label="作品描述">
        <el-input
          v-model="topicFrm.description"
          name="description"
          :clearable="true"
          placeholder="请输入作品描述"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="topicFrm.type==5" label="音频封面">
        <upload-prize-avatar v-model="topicFrm.cover"></upload-prize-avatar>
        <small style="color: #999">建议尺寸340*340</small>
        <!-- <img-cropper :pic="share_images" @get_pic="get_pis" type="only" :width="375" :height="400"></img-cropper> -->
      </el-form-item>
      <el-form-item prop="detail" label="添加作品">
        <el-input
          v-if="topicFrm.type == 3"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="topicFrm.detail"
        ></el-input>
        <tinymce
          v-else-if="topicFrm.type == 4"
          placeholder="请输入内容"
          :height="300"
          v-model="topicFrm.detail"
        />
        <el-upload
          v-else
          v-show="!isUploadLoading"
          class="avatar-uploader"
          :before-upload="beforeWorkUpload"
          :action="$store.state.uploadImgUrl"
          :http-request="uploadAction"
          :show-file-list="false"
        >
          <video
            v-if="topicFrm.detail&&topicFrm.type == 1"
            :src="topicFrm.detail"
            controls="controls"
            width="600px"
            height="380px"
            style="margin-left:20px"
          ></video>
          <img
            v-else-if="topicFrm.detail&&topicFrm.type == 2"
            :src="topicFrm.detail"
            class="avatar"
          />
          <audio
            v-else-if="topicFrm.detail&&topicFrm.type == 5"
            :src="topicFrm.detail"
            controls="controls"
            style="margin-left:20px"
          ></audio>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-progress v-show="isUploadLoading" type="circle" :percentage="uploadPercent"></el-progress>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Activity from "@/api/vote/activity";
import Tinymce from "@/components/Tinymce";
import Upload from "@/api/upload";
import uploadPrizeAvatar from '@/components/Upload/singleImage';
export default {
  name: "uploadWork",
  components: {
    Tinymce,
    uploadPrizeAvatar
  },
  data() {
    return {
      topicFrm: {
        activity_id: "",
        stage_id: "",
        mission_id: "",
        type: "",
        title: "",
        description: "",
        detail: ""
      },
      wotks: [],
      stage: [],
      task: [],
      wotks_page_info: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1
      },
      stage_page_info: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1
      },
      task_page_info: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1
      },
      works_type_options: [
        {
          id: 1,
          name: "视频"
        },
        {
          id: 2,
          name: "照片"
        },
        {
          id: 3,
          name: "文字"
        },
        {
          id: 4,
          name: "富文本"
        },
        {
          id: 5,
          name: "音频"
        }
      ],
      type_options: [],
      uploadPercent: 0,
      showImageDel: false,
      isUploadLoading: false,
      frmRules: {
        activity_id: [
          {
            required: true,
            message: "请选择活动"
          }
        ],
        stage_id: [
          {
            required: true,
            message: "请选择阶段"
          }
        ],
        mission_id: [
          {
            required: true,
            message: "请选择任务"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择作品类型"
          }
        ],
        title: [
          {
            required: true,
            message: "请输入作品名称"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入作品描述"
          }
        ],
        detail: [
          {
            required: true,
            message: "请添加作品"
          }
        ]
      }
    };
  },
  created() {
    this.getWorks();
  },
  methods: {
    getWorks() {
      Activity.activity
        .list({
          pageIndex: this.wotks_page_info.pageIndex,
          pageSize: this.wotks_page_info.pageSize
        })
        .then(data => {
          this.wotks_page_info = {
            pageIndex: data.pageIndex * 1,
            pageSize: data.pageSize * 1,
            totalCount: data.totalCount * 1
          };
          this.wotks = data.result.map(item => {
            return {
              ...item,
              id: parseInt(item.id)
            };
          });
        });
    },
    getStage() {
      this.topicFrm.stage_id = "";
      this.topicFrm.mission_id = "";
      this.stage = [];
      this.task = [];
      Activity.stage
        .list(this.topicFrm.activity_id, {
          pageIndex: this.stage_page_info.pageIndex,
          pageSize: this.stage_page_info.pageSize
        })
        .then(data => {
          this.stage_page_info = {
            pageIndex: data.pageIndex * 1,
            pageSize: data.pageSize * 1,
            totalCount: data.totalCount * 1
          };
          this.stage = data.result.map(item => {
            return {
              ...item,
              id: parseInt(item.id)
            };
          });
        });
    },
    getTask() {
      this.topicFrm.mission_id = "";
      this.task = [];
      Activity.task
        .list(this.topicFrm.stage_id, {
          page_index: this.task_page_info.pageIndex,
          page_size: this.task_page_info.pageSize
        })
        .then(data => {
          this.task_page_info = {
            pageIndex: data.pageIndex * 1,
            pageSize: data.pageSize * 1,
            totalCount: data.totalCount * 1
          };
          this.task = data.result.map(item => {
            return {
              ...item,
              id: parseInt(item.id)
            };
          });
        });
    },
    getType() {
      this.topicFrm.detail = "";
      this.task.forEach(item => {
        if (item.id === this.topicFrm.mission_id) {
          let types = item.type.split(",");
          console.log(types);
          types.map(data => {
            this.works_type_options.map(val => {
              if (Number(data) === Number(val.id)) {
                this.type_options.push(val);
              }
            });
          });
          return;
        }
      });
    },
    beforeWorkUpload(file) {
      if (!this.topicFrm.type) {
        this.$message({
          type: "error",
          message: "请先选择任务"
        });
        return false;
      }
      if (this.topicFrm.type - 0 === 1 && file.type.split("/")[0] !== "video") {
        this.$message({
          type: "error",
          message: "请上传视频类作品"
        });
        return false;
      } else if (
        this.topicFrm.type - 0 === 2 &&
        file.type.split("/")[0] !== "image"
      ) {
        this.$message({
          type: "error",
          message: "请上传图片类作品"
        });
        return false;
      } else if (
        this.topicFrm.type - 0 === 5 &&
        file.type.split("/")[0] !== "audio"
      ) {
        this.$message({
          type: "error",
          message: "请上传音频类作品"
        });
        return false;
      }
    },
    uploadAction(res) {
      this.isUploadLoading = true;
      Upload.img(res.file, "file", e => {
        this.uploadPercent = Math.min(
          99,
          Math.floor((e.loaded * 100) / e.total)
        );
      })
        .then(res => {
          this.topicFrm.detail = res.url;
          this.isUploadLoading = false;
          this.uploadPercent = 100;
        })
        .catch(() => {
          this.isUploadLoading = false;
          this.uploadPercent = 0;
        });
    },
    currentChangeActivity(e) {
      this.wotks_page_info.pageIndex = e;
      this.getWorks();
    },
    currentChangeStage(e) {
      this.stage_page_info.pageIndex = e;
      this.getStage();
    },
    currentChangeTask(e) {
      this.task_page_info.pageIndex = e;
      this.getTask();
    },
    save() {
      this.$refs.groupFrm.validate(valid => {
        if (valid) {
          Activity.task.addPlayerWork(this.topicFrm).then(res => {
            this.$router.replace({ name: "voteWorks" });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.article_pages {
  text-align: right;
  margin: 5px 0 0;
}
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
