import blankLayout from '@/views/layout/blankLayout';

export default {
  path: 'integralMall',
  component: blankLayout,
  meta: {
    title: 'integralMall',
    icon: 'mall'
  },
  children: [
    {
      path: 'mallOverview',
      component: blankLayout,
      meta: { title: 'mallOverview', noCache: true },
      children: [
        {
          path: 'list',
          name: 'mallOverview',
          component: () => import('@/views/integralMall/mallOverview/index'),
          meta: { title: 'mallOverview', noCache: true }
        },
        {
          path: 'mallEdith',
          component: () => import('@/views/integralMall/mallOverview/edit'),
          name: 'mallEdith',
          meta: { title: 'mallEdith', noCache: false },
          hidden: true
        }
      ]
    },
    {
      path: 'integralCommodity',
      component: blankLayout,
      meta: {
        title: 'integralCommodityManagement'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/integralMall/commodity/index'),
          name: 'integralCommodityList',
          meta: { title: 'integralCommodityManagement', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/integralMall/commodity/add'),
          name: 'integralCommodityCreate',
          meta: { title: 'integralCommodityCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/integralMall/commodity/add'),
          name: 'integralCommodityModify',
          meta: { title: 'integralCommodityModify', noCache: true },
          hidden: true
        },
        // 奖品核销码
        {
          path: 'writeCode',
          name: 'integralCommodityWriteCode',
          component: () => import('@/views/integralMall/commodity/writeCode'),
          meta: { title: 'integralCommodityWriteCode', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'integralOrder',
      name: 'integralOrder',
      component: () => import('@/views/integralMall/order/index'),
      meta: { title: 'integralOrder', noCache: true }
    }
  ]
};
