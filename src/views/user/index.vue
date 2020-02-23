<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true" ref="userListQueryFrm" :model="userListQueryFrm">
        <el-form-item prop="wx_nick_name" label="微信/微博昵称">
          <el-input placeholder="微信/微博昵称" v-model="userListQueryFrm.wx_nick_name"></el-input>
        </el-form-item>
        <el-form-item prop="user_name" label="用户名称">
          <el-input placeholder="用户名称" v-model="userListQueryFrm.user_name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input placeholder="手机号" type="tel" v-model="userListQueryFrm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="app_type" label="来源渠道">
          <el-select placeholder="请选择来源渠道" clearable v-model="userListQueryFrm.app_type">
            <el-option
              v-for="item in features_list"
              :key="item.app_type"
              :label="item.app_type_name"
              :value="item.app_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="加入时间">
          <el-date-picker
            :editable="false"
            v-model="userListQueryFrm.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('userListQueryFrm')" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table
      v-loading="tabLoading"
      v-model="pageIndex"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :total="totalCount"
      :pageSizes="[20, 50, 100]"
      :size="pageSize"
      @action="actionHandler"
      @size-change="sizeChangeHandler"
      @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>
  import customElTable from '@/components/customElTable';
  import UserManagement from '@/api/user/user';
  import wxManager from '@/api/authorize/wxManager';
  import _ from 'lodash';
  import { parseTime } from '@/utils';

  export default {
    name: 'userList',
    components: {
      customElTable
    },
    data() {
      return {
        userListQueryFrm: {
          wx_nick_name: '',
          user_name: '',
          phone: '',
          app_type: '',
          time: []
        },
        query: null,
        tableOptions: [
          {
            label: '编号',
            prop: 'index',
            width: 80
          },
          {
            label: '用户ID',
            prop: 'id'
          },
          {
            label: '微信/微博昵称',
            prop: 'nickname'
          },
          {
            label: '用户名称',
            prop: 'user_name'
          },
          {
            label: '手机号码',
            prop: 'phone_number'
          },
          {
            label: '联系地址',
            prop: 'address'
          },
          {
            label: '积分值',
            prop: 'integral'
          },
          {
            label: '来源渠道',
            prop: 'channel'
          },
          {
            label: '加入时间',
            prop: 'created_at',
            sortable: true,
            width: 160,
            className: 'ph-6'
          },
          {
            prop: 'USER_ACTION',
            actions: [
              {
                type: 'see',
                label: '查看详情'
              }
            ]
          }
        ],
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        tabLoading: true,
        features_list: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      };
    },
    created() {
      this.getTemplate();
    },
    methods: {
      getData() {
        const query = this.query || {};
        this.tabLoading = true;
        UserManagement.common_list({
          page_index: this.pageIndex,
          page_size: this.pageSize,
          ...query
        }).then(data => {
          this.tableData = (data.result || []).map((item, index) => {
            return {
              ...item,
              index: index + ((this.pageIndex - 1) * this.pageSize) + 1,
              address: (item.province + item.city + item.zone + item.detail) || '',
              created_at: item.created_at * 1 !== 0 ? parseTime(item.created_at) : '--',
              channel: this.setChannel(item.app_type) || ''
            };
          });
          this.totalCount = data.totalCount * 1;
          this.tabLoading = false;
        }).catch(() => {
          this.tabLoading = false;
        });
      },
      getTemplate() {
        wxManager.getTemplate().then(res => {
          this.features_list = res.data;
          this.getData();
        });
      },
      setChannel(data) {
        var channel = '未知';
        this.features_list.map(item => {
          if (item.app_type * 1 === data * 1) {
            channel = item.app_type_name || '';
          }
        });
        return channel;
      },
      searchUser() {
        this.query = _.cloneDeep(this.userListQueryFrm);
        const time = this.query.time || [];
        this.$set(this.query, 'create_start_time', time[0] || '');
        this.$set(this.query, 'create_end_time', time[1] || '');
        this.$delete(this.query, 'time');
        this.pageIndex = 1;
        this.getData();
      },
      actionHandler(type, info) {
        if (type === 'see') {
          this.$router.push({ name: 'usersManageDetails', params: { id: info.id }, query: { channel: info.channel }});
        }
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
