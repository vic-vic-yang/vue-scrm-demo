import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 6,
  orderName: 'userCenter',
  path: '/userCenter',
  component: Layout,
  meta: {
    title: 'userCenter',
    icon: 'user'
  },
  children: [
    {
      path: 'userBlack',
      name: 'userBlack',
      component: () => import('@/views/userCenter/index'),
      meta: { title: 'userBlack', icon: 'black-user', noCache: true }
    },
    { // 用户管理
      path: 'user',
      component: blankLayout,
      meta: {
        title: 'userManager',
        icon: 'user-magene',
        roles: ['11_3', 'admin']
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/contentPlatform/user/index'),
          name: 'userManagement',
          meta: { title: 'userManagement', icon: 'user', noCache: true, roles: ['11_3', 'admin'] }
        },
        { // 用户详情
          path: 'userDetails/:id',
          component: () => import('@/views/contentPlatform/user/userDetails'),
          name: 'contentUserDetail',
          meta: { title: 'userDetail', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'usersGrowth',
      component: blankLayout,
      meta: {
        title: 'usersGrowth',
        icon: 'archive'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/userCenter/growth/index'),
          name: 'growthIndex',
          meta: { title: 'growthIndex', noCache: true}
        },
        {
          path: 'type',
          component: () => import('@/views/userCenter/growth/type'),
          name: 'growthType',
          meta: { title: 'growthType', noCache: true }
        },
        {
          path: 'view/:id',
          component: () => import('@/views/userCenter/growth/view'),
          name: 'growthView',
          meta: { title: 'growthView', noCache: true },
          hidden: true
        },
        {
          path: 'addType',
          component: () => import('@/views/userCenter/growth/edit_type'),
          name: 'growthAddType',
          meta: { title: 'growthAddType', noCache: true },
          hidden: true
        },
        {
          path: 'editType/:id',
          component: () => import('@/views/userCenter/growth/edit_type'),
          name: 'growthEditType',
          meta: { title: 'growthEditType', noCache: true },
          hidden: true
        },
        {
          path: 'activity/index',
          component: () => import('@/views/userCenter/growth/activity/index'),
          name: 'growthActivityIndex',
          meta: { title: 'growthActivityIndex', noCache: true },
          hidden: true
        },
        {
          path: 'activity/edit/:id',
          component: () => import('@/views/userCenter/growth/activity/edit'),
          name: 'growthEditActivity',
          meta: { title: 'growthEditActivity', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'integralManage',
      component: blankLayout,
      meta: { title: 'integralManage', icon: 'score' },
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
        }
      ]
    }
  ]
};
