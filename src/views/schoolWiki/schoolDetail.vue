<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :model="schoolFrm"
      :rules="frmRules"
      ref="schoolFrm"
      label-width="120px">
      <el-form-item prop="name" label="学校名称">
        <el-input v-model="schoolFrm.name" placeholder="请输入学校名称" :maxlength="80" name="name" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="image_url" label="学校图片">
        <upload-prize-avatar v-model="schoolFrm.image" :showDelImage="true" @del="deleteImage" @success="uploadSuccess"></upload-prize-avatar>
        <small style="color: #999">建议尺寸450*450</small>
      </el-form-item>
      <el-form-item prop="zone" label="所在区">
        <el-select placeholder="请选择所在区" v-model="schoolFrm.zone">
          <el-option
            v-for="item in zoneOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="address" label="地址">
        <el-input v-model="schoolFrm.address" placeholder="请输入地址" :maxlength="80" name="address" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="longitude" label="纬度">
        <el-input v-model="schoolFrm.longitude" placeholder="纬度" :maxlength="80" name="longitude" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="latitude" label="经度">
        <el-input v-model="schoolFrm.latitude" placeholder="经度" :maxlength="80" name="latitude" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="stageList" label="学段">
        <el-select multiple placeholder="请选择学段" v-model="stageList" clearable>
          <el-option v-for="item in stageOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-select placeholder="请选择类型" v-model="schoolFrm.type">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="year_price" label="每年费用(元)">
        <el-input v-model="schoolFrm.year_price" placeholder="每年费用(元)" :maxlength="80" name="year_price" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="excellent_courses" label="特色课程">
        <el-input v-model="schoolFrm.excellent_courses" placeholder="特色课程" :maxlength="80" name="excellent_courses" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="house_price" label="周边房价(元)">
        <el-input v-model="schoolFrm.house_price" placeholder="周边房价(元)" :maxlength="80" name="house_price" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="teacher_levels" label="师资水平">
        <el-input v-model="schoolFrm.teacher_levels" placeholder="师资水平" :maxlength="80" name="teacher_levels" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="equipments" label="硬件水平">
        <el-input v-model="schoolFrm.equipments" placeholder="硬件水平" :maxlength="80" name="equipments" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="联系电话">
        <el-input v-model="schoolFrm.phone" placeholder="联系电话" :maxlength="80" name="phone" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="website" label="官方网址">
        <el-input v-model="schoolFrm.website" placeholder="官方网址" :maxlength="80" name="website" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="description" label="简介">
        <el-input v-model="schoolFrm.description" placeholder="简介" :maxlength="80" name="description" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="school_id" label="外部ID">
        <el-input v-model="schoolFrm.school_id" placeholder="教育局ID" :maxlength="80" name="school_id" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="region_text" label="划片信息">
        <el-input v-model="schoolFrm.region_text" placeholder="划片信息" :maxlength="80" name="region_text" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item prop="partition_article" label="划片文章">
        <el-input v-model="schoolFrm.partition_article" placeholder="划片文章" :maxlength="80" name="partition_article" :clearable="true"></el-input>
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
  import Tinymce from '@/components/Tinymce';
  import uploadVideo from '@/components/Upload/uploadVideo';
  import uploadAudio from '@/components/Upload/uploadAudio';
  import SCHOOL_API from '@/api/schoolWiki/school';
  import {zoneOptions, stageOptions, typeOptions} from './data.js';

  export default {
    name: 'schoolDetail',
    components: {
      uploadPrizeAvatar,
      Tinymce,
      uploadVideo,
      uploadAudio
    },
    data() {
      return {
        pageLoading: true,
        stageList: [],
        schoolFrm: {
          id: this.$route.query.id || 0,
          name: '',
          zone: '',
          zone_alias: '',
          address: '',
          longitude: '',
          latitude: '',
          stage: '',
          type: '',
          year_price: '',
          excellent_courses: '',
          house_price: '',
          teacher_levels: '',
          equipments: '',
          phone: '',
          image_url: '',
          image_id: '',
          website: '',
          description: '',
          school_id: '',
          region_text: '',
          partition_article: '',
          middle_schools: [], // 对口初中
          houses: [] // 划片小区
        },
        frmRules: {
          name: [
            {
              required: true, message: '请输入学校名称'
            }
          ],
          zone: [
            {
              required: true, message: '选择区域'
            }
          ],
          address: [
            {
              required: true, message: '填写地址'
            }
          ]
        },
        zoneOptions: zoneOptions,
        stageOptions: stageOptions,
        typeOptions: typeOptions
      };
    },
    created() {
      this.getData();
    },
    methods: {
      deleteImage() {
        this.schoolFrm.image_id = 0;
        this.schoolFrm.image = '';
      },
      uploadSuccess(res) {
        console.log(res);
        this.schoolFrm.image_id = res.id;
        this.schoolFrm.image = res.url;
      },
      getData() {
        SCHOOL_API.get(this.schoolFrm.id).then(res => {
          console.log(res['info']);
          const id = this.schoolFrm.id;
          this.schoolFrm = Object.assign(res['info']);
          this.schoolFrm.type = parseInt(this.schoolFrm.type);
          this.schoolFrm.zone = this.schoolFrm.zone_alias;
          this.schoolFrm.id = id;
          this.stageList = this.getStageList(this.schoolFrm.stage);
        }).catch(e => {
          console.log(e);
        }).finally(() => {
          this.pageLoading = false;
        });
      },
      save() {
        const params = this.schoolFrm;
        let stage = 0;
        for (let i = 0; i < this.stageList.length; i++) {
          stage = (stage | this.stageList[i]);
        }
        this.schoolFrm.stage = stage;
        SCHOOL_API.edit(params).then(res => {
          this.$router.push({name: 'schoolDetail', query: { id: this.schoolFrm.id }});
        }).catch(e => {
          console.log(e);
        });
      },
      getStageList(stage) {
        const stageList = [];
        for (let i = 0; i < this.stageOptions.length; i++) {
          if ((parseInt(stage) & this.stageOptions[i].value) === this.stageOptions[i].value) {
            stageList.push(this.stageOptions[i].value);
          }
        }
        console.log(stageList);
        return stageList;
      }
    }
  };
</script>

<style scoped>

</style>

