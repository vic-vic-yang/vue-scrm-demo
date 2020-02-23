<!--
 * @Description: 
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-10-19 19:02:55
 -->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      class="activity-edit__form"
      :model="prizeFrm"
      :rules="frmRules"
      ref="prizeFrm"
      label-width="140px">
      <el-form-item prop="type" label="奖品类型">
        <el-select v-model="prizeFrm.type" @change="changeType" clearable placeholder="请选择奖品类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="奖品名称">
        <el-input :disabled="prizeFrm.type == 1 ? true : false" v-model="prizeFrm.name" placeholder="请输入奖品名称"></el-input>
      </el-form-item>
      <el-form-item prop="worth" label="奖品价值" v-if="prizeFrm.type !== 1">
        <el-input-number
          v-model="prizeFrm.worth"
          :min="0"
          placeholder="请输入奖品价值"
          name="worth">
        </el-input-number>
        <span class="ml-5 text-666">{{prizeFrm.type === 2 ? '积分':'元'}}</span>
      </el-form-item>
      <el-form-item prop="cover" label="奖品图片">
        <upload-prize-avatar @success="uploadSuccess" v-model="prizeFrm.cover"></upload-prize-avatar>
      </el-form-item>
      <el-form-item prop="store" label="奖品库存">
        <el-input-number
          v-model="prizeFrm.store"
          :min="0"
          placeholder="请输入奖品库存"
          name="store">
        </el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import prize from '@/api/integralMall/prize';
  import _ from 'lodash';

  export default {
    name: 'prize_create',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        pageLoading: true,
        action: this.$route.params.id ? 'modify' : 'add',
        prizeFrm: {
          id: this.$route.params.id || 0,
          type: 2,
          name: '',
          worth: '',
          cover: '',
          store: '',
          pic: []
        },
        frmRules: {
          type: [
            {
              required: true, message: '请选择奖品类型'
            }
          ],
          name: [
            {
              required: true, message: '请输入奖品名称'
            }
          ],
          worth: [
            {
              required: true, message: '请输入奖品价值'
            }
          ],
          cover: [
            {
              required: true, message: '请上传奖品图片'
            }
          ],
          store: [
            {
              required: true, message: '请输入奖品库存'
            }
          ]
        },
        typeOptions: [
          {
            id: 1,
            name: '谢谢参与'
          },
          {
            id: 2,
            name: '积分'
          },
          {
            id: 3,
            name: '虚拟奖品'
          }
        ],
        name: ''
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        if (this.action === 'add') return (this.pageLoading = false);
        prize.get({ id: this.prizeFrm.id })
          .then(res => {
            this.prizeFrm = _.assign({}, this.prizeFrm, res.data);
            this.prizeFrm.cover = res.data.pic[0].file_path;
            this.pageLoading = false;
          })
          .catch(() => {
            this.pageLoading = false;
          });
      },
      changeType() {
        if (this.prizeFrm.type === 1) {
          this.prizeFrm.name = '谢谢参与';
        } else {
          this.prizeFrm.name = '';
        }
      },
      uploadSuccess(data) {
        this.prizeFrm.pic = [];
        this.prizeFrm.pic.push(data);
      },
      save() {
        this.$refs.prizeFrm.validate(valid => {
          if (valid) {
            const prizeFrm = Object.assign({}, this.prizeFrm);
            let prizeFrms = null;
            prizeFrm.pic = (prizeFrm.pic.map(pic => pic.id)).join(',');
            if (prizeFrm.type * 1 === 1) {
              prizeFrms = (({ id, name, type, pic, store }) => ({ id, name, type, pic, store }))(prizeFrm);
            }
            prizeFrms = (({ id, name, type, pic, worth, store }) => ({ id, name, type, pic, worth, store }))(prizeFrm);
            (this.action === 'modify' ? prize.edit(prizeFrms) : prize.add(prizeFrms))
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
