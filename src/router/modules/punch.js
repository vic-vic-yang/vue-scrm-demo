import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 13,
  path: '/reading',
  component: Layout,
  meta: {
    title: 'readingClub',
    icon: 'form'
  },
  children: [
    {
      path: 'interpretation',
      component: blankLayout,
      meta: {
        title: 'readingClub'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/readingClub/Interpretation/index'),
          name: 'interpretationList',
          meta: { title: 'readingClubInterpretation', noCache: true }
        },
        {
          path: 'selectBook',
          component: () => import('@/views/readingClub/Interpretation/selectBook'),
          name: 'readingClubSelectBook',
          meta: { title: 'readingClubSelectBook', noCache: true },
          hidden: true
        },
        {
          path: 'create',
          component: () => import('@/views/readingClub/Interpretation/editor'),
          name: 'readingClubInterpretationCreate',
          meta: { title: 'interpretationCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/readingClub/Interpretation/editor'),
          name: 'readingClubInterpretationModify',
          meta: { title: 'interpretationModify', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'user',
      component: blankLayout,
      meta: {
        title: 'readingClubUser'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/readingClub/user/index'),
          name: 'readingClubUser',
          meta: { title: 'readingClubUser', noCache: true }
        }
      ]
    },
    {
      path: 'clockActivityManagement', // 打卡活动管理
      component: blankLayout,
      meta: {
        title: 'clockActivityManagement'
      },
      children: [
        {
          path: 'list', // 管理列表
          component: () => import('@/views/readingClub/clockActivityManagement/list'),
          name: 'clockActivityManagement',
          meta: { title: 'clockActivityManagement', noCache: true }
        },
        {
          path: 'activityDetail', // 新建活动
          component: () => import('@/views/readingClub/clockActivityManagement/activityDetail'),
          name: 'newActivity',
          meta: { title: 'newActivity', noCache: true },
          hidden: true
        },
        {
          path: 'readTaskList', // 主题列表
          component: () => import('@/views/readingClub/clockActivityManagement/readTaskList'),
          name: 'readTaskList',
          meta: { title: 'readTaskList', noCache: true },
          hidden: true
        },
        {
          path: 'taskDetail', // 主题详情
          component: () => import('@/views/readingClub/clockActivityManagement/taskDetail'),
          name: 'taskDetail',
          meta: { title: 'taskDetail', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'topic', // 主题列表
      component: blankLayout,
      meta: {
        title: 'topicManagement'
      },
      children: [
        {
          path: 'series',
          component: blankLayout,
          meta: {
            title: 'topicSeriesManagement'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/readingClub/topic/series/index'),
              name: 'topicSeriesManagement',
              meta: { title: 'topicSeriesManagement', noCache: true }
            },
            {
              path: 'create',
              component: () => import('@/views/readingClub/topic/series/editor'),
              name: 'topicSeriesCreate',
              meta: { title: 'topicSeriesCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/readingClub/topic/series/editor'),
              name: 'topicSeriesModify',
              meta: { title: 'topicSeriesModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'list',
          component: blankLayout,
          meta: {
            title: 'topicListManagement'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/readingClub/topic/list/index'),
              name: 'topicListManagement',
              meta: { title: 'topicListManagement', noCache: true }
            },
            {
              path: 'create',
              component: () => import('@/views/readingClub/topic/list/editor'),
              name: 'topicListCreate',
              meta: { title: 'topicListCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/readingClub/topic/list/editor'),
              name: 'topicListModify',
              meta: { title: 'topicListModify', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    {
      path: 'clockManagement', // 打卡管理
      component: blankLayout,
      meta: {
        title: 'clockManagement'
      },
      children: [
        {
          path: 'list', // 管理列表
          component: () => import('@/views/readingClub/clockManagement/list'),
          name: 'clockManagement',
          meta: { title: 'clockManagement', noCache: true }
        },
        {
          path: 'userClock', // 用户打卡记录
          component: () => import('@/views/readingClub/clockManagement/userClock'),
          name: 'userClock',
          meta: { title: 'userClock', noCache: true },
          hidden: true
        }
      ]
    }
  ]
};
