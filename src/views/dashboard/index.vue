<!--
 * @Description: 
 * @Autor: shao bo
 * @Date: 2019-09-16 14:37:18
 -->
<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole"></component>-->
    <dataTotalAnalysis/>
    <!-- <el-main>敬请期待</el-main> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import adminDashboard from './admin';
import editorDashboard from './editor';
import dataTotalAnalysis from '@/views/dataTotalAnalysis/index';
export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard, dataTotalAnalysis },
  data() {
    return {
      currentRole: 'adminDashboard'
    };
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard';
    }
  }
};
</script>
