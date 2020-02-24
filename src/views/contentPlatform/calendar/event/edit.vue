<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="name" label="事件名称">
        <el-input
          v-model="formFrm.name"
          placeholder="请输入事件名称"
          :maxlength="50"
          name="name"
          :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="time" label="事件时间">
        <el-date-picker
          :editable="false"
          v-model="formFrm.time"
          type="datetimerange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="事件标签">
        <select-tags v-model="formFrm.tag" :multiple="true"/>
      </el-form-item>
      <el-form-item label="事件附件">
        <el-table :data="formFrm.file" border class="box-file" size="mini">
          <el-table-column label="文件名" prop="file_name"></el-table-column>
          <el-table-column label="文件格式" prop="file_type"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="delFile(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-upload
            action="/api/v1/fileUpload/file-upload/file-upload"
            name="file"
            :http-request="uploadAction"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :with-credentials="true"
            :show-file-list="false">
            <el-button type="primary" style="margin-top: 20px;" size="small"><i class="el-icon-uploadmr-5"></i>上传附件
            </el-button>
          </el-upload>
      </el-form-item>
      <el-form-item prop="describe" label="事件内容">
        <el-input
          v-model="formFrm.describe"
          placeholder="请输入事件内容"
          :maxlength="1000"
          name="name"
          type="textarea"
          :rows="10"
          :clearable="true">
        </el-input>
      </el-form-item>

      <div v-for="(item, index) in related" :key="index" class="related-item">
        <el-form-item label="标题">
          <el-input
            v-model="item.title"
            placeholder="请输入标题"
            :maxlength="100"
            name="name"
            style="width: 214px"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input
            v-model="item.digest"
            placeholder="请输入摘要"
            :maxlength="100"
            name="name"
            style="width: 214px"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="关联类型">
          <el-select placeholder="请选择关联类型" v-model="item.type">
            <el-option
              v-for="typeOption in typeOptions"
              :key="typeOption.id"
              :label="typeOption.name"
              :value="typeOption.id">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="item.type === 1">
          <el-form-item label="活动类型">
            <el-select placeholder="请选择活动类型" v-model="item.activity_type" @change="typeChange($event, item, index)">
              <el-option
                v-for="activityTypeOp in activityTypeOption"
                :key="activityTypeOp.id"
                :label="activityTypeOp.value"
                :value="activityTypeOp.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择活动">
            <el-select placeholder="请选择活动" v-model="item.activity_id">
              <el-option
                v-for="activityOption in activityOptions[item.activity_type]"
                :key="activityOption.id"
                :label="activityOption.activity_name"
                :value="activityOption.id">
              </el-option>
              <el-pagination
                v-loading="activity_page_info.tabLoading"
                :page-size="activity_page_info.pageSize"
                :current-page="activity_page_info.pageIndex"
                @current-change="currentChangeActivity"
                layout="prev, pager, next"
                :total="activity_page_info.totalCount">
              </el-pagination>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item v-if="item.type === 3" label="关联url">
          <el-input
            v-model="item.url"
            placeholder="请输入关联url"
            :maxlength="1000"
            name="name"
            style="width: 400px"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item  v-if="item.type === 2" label="关联小程序内容">
          <related-content v-model="item.content_id" :multiple="false"/>
        </el-form-item>

        <div class="del-related-item" @click="delRelated(index)">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <el-form-item label="">
        <el-button type="primary" icon="el-icon-plus" @click="addRelated"></el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import selectTags from '../components/selectTags';
  import relatedContent from '../components/relatedContent/index';
  import CALENDAR from '@/api/contentPlatform/calendar';
  import _ from 'lodash';
  import ACTIVITY_API from '@/api/activityCenter/index';
  import { parseTime } from '@/utils';

  export default {
    name: 'editor',
    components: {
      selectTags,
      relatedContent
    },
    data() {
      return {
        tempFileInfo: {},
        isUploadLoading: null,
        action: this.$route.params.id ? 'modify' : 'add',
        pageLoading: true,
        formFrm: {
          id: this.$route.params.id || 0,
          name: '',
          time: '',
          type: '',
          tag: [],
          file: [],
          describe: ''
        },
        related: [
          {
            id: 0,
            type: '',
            activity_type: '',
            activity_id: '',
            url: '',
            content_id: '',
            digest: '',
            title: ''
          }
        ],
        typeOptions: [
          {
            id: 1,
            name: '活动'
          },
          {
            id: 3,
            name: '外链'
          },
          {
            id: 2,
            name: '内容'
          }
        ],
        activityTypeOption: [],
        activityOptions: {},
        activity_page_info: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1,
          tabLoading: true
        },
        frmRules: {
          name: [{required: true, message: '请输入事件名称'}],
          time: [{required: true, message: '请选择事件时间'}],
          describe: [{required: true, message: '请输入事件内容'}]
        }
      };
    },
    created() {
      Promise.all([
        this.getActivityTypes(),
        this.getData()
      ]);
    },
    methods: {
      delFile(data) {
        console.log(data);
        this.formFrm.file.splice(data.$index, 1);
      },
      beforeUpload(res) {
        console.log(res);
        const temp = res.name.split('.');
        const file_type = temp[temp.length - 1].toLocaleUpperCase();
        this.tempFileInfo = Object.assign(this.tempFileInfo, {file_name: res.name, file_type: file_type});
        this.isUploadLoading = this.$loading({
          lock: true,
          text: '正在导入',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      uploadSuccess(res) {
        console.log(res);
        this.tempFileInfo = Object.assign(this.tempFileInfo, {id: res.id, file_path: res.url});
        this.formFrm.file.push(Object.assign({}, this.tempFileInfo));
        this.isUploadLoading.close();
        this.$message({
          message: '导入成功',
          type: 'success'
        });
      },
      uploadError(err) {
        this.isUploadLoading.close();
        this.$message({
          message: (err && err.message) ? err.message : '导入失败',
          type: 'error'
        });
      },
      uploadAction(res) {
        CALENDAR.collection.upload(res.file, '/v1/fileUpload/file-upload/file-upload').then(this.uploadSuccess)
          .catch(this.uploadError);
      },
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        CALENDAR.event.get(this.formFrm.id).then(res => {
          this.formFrm = _.assign({}, this.formFrm, res);
          this.$set(this.formFrm, 'time', [parseTime(this.formFrm.start_time * 1), parseTime(this.formFrm.end_time * 1)] || '');
          this.$set(this.formFrm, 'tag', res.tag.map(item => item.id) || []);
          this.related = (this.formFrm.extend || []).map(item => {
            if (Number(item.type) === 1) {
              this.getActivity(Number(item.activity_type));
            }
            return {
              ...item,
              id: Number(item.id),
              type: Number(item.type),
              activity_type: Number(item.activity_type)
            };
          });
          console.log(this.related);
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      getActivityTypes() {
        return ACTIVITY_API.getTypes().then(res => {
          this.activityTypeOption = res;
          this.activityTypeOption.splice(0, 1);
          return res;
        }).catch(() => {
          return true;
        });
      },
      typeChange(e, item, index) {
        this.activity_page_info.pageIndex = 1;
        const obj = {
          ...item,
          activity_id: null
        };
        this.related.splice(index, 1, obj);
        this.getActivity(e);
      },
      getActivity(type) {
        ACTIVITY_API.list({
          pageSize: this.activity_page_info.pageSize,
          pageIndex: this.activity_page_info.pageIndex,
          type
        }).then(res => {
          this.activityOptions[type] = res.result || [];
          this.activity_page_info.totalCount = res.totalCount * 1;
          this.activity_page_info.tabLoading = false;
        });
      },
      currentChangeActivity(e) { // 分页频道
        this.activity_page_info.pageIndex = e;
        this.getActivity(0);
      },
      addRelated() {
        this.related.push({
          id: 0,
          type: '',
          activity_type: '',
          activity_id: '',
          url: '',
          content_id: '',
          digest: '',
          title: ''
        });
      },
      delRelated(index) {
        this.related.splice(index, 1);
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            this.$set(formFrm, 'start_time', formFrm.time[0] || '');
            this.$set(formFrm, 'end_time', formFrm.time[1] || '');
            this.$set(formFrm, 'extend', this.related || []);
            formFrm.file = formFrm.file.map(item => item.id).join(',');
            (this.action === 'modify' ? CALENDAR.event.edit(formFrm) : CALENDAR.event.add(formFrm))
              .then((res) => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: `${this.action === 'modify' ? '修改' : '添加'}成功`
                  });
                  if (!this.$route.matched.length) {
                    this.$router.replace({name: 'eventMagage'});
                  } else {
                    this.$router.back();
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `${this.action === 'modify' ? '修改' : '添加'}失败`
                  });
                }
              });
          }
        });
      }
    }
  };
</script>
<style lang="scss">
.box-file .el-table {

}
</style>
<style lang="scss" scoped>
  .related-item{
    position: relative;
    border: 1px solid #eee;
    margin-bottom: 15px;
    padding: 10px 0;
  }
  .del-related-item{
    width: 24px;
    height: 24px;
    background: rgba(0,0,0,0.3);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-close{
      font-size: 18px;
      color: #fff;
    }
  }
</style>
