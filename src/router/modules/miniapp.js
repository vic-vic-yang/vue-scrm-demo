import Layout from '@/views/layout/Layout';
export default {
  order: 15,
  path: '/program',
  component: Layout,
  redirect: 'index',
  meta: {
    title: 'miniProgramManagement',
    icon: 'wechat'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/authorize/miniProgram/index'),
      name: 'miniProgram',
      meta: { title: 'miniProgramManagement', icon: 'wechat', noCache: true }
    }
  ]
};
