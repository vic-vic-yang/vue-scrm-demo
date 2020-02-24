<template>
  <div class="content-container">
    <div v-if="tags_list && tags_list.length" class="list-content">
      <div v-for="(item, index) in tags_list" :key="index" class="list">
        <item-card v-if="item"
                   :taskItem="item"
                   :index="index"
                   :name="item.title"
                   :desc="item.channels"
                   type="calendar-content"
                   @editHandler="editHandler"
                   @delHandler="closeHandler"/>
      </div>
    </div>

    <el-button type="primary" size="mini" @click="addEventTag">关联内容</el-button>

    <tags-list :show="tags_show"
               :multiple="multiple"
               :list="JSON.stringify(tags_list)"
               @saveContent="determineHandler"
               @handleClose="tags_show = false"></tags-list>
  </div>
</template>

<script>
  import tagsList from './relatedContent';
  import itemCard from '@/components/card/item-card';
  import Content from '@/api/contentPlatform/content';
  import { parseTime } from '@/utils';

  export default {
    name: 'index',
    components: {
      tagsList,
      itemCard
    },
    data() {
      return {
        tags_list: [],
        tags_show: false,
        tableData: ''
      };
    },
    model: {
      prop: 'tagsId',
      event: 'change'
    },
    props: {
      tagsId: {
        type: [Array, Number, String],
        default: []
      },
      multiple: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      tags: {
        set(data) {
          let tagsData = data;
          if (!this.multiple) {
            tagsData = data[0] || '';
          }
          this.$emit('change', tagsData);
        },
        get() {
          let tagsData = this.tagsId || [];
          if (!(tagsData.constructor === Array) || !this.multiple) {
            tagsData = [];
            if (this.tagsId) {
              tagsData.push(this.tagsId);
            }
            return tagsData;
          } else {
            return tagsData;
          }
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      determineHandler(data) {
        this.tags_list = data;
        this.tags = this.tags_list.map(item => item.id);
        this.tags_show = false;
      },
      getData() {
        Content.list.listB({
          pageIndex: 1,
          pageSize: 10000
        }).then(data => {
          data.result.forEach(item => {
            if (item.publish_time) {
              item.publish_time = parseTime(item.publish_time);
            }
            item.article_type = item.article_type - 0 === 1 ? '图文' : '视频';
            item.status_cn = item.status - 0 === 0 ? '未发布' : '已发布';
            item.stageType = item.status - 0 === 0 ? 2 : 1;
            item.top_cn = item.top - 0 === 0 ? '置顶' : '取消置顶';
            item.recommend_cn = item.recommend - 0 === 0 ? '推荐' : '取消推荐';
            item.title = item.recommend - 0 === 1 ? '[推荐] ' + item.title : item.title;
            item.title = item.top - 0 === 1 ? '[置顶] ' + item.title : item.title;
          });
          this.tableData = data.result;
          this.setTagsList();
        })
          .catch(() => {
            this.tabLoading = false;
          });
      },
      editHandler(info) {
        const { href } = this.$router.resolve({name: 'modifyContent', params: {id: info.id}});
        window.open(href, '_blank');
      },
      setTagsList() {
        let tagsData = this.tagsId || [];
        console.log(this.tagsId);
        if (!(tagsData.constructor === Array) || !this.multiple) {
          tagsData = [];
          if (this.tagsId) {
            tagsData.push(this.tagsId);
          }
        }
        this.tags_list = this.tableData.filter(item => tagsData.includes(item.id));
      },
      closeHandler(index) {
        this.tags_list.splice(index, 1);
      },
      addEventTag() {
        this.tags_show = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-content {
    display: flex;
    flex-wrap: wrap;
    .list{
      margin:0 10px 10px 0
    }
  }
</style>
