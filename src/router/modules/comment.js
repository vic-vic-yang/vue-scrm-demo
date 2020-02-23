import Layout from '@/views/layout/Layout';
export default {
  order: 2,
  path: '/commentCenter',
  component: Layout,
  meta: {
    title: 'commentCenter',
    icon: 'list'
  },
  children: [
  // 评论管理
    {
      path: 'commentManagment',
      name: 'commentManagment',
      component: () => import('@/views/commentCenter/index'),
      meta: { title: 'commentManagment', noCache: true }
    },
    // 评论配置
    {
      path: 'commentConfig',
      name: 'commentConfig',
      component: () => import('@/views/commentCenter/config'),
      meta: { title: 'commentConfig', noCache: true }
    }
  ]
};
