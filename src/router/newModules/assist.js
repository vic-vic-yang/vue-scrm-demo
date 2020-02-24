import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 7,
  orderName: 'assist',
  path: '/assist',
  component: Layout,
  meta: {
    title: 'assist',
    icon: 'tool'
  },
  children: [
    { path: 'template',
      component: blankLayout,
      meta: { title: 'templateManage', icon: 'message-template' },
      children: [
        {
          path: 'library',
          component: blankLayout,
          meta: { title: 'templateLibraryList' },
          children: [
            {
              path: 'list',
              component: () => import('@/views/templateMessage/library/list'),
              name: 'templateLibraryList',
              meta: { title: 'templateLibraryList' }
            },
            {
              path: ':id',
              component: () => import('@/views/templateMessage/library/editor'),
              name: 'templateLibraryModify',
              meta: { title: 'templateLibraryModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'myTemplate',
          component: blankLayout,
          meta: { title: 'myTemplateList' },
          children: [
            {
              path: 'list',
              component: () => import('@/views/templateMessage/myTemplate/list'),
              name: 'myTemplateList',
              meta: { title: 'myTemplateList' }
            },
            {
              path: 'create',
              component: () => import('@/views/templateMessage/myTemplate/editor'),
              name: 'myTemplateCreate',
              meta: { title: 'myTemplateCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/templateMessage/myTemplate/editor'),
              name: 'myTemplateModify',
              meta: { title: 'myTemplateModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'messagePushList',
          component: blankLayout,
          meta: { title: 'messagePushList' },
          children: [
            {
              path: 'list',
              component: () => import('@/views/templateMessage/messagePushList/list'),
              name: 'messagePushList',
              meta: { title: 'messagePushList' }
            },
            {
              path: 'create',
              component: () => import('@/views/templateMessage/messagePushList/editor'),
              name: 'messageListCreate',
              meta: { title: 'messageListCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/templateMessage/messagePushList/editor'),
              name: 'messageListModify',
              meta: { title: 'messageListModify', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    }
  ]
};
