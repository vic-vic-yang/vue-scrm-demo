import Layout from '@/views/layout/Layout';
export default {
  order: 14,
  path: '/public',
  component: Layout,
  redirect: 'index',
  meta: { title: 'publicAddressManagement', icon: 'star' },
  children: [
    {
      path: 'index',
      component: () => import('@/views/authorize/publicAddress/index'),
      name: 'publicAddress',
      meta: { title: 'publicAddressManagement', icon: 'star', noCache: true }
    }
  ]
};
