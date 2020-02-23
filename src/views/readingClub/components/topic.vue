<template>
    <div class="topic">
      <div v-if="selectTopic && selectTopic.length" class="list-content">
        <el-tag v-for="(item, index) in selectTopic" closable class="list" :key="index" type="success" @close="closeHandler(index)">{{item.name}}</el-tag>
      </div>
      <el-button type="primary" size="mini" @click="addTopic">添加主题</el-button>

      <select-Topic :show="topicShow"
                    :isFilter="false"
                    :list="JSON.stringify(selectTopic)"
                    :multiple="multiple"
                    @determineHandler="determineHandler"
                    @moduleHide="topicShow = false"/>
    </div>
</template>

<script>
  import selectTopic from './select-topic';
  import TOPIC from '@/api/readingClub/topic';

  export default {
    name: 'topic',
    components: {
      selectTopic
    },
    model: {
      prop: 'topic_ids',
      event: 'change'
    },
    props: {
      topic_ids: {
        type: [Array, Number, String],
        default: []
      },
      multiple: {
        type: Boolean,
        default: true
      },
      parameter: {
        type: [Object, String],
        default: ''
      }
    },
    data() {
      return {
        topicShow: false,
        selectTopic: [],
        topicOptions: null
      };
    },
    computed: {
      topic: {
        set(data) {
          let topicData = data;
          if (!this.multiple) {
            topicData = data[0] || '';
          }
          this.$emit('change', topicData);
        },
        get() {
          console.log(this.topic_ids);
          let topicData = this.topic_ids || [];
          if (!(topicData.constructor === Array) || !this.multiple) {
            topicData = [];
            if (this.topic_ids) {
              topicData.push(this.topic_ids);
            }
            return topicData;
          } else {
            return topicData;
          }
        }
      }
    },
    created() {
      this.getTopic();
    },
    methods: {
      addTopic() {
        this.topicShow = true;
      },
      closeHandler(index) {
        this.selectTopic.splice(index, 1);
      },
      determineHandler(data) {
        this.selectTopic = data;
        this.setTopic();
        var topic = (this.selectTopic || []).map(item => item.id);
        if (this.parameter && this.parameter.constructor === Object) {
          var parameter = this.parameter;
          parameter.id = !this.multiple ? Number(topic[0]) : topic;
          this.$emit('giftSuccess', parameter);
        }
        this.topicShow = false;
      },
      setTopicList() {
        let topicData = this.topic_ids || [];
        if (!(topicData.constructor === Array) || !this.multiple) {
          topicData = [];
          if (this.topic_ids) {
            topicData.push(this.topic_ids);
          }
        }
        this.selectTopic = this.topicOptions.filter(item => topicData.includes(item.id));
      },
      setTopic() {
        this.topic = (this.selectTopic || []).map(item => item.id);
      },
      getTopic() {
        TOPIC.topic.list({
          pageIndex: this.pageIndex,
          pageSize: 10000
        }).then(res => {
          this.topicOptions = res.result || [];
          this.setTopicList();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-content {
    margin-top: 20px;
    .list{
      margin:0 10px 10px 0
    }
  }
</style>
