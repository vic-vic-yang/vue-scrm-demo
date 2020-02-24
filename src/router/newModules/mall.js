import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 2,
  orderName: 'fightGroup',
  path: '/fightGroup',
  component: Layout,
  name: 'fightGroup',
  meta: { title: 'fightGroup', icon: 'mall' },
  children: [
    {
      path: 'commodity',
      component: blankLayout,
      meta: {
        title: 'commodityManagement'
      },
      children: [
        {
          path: 'commodity',
          component: blankLayout,
          meta: {
            title: 'commodityList'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/fightGroup/commodity/list'),
              name: 'commodityList',
              meta: { title: 'commodityList' }
            },
            {
              path: 'writeCode/:id',
              component: () => import('@/views/fightGroup/commodity/writeCode'),
              name: 'commodityWriteCode',
              meta: { title: 'commodityWriteCode', noCache: true },
              hidden: true
            },
            {
              path: 'create',
              component: () => import('@/views/fightGroup/commodity/editor'),
              name: 'fightGroupCommodityCreate',
              meta: { title: 'commodityCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/fightGroup/commodity/editor'),
              name: 'fightGroupCommodityModify',
              meta: { title: 'commodityModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'classification',
          component: blankLayout,
          meta: {
            title: 'classificationManagement'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/fightGroup/classification/list'),
              name: 'classificationList',
              meta: { title: 'classificationManagement' }
            },
            {
              path: 'create',
              component: () => import('@/views/fightGroup/classification/editor'),
              name: 'classificationCreate',
              meta: { title: 'classificationCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/fightGroup/classification/editor'),
              name: 'classificationModify',
              meta: { title: 'classificationModify', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    {
      path: 'supplier',
      component: blankLayout,
      meta: {
        title: 'supplierManagement'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/fightGroup/supplier/list'),
          name: 'supplierManagement',
          meta: { title: 'supplierManagement' }
        },
        {
          path: 'create',
          component: () => import('@/views/fightGroup/supplier/editor'),
          name: 'supplierCreate',
          meta: { title: 'supplierCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/fightGroup/supplier/editor'),
          name: 'supplierModify',
          meta: { title: 'supplierModify', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'activity',
      component: blankLayout,
      meta: {
        title: 'activityManagement'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/fightGroup/activity/list'),
          name: 'fightGroupActivity',
          meta: { title: 'activityManagement', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/fightGroup/activity/editor'),
          name: 'fightGroupActivityCreate',
          meta: { title: 'activityCreate' },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/fightGroup/activity/editor'),
          name: 'fightGroupActivityModify',
          meta: { title: 'activityModify' },
          hidden: true
        }
      ]
    },
    {
      path: 'activityInfo',
      component: blankLayout,
      meta: {
        title: 'activityInfoManagement'
      },
      children: [
        {
          path: 'guide',
          component: () => import('@/views/fightGroup/activityInfo/guide'),
          name: 'fightGroupActivityGuide',
          meta: { title: 'activityGuide', noCache: true }
        },
        {
          path: 'introduce',
          component: () => import('@/views/fightGroup/activityInfo/introduce'),
          name: 'fightGroupActivityIntroduce',
          meta: { title: 'activityIntroduce' }
        },
        {
          path: 'highlight',
          component: blankLayout,
          meta: { title: 'activityHighlight' },
          children: [
            {
              path: 'list',
              component: () => import('@/views/fightGroup/activityInfo/highlight/list'),
              name: 'activityHighlightList',
              meta: { title: 'activityHighlight', noCache: true }
            },
            {
              path: 'cover',
              component: () => import('@/views/fightGroup/activityInfo/highlight/cover'),
              name: 'activityHighlightCover',
              meta: { title: 'activityHighlightCover', noCache: true },
              hidden: true
            },
            {
              path: 'create',
              component: () => import('@/views/fightGroup/activityInfo/highlight/editor'),
              name: 'activityHighlightCreate',
              meta: { title: 'activityHighlightCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/fightGroup/activityInfo/highlight/editor'),
              name: 'activityHighlightModify',
              meta: { title: 'activityHighlightModify', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    {
      path: 'order',
      component: blankLayout,
      meta: {
        title: 'orderManagement'
      },
      children: [
        {
          path: 'overview',
          component: () => import('@/views/fightGroup/order/management'),
          name: 'fightGroupOrderOverview',
          meta: { title: 'orderStatic', noCache: true }
        },
        {
          path: 'list',
          component: () => import('@/views/fightGroup/order/overview'),
          name: 'fightGroupOrderList',
          meta: { title: 'orderList' }
        },
        {
          path: 'teamOverview',
          component: () => import('@/views/fightGroup/order/team'),
          name: 'fightGroupOrderTeam',
          meta: { title: 'orderTeamOverview', noCache: true }
        },
        {
          path: 'refund',
          component: () => import('@/views/fightGroup/order/refund'),
          name: 'fightGroupRefund',
          meta: { title: 'fightGroupRefund', noCache: true }
        },
        {
          path: 'deliverGoods',
          component: () => import('@/views/fightGroup/order/deliverGoods'),
          name: 'deliverGoods',
          meta: { title: 'deliverGoods', noCache: true }
        },
        {
          path: ':id',
          component: () => import('@/views/fightGroup/order/orderDetails'),
          name: 'orderDetails',
          meta: { title: 'orderDetail', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'user',
      // component: () => import('@/views/fightGroup/user/userList'),
      component: blankLayout,
      meta: { title: 'userManagement' },
      children: [
        {
          path: 'list',
          name: 'fightGroupUser',
          component: () => import('@/views/fightGroup/user/userList'),
          meta: { title: 'userManagement' }
        },
        {
          path: ':id',
          name: 'userDetails',
          component: () => import('@/views/fightGroup/user/details'),
          meta: { title: 'userDetails', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'writeOff',
      component: blankLayout,
      meta: {
        title: 'writeOffManagement'
      },
      children: [
        {
          path: 'writeOffManage',
          component: () => import('@/views/fightGroup/writeOff/writeOffManage/list'),
          name: 'writeOffCodeManagement',
          meta: { title: 'writeOffCodeManagement', noCache: true }
        },
        {
          path: 'list',
          component: () => import('@/views/fightGroup/writeOff/list'),
          name: 'fightGroupWriteOffRecord',
          meta: { title: 'writeOffRecord', noCache: true }
        },
        {
          path: 'management',
          component: () => import('@/views/fightGroup/writeOff/management'),
          name: 'fightGroupWriteOffManagement',
          meta: { title: 'writeOffControl', noCache: true }
        },
        {
          path: 'create',
          component: () => import('@/views/fightGroup/writeOff/writeOffManage/add'),
          name: 'writeOffCreate',
          meta: { title: 'writeOffCreateManagement', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'service',
      component: blankLayout,
      children: [
        {
          path: 'service',
          component: () => import('@/views/fightGroup/service/index'),
          name: 'serviceCenter',
          meta: { title: 'service' }
        },
        {
          path: 'communication',
          component: () => import('@/views/fightGroup/service/communication'),
          name: 'serviceCommunication',
          meta: { title: 'communication' },
          hidden: true
        }
      ]
    },
    {
      path: 'dataView',
      component: blankLayout,
      meta: {
        title: 'dataView'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/fightGroup/dataView/index'),
          name: 'fightGroupDataView',
          meta: { title: 'dataView', noCache: true }
        },
        {
          path: 'dataViewSetting',
          component: () => import('@/views/fightGroup/dataView/dataViewSetting'),
          name: 'fightGroupDataViewSetting',
          meta: { title: 'dataViewSetting' },
          hidden: true
        },
        {
          path: ':id',
          component: () => import('@/views/fightGroup/dataView/dataViewSetting'),
          name: 'fightGroupDataViewModify',
          meta: { title: 'dataViewModify' },
          hidden: true
        }
      ]
    }
  ]
};
