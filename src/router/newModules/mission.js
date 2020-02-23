import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 4,
  orderName: 'integralTask',
  path: '/taskCenter',
  component: Layout,
  meta: {
    title: 'integralTask',
    icon: 'mission'
  },
  alwaysShow: true,
  children: [
    {
      path: 'task',
      component: blankLayout,
      meta: {
        title: 'taskManage'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/taskCenter/index'),
          name: 'taskManage',
          meta: { title: 'taskManage', noCache: true }
        },
        {
          path: 'article',
          component: () => import('@/views/taskCenter/article'),
          name: 'taskArticle',
          meta: { title: 'taskArticle', noCache: true },
          hidden: true
        },
        {
          path: 'articleParameter',
          component: () => import('@/views/taskCenter/articleParameter'),
          name: 'taskArticleParameter',
          meta: { title: 'taskArticleParameter', noCache: true },
          hidden: true
        },
        {
          path: 'create',
          component: () => import('@/views/taskCenter/taskEdit'),
          name: 'taskCreate',
          meta: { title: 'taskCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/taskCenter/taskEdit'),
          name: 'taskEdit',
          meta: { title: 'taskEdit', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'taskLogs',
      component: blankLayout,
      name: 'taskLogs',
      meta: {
        title: 'taskLogs'
      },
      children: [
        {
          path: 'above',
          component: () => import('@/views/taskCenter/taskLogs'),
          name: 'taskLogs',
          meta: { title: 'taskLogs', noCache: true }
        },
        {
          path: 'details',
          component: () => import('@/views/taskCenter/taskLogsDetails'),
          name: 'taskLogsDetails',
          meta: { title: 'taskLogsDetails', noCache: true },
          hidden: true
        }
      ]
    }
  ]
};
