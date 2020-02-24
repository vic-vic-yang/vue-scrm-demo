import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 5,
  orderName: 'dataCenter',
  path: '/data',
  component: Layout,
  name: 'dataCenter',
  meta: { title: 'dataCenter', icon: 'data' },
  children: [
    {
      path: 'reportSystem',
      name: 'reportSystem',
      component: blankLayout,
      meta: { title: 'reportSystem', icon: 'statement' },
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
    }
  ]
};
