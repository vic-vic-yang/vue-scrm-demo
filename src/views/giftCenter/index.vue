<!--
 * @Description: 奖品中心页面/列表页
 * @Author: haorun
 * @Date: 2019-08-13 09:51:20
 * @LastEditTime: 2019-08-30 14:43:04
 * @LastEditors: Please set LastEditors
 -->
<template>
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
          <el-button @click="resetForm('giftFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="configGift">新增奖品</el-button>
          <el-button type="primary" @click.stop="go_giftWays">发奖策略</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      @delete="del"
      @action="forbid"
      @edit="edit"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import GIFTCENTER_API from '@/api/giftcenter/index';
  import customElTable from '@/components/customElTable';
  // import { parseTime } from '@/utils';
  import _ from 'lodash';

  export default {
    name: 'commentCenter',
    components: {
      customElTable
    },
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: false,
        tableOptions: [
          {
            label: '序号',
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
              width: 100,
              height: 100
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
            label: '今日已发送数量',
            prop: 'user_day_limit'
          },
          {
            label: '已发送总数量',
            prop: 'today_send_number',
            width: 160
          },
          {
            label: '奖品总数量',
            prop: 'total_num'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              'edit',
              {
                type: 'forbid',
                options: this.getStatusBtnInfo
              },
              'del',
              {
                type: 'code',
                label: '核销码',
                disableds: (item) => {
                  return !(item.type * 1 === 6 && item.card_number_type * 1 === 2);
                }
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
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      selectChange() {},
      configGift(id) {
        this.$router.push({name: 'giftconf'});
      },
      getData() {
        const query = this.query || {};
        const params = {
          page_size: this.pageSize,
          page_index: this.pageIndex,
          ...query
        };
        GIFTCENTER_API.list(params).then(res => {
          this.tableData = res.result.map(item => {
            item.task_img = item.pic && item.pic.length ? item.pic[0].file_path : '';
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
          this.totalCount = res.totalCount * 1;
          this.tabLoading = false;
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
      del(scope) {
        this.$confirm(`确认删除奖品 <b>${scope.name}</b> 吗？`, '删除', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          GIFTCENTER_API.delete(scope.id).then(res => {
            if (res.status === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            }
          }).catch(e => {
            this.$message.error('系统出错！');
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      forbid(type, scope) {
        if (type === 'forbid') {
          const title = this.getStatusBtnInfo(scope).label;
          this.$confirm(`确认立即${title}奖品 <b>${scope.name}</b> 吗？`, title, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            GIFTCENTER_API.forbid(scope.id, scope.status === '1' ? '2' : '1').then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${title}`
            });
          });
        } else if (type === 'code') {
          this.$router.push({name: 'giftWriteCode', query: { id: scope.id}});
        }
      },
      getStatusBtnInfo(item) {
        if (!item) {
          return {
            btn: 'danger',
            label: '禁用'
          };
        }
        const status = item.status * 1;
        return status === 1
          ? {
            btn: 'danger',
            label: '禁用'
          }
          : {
            btn: 'primary',
            label: '启用'
          };
      },
      edit(scope) {
        this.$router.push({name: 'giftconf', query: {id: scope.id}});
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
</style>
