<!--
 * @Description: 添加奖品策略
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 * @LastEditors: shao bo
 * @LastEditTime: 2019-10-30 18:15:51
 -->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form :model="templateForm" :rules="frmRules" ref="templateForm" label-width="100px">
      <header>基本信息</header>
      <el-form-item prop="name" label="策略名称" class="my-item">
        <el-input v-model="templateForm.name" placeholder="请输入策略名称" name="name" :clearable="true"></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="奖品发送限制"
        label-width="auto"
        style="border-bottom: 1px solid #dcdfe6;font-weight: bolder;"
      ></el-form-item>
      <el-form-item class="my-item">
        <el-input style="margin-top: 20px;" placeholder="系统每天可发送的奖品总数" type="number">
          <template slot="prepend">总体限制</template>
        </el-input>
        <el-input style="margin-top: 20px;" placeholder="每天可向用户发送的奖品数" type="number">
          <template slot="prepend">每天限制</template>
        </el-input>
      </el-form-item> -->
      <header>发奖限制</header>
      <el-form-item prop="send_type" class="my-item" label="发奖方式选择" >
        <el-radio v-model="templateForm.send_type" :label="2">多个奖品同时发送</el-radio>
        <el-radio v-model="templateForm.send_type" :label="1">多个奖品随机发送一个
          <el-tooltip class="item abs" effect="dark" content="根据已选择多个奖品的库存数量生成发送概率，随机选择一种奖品发送" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-radio>
      </el-form-item>
      <el-form-item prop="limit" class="my-item" label="时间限制" style="position: relative;">
        <el-tooltip class="item abs" effect="dark" content="选择可进行奖品发送的不同时段" placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
        <el-row>
          <el-col :span="12">
            <el-radio v-model="templateForm.isLimit" :label="2">关闭</el-radio>
            <el-radio v-model="templateForm.isLimit" :label="1">开启</el-radio>
          </el-col>
          <template v-if="templateForm.isLimit === 1">
            <el-col v-for="(n, idx) in dataLength" :key="n.id" style="margin-bottom: 10px;">
              <el-date-picker
                :span="12"
                v-model="n.timming"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="startPickerOptions"
              ></el-date-picker>
              <i
                :span="2"
                class="el-icon-delete"
                @click.stop="delLine(n.id)"
                style="color:#fff;background-color: #f56c6c;padding:10px;border-radius:50%;"
              ></i>
              <i
                :span="2"
                v-if="idx === dataLength.length - 1"
                class="el-icon-plus"
                @click.stop="addLine"
                style="color:#fff;background-color: #409eff;padding:10px;border-radius:50%;"
              ></i>
            </el-col>
          </template>
        </el-row>
      </el-form-item>
      <el-form-item label="地区限制">
        <el-row>
          <el-col>
            <el-radio v-model="templateForm.cityLimit" :label="1">指定区域用户得奖</el-radio>
            <el-radio v-model="templateForm.cityLimit" :label="2">指定区域用户不得奖</el-radio>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="templateForm.cityLimit!==0">
        <el-tree
          :data="options"
          show-checkbox
          node-key="value"
          ref="tree"
          :props="defaultProps"
          :default-checked-keys="selectedOptions"
          >
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Strategies from '@/api/integralMall/strategies';
export default {
  name: 'templateEditor',
  data() {
    return {
      options: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedOptions: [],
      pageLoading: true,
      action: this.$route.params.id ? 'modify' : 'add',
      dataLength: [
        {
          id: new Date().getTime(),
          timming: ''
        }
      ],
      templateForm: {
        name: '',
        isLimit: 2, // 1表示限制，0表示不限制
        cityLimit: 1,
        send_type: 1
      },
      frmRules: {
        name: [
          {
            required: true,
            message: '名称必填'
          }
        ],
        send_type: [
          {
            required: true,
            message: '请选择'
          }
        ]
      },
      startPickerOptions: {
        disabledDate(time) {
          const currentDate = new Date();
          const currentTime = +new Date(
            `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} 00:00`);
          return (+time) < currentTime;
        }
      }
    };
  },
  created() {
    this.getDetail();
    this.getCity();
  },
  computed: {},
  mounted() {
  },
  methods: {
    getCity() {
      Strategies.city().then(result => {
        console.log('=======');
        console.log(result);
        const data = [{label: '全部', value: 0, children: result.children }];
        this.options = data;

        console.log(this.options);
      });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }]);
      }
      if (node.level > 3) return resolve([]);
      var hasChild;
      if (node.data.name === 'region1') {
        hasChild = true;
      } else if (node.data.name === 'region2') {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    },
    handleChange() {},
    getDetail() {
      if (this.action !== 'modify') {
        this.pageLoading = false;
        this.selectedOptions = ['0'];
        return;
      }
      Strategies.get({id: this.$route.params.id}).then(result => {
        console.log(result);
        this.templateForm.name = result.data.name;
        this.templateForm.isLimit = result.data.time_limit_type;
        this.templateForm.cityLimit = result.data.zone_limit_type;
        this.templateForm.send_type = Number(result.data.send_type || 1);
        if (result.data.time_limit_type === 1 && result.data.time_limit_allow) {
          this.setDataLength(result.data.time_limit_allow);
        }
        if (result.data.zone.length > 0) {
          console.log('=====');
          this.selectedOptions = result.data.zone.split(',');
          console.log(this.selectedOptions);
        }
        this.pageLoading = false;
      }).catch(() => {
        this.tabLoading = false;
      });
    },
    setDataLength(data) {
      const dataLength = [];
      let params = {};
      for (const item of data) {
        params = {
          id: new Date().getTime(),
          timming: [item.s, item.e]
        };
        dataLength.push(params);
      }
      this.dataLength = dataLength;
    },
    delLine(id) {
      if (this.dataLength.length > 1) {
        let _idx = -1;
        _idx = this.dataLength.findIndex(item => {
          return item.id === id;
        });
        this.dataLength.splice(_idx, 1);
      }
    },
    addLine() {
      this.dataLength.push({
        id: new Date().getTime(),
        timming: ''
      });
    },
    getKeys() {
      let keys = '';
      console.log(this.$refs.tree.getCheckedKeys());
      const node = this.$refs.tree.getCheckedKeys();
      for (const item of node) {
        if (item === 0) {
          keys = '0';
          break;
        } else {
          keys += item + ',';
        }
      }
      console.log(keys);
      return keys;
    },
    save() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          console.log(this.templateForm.name);
          console.log(this.dataLength);
          console.log(this.templateForm.isLimit);
          console.log(this.templateForm.cityLimit);
          let time_limit_allow = '';
          if (this.templateForm.isLimit === 1) {
            let i = 0;
            const time_limit_allow_new = {};
            for (const item of this.dataLength) {
              if (item.timming && item.timming[0] && item.timming[1]) {
                time_limit_allow_new[i] = {
                  s: item.timming[0],
                  e: item.timming[1]
                };
                i++;
              } else {
                this.$message({
                  type: 'error',
                  message: '请选择时间限制'
                });
                return;
              }
            }
            time_limit_allow = JSON.stringify(time_limit_allow_new);
          }
          const keys = this.getKeys();
          if (!keys) {
            this.$message({
              type: 'error',
              message: '请选择城市'
            });
            return;
          }
          const obj = {
            id: this.$route.params.id || '',
            name: this.templateForm.name,
            time_limit_type: this.templateForm.isLimit,
            time_limit_allow: time_limit_allow,
            zone_limit_type: this.templateForm.cityLimit,
            zone: keys,
            send_type: this.templateForm.send_type
          };
          (this.action === 'modify'
            ? Strategies.edit(obj)
            : Strategies.add(obj)).then(() => {
            this.cancel(true);
          });
        }
      });
    },
    cancel(status) {
      if (this.$route.query && this.$route.query.type === 'newAdd') {
        if (status) {
          localStorage.setItem('addStrategy', true);
        }
        this.$router.replace({ name: 'giftWays' });
      } else {
        this.$router.back();
      }
    }
  }
};
</script>

<style>
.my-item {

}
.line {
  text-align: center;
}
  header {
    margin-bottom: 20px;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 15px;
    color: #999;
  }
</style>
