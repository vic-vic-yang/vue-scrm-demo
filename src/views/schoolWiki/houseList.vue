/* eslint-disable */
<template>
  <div class="app-container">
    <div class="control-group">
      <el-form :inline="true"
               :model="activityListQueryFrm">
        <el-form-item label="活动名称">
          <el-input placeholder="活动名称"
                    v-model="activityListQueryFrm.activityName"></el-input>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select placeholder="全部"
                     clearable
                     v-model="activityListQueryFrm.status">
            <el-option v-for="item in matchTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker :editable="false"
                          v-model="activityListQueryFrm.time"
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
          <el-button type="primary"
                     @click="searchGameList"
                     icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="createGame">
            <i class="fs-13 el-icon-plus mr-5"></i>新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-el-table v-loading="tabLoading"
                     v-model="pageIndex"
                     :tableData="tableData"
                     :tableOptions="tableOptions"
                     :total="totalCount"
                     @edit="editHandler"
                     @delete="deleteHandler"
                     @action="actionHandler"
                     @size-change="sizeChangeHandler"
                     @page-change="pageChangeHandler">
    </custom-el-table>
  </div>
</template>

<script>

</script>

<style scoped>
</style>
