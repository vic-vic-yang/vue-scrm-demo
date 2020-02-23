<template>
  <div class="app-container">
    <el-form
      :model="groupFrm"
      class="code-add__frm"
      :rules="frmRules"
      ref="groupFrm"
      label-width="80px">
      <el-form-item prop="channel_name" label="频道名称">
        <el-input
          v-model="groupFrm.channel_name"
          name="channel_name"
          :clearable="true"
          maxlength="4"
          placeholder="请输入频道名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="classify" label="内容分类">
        <el-select placeholder="请选择内容分类" multiple v-model="groupFrm.classify">
          <el-option
            v-for="item in classifiCations"
            :key="item.id "
            :label="item.classify_name"
            :value="item.id + ''">
          </el-option>
          <!-- <div class="article_pages">
            <el-pagination
              :page-size="class_page_info.pageSize"
              :pager-count="Math.ceil(class_page_info.totalCount / class_page_info.pageSize)"
              :current-page="class_page_info.pageIndex"
              @current-change="currentChangeClass"
              layout="prev, pager, next"
              :total="class_page_info.totalCount">
            </el-pagination>
          </div> -->
        </el-select>
      </el-form-item>
        <el-form-item prop="description" label="频道描述">
        <el-input
          v-model="groupFrm.description"
          name="matchIntro"
          :clearable="true"
          placeholder="请输入频道描述">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Channel from '@/api/contentPlatform/channel';
  import Content from '@/api/contentPlatform/content';
  export default {
    name: 'editorCation',
    data() {
      return {
        action: this.$route.params.id ? 'modify' : 'add',
        groupFrm: {
          id: this.$route.params.id,
          classify: [],
          channel_name: '', // 频道名称
          description: '' // 频道描述
        },
        classifiCations: [],
        class_page_info: {
          pageIndex: 1,
          pageSize: 999,
          totalCount: 1
        },
        frmRules: {
          channel_name: [
            {
              required: true, message: '请输入频道名称'
            }
          ]
          // classify: [
          //   {
          //     required: true, message: '请选择内容分类'
          //   }
          // ],
          // description: [
          //   {
          //     required: true, message: '请输入频道描述'
          //   }
          // ]
        }
      };
    },
    created() {
      this.getClassifications();
      if (this.action === 'modify') {
        this.getData();
      }
    },
    methods: {
      getData() { // 获取频道数据
        Channel.applet.get(this.$route.params.id).then(res => {
          this.groupFrm.channel_name = res.channel_name;
          this.groupFrm.classify = res.classify;
          this.groupFrm.description = res.description;
        });
      },
      getClassifications() { // 获取分类信息
        Content.class.list({
          pageIndex: this.class_page_info.pageIndex,
          pageSize: this.class_page_info.pageSize
        }).then(data => {
          this.classifiCations = data.result;
          this.class_page_info.totalCount = data.totalCount * 1;
        });
      },
      currentChangeClass(e) {
        this.class_page_info.pageIndex = e;
        this.getClassifications();
      },
      save() {
        this.$refs.groupFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Channel.applet.edit(this.groupFrm)
              : Channel.applet.add(this.groupFrm)).then(() => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
