import blankLayout from '@/views/layout/blankLayout';

export default {
  path: 'answer',
  component: blankLayout,
  meta: {
    title: 'answer',
    icon: 'quiz'
  },
  children: [
    // 全局配置
    {
      path: 'global',
      component: () => import('@/views/answer/global/index'),
      meta: {title: 'global', noCache: true}
    },
    // 比赛管理
    {
      path: 'game',
      component: blankLayout,
      meta: {
        title: 'gameManagement'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/answer/game/list'),
          name: 'gameList',
          meta: {title: 'gameManagement', noCache: true}
        },
        {
          path: 'name/list/:gameId',
          component: () => import('@/views/answer/game/nameList'),
          name: 'gameNameList',
          meta: {title: 'gameNameList', noCache: true},
          hidden: true
        },
        {
          path: 'name/create/:gameId',
          component: () => import('@/views/answer/game/nameEditor'),
          name: 'gameNameCreate',
          meta: {title: 'gameNameCreate', noCache: true},
          hidden: true
        },
        {
          path: 'name/:gameId/:id',
          component: () => import('@/views/answer/game/nameEditor'),
          name: 'gameNameModify',
          meta: {title: 'gameNameModify', noCache: true},
          hidden: true
        },
        {
          path: 'detail/:gameId',
          component: () => import('@/views/answer/game/gameDetail'),
          name: 'gameDetail',
          meta: {title: 'gameDetail', noCache: true},
          hidden: true
        },
        {
          path: 'view/:gameId',
          component: () => import('@/views/answer/game/view'),
          name: 'gameView',
          meta: {title: 'gameView', noCache: true},
          hidden: true
        },
        {
          path: 'reward/:gameId',
          component: () => import('@/views/answer/game/reward'),
          name: 'gameReward',
          meta: {title: 'gameReward', noCache: true},
          hidden: true
        },
        {
          path: 'create',
          component: () => import('@/views/answer/game/editor'),
          name: 'gameCreate',
          meta: {title: 'gameCreate', noCache: true},
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/answer/game/editor'),
          name: 'gameModify',
          meta: {title: 'gameModify', noCache: true},
          hidden: true
        }
      ]
    },
    // 题库管理
    {
      path: 'question',
      component: blankLayout,
      meta: {
        title: 'questionManagement'
      },
      children: [
        {
          path: 'group',
          component: () => import('@/views/answer/question/groupList'),
          name: 'questionGroupList',
          meta: {title: 'questionManagement', noCache: true}
        },
        {
          path: 'group/create',
          component: () => import('@/views/answer/question/groupEditor'),
          name: 'questionGroupCreate',
          meta: {title: 'questionCreate', noCache: true},
          hidden: true
        },
        {
          path: 'group/:id',
          component: () => import('@/views/answer/question/groupEditor'),
          name: 'questionGroupModify',
          meta: {title: 'questionModify', noCache: true},
          hidden: true
        },
        {
          path: 'topic/create',
          component: () => import('@/views/answer/question/topicEditor'),
          name: 'topicCreate',
          meta: {title: 'topicCreate', noCache: true},
          hidden: true
        },
        {
          path: 'topic/:id',
          component: () => import('@/views/answer/question/topicEditor'),
          name: 'topicModify',
          meta: {title: 'topicModify', noCache: true},
          hidden: true
        },
        {
          path: 'topic',
          component: () => import('@/views/answer/question/topicList'),
          name: 'topicList',
          meta: {title: 'topicList', noCache: true},
          hidden: true
        }
      ]
    },
    // // 任务管理
    {
      path: 'task',
      component: blankLayout,
      meta: {
        title: 'taskList'
      },
      hidden: true,
      children: [
        {
          path: 'list',
          component: () => import('@/views/answer/taskList/index'),
          name: 'taskList',
          meta: {title: 'taskList', noCache: true}
        },
        {
          path: 'newTask',
          component: () => import('@/views/answer/taskList/editingTask'),
          name: 'newTask',
          meta: {title: 'newTask', noCache: true},
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/answer/taskList/editingTask'),
          name: 'editingTask',
          meta: {title: 'editingTask', noCache: true},
          hidden: true
        }
      ]
    },
    // 学习中心
    {
      path: 'learning',
      component: blankLayout,
      meta: {
        title: 'learningCenter'
      },
      children: [
        {
          path: 'center',
          component: () => import('@/views/answer/learningCenter/index'),
          name: 'learningCenter',
          meta: {title: 'learningCenter', noCache: true}
        },
        {
          path: 'newArticle',
          component: () => import('@/views/answer/learningCenter/newArticle'),
          name: 'newArticle',
          meta: {title: 'newArticle', noCache: true},
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/answer/learningCenter/editArticle'),
          name: 'editArticle',
          meta: {title: 'editArticle', noCache: true},
          hidden: true
        }
      ]
    },
    // 用户管理
    {
      path: 'userManagement',
      component: blankLayout,
      meta: {
        title: 'userManagement'
      },
      children: [
        {
          path: 'team/list',
          component: () => import('@/views/answer/user/teamList'),
          name: 'teamList',
          meta: {title: 'teamList', noCache: true}
        },
        {
          path: 'team/:id',
          component: () => import('@/views/answer/user/teamDetail'),
          name: 'teamDetail',
          meta: {title: 'teamDetail', noCache: true},
          hidden: true
        },
        {
          path: 'user/list',
          component: () => import('@/views/answer/user/userList'),
          name: 'userList',
          meta: {title: 'userList', noCache: true}
        },
        {
          path: 'matchRecord/:id',
          component: () => import('@/views/answer/user/userMatchRecord'),
          name: 'userMatchRecord',
          meta: {title: 'userMatchRecord', noCache: true},
          hidden: true
        }
      ]
    },
    // 运营管理
    {
      path: 'operationManagement',
      component: blankLayout,
      meta: {
        title: 'operationManagement'
      },
      children: [
        // 客服中心
        {
          path: 'center',
          component: blankLayout,
          children: [
            {
              path: 'service',
              component: () => import('@/views/answer/service/index'),
              name: 'service',
              meta: {title: 'service'}
            },
            {
              path: 'communication',
              component: () => import('@/views/answer/service/communication'),
              name: 'answerServiceCommunication',
              meta: {title: 'communication'},
              hidden: true
            }
          ]
        },
        // 绑定小程序
        // {
        //   path: 'publicNumber',
        //   component: () => import('@/views/answer/basic/bindPublicNumber'),
        //   name: 'bindPublicNumber',
        //   meta: { title: 'bindPublicNumber', noCache: true }
        // },
        // 广告管理
        {
          path: 'advert/list',
          component: () => import('@/views/answer/operation/advertList'),
          name: 'advertManagement',
          meta: {title: 'advertManagement', noCache: true}
        },
        {
          path: 'advert/create',
          component: () => import('@/views/answer/operation/advertEditor'),
          name: 'advertModify',
          meta: {title: 'advertModify', noCache: true},
          hidden: true
        },
        {
          path: 'advert/:id',
          component: () => import('@/views/answer/operation/advertEditor'),
          name: 'advertCreate',
          meta: {title: 'advertCreate', noCache: true},
          hidden: true
        },
        // 数据展示
        {
          path: 'dataView',
          component: blankLayout,
          meta: {
            title: 'dataView'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/answer/dataView/index'),
              name: 'fightGroupDataView',
              meta: {title: 'dataView', noCache: true}
            },
            {
              path: 'dataViewSetting',
              component: () => import('@/views/answer/dataView/dataViewSetting'),
              name: 'fightGroupDataViewSetting',
              meta: {title: 'dataViewSetting'},
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/answer/dataView/dataViewSetting'),
              name: 'fightGroupDataViewModify',
              meta: {title: 'dataViewModify'},
              hidden: true
            }
          ]
        }
      ]
    }
  ]
};
