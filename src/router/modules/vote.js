import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 11,
  path: '/vote',
  component: Layout,
  meta: {
    title: 'vote',
    icon: 'table'
  },
  children: [
    { // 活动管理
      path: 'activity',
      component: blankLayout,
      meta: {
        title: 'voteActivityManagement'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/vote/activity/index'),
          name: 'voteActivity',
          meta: { title: 'voteActivityManagement', noCache: true }
        },
        { // 新建活动
          path: 'editorActivity',
          component: () => import('@/views/vote/activity/editorActivity'),
          name: 'addActivity',
          meta: { title: 'voteActivityCreate', noCache: true },
          hidden: true // 是否不在侧边栏显示
        },
        { // 修改活动
          path: 'editorActivity/:id',
          component: () => import('@/views/vote/activity/editorActivity'),
          name: 'modifyActivity',
          meta: { title: 'voteActivityModify', noCache: true },
          hidden: true
        },
        { // 阶段列表
          path: 'stageList/:id',
          component: () => import('@/views/vote/activity/stageList'),
          name: 'stageList',
          meta: { title: 'stage', noCache: true },
          hidden: true
        },
        { // 新建阶段
          path: 'newStage/:activityId',
          component: () => import('@/views/vote/activity/newStage'),
          name: 'newStage',
          meta: { title: 'newStage', noCache: true },
          hidden: true
        },
        { // 修改阶段
          path: 'editStage/:activityId/:id',
          component: () => import('@/views/vote/activity/newStage'),
          name: 'editStage',
          meta: { title: 'editStage', noCache: true },
          hidden: true
        },
        { // 任务管理
          path: 'taskList/:stageId',
          component: () => import('@/views/vote/activity/taskList'),
          name: 'voteTaskList',
          meta: { title: 'taskList', noCache: true },
          hidden: true
        },
        { // 新建任务
          path: 'editorTask/:stageId',
          component: () => import('@/views/vote/activity/editorTask'),
          name: 'voteNewStage',
          meta: { title: 'newTask', noCache: true },
          hidden: true
        },
        { // 修改任务
          path: 'editorTask/:stageId/:id',
          component: () => import('@/views/vote/activity/editorTask'),
          name: 'voteEditorTask',
          meta: { title: 'editingTask', noCache: true },
          hidden: true
        },
        { // 报名审核
          path: 'userExamine/:id',
          component: () => import('@/views/vote/user/userExamine'),
          name: 'userExamine',
          meta: { title: 'userExamine', noCache: true },
          hidden: true
        },
        { // 查看排名
          path: 'ranking/:id',
          component: () => import('@/views/vote/activity/ranking'),
          name: 'voteActivityRankink',
          meta: { title: 'ranking', noCache: true },
          hidden: true
        },
        { // 评委评分
          path: 'judges/:id',
          component: () => import('@/views/vote/activity/judgesScore'),
          name: 'judgesScore',
          meta: { title: 'judgesScore', noCache: true },
          hidden: true
        }
      ]
    },
    { // 作品管理
      path: 'works',
      component: blankLayout,
      meta: {
        title: 'works'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/vote/works/index'),
          name: 'voteWorks',
          meta: { title: 'wotksList', noCache: true }
        },
        {
          path: 'comment/:id',
          component: () => import('@/views/vote/works/comment'),
          name: 'voteComment',
          meta: { title: 'comment', noCache: true },
          hidden: true
        },
        {
          path: 'uploadWork',
          component: () => import('@/views/vote/works/uploadWork'),
          name: 'uploadWork',
          meta: { title: 'uploadWork', noCache: true }
        },
        {
          path: 'tag',
          component: () => import('@/views/vote/works/tag'),
          name: 'uploadWorkTag',
          meta: { title: 'uploadWorkTag', noCache: true }
        }
      ]
    },
    { // 用户管理
      path: 'voteUser',
      component: blankLayout,
      meta: {
        title: 'userManagement'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/vote/user/index'),
          name: 'voteUser',
          meta: { title: 'userList', noCache: true }
        },
        {
          path: 'userDetails/:id',
          component: () => import('@/views/vote/user/userDetails'),
          name: 'voteUserDetails',
          meta: { title: 'userDetail', noCache: true },
          hidden: true
        },
        {
          path: 'blackList',
          component: () => import('@/views/vote/user/blacklist'),
          name: 'blackList',
          meta: { title: 'blackList', noCache: true }
        }
      ]
    },
    { // 红包管理
      path: 'award',
      component: blankLayout,
      meta: {
        title: 'voteOperationManagementAward'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/vote/operation/award'),
          name: 'voteOperationManagementAward',
          meta: { title: 'voteOperationManagementAward', noCache: true }
        }
      ]
    },
    { // 任务管理
      path: 'task',
      component: blankLayout,
      meta: {
        title: 'voteTaskManagement'
      },
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/vote/task/index'),
          name: 'voteTask',
          meta: { title: 'voteTaskManagement', noCache: true }
        },
        {
          path: 'editorTask',
          component: () => import('@/views/vote/task/editor'),
          name: 'addTask',
          meta: { title: 'voteTaskCreate', noCache: true },
          hidden: true
        },
        {
          path: 'editorTask/:id',
          component: () => import('@/views/vote/task/editor'),
          name: 'modifyTask',
          meta: { title: 'voteTaskModify', noCache: true },
          hidden: true
        }
      ]
    }
  ]
};
