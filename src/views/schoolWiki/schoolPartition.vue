<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :rules="frmRules"
      ref="schoolFrm"
      label-width="120px">
      <el-form-item prop="name" label="学校名称">
        {{schoolInfo.name}}
      </el-form-item>
      <el-form-item prop="image_url" label="学校图片">
        <img :src="schoolInfo.image_url" class="school-img"/>
      </el-form-item>
      <el-form-item prop="name" label="地址">
        <img src="https://scrm-pic.cdn.buerkongjian.com/static/image/wiki/svg/address.svg">
        <span>{{schoolInfo.address}}</span>
      </el-form-item>
      <el-form-item prop="middleSchools" label="对口中学">
        <custom-el-table :tableData="middleSchools"
                         :tableOptions="middleSchoolOptions"
                          @delete="deleteSchool">
        </custom-el-table>
        <el-button type="primary" size="mini" @click="addMiddleSchool">添加学校</el-button>
      </el-form-item>
      <el-form-item prop="houses" label="划片小区">
        <custom-el-table :tableData="houses"
                         :tableOptions="houseOptions"
                         @delete="deleteHouse">
        </custom-el-table>
        <el-button type="primary" size="mini" @click="addHouse">添加小区</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
      </el-form-item>
    </el-form>
    <school-select :schoolSelectVisible="schoolSelectVisible"
                   stage="juniormiddle"
                   @dialogHide="schoolSelectHide"
                   @addSchoolSuccess="addSchoolSuccess"></school-select>
    <house-select :houseSelectVisible="houseSelectVisible"
                   @dialogHide="houseSelectHide"
                   @addHouseSuccess="addHouseSuccess"></house-select>
  </div>
</template>

<script>
  import SCHOOL_API from '@/api/schoolWiki/school';
  import customElTable from '@/components/customElTable';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';
  import Tinymce from '@/components/Tinymce';
  import uploadVideo from '@/components/Upload/uploadVideo';
  import uploadAudio from '@/components/Upload/uploadAudio';
  import {zoneOptions, stageOptions, typeOptions} from './data.js';
  import schoolSelect from './schoolSelect';
  import houseSelect from './houseSelect';

  export default {
    name: 'schoolPartition',
    components: {
      uploadPrizeAvatar,
      Tinymce,
      uploadVideo,
      uploadAudio,
      schoolSelect,
      houseSelect,
      customElTable
    },
    data() {
      return {
        pageLoading: true,
        schoolSelectVisible: false,
        houseSelectVisible: false,
        schoolInfo: {
          id: 0,
          name: '',
          image_url: '',
          address: ''
        },
        middleSchools: [],
        houses: [],
        frmRules: {
        },
        zoneOptions: zoneOptions,
        stageOptions: stageOptions,
        typeOptions: typeOptions,
        middleSchoolOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '学校名称',
            prop: 'name'
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'del'
            ]
          }
        ],
        houseOptions: [
          {
            label: '编号',
            prop: 'id',
            width: 80
          },
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'del'
            ]
          }
        ]
      };
    },
    created() {
      this.pageLoading = true;
      this.schoolInfo.id = this.$route.query.id;
      SCHOOL_API.get(this.schoolInfo.id).then(res => {
        this.pageLoading = false;
        this.schoolInfo.name = res.info.name;
        this.schoolInfo.image_url = res.info.image;
        this.schoolInfo.address = res.info.address;

        this.middleSchools = res.middle_schools.map(item => {
          return {
            id: item.id,
            name: item.name,
            address: item.address
          };
        });
        this.houses = res.houses.map(item => {
          return {
            id: item.id,
            name: item.name,
            address: item.address
          };
        });
      });
    },
    methods: {
      addMiddleSchool() {
        this.schoolSelectVisible = true;
      },
      addSchoolSuccess(school) {
        const existedOne = this.middleSchools.find(item => {
          return parseInt(item.id) === parseInt(school.id);
        });
        if (!existedOne) {
          const middleSchools = this.middleSchools.map(item => item);
          middleSchools.push({
            id: school.id,
            name: school.name,
            address: school.address
          });
          this.middleSchools = middleSchools;
        }
      },
      deleteSchool(item) {
        console.log('deleteSchool', item);
        this.middleSchools = this.middleSchools.filter(school => {
          return parseInt(item.id) !== parseInt(school.id);
        });
      },
      schoolSelectHide() {
        this.schoolSelectVisible = false;
      },
      addHouse() {
        this.houseSelectVisible = true;
      },
      addHouseSuccess(house) {
        console.log('addHouseSuccess', house);
        const existedOne = this.houses.find(item => {
          return parseInt(item.id) === parseInt(house.id);
        });
        if (!existedOne) {
          const houses = this.houses.map(item => item);
          houses.push({
            id: house.id,
            name: house.name,
            address: house.address
          });
          this.houses = houses;
        }
      },
      deleteHouse(item) {
        this.houses = this.houses.filter(house => {
          return parseInt(item.id) !== parseInt(house.id);
        });
      },
      houseSelectHide() {
        this.houseSelectVisible = false;
      },
      save() {
        const middleSchools = this.middleSchools.map(item => item.id).join(',');
        const houses = this.houses.map(item => item.id).join(',');
        SCHOOL_API.partition(this.schoolInfo.id, {
          middleSchools: middleSchools,
          houses: houses
        }).then(res => {
          this.$router.push({name: 'schoolPartition', query: { id: this.schoolInfo.id }});
          console.log('save partition', res);
        }).catch(e => {
          console.log('save partition fail', e);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    .list{
      margin:0 20px 10px 0
    }

    .middle-school {
      position: relative;
    }
  }

  .address {
    font-size: 12px;
    color: #26425c;
  }

  .school-img {
    height: 200px;
  }
</style>

