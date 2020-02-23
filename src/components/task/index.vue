<template>
  <div class="task-content">
    <div v-if="taskList && taskList.length" class="list-content">
      <div v-for="(item, index) in taskList" :key="index" class="list">
        <item-card :taskItem="item"
                   :index="index"
                   :cover="item.pic[0].file_path"
                   :name="item.name"
                   type="task"
                   @editHandler="editTaskHandler"
                   @delHandler="handleClose"/>
      </div>
    </div>
    <el-button type="primary" size="mini" @click="addTask">添加任务</el-button>

    <!--任务选择弹层-->
    <select-task :taskShow="taskShow" :list="JSON.stringify(taskList)" :multiple="multiple" @taskHandler="taskHandler" @taskHide="taskShow = false"/>
  </div>
</template>

<script>
  import selectTask from '@/components/task/list';
  import missionTask from '@/api/task/index';
  import itemCard from '@/components/card/item-card';

  export default {
    name: 'cared',
    components: {
      selectTask,
      itemCard
    },
    model: {
      prop: 'taskId',
      event: 'change'
    },
    props: {
      taskId: {
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
        taskShow: false,
        taskList: [],
        prizeTask: null
      };
    },
    computed: {
      missions: {
        set(data) {
          let taskData = data;
          if (!this.multiple) {
            taskData = data[0] || '';
          }
          this.$emit('change', taskData);
        },
        get() {
          let taskData = this.taskId || [];
          if (!(taskData.constructor === Array) || !this.multiple) {
            taskData = [];
            if (this.prizeId) {
              taskData.push(this.prizeId);
            }
            return taskData;
          } else {
            return taskData;
          }
        }
      }
    },
    created() {
      console.log('created');
      this.getTask();
    },
    methods: {
      addTask() {
        this.taskShow = true;
      },
      taskHandler(data) {
        this.taskList = data;
        this.setTaskId();
        var missions = (this.taskList || []).map(item => item.id);
        var parameter = this.parameter;
        if (this.parameter && this.parameter.constructor === Object) {
          parameter.id = !this.multiple ? missions[0] : missions;
          this.$emit('taskHandler', parameter);
        }
        this.taskShow = false;
      },
      setTask() {
        let taskData = this.taskId || [];
        if (!(taskData.constructor === Array) || !this.multiple) {
          taskData = [];
          if (this.taskId) {
            taskData.push(this.taskId);
          }
        }
        this.taskList = this.prizeTask.filter(item => taskData.includes(item.id));
      },
      setTaskId() {
        this.missions = this.taskList.map(item => item.id);
      },
      handleClose(index) {
        this.taskList.splice(index, 1);
        this.setTaskId();
      },
      editTaskHandler(info) {
        const { href } = this.$router.resolve({ name: 'taskEdit', params: { id: info.id, type: 'newAdd' }});
        window.open(href, '_blank');
      },
      getTask() {
        missionTask.getTasks({
          page_index: this.pageIndex,
          page_size: 100000
        }).then(res => {
          this.prizeTask = res.result || [];
          this.setTask();
        });
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
