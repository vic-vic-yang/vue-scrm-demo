import blankLayout from '@/views/layout/blankLayout';

export default {
  path: 'integralMarketing',
  component: blankLayout,
  meta: {title: 'integralMarketing', icon: 'lottery'},
  children: [
    {
      path: 'prize',
      component: blankLayout,
      name: 'marketingPrize',
      meta: { title: 'marketingPrize', noCache: false },
      hidden: false,
      children: [
        {
          path: 'list',
          component: () => import('@/views/integralMall/marketingActivity/prize/index'),
          name: 'marketingPrizeList',
          meta: { title: 'marketingPrize', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/integralMall/marketingActivity/prize/add'),
          name: 'marketingPrizeCreate',
          meta: { title: 'marketingPrizeCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/integralMall/marketingActivity/prize/add'),
          name: 'marketingPrizeModify',
          meta: { title: 'marketingPrizeModify', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'rule',
      component: blankLayout,
      name: 'marketingRule',
      meta: { title: 'marketingRule', noCache: false },
      children: [
        {
          path: 'list',
          component: () => import('@/views/integralMall/marketingActivity/rule/index'),
          name: 'marketingRuleList',
          meta: { title: 'marketingRule', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/integralMall/marketingActivity/rule/add'),
          name: 'marketingRuleCreate',
          meta: { title: 'marketingRuleCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/integralMall/marketingActivity/rule/add'),
          name: 'marketingRuleModify',
          meta: { title: 'marketingRuleModify', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'activity',
      component: blankLayout,
      name: 'marketingActivity',
      meta: { title: 'marketingActivity', noCache: false },
      children: [
        {
          path: 'list',
          component: () => import('@/views/integralMall/marketingActivity/activity/index'),
          name: 'marketingActivityList',
          meta: { title: 'marketingActivity', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/integralMall/marketingActivity/activity/add'),
          name: 'marketingActivityCreate',
          meta: { title: 'marketingActivityCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/integralMall/marketingActivity/activity/add'),
          name: 'marketingActivityModify',
          meta: { title: 'marketingActivityModify', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'data',
      component: () => import('@/views/integralMall/marketingActivity/data/index'),
      name: 'marketingData',
      meta: { title: 'marketingData', noCache: false }
    },
    {
      path: 'lotteryPrize',
      component: blankLayout,
      name: 'marketingLotteryPrize',
      meta: { title: 'marketingLotteryPrize', noCache: false },
      hidden: true,
      children: [
        {
          path: 'list',
          component: () => import('@/views/integralMall/marketingActivity/lotteryPrize/index'),
          name: 'marketingLotteryPrizeList',
          meta: { title: 'marketingLotteryPrize', noCache: true },
          hidden: true
        },
        {
          path: 'create',
          component: () => import('@/views/integralMall/marketingActivity/lotteryPrize/add'),
          name: 'marketingLotteryPrizeCreate',
          meta: { title: 'marketingLotteryPrizeCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/integralMall/marketingActivity/lotteryPrize/add'),
          name: 'marketingLotteryPrizeModify',
          meta: { title: 'marketingLotteryPrizeModify', noCache: true },
          hidden: true
        }
      ]
    }
  ]
};
