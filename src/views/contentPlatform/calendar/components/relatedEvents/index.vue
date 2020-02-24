<template>
  <div class="content-container">
    <div v-if="tags_list && tags_list.length" class="list-content">
      <div v-for="(item, index) in tags_list" :key="index" class="list">
        <item-card v-if="item"
                   :taskItem="item"
                   :index="index"
                   :name="item.name"
                   :desc="item.describe"
                   type="calendar-content"
                   @editHandler="editHandler"
                   @delHandler="closeHandler"/>
      </div>
    </div>
    <el-button type="primary" size="mini" @click="addEventTag">关联事件</el-button>

    <tags-list :show="tags_show"
               :multiple="multiple"
               :list="JSON.stringify(tags_list)"
               @determineHandler="determineHandler"
               @dialogHide="tags_show = false"></tags-list>
  </div>
</template>

<script>
  import tagsList from './list';
  import itemCard from '@/components/card/item-card';
  import CALENDAR from '@/api/contentPlatform/calendar';

  export default {
    name: 'content',
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
        CALENDAR.event.list({
          pageIndex: 1,
          pageSize: 10000
        }).then(res => {
          this.tableData = (res.result || []);
          this.setTagsList();
        });
      },
      editHandler(info) {
        // const { href } = this.$router.resolve({name: 'modifyEvent', params: {id: info.id}});
        // window.open(href, '_blank');
        this.$router.push({name: 'modifyEvent', params: {id: info.id}});
      },
      setTagsList() {
        let tagsData = this.tagsId || [];
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
        this.tags = this.tags_list.map(item => item.id);
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
