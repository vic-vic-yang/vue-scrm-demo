import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 5,
  orderName: 'activity',
  path: '/activityCenter',
  component: Layout,
  meta: {
    title: 'activityCenter',
    icon: 'activity'
  },
  children: [
    {
      path: 'index',
      component: blankLayout,
      meta: {
        title: 'activityCenterList'
      },
      children: [
        { // 编辑活动
          path: 'editorActivity/:id',
          component: () => import('@/views/contentPlatform/auxiliary/editorActivity'),
          name: 'contentEditorActivity',
          meta: { title: 'activityModify', noCache: true },
          hidden: true
        },
        { // 报名管理
          path: 'signUp/:id',
          component: () => import('@/views/contentPlatform/auxiliary/signUp'),
          name: 'contentSignUp',
          meta: { title: 'userExamine', noCache: true },
          hidden: true
        },
        { // 标签管理
          path: 'label',
          component: () => import('@/views/contentPlatform/auxiliary/label'),
          name: 'contentLabel',
          meta: { title: 'label', noCache: true, roles: ['11_4_3', 'admin'] }
        },
        { // 新建标签
          path: 'addLabel',
          component: () => import('@/views/contentPlatform/auxiliary/editorLabel'),
          name: 'contentAddLabel',
          meta: { title: 'addLabel', noCache: true },
          hidden: true
        },
        { // 编辑标签
          path: 'editorLabel/:id',
          component: () => import('@/views/contentPlatform/auxiliary/editorLabel'),
          name: 'contentEditorLabel',
          meta: { title: 'editLabel', noCache: true },
          hidden: true
        },
        { // 新建活动
          path: 'addActivity',
          component: () => import('@/views/contentPlatform/auxiliary/editorActivity'),
          name: 'contentAddActivity',
          meta: { title: 'activityCreate', noCache: true },
          hidden: true
        },
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
