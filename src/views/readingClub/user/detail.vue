<template>
  <div style="width: 90%; margin: 0 auto;height: 650px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="阅读记录" name="first">
        <div style="max-height: 600px;overflow-y: auto;" v-loading="readingTabLoading">
          <el-table
            :data="readingRecord"
            style="width: 100%;margin-bottom: 10px;">
            <el-table-column
              label="书籍封面">
              <template slot-scope="scope">
                <img :src="scope.row.image_url" style="width: 80px;height: auto;"/>
              </template>
            </el-table-column>
            <el-table-column
              prop="book_id"
              label="书籍ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="书籍名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="最近阅读时间">
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="reading_page_info.totalCount > 0"
            background
            @size-change="sizeChangeHandler"
            @current-change="pageChangeHandler"
            :current-page.sync="reading_page_info.pageIndex"
            :page-sizes="sizes"
            :page-size="reading_page_info.pageSize"
            layout="sizes, prev, pager, next"
            :current-page="reading_page_info.pageIndex"
            :total="reading_page_info.totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="加入的读书会" name="second">
        <div style="max-height: 600px;overflow-y: auto;" v-loading="clubTabLoading">
          <el-table
            :data="readingClub"
            style="width: 100%;margin-bottom: 10px;">
            <el-table-column
              prop="id"
              label="读书会ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="读书会名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="user_name"
              label="读书会创建人"
              width="180">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="加入读书会时间">
            </el-table-column>
            <el-table-column
              prop="p_user_name"
              label="邀请人">
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="club_page_info.totalCount > 0"
            background
            @size-change="sizeChangeHandler"
            @current-change="pageChangeHandler"
            :current-page.sync="club_page_info.pageIndex"
            :page-sizes="sizes"
            :page-size="club_page_info.pageSize"
            layout="sizes, prev, pager, next"
            :current-page="club_page_info.pageIndex"
            :total="club_page_info.totalCount">
          </el-pagination>
        </div>
      </el-tab-pane >
      <el-tab-pane label="加入的计划" name="third">
        <div style="max-height: 600px;overflow-y: auto;" v-loading="planTabLoading">
          <el-table
            :data="plan"
            style="width: 100%;margin-bottom: 10px;">
            <el-table-column
              prop="id"
              label="计划ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="reading_plan_name"
              label="计划名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="reading_club_name"
              label="所属读书会"
              width="180">
            </el-table-column>
            <el-table-column
              prop="start_time"
              label="计划开始时间">
            </el-table-column>
            <el-table-column
              prop="end_time"
              label="计划结束时间">
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="plan_page_info.totalCount > 0"
            background
            @size-change="sizeChangeHandler"
            @current-change="pageChangeHandler"
            :current-page.sync="plan_page_info.pageIndex"
            :page-size="plan_page_info.pageSize"
            :page-sizes="sizes"
            layout="sizes, prev, pager, next"
            :current-page="plan_page_info.pageIndex"
            :total="plan_page_info.totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="false" label="收藏的书籍" name="fourth">
        <div style="max-height: 600px;overflow-y: auto;" v-loading="bookTabLoading">
          <el-table
            :data="book"
            style="width: 100%;margin-bottom: 10px;">
            <el-table-column
              prop="book_id"
              label="书籍ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="book_name"
              label="书籍名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="书籍分类">
            </el-table-column>
            <el-table-column
              prop="time"
              label="收藏时间">
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="book_page_info.totalCount > 0"
            background
            @size-change="sizeChangeHandler"
            @current-change="pageChangeHandler"
            :current-page.sync="book_page_info.pageIndex"
            :page-size="book_page_info.pageSize"
            :page-sizes="sizes"
            layout="sizes, prev, pager, next"
            :current-page="book_page_info.pageIndex"
            :total="book_page_info.totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="打卡记录" name="five">
        <div style="max-height: 600px;overflow-y: auto;" v-loading="cardTabLoading">
          <el-table
            :data="openRecord"
            style="width: 100%;margin-bottom: 10px;">
            <el-table-column
              prop="status"
              label="打卡类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="book_id"
              label="书籍ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="book_name"
              label="书籍名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="classify"
              label="书籍分类">
            </el-table-column>
            <el-table-column
              v-if="false"
              prop="punch_chapter"
              label="打卡章节">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="打卡时间">
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="card_page_info.totalCount > 0"
            background
            @size-change="sizeChangeHandler"
            @current-change="pageChangeHandler"
            :current-page.sync="card_page_info.pageIndex"
            :page-size="card_page_info.pageSize"
            :page-sizes="sizes"
            layout="sizes, prev, pager, next"
            :current-page="card_page_info.pageIndex"
            :total="card_page_info.totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import user from '@/api/readingClub/user';
  import { parseTime } from '@/utils';

  export default {
    name: 'detail',
    props: ['user_id'],
    data() {
      return {
        activeName: 'first',
        readingRecord: [], // 阅读记录
        readingClub: [], // 读书会
        plan: [], // 读书计划
        book: [], // 收藏书籍
        openRecord: [], // 打卡记录
        sizes: [10, 20, 50, 100],
        reading_page_info: {
          pageIndex: 1,
          pageSize: 20,
          totalCount: 1
        },
        club_page_info: {
          pagesIndex: 1,
          pageSize: 20,
          totalCount: 1
        },
        plan_page_info: {
          pageIndex: 1,
          pageSize: 20,
          totalCount: 1
        },
        book_page_info: {
          pageIndex: 1,
          pageSize: 20,
          totalCount: 1
        },
        card_page_info: {
          pageIndex: 1,
          pageSize: 20,
          totalCount: 1
        },
        readingTabLoading: true,
        clubTabLoading: true,
        planTabLoading: true,
        bookTabLoading: true,
        cardTabLoading: true
      };
    },
    created() {
      this.handleClick();
    },
    methods: {
      handleClick() {
        if (this.activeName === 'first') {
          this.get_reading_record();
        } else if (this.activeName === 'second') {
          this.get_reading_club();
        } else if (this.activeName === 'third') {
          this.get_reading_plan();
        } else if (this.activeName === 'fourth') {
          console.log('收藏');
        } else {
          this.get_punch_card_record();
        }
      },
      // 读书计划
      get_reading_plan() {
        this.planTabLoading = true;
        user.reading_plan({
          page_index: this.plan_page_info.pageIndex,
          page_size: this.plan_page_info.pageSize,
          user_id: this.user_id
        }).then(res => {
          this.plan = (res.data.records || []).map(item => {
            return {
              ...item,
              start_time: item.start_time * 1 > 0 ? parseTime(item.start_time) : '--',
              end_time: item.start_time * 1 > 0 ? parseTime(item.end_time) : '--'
            };
          });
          this.plan_page_info.totalCount = res.data.totalCount * 1;
          this.planTabLoading = false;
        });
      },
      // 阅读记录
      get_reading_record() {
        this.readingTabLoading = true;
        user.reading_record({
          page_index: this.reading_page_info.pageIndex,
          page_size: this.reading_page_info.pageSize,
          user_id: this.user_id
        }).then(res => {
          console.log(res);
          this.readingRecord = (res.data.records || []).map(item => {
            return {
              ...item,
              image_url: item.cover[0].file_path,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.reading_page_info.totalCount = res.data.totalCount * 1;
          this.readingTabLoading = false;
        });
      },
      // 加入的读书会
      get_reading_club() {
        this.clubTabLoading = true;
        user.reading_club({
          page_index: this.club_page_info.pageIndex,
          page_size: this.club_page_info.pageSize,
          user_id: this.user_id
        }).then(res => {
          this.readingClub = (res.data.records || []).map(item => {
            return {
              ...item,
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--'
            };
          });
          this.club_page_info.totalCount = res.data.totalCount * 1;
          this.clubTabLoading = false;
        });
      },
      // 打卡记录
      get_punch_card_record() {
        this.cardTabLoading = true;
        user.punch_card_record({
          page_index: this.card_page_info.pageIndex,
          page_size: this.card_page_info.pageSize,
          user_id: this.user_id
        }).then(res => {
          this.openRecord = (res.data.records || []).map(item => {
            return {
              ...item,
              punch_chapter: '整书',
              status: item.status * 1 === 0 ? '章节打卡' : '整书打卡',
              create_time: item.create_time * 1 > 0 ? parseTime(item.create_time) : '--',
              update_time: item.update_time * 1 > 0 ? parseTime(item.update_time) : '--'
            };
          });
          this.card_page_info.totalCount = res.data.totalCount * 1;
          this.cardTabLoading = false;
        });
      },
      sizeChangeHandler(size) {
        if (this.activeName === 'first') {
          this.reading_page_info.pageSize = size;
          this.reading_page_info.pageIndex = 1;
          this.get_reading_record();
        } else if (this.activeName === 'second') {
          this.club_page_info.pageSize = size;
          this.club_page_info.pageIndex = 1;
          this.get_reading_club();
        } else if (this.activeName === 'third') {
          this.plan_page_info.pageSize = size;
          this.plan_page_info.pageIndex = 1;
          this.get_reading_plan();
        } else if (this.activeName === 'fourth') {
          this.book_page_info.pageSize = size;
          this.book_page_info.pageIndex = 1;
        } else {
          this.card_page_info.pageSize = size;
          this.card_page_info.pageIndex = 1;
          this.get_punch_card_record();
        }
      },
      pageChangeHandler(page) {
        if (this.activeName === 'first') {
          this.reading_page_info.pageIndex = page;
          this.get_reading_record();
        } else if (this.activeName === 'second') {
          this.club_page_info.pageIndex = page;
          this.get_reading_club();
        } else if (this.activeName === 'third') {
          this.plan_page_info.pageIndex = page;
          this.get_reading_plan();
        } else if (this.activeName === 'fourth') {
          this.book_page_info.pageIndex = page;
        } else {
          this.card_page_info.pageIndex = page;
          this.get_punch_card_record();
        }
      }
    }
  };
</script>

<style scoped>

</style>
