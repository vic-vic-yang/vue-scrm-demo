<template>
    <div class="app-container">
      <h4>选择模板</h4>
      <el-card class="box-card" v-for="(item, index) in moduleOptions" :key="index">
        <div class="box-card-content" @click.stop="selectModule(item)">
          <div>
            <span>{{item.name}}</span>
            <!-- <span style="font-size: 14px;color: #999;display: block;text-align: center">({{tips}})</span> -->
          </div>
        </div>
      </el-card>
    </div>
</template>

<script>
  import WORKFLOW from '@/api/configure/workflow';

  export default {
    name: 'workflow',
    data() {
      return {
        moduleOptions: [
          {
            id: 1,
            name: '内容审核'
          }
        ],
        workflow: null,
        tips: ''
      };
    },
    created() {
      // this.getData();
    },
    methods: {
      getData() {
        WORKFLOW.works.list({
          department_id: this.$route.params.id
        }).then(res => {
          this.workflow = res;
          if (this.workflow && this.workflow.length) {
            this.tips = '编辑';
          } else {
            this.tips = '新增';
          }
        });
      },
      selectModule(item) {
        this.$router.push({ name: 'workflowTemplateMange', params: { id: item.id }});
        // if (this.workflow && this.workflow.length) {
        //   const workflow = this.workflow.filter(item => item.type === 1);
        //   this.$router.replace({ name: 'modifyWorkflow', params: { id: workflow[0].id }, query: {department_id: this.$route.params.id}});
        // } else {
        //   this.$router.replace({ name: 'createWorkflow', query: {department_id: this.$route.params.id}});
        // }
      }
    }
  };
</script>

<style scoped>
  .box-card{
    width: 300px;
    height: 260px;
    cursor: pointer;
  }
  .box-card-content{
    width: 250px;
    height: 210px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
