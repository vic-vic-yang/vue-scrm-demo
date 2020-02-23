import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 7,
  path: '/integralCenter',
  component: Layout,
  meta: {
    title: 'integralCenter',
    icon: 'documentation'
  },
  children: [
    {
      path: 'integralMall',
      component: blankLayout,
      meta: {
        title: 'integralMall'
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
    },
    {
      path: 'integralTask',
      name: 'integralTask',
      component: blankLayout,
      meta: { title: 'integralTask', noCache: true },
      hidden: true,
      children: [
        {
          path: 'overview',
          component: () => import('@/views/integralMall/task/overview'),
          name: 'integralTaskOverview',
          meta: { title: 'integralTaskOverview', noCache: true }
        },
        {
          path: 'list',
          component: () => import('@/views/integralMall/task/index'),
          name: 'integralTask',
          meta: { title: 'integralTaskList', noCache: true },
          hidden: false
        },
        {
          path: 'details',
          component: () => import('@/views/integralMall/task/details'),
          name: 'integralTaskDetails',
          meta: { title: 'integralTaskDetails', noCache: true },
          hidden: false
        },
        {
          path: 'awardAdd',
          component: () => import('@/views/integralMall/task/prize/award_task'),
          name: 'integralAwardTaskCreate',
          meta: { title: 'integralAwardTask', noCache: true },
          hidden: true
        },
        {
          path: 'articleAdd',
          component: () => import('@/views/integralMall/task/article/index'),
          name: 'integralArticleAddCreate',
          meta: { title: 'integralArticleAdd', noCache: true },
          hidden: true
        },
        {
          path: 'add',
          component: () => import('@/views/integralMall/task/add'),
          name: 'integralTaskCreate',
          meta: { title: 'integralTaskCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/integralMall/task/add'),
          name: 'integralTaskModify',
          meta: { title: 'integralTaskCreate', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'integralManage',
      component: blankLayout,
      meta: { title: 'integralManage' },
      children: [
        {
          path: 'overview',
          component: () => import('@/views/integralMall/integral/overview'),
          name: 'integralOverview',
          meta: { title: 'integralOverview', noCache: true }
        },
        {
          path: 'index',
          component: () => import('@/views/integralMall/integral/index'),
          name: 'integralRule',
          meta: { title: 'integralRule', noCache: true }
        },
        {
          path: 'details',
          component: () => import('@/views/integralMall/integral/details'),
          name: 'integralDetails',
          meta: { title: 'integralDetails', noCache: true },
          hidden: false
        }
      ]
    },
    {
      path: 'integralMarketing',
      component: blankLayout,
      meta: { title: 'integralMarketing' },
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
    }
  ]
};
