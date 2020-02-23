import Layout from '@/views/layout/Layout';
export default {
  order: 5,
  path: '/giftCenter',
  component: Layout,
  meta: {
    title: 'giftCenter',
    icon: 'example'
  },
  children: [
    // 奖品管理
    {
      path: 'giftManage',
      name: 'giftManage',
      component: () => import('@/views/giftCenter/index'),
      meta: { title: 'giftManage', noCache: true }
    },
    // 奖品配置
    {
      path: 'giftconf',
      name: 'giftconf',
      component: () => import('@/views/giftCenter/config'),
      meta: { title: 'giftconf', noCache: true },
      hidden: true
    },
    // 奖品流水
    {
      path: 'giftlist',
      name: 'giftlist',
      component: () => import('@/views/giftCenter/list'),
      meta: { title: 'giftlist', noCache: true }
    },
    // 发奖策略
    {
      path: 'giftWays',
      name: 'giftWays',
      component: () => import('@/views/giftCenter/plot'),
      meta: { title: 'giftWays', noCache: true }
    },
    // 新建发奖策略
    {
      path: 'addPlot',
      name: 'addPlot',
      component: () => import('@/views/giftCenter/addPlot'),
      meta: { title: 'addPlot', noCache: true },
      hidden: true
    },
    // 奖品核销码
    {
      path: 'writeCode',
      name: 'giftWriteCode',
      component: () => import('@/views/giftCenter/writeCode'),
      meta: { title: 'giftWriteCode', noCache: true },
      hidden: true
    }
  ]
};
