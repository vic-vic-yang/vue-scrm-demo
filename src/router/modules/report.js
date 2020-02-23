import Layout from '@/views/layout/Layout';
export default {
  order: 17,
  path: '/reportSystem',
  name: 'reportSystem',
  component: Layout,
  meta: { title: 'reportSystem', icon: 'edit' },
  children: [
    {
      path: 'rewardRecords',
      name: 'rewardRecords',
      component: () => import('@/views/reportSystem/rewardRecords'),
      meta: { title: 'rewardRecords', noCache: true }
      // children: [] 只有一个子菜单时需要加上一个空的children，不然会出错
      // name属性必须
    },
    {
      path: 'redPacketRecords',
      name: 'redPacketRecords',
      component: () => import('@/views/reportSystem/redPacketRecords'),
      meta: { title: 'redPacketRecords', noCache: true }
    }
  ]
};
