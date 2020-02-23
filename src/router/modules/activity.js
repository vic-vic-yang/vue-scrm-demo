import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 3,
  path: '/activityCenter',
  component: Layout,
  meta: {
    title: 'activityCenter',
    icon: 'nested'
  },
  children: [
    {
      path: 'index',
      component: blankLayout,
      meta: {
        title: 'activityCenterList'
      },
      children: [
        {
          path: 'index',
          name: 'activityCenter',
          component: () => import('@/views/activityCenter/index/index'),
          meta: { title: 'activityCenterList', noCache: true }
        },
        {
          path: 'config',
          name: 'activityCenterConfig',
          component: () => import('@/views/activityCenter/index/configure'),
          meta: { title: 'activityCenterConfig', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'column',
      component: blankLayout,
      meta: {
        title: 'activityColumnList'
      },
      children: [
        {
          path: 'list',
          name: 'activityColumnList',
          component: () => import('@/views/activityCenter/column/index'),
          meta: { title: 'activityColumnList', noCache: true }
        },
        {
          path: 'weight:id',
          name: 'columnActivityWeight',
          component: () => import('@/views/activityCenter/column/activityWeight'),
          meta: { title: 'columnActivityWeight', noCache: true },
          hidden: true
        },
        {
          path: 'create',
          name: 'activityColumnCreate',
          component: () => import('@/views/activityCenter/column/editor'),
          meta: { title: 'activityColumnCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          name: 'activityColumnModify',
          component: () => import('@/views/activityCenter/column/editor'),
          meta: { title: 'activityColumnModify', noCache: true },
          hidden: true
        }
      ]
    }
  ]
};
