<template>
  <div class="activity-wrapper app-container">
    <header>档案基本信息</header>
      <div v-for="(item, index) in fields" style="margin-bottom: 10px">
        <span class="content-title" style="display: inline-block;width: 80px">{{ item.name }}</span>
        <span v-if="item.type !== 'image'" class="content-div">{{ item.show_value }}</span>
        <el-image v-if="item.type === 'image'" :src="item.show_value" alt="" style="width: 100px; height: 100px" fit="cover"/>
        <el-popover
          v-model="item.showPopOver"
          v-if="item.type !== 'district'"
          style="margin-left: 10px"
          placement="bottom-start"
          width="auto">
          <div>
            <dynamic-form :formsConfig="item"></dynamic-form>
            <i @click="modifyItem(index)" class="el-icon-check"></i>
            <i @click="item.showPopOver=false" class="el-icon-close"></i>
          </div>
          <i style="font-size: 12px" @click="item.showPopOver=true" class="el-icon-edit" slot="reference"></i>
        </el-popover>
      </div>
    <header>档案记录详情</header>
    <el-form ref="form" :inline="true" label-width="120px">
      <el-form-item>
        <el-button type="primary" @click="addRecord" icon="el-icon-plus">新增用户记录档案</el-button>
      </el-form-item>
    </el-form>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @action="actionHandler"
    @delete="deleteHandler">
<!--      @handleSelectChange2="statusChange"-->
<!--      @action="actionHandler"-->
<!--      @blurInput="blurInputHandler"-->
<!--      @pass="passHandler"-->
<!--      @reject="rejectHandler"-->
<!--      @cell-click="cellClick"-->
<!--      @size-change="sizeChangeHandler"-->
<!--      @page-change="pageChangeHandler">-->
    </custom-el-table>
    <el-dialog
      title="档案记录详情"
      :visible.sync="dialogVisible"
      width="60%">
      <div style="display: flex;flex-direction: column;line-break: auto" class="dialog-div">
        <span class="dialog-title">参与事件</span>
        <span>{{ viewData.activity }}</span>
        <el-image :src="viewData.activity_cover" alt="" style="width: 200px; height: 200px" fit="cover"/>
        <!--        <span>{{ viewData.activity_cover }}</span>-->
        <span class="dialog-title">事件类型</span>
        <span>{{ viewData.activity_type_name }}</span>
        <span class="dialog-title">参与时间</span>
        <span>{{ viewData.join_time }}</span>
        <span class="dialog-title">事件简介</span>
        <span>{{ viewData.description }}</span>
        <span class="dialog-title">参与详情</span>
        <el-image v-if="viewData.detail" :src="viewData.detail" alt="" style="width: 200px; height: 200px" fit="cover"/>
        <span v-else>无</span>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增记录"
      :visible.sync="addRecordVisible"
      width="60%">
      <el-form ref="recordForm" :rules="recordFormRules" :model="recordForm" label-width="80px">
        <el-form-item prop="activity_id" label="活动选择">
          <el-select placeholder="活动类型"  v-model="recordForm.activity_id" value="">
            <el-option
              v-for="(item, index) of this.activities" :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="join_time" label="参加时间">
          <el-date-picker
            v-model="recordForm.join_time"
            style="width: 240px"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择参与时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="detail" label="参与详情">
          <upload-prize-avatar v-model="recordForm.detail"  @update:imageId=""></upload-prize-avatar>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveRecord">确 定</el-button>
      <el-button type="danger" @click="addRecordVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import USER_GROWTH_API from '@/api/userCenter/growth/index';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import customElTable from '@/components/customElTable';
  import dynamicForm from '@/components/dynamicForm';
  import {parseTime } from '@/utils/index';
  import {value2Label } from '@/utils/enum';

  export default {
    name: 'userGrowthEditType',
    components: {
      uploadPrizeAvatar,
      customElTable,
      dynamicForm
    },
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        dialogVisible: false,
        addRecordVisible: false,
        visible: false,
        docForm: {
          name: '',
          sex: '',
          birthday: '',
          age: '',
          address: '',
          relation: '',
          avatar: '',
          stage: '',
          id: 0
        },
        viewData: {
          activity: '',
          activity_cover: '',
          activity_type_name: '',
          join_time: '',
          description: '',
          detail: ''
        },
        recordForm: {
          activity_id: '',
          join_time: '',
          detail: ''
        },
        fields: [],
        frmRules: {
          name: [
            {
              min: 3, message: '请填写正确的档案模型', trigger: 'blur'
            }
          ]
        },
        recordFormRules: {
          activity_id: [
            {required: true, message: '请选择活动', trigger: 'blur'}
          ],
          join_time: [
            {required: true, message: '请选择时间', trigger: 'blur'}
          ]
        },
        activities: [],
        tableOptions: [
          {
            label: '序号',
            prop: 'id',
            width: 120
          },
          {
            label: '参与事件',
            prop: 'activity'
          },
          {
            label: '事件类型',
            prop: 'activity_type_name'
          },
          {
            label: '参与时间',
            prop: 'join_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'view',
                label: '详情',
                btn: 'primary',
                showBtn: function(action, scope) {
                  return scope.activity_type_name === '线下讲座';
                }
              },
              {
                type: 'del',
                label: '删除',
                btn: 'danger'
              }
            ]
          }
        ],
        eventTypes: [
          {
            value: 1,
            label: '投票活动'
          },
          {
            value: 2,
            label: '线下讲座'
          },
          {
            value: 3,
            label: '打卡活动'
          }
        ]
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.id = this.$route.params.id;
        this.queryDoc();
        this.queryRecords();
      },
      queryDoc() {
        if (this.id) {
          USER_GROWTH_API.getDoc(this.id, {}).then(
            res => {
              const fields = res.fields;
              for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                field.show_value = field.value;
                if (field.config && field.config.option) {
                  field.show_value = value2Label(field.config.option, field.value);
                }
                if (field.type === 'district') {
                  field.areaData = {};
                }
              }
              this.fields = fields;
            });
        }
      },
      queryRecords() {
        if (this.id) {
          const params = {
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
          };
          USER_GROWTH_API.getRecords(this.id, params).then(
            res => {
              this.formatResult(res);
            });
        }
      },
      formatResult(res) {
        const result = res.result;
        this.tableData = result.map(item => {
          item.join_time = parseTime(item.join_time);
          item.activity_type_name = value2Label(this.eventTypes, item.activity_type);
          return {
            ...item
          };
        });
        this.totalCount = res.totalCount * 1;
      },
      deleteHandler(item) {
        const delMessage = `确认要删除记录 <b>${item.activity}</b> 吗？`;
        this.$confirm(delMessage, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData = [];
          USER_GROWTH_API.deleteRecords(this.id, item.id, {}).then(res => {
            this.queryRecords();
          });
        }).catch((e) => {
          console.log(e);
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      add() {
        console.log('add');
      },
      addRecord() {
        this.addRecordVisible = true;
        USER_GROWTH_API.getActivitySelect({}).then(res => {
          this.activities = res;
        }).catch(e => {
          this.$message.error('失败');
        });
      },
      saveRecord() {
        console.log('this.recordForm.activity_type');
        console.log(this.recordForm.activity_id);

        const save = () => {
          const params = {
            activity_id: this.recordForm.activity_id,
            detail: this.recordForm.detail,
            create_time: this.recordForm.join_time
          };
          USER_GROWTH_API.saveRecord(this.id, params).then(res => {
            this.$message({message: '操作成功', type: 'success'});
            this.addRecordVisible = false;
            this.tableData = [];
            this.queryRecords();
          }).catch(e => {
            this.$message.error('失败');
          });
        };

        this.$refs.recordForm.validate((valid) => {
          if (valid) {
            save();
          }
        });
      },
      actionHandler(type, scope) {
        if (type === 'view') {
          USER_GROWTH_API.getRecordDetail(this.id, scope.id, {}).then(
            res => {
              this.viewData.activity = res.activity;
              this.viewData.activity_type_name = value2Label(this.eventTypes, res.activity_type);
              this.viewData.activity_cover = res.activity_cover;
              this.viewData.description = res.description;
              this.viewData.detail = res.detail;
              this.viewData.join_time = parseTime(res.join_time);

              this.dialogVisible = true;
            });
        }
      },
      modifyItem(index) {
        const item = this.fields[index];
        const onSuccess = (res) => {
          console.log(item.value);
          this.fields[index].show_value = item.value;
          if (item.config && item.config.option) {
            this.fields[index].show_value = value2Label(item.config.option, item.value);
          }
          console.log(item);
          this.$message({message: '保存成功', type: 'success'});
        };

        if (item.value_id) {
          const params = {value: item.value};
          USER_GROWTH_API.editDocField(item.value_id, params).then(
            onSuccess
          ).catch(e => {
            this.$message.error('失败');
          });
        } else {
          const params = {
            user_doc_id: this.id,
            field_id: item.id,
            value: item.value
          };
          USER_GROWTH_API.addDocField(params).then(onSuccess).catch(e => {
            this.$message.error('失败');
          });
        }

        item.showPopOver = false;
        return 0;
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
  .el-input {
    width: 130px;
  }

  .dialog-title {
    font-size: 15px;
    font-weight: bold;
  }
  .dialog-div{
    span{
      margin-top: 10px;
    }
  }

  .content-title {
    font-size: 15px;
    font-weight: bold;
  }
  .content-div{
    span{
      margin-top: 10px;
    }
  }
</style>
