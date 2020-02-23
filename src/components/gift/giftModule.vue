<!--
 * @Description: 奖品中心页面/列表页
 * @Author: haorun
 * @Date: 2019-08-13 09:51:20
 * @LastEditTime: 2019-08-30 14:43:04
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog
    title="奖品选择"
    :visible.sync="giftDialogVisible"
    top="5vh"
    width="80%"
    @close="dialogHide">
    <div>
      <div>已选择奖品：</div>
      <div v-if="selectGift && selectGift.length" class="list-content">
        <div :span="4" v-for="(item, index) in selectGift" class="list" :key="index">
          <item-card :taskItem="item"
                     :index="index"
                     :cover="item.pic[0].file_path"
                     :name="item.name"
                     type="prize"
                     @editHandler="editHandler"
                     @delHandler="closeHandler"/>
        </div>
      </div>
    </div>

    <div class="comment-wrapper app-container">
      <div class="control-group">
        <el-form :inline="true" ref="giftFrm" :model="giftFrm">
          <el-form-item prop="type" label="奖品类型">
            <el-select placeholder="全部" clearable v-model="giftFrm.type">
              <el-option
                v-for="item in prizeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="奖品名称">
            <el-input placeholder="奖品名称" clearable v-model="giftFrm.name"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="奖品状态">
            <el-select placeholder="全部" clearable v-model="giftFrm.status">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="time" label="奖品有效期">
            <el-date-picker
              :editable="false"
              v-model="giftFrm.time"
              type="datetimerange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchGiftList" icon="el-icon-search">查询</el-button>
            <!--<el-button @click="resetForm('giftFrm')" icon="el-icon-refresh">重置</el-button>-->
            <el-button @click="getData" icon="el-icon-refresh">刷新列表</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click.stop="configGift">新增奖品</el-button>
            <el-button type="primary" @click.stop="determine">确定选择</el-button>
          </el-form-item>
        </el-form>
      </div>

      <custom-el-table
        v-loading="tabLoading"
        v-model="pageIndex"
        :tableData="tableData"
        :tableOptions="tableOptions"
        :total="totalCount"
        :pageSizes="pageSizes"
        :size="pageSize"
        @action="actionHandler"
        @size-change="sizeChangeHandler"
        @page-change="pageChangeHandler">
      </custom-el-table>
    </div>
  </el-dialog>
</template>

<script>
  import GIFTCENTER_API from '@/api/giftcenter/index';
  import customElTable from '@/components/customElTable';
  // import { parseTime } from '@/utils';
  import _ from 'lodash';
  import itemCard from '@/components/card/item-card';

  export default {
    name: 'commentCenter',
    components: {
      customElTable,
      itemCard
    },
    props: ['prizeShow', 'multiple', 'list'],
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '序号',
            width: 80,
            prop: 'id'
          },
          {
            label: '奖品类型',
            prop: 'typeZh'
          },
          {
            label: '奖品名称',
            prop: 'name'
          },
          {
            label: '奖品图片',
            prop: 'task_img',
            options: {
              type: 'img',
              width: 60,
              height: 60
            }
          },
          {
            label: '奖品价值',
            prop: 'myworth'
          },
          {
            label: '奖品库存',
            prop: 'store'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            width: 120,
            actions: [
              {
                type: 'checkbox',
                label: ''
              }
            ]
          }
        ],
        giftFrm: {
          type: '',
          name: '',
          time: '',
          status: ''
        },
        query: null,
        statusOptions: [
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 2
          }
        ],
        prizeTypeOptions: [
          {
            label: '谢谢参与',
            value: 1
          },
          {
            label: '红包',
            value: 2
          },
          {
            label: '积分',
            value: 3
          },
          {
            label: '答题次数',
            value: 4
          },
          {
            label: '投票次数',
            value: 5
          },
          {
            label: '电子卡券',
            value: 6
          },
          {
            label: '奖品礼包',
            value: 101
          }
        ],
        selectGift: [],
        giftDialogVisible: this.prizeShow
      };
    },
    watch: {
      prizeShow(val) {
        this.giftDialogVisible = val;
        if (val) {
          this.setSelectGift();
          this.setChecked();
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      dialogHide() {
        this.$emit('prizeHide');
      },
      closeHandler(index) {
        this.selectGift.splice(index, 1);
      },
      determine() {
        this.giftDialogVisible = false;
        this.$emit('giftHandler', this.selectGift);
      },
      setChecked() {
        this.tableData.map(item => {
          item.checked = false;
          this.selectGift.map(val => {
            if (item.id === val.id) {
              item.checked = true;
            }
          });
        });
      },
      setSelectGift() {
        this.selectGift = JSON.parse(this.list);
      },
      configGift() {
        // this.$router.push({name: 'giftconf'});
        const { href } = this.$router.resolve({ name: 'giftconf', query: {type: 'newAdd'} });
        window.open(href, '_blank');
      },
      editHandler(scope) {
        const { href } = this.$router.resolve({name: 'giftconf', query: {id: scope.id, type: 'newAdd'}});
        window.open(href, '_blank');
      },
      getData() {
        const query = this.query || {};
        const params = {
          page_size: this.pageSize,
          page_index: this.pageIndex,
          ...query
        };
        return GIFTCENTER_API.list(params).then(res => {
          this.tableData = res.result.map(item => {
            item.task_img = item.pic && item.pic.length ? item.pic[0].file_path : '';
            item.checked = false;
            let zh = '';
            switch (item.type) {
              case '6':
                zh = '电子卡券奖品';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth_type * 1 === 2 ? `${item.worth_rand_min}-${item.worth_rand_max}` : item.worth,
                  ...item
                };
              case '5':
                zh = '投票次数奖品';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth_type * 1 === 2 ? `${item.worth_rand_min}-${item.worth_rand_max}次` : item.worth + '次',
                  ...item
                };
              case '4':
                zh = '答题次数奖品';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth_type * 1 === 2 ? `${item.worth_rand_min}-${item.worth_rand_max}次` : item.worth + '次',
                  ...item
                };
              case '3':
                zh = '积分奖品';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth_type * 1 === 2 ? `${item.worth_rand_min}-${item.worth_rand_max}积分` : item.worth + '积分',
                  ...item
                };
              case '2':
                zh = '红包奖品';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth_type * 1 === 2 ? `${item.worth_rand_min}-${item.worth_rand_max}元` : item.worth + '元',
                  ...item
                };
              case '1':
                zh = '谢谢参与';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth,
                  ...item
                };
              case '101':
                zh = '奖品礼包';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth,
                  ...item
                };
              default:
                zh = '其他奖品';
                return {
                  typeZh: zh,
                  total_num: Number(item.store) + Number(item.send_num),
                  myworth: item.worth,
                  ...item
                };
            }
          });
          this.setChecked();
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
          return res.result;
        }).catch(e => {
          console.log(e);
        });
      },
      searchGiftList() {
        this.query = _.cloneDeep(this.giftFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'start_time', time[0] || '');
        this.$set(this.query, 'end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      go_giftWays() {
        this.$router.push({name: 'giftWays'});
      },
      sizeChangeHandler(size) {
        this.pageSize = size;
        this.pageIndex = 1;
        this.getData();
      },
      pageChangeHandler(page) {
        this.pageIndex = page;
        this.getData();
      },
      actionHandler(type, scope) {
        if (type === 'checkbox') {
          if (scope.checked) {
            var item = this.selectGift.find(item => item.id === scope.id);
            if (!item) {
              if (this.multiple) {
                this.selectGift.push(scope);
              } else {
                this.selectGift = [];
                this.selectGift.push(scope);
                this.tableData.map(item => {
                  item.checked = false;
                  if (item.id === scope.id) {
                    item.checked = true;
                  }
                });
              }
            }
          } else {
            var index = this.selectGift.findIndex(item => item.id === scope.id);
            this.selectGift.splice(index, 1);
          }
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .btns-wrapper{
    margin-bottom: 20px;
  }
  .select-gift{
    padding: 10px 0 30px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }

  .list-content {
    display: flex;
    flex-wrap: wrap;
    .list{
      margin:0 10px 10px 0
    }
  }
</style>
