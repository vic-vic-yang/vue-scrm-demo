<template>
  <div class="tags-container">
    <el-tag
      v-for="(tag, index) in tags_list"
      :key="index"
      closable
      style="margin-right: 10px;"
      @close="closed(index)">
      {{tag.name}}
    </el-tag>
    <el-button type="primary" size="mini" @click="addEventTag">添加事件标签</el-button>

    <tags-list :show="tags_show"
      :list="JSON.stringify(tags_list)"
      :multiple="multiple"
      @determineHandler="determineHandler"
      @dialogHide="tags_show = false"></tags-list>
  </div>
</template>

<script>
  import tagsList from './list';
  import CALENDAR from '@/api/contentPlatform/calendar';

  export default {
    name: 'tags',
    components: {
      tagsList
    },
    data() {
      return {
        tags_list: [],
        tags_show: false,
        tableData: null
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
        this.tags = (this.tags_list || []).map(item => item.id);
        this.tags_show = false;
      },
      getData() {
        CALENDAR.tag.list({
          pageIndex: 1,
          pageSize: 10000
        }).then(res => {
          this.tableData = (res.result || []);
          this.setTagsList();
        });
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
      closed(index) {
        this.tags_list.splice(index, 1);
      },
      addEventTag() {
        this.tags_show = true;
      }
    }
  };
</script>

<style scoped>

</style>
