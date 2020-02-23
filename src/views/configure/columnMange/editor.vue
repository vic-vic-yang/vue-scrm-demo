<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form class="activity-edit__form" :model="formFrm" :rules="frmRules" ref="formFrm" label-width="120px">
      <el-form-item prop="name" label="栏目名称">
        <el-input v-model="formFrm.name" placeholder="请输入栏目名称" :maxlength="50" name="name" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="description" label="栏目描述">
        <el-input v-model="formFrm.description" placeholder="请输入栏目描述" name="description" type="textarea" :clearable="true" :rows="5">
        </el-input>
      </el-form-item>
      <el-form-item prop="IsLink" label="外部连接地址">
        <el-radio-group v-model="formFrm.IsLink">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="LinkUrl" v-if="formFrm.IsLink == 1" label="链接">
        <el-input v-model="formFrm.LinkUrl" placeholder="请输入链接" name="name" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="IsSubSite" v-if="false" label="是否是子站">
        <el-radio-group v-model="formFrm.IsSubSite">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="type" label="管理模块">
        <el-select placeholder="请选择管理模块" v-model="formFrm.type">
          <el-option v-for="item in moduleOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="bindCategory" v-if="false" label="绑定栏目">
        <el-input v-model="formFrm.bindCategory" placeholder="请输入绑定栏目" name="bindCategory" :clearable="true">
        </el-input>
        <small style="color: #f56c6c;">仅限模块相同栏目</small>
      </el-form-item>
      <el-form-item prop="push_category" v-if="false" label="上报栏目">
        <el-input v-model="formFrm.push_category" placeholder="请输入上报栏目" name="push_category" :clearable="true">
        </el-input>
        <small style="color: #f56c6c;">仅限模块相同栏目</small>
      </el-form-item>
      <el-form-item prop="template" label="模板">
        <el-input v-model="formFrm.template" placeholder="请输入模板" name="template" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="template_list" v-if="false" label="子栏目模板">
        <el-input v-model="formFrm.template_list" placeholder="请输入子栏目模板" name="template_list" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="template_detail" v-if="false" label="内容模板">
        <el-input v-model="formFrm.template_detail" placeholder="请输入内容模板" name="template_detail" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="template_search" v-if="false" label="搜索模板">
        <el-input v-model="formFrm.template_search" placeholder="请输入搜索模板" name="template_search" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="wap_template" v-if="false" label="WAP模板">
        <el-input v-model="formFrm.wap_template" placeholder="请输入WAP模板" name="wap_template" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="wap_template_list" v-if="false" label="WAP子栏目模板">
        <el-input v-model="formFrm.wap_template_list" placeholder="请输入WAP子栏目模板" name="wap_template_list" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="wap_template_detail" v-if="false" label="WAP内容目模板">
        <el-input v-model="formFrm.wap_template_detail" placeholder="请输入WAP内容目模板" name="wap_template_detail" :clearable="true">
        </el-input>
      </el-form-item>
      <el-form-item prop="IsNav" label="是否导航显示">
        <el-radio-group v-model="formFrm.IsNav">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="is_wap" v-if="false" label="是否Wap版显示">
        <el-radio-group v-model="formFrm.is_wap">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="sort" v-if="false" label="栏目顺序">
        <el-input-number v-model="formFrm.sort" :min="0" placeholder="请输入栏目顺序" name="sort" :clearable="true">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="position" v-if="false" label="栏目位置">
        <el-select placeholder="请选择栏目位置" v-model="formFrm.position">
          <el-option v-for="item in columnPositionOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <small style="color: #f56c6c;">仅适用于子站及专题</small>
      </el-form-item>
      <el-form-item prop="is_html" v-if="false" label="是否静态化">
        <el-radio-group v-model="formFrm.is_html">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <small style="color: #f56c6c;">分页列表不建议使用静态化</small>
      </el-form-item>
      <el-form-item prop="allow_comment" v-if="false" label="是否允许评论">
        <el-radio-group v-model="formFrm.allow_comment">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="formFrm.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="cover" label="栏目图片">
        <upload-prize-avatar v-model="formFrm.cover"></upload-prize-avatar>
        <el-button v-if="formFrm.cover" @click="formFrm.cover = ''" type="danger">删除图片</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import COLUMN from '@/api/configure/column';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    components: {
      uploadPrizeAvatar
    },
    name: 'edit',
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        formFrm: {
          id: this.$route.params.id || 0,
          parent_id: this.$route.query.parent_id || 0,
          name: '',
          description: '',
          IsLink: 0,
          LinkUrl: '',
          IsSubSite: 0,
          type: '',
          bindCategory: '',
          push_category: '',
          template: 'Tpl/default/list.html',
          template_list: '',
          template_detail: '',
          template_search: '',
          wap_template: '',
          wap_template_list: '',
          wap_template_detail: '',
          IsNav: 0,
          is_wap: 0,
          sort: '',
          position: '',
          is_html: 0,
          allow_comment: 0,
          status: 0,
          cover: ''
        },
        moduleOptions: [
          {
            id: 0,
            name: '外部链接'
          },
          {
            id: 1,
            name: '新闻资讯'
          },
          {
            id: 2,
            name: '单页面'
          }
        ],
        columnPositionOptions: [
          {
            id: 1,
            name: '左'
          },
          {
            id: 2,
            name: '中'
          },
          {
            id: 3,
            name: '右'
          },
          {
            id: 4,
            name: '上'
          },
          {
            id: 5,
            name: '左上'
          },
          {
            id: 6,
            name: '左下'
          },
          {
            id: 7,
            name: '右上'
          },
          {
            id: 8,
            name: '右下'
          }
        ],
        frmRules: {
          name: [{required: false, message: '请输入栏目名称'}],
          description: [{required: false, message: '请输入栏目描述'}],
          IsLink: [{required: false, message: '请选择是否是外部连接地址'}],
          LinkUrl: [{required: false, message: '请输入链接'}],
          IsSubSite: [{required: false, message: '请选择是否是子站'}]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.action === 'add') return (this.pageLoading = false);
        COLUMN.get(this.$route.params.id).then(res => {
          res.IsLink = Number(res.IsLink);
          res.IsSubSite = Number(res.IsSubSite);
          res.type = Number(res.type);
          res.IsNav = Number(res.IsNav);
          res.is_wap = Number(res.is_wap);
          res.position = Number(res.position);
          res.is_html = Number(res.is_html);
          res.allow_comment = Number(res.allow_comment);
          res.status = Number(res.status);
          this.formFrm = res;
          this.pageLoading = false;
        }).catch(() => {
          this.pageLoading = false;
        });
      },
      save() {
        this.$refs.formFrm.validate(valid => {
          if (valid) {
            const formFrm = Object.assign({}, this.formFrm);
            (this.action === 'modify' ? COLUMN.edit(formFrm) : COLUMN.add(formFrm))
              .then(() => {
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
