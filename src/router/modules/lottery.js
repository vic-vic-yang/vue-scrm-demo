import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 8,
  path: '/lottery',
  component: Layout,
  meta: {
    title: 'lottery',
    icon: 'guide'
  },
  children: [
    {
      path: 'code',
      component: blankLayout,
      meta: {
        title: 'code'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/lottery/code/list'),
          name: 'codeList',
          meta: { title: 'codeList', noCache: true }
        },
        {
          path: 'statics',
          component: () => import('@/views/lottery/code/statics'),
          name: 'codeStatics',
          meta: { title: 'codeStatics', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/lottery/code/editor'),
          name: 'codeAdd',
          meta: { title: 'codeCreate' },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/lottery/code/editor'),
          name: 'codeModify',
          meta: { title: 'codeModify' },
          hidden: true
        }
      ]
    },
    {
      path: 'prize',
      component: blankLayout,
      meta: {
        title: 'prize'
      },
      children: [
        {
          path: 'template/list',
          component: () => import('@/views/lottery/prize/template'),
          name: 'prizeTemplate',
          meta: { title: 'prizeTemplate', noCache: true }
        },
        {
          path: 'template/create',
          component: () => import('@/views/lottery/prize/templateEditor'),
          name: 'prizeTemplateCreate',
          meta: { title: 'prizeTemplateCreate' },
          hidden: true
        },
        {
          path: 'template/:id',
          component: () => import('@/views/lottery/prize/templateEditor'),
          name: 'prizeTemplateModify',
          meta: { title: 'prizeTemplateModify' },
          hidden: true
        },
        {
          path: 'list',
          component: () => import('@/views/lottery/prize/management'),
          name: 'prizeManagement',
          meta: { title: 'prizeManagement', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/lottery/prize/editor'),
          name: 'prizeCreate',
          meta: { title: 'prizeCreate' },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/lottery/prize/editor'),
          name: 'prizeModify',
          meta: { title: 'prizeModify' },
          hidden: true
        }
      ]
    },
    {
      path: 'lotteryActivity',
      component: blankLayout,
      meta: {
        title: 'lotteryActivityManagement'
      },
      children: [
        {
          path: 'rule/list',
          component: () => import('@/views/lottery/lotteryRule/rule'),
          name: 'lotteryRule',
          meta: { title: 'lotteryRule', noCache: true }
        },
        {
          path: 'rule/create',
          component: () => import('@/views/lottery/lotteryRule/ruleEditor'),
          name: 'lotteryRuleCreate',
          meta: { title: 'lotteryRuleCreate' },
          hidden: true
        },
        {
          path: 'rule/:id',
          component: () => import('@/views/lottery/lotteryRule/ruleEditor'),
          name: 'lotteryRuleModify',
          meta: { title: 'lotteryRuleModify' },
          hidden: true
        },
        {
          path: 'prizeRule/list',
          component: () => import('@/views/lottery/lotteryRule/prizeRule'),
          name: 'prizeRule',
          meta: { title: 'prizeRule', noCache: true },
          hidden: true
        },
        {
          path: 'prizeRule/create',
          component: () => import('@/views/lottery/lotteryRule/prizeRuleEditor'),
          name: 'prizeRuleCreate',
          meta: { title: 'prizeRuleCreate' },
          hidden: true
        },
        {
          path: 'prizeRule/:id',
          component: () => import('@/views/lottery/lotteryRule/prizeRuleEditor'),
          name: 'prizeRuleModify',
          meta: { title: 'prizeRuleModify' },
          hidden: true
        },
        {
          path: 'awardRecord/:activityId',
          component: () => import('@/views/lottery/lotteryActivity/awardRecord'),
          name: 'activityAwardRecord',
          meta: { title: 'activityAwardRecord', noCache: true },
          hidden: true
        },
        {
          path: 'list',
          component: () => import('@/views/lottery/lotteryActivity/activity'),
          name: 'lotteryActivity',
          meta: { title: 'lotteryActivity', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/lottery/lotteryActivity/activityEditor'),
          name: 'lotteryActivityCreate',
          meta: { title: 'lotteryActivityCreate' }
        },
        {
          path: ':id',
          component: () => import('@/views/lottery/lotteryActivity/activityEditor'),
          name: 'lotteryActivityModify',
          meta: { title: 'lotteryActivityModify' },
          hidden: true
        }
      ]
    },
    {
      path: 'client',
      component: blankLayout,
      meta: {
        title: 'client'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/lottery/client/list'),
          name: 'clientList',
          meta: { title: 'clientList' }
        },
        {
          path: 'record/:id',
          component: () => import('@/views/lottery/client/record'),
          name: 'clientRecord',
          meta: { title: 'clientRecord', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'sysLog',
      component: blankLayout,
      meta: {
        title: 'sysLog'
      },
      children: [
        {
          path: 'operation',
          component: () => import('@/views/lottery/system/log'),
          name: 'operationLog',
          meta: { title: 'operationLog', noCache: true }
        }
      ]
    }
  ]
};
