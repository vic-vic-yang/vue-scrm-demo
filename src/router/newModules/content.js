// 内容管理
import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 1,
  orderName: 'newcontentPlatform',
  path: '/newcontentPlatform',
  name: 'newcontentPlatform',
  component: Layout,
  meta: {
    title: 'newcontentPlatform',
    icon: 'content',
    roles: ['11', 'admin']
  },
  alwaysShow: true,
  children: [
    // 渠道管理
    {
      path: 'channel',
      component: blankLayout,
      meta: {
        title: 'channel',
        roles: ['11_1', 'admin']
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/contentPlatform/channel/index'),
          name: 'smallProgram',
          meta: { title: 'smallProgram', noCache: true, roles: ['11_1_1', 'admin'] }
        },
        {
          path: 'mp',
          component: () => import('@/views/contentPlatform/channel/mp'),
          name: 'mp',
          meta: { title: 'mp', noCache: true, roles: ['11_1_1', 'admin'] }
        },
        { // 新建频道
          path: 'editorChannel',
          component: () => import('@/views/contentPlatform/channel/editorChannel'),
          name: 'addChannel',
          meta: { title: 'addChannel', noCache: true },
          hidden: true // 是否不在侧边栏显示
        },
        { // 修改频道
          path: 'editorChannel/:id',
          component: () => import('@/views/contentPlatform/channel/editorChannel'),
          name: 'modifyChannel',
          meta: { title: 'editChannel', noCache: true },
          hidden: true
        }
      ]
    },
    // banner 管理
    {
      path: 'banner',
      component: blankLayout,
      meta: {
        title: 'bannerManagement',
        roles: ['11_1', 'admin']
      },
      children: [
        {
          path: 'bannerView',
          component: () => import('@/views/contentPlatform/banner/bannerView'),
          name: 'bannerManagement',
          meta: { title: 'bannerManagement', noCache: true, roles: ['11_1_1', 'admin'] }
        },
        {
          path: 'editBanner/:id',
          component: () => import('@/views/contentPlatform/banner/editBanner'),
          name: 'editBanner',
          meta: { title: 'editBanner', noCache: true, roles: ['11_1_1', 'admin'] },
          hidden: true
        }
      ]
    },
    // 内容管理
    {
      path: 'content',
      component: blankLayout,
      meta: {
        title: 'content',
        roles: ['11_2', 'admin']
      },
      alwaysShow: true,
      children: [
        { // 内容分类
          path: 'class',
          component: () => import('@/views/contentPlatform/content/class'),
          name: 'contentClass',
          meta: { title: 'contentClass', noCache: true, roles: ['11_2_1', 'admin'] }
        },
        { // 内容列表
          path: 'index',
          component: () => import('@/views/contentPlatform/content/index'),
          name: 'contentList',
          meta: { title: 'contentList', noCache: true, roles: ['11_2_2', 'admin'] }
        },
        { // 新建分类
          path: 'editorClass',
          component: () => import('@/views/contentPlatform/content/editorClass'),
          name: 'addClass',
          meta: { title: 'addClass', noCache: true },
          hidden: true
        },
        { // 修改分类
          path: 'editorClass/:id',
          component: () => import('@/views/contentPlatform/content/editorClass'),
          name: 'modifyClass',
          meta: { title: 'editClass', noCache: true },
          hidden: true
        },
        { // 添加内容
          path: 'editorContent',
          component: () => import('@/views/contentPlatform/content/manualAddCont'),
          name: 'addContent',
          meta: { title: 'addContent', noCache: true },
          hidden: true
        },
        { // 修改内容
          path: 'editorContent/:id',
          component: () => import('@/views/contentPlatform/content/manualAddCont'),
          name: 'modifyContent',
          meta: { title: 'editContent', noCache: true },
          hidden: true
        },
        { // 导入内容
          path: 'autoContent',
          component: () => import('@/views/contentPlatform/content/autoAddCont'),
          name: 'contentCenter',
          meta: { title: 'contentCenter', noCache: true },
          hidden: true
        }
      ]
    },
    // 标签管理
    {
      path: 'label',
      component: blankLayout,
      meta: {
        title: 'label',
        roles: ['11_5', 'admin']
      },
      children: [
        { // 标签管理
          path: 'label',
          component: () => import('@/views/contentPlatform/auxiliary/label'),
          name: 'label',
          meta: { title: 'label', noCache: true }
        },
        { // 新建标签
          path: 'addLabel',
          component: () => import('@/views/contentPlatform/auxiliary/editorLabel'),
          name: 'contentAddLabel',
          meta: { title: 'addLabel', noCache: true },
          hidden: true
        },
        { // 编辑标签
          path: 'editorLabel/:id',
          component: () => import('@/views/contentPlatform/auxiliary/editorLabel'),
          name: 'contentEditorLabel',
          meta: { title: 'editLabel', noCache: true },
          hidden: true
        }
      ]
    },
    // 内容-订阅管理
    {
      path: 'subscribe',
      component: blankLayout,
      meta: {
        title: 'subscribe',
        roles: ['11_5', 'admin']
      },
      children: [
        { // 订阅管理主页
          path: 'index',
          component: () => import('@/views/contentPlatform/subscribe/index'),
          name: 'subscribe',
          meta: { title: 'subscribe', noCache: true, roles: ['11_5', 'admin'] }
        },
        { // 管理订阅
          path: 'management',
          component: () => import('@/views/contentPlatform/subscribe/management'),
          name: 'subscribeManagement',
          meta: { title: '管理订阅', noCache: true},
          hidden: true
        },
        { // 编辑订阅
          path: 'edit/:id',
          component: () => import('@/views/contentPlatform/subscribe/edit'),
          name: 'contentSubscribeEdit',
          meta: { title: '订阅编辑', noCache: true },
          hidden: true
        }
      ]
    },
    // 审核详情
    {
      path: 'contentApproval',
      component: blankLayout,
      meta: {
        title: 'contentApprovalManagment'
      },
      children: [
        {
          path: 'index',
          name: 'contentApprovalManagment',
          component: () => import('@/views/contentPlatform/contentApproval/index'),
          meta: { title: 'contentApprovalManagment', noCache: false}
        },
        {
          path: ':id/:type/:t_id',
          name: 'contentApproval',
          component: () => import('@/views/contentPlatform/contentApproval/check'),
          meta: { title: 'contentApproval', noCache: true },
          hidden: true
        }
      ]
    },
    // 数据统计
    {
      path: 'contentStatistics',
      component: blankLayout,
      meta: {
        title: 'contentStatisticsManagment'
      },
      alwaysShow: true,
      children: [
        {
          path: 'index',
          name: 'editStatistics',
          component: () => import('@/views/contentPlatform/contentStatistics/index'),
          meta: { title: 'editStatistics', noCache: true}
        }
      ]
    },
    // 评论管理
    {
      path: 'commentCenter',
      component: blankLayout,
      meta: {
        title: 'commentCenter'
      },
      alwaysShow: true,
      children: [
      // 评论管理
        {
          path: 'commentManagment',
          name: 'commentManagment',
          component: () => import('@/views/commentCenter/index'),
          meta: { title: 'commentManagment', noCache: true }
        },
        // 评论配置
        {
          path: 'commentConfig',
          name: 'commentConfig',
          component: () => import('@/views/commentCenter/config'),
          meta: { title: 'commentConfig', noCache: true }
        }
      ]
    },
    // 日历管理
    {
      path: 'calendar',
      component: blankLayout,
      name: 'calendarManage',
      meta: { title: 'calendarManage', noCache: true },
      alwaysShow: true,
      children: [
        {
          path: 'eventCollection',
          component: () => import('@/views/contentPlatform/calendar/eventCollection/list.vue'),
          name: 'eventCollectionMagage',
          meta: { title: 'eventCollectionMagage', noCache: true }
        },
        {
          path: 'event',
          component: () => import('@/views/contentPlatform/calendar/event/list.vue'),
          name: 'eventMagage',
          meta: { title: 'eventMagage', noCache: true }
        },
        {
          path: 'eventPush',
          component: () => import('@/views/contentPlatform/calendar/event/push.vue'),
          name: 'eventPush',
          meta: { title: 'eventPush', noCache: true }
        },
        {
          path: 'eventTags',
          component: () => import('@/views/contentPlatform/calendar/eventTags/index.vue'),
          name: 'eventTags',
          meta: { title: 'eventTags', noCache: true }
        }
      ]
    },
    // 广告位管理
    {
      path: 'advertisingPosition',
      component: blankLayout,
      meta: { title: 'advertisingPositionManage', noCache: true },
      children: [
        {
          path: 'list', // 广告位列表
          component: () => import('@/views/advertisingPosition/list.vue'),
          meta: { title: 'advertisingPositionManage', noCache: true },
          name: 'advertisingPositionManage'
        },
        {
          path: 'positionEdit', // 广告位编辑
          component: () => import('@/views/advertisingPosition/positionEdit.vue'),
          meta: { title: 'advertisingPositionEdit', noCache: true },
          name: 'advertisingPositionEdit',
          hidden: true
        },
        {
          path: 'advertisingList', // 广告列表
          component: () => import('@/views/advertisingPosition/advertisingList.vue'),
          meta: { title: 'advertisingPositionAdvertisingList', noCache: true },
          name: 'advertisingPositionAdvertisingList',
          hidden: true
        },
        {
          path: 'advertisingDetails', // 广告详情
          component: () => import('@/views/advertisingPosition/advertisingDetails.vue'),
          meta: { title: 'advertisingPositionAdvertisingDetails', noCache: true },
          name: 'advertisingPositionAdvertisingDetails',
          hidden: true
        }
      ]
    },
    // 数据统计分析
    {
      path: 'dataTotalAnalysis',
      component: () => import('@/views/dataTotalAnalysis/index.vue'),
      meta: { title: 'dataTotalAnalysis', noCache: true },
      name: 'dataTotalAnalysis',
      hidden: true
    },
    // 迷你导航
    {
      path: 'miniNavigation',
      component: blankLayout,
      name: 'miniNavigation',
      meta: { title: 'miniNavigation', noCache: true },
      alwaysShow: true,
      children: []
    }
  ]
};
