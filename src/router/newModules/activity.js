import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 5,
  orderName: 'activity',
  path: '/activityCenter',
  component: Layout,
  meta: {
    title: 'activityCenter',
    icon: 'activity'
  },
  alwaysShow: true,
  children: [
    {
      path: 'index',
      component: blankLayout,
      meta: {
        title: 'activityCenterList'
      },
      children: [
        {
          path: 'index',
          name: 'activityCenter',
          component: () => import('@/views/activityCenter/index/index'),
          meta: { title: 'activityCenterList', noCache: true }
        },
        { // 新建活动
          path: 'addActivity',
          component: () => import('@/views/contentPlatform/auxiliary/editorActivity'),
          name: 'contentAddActivity',
          meta: { title: 'activityCreate', noCache: true },
          hidden: true
        },
        { // 编辑活动
          path: 'editorActivity/:id',
          component: () => import('@/views/contentPlatform/auxiliary/editorActivity'),
          name: 'contentEditorActivity',
          meta: { title: 'activityModify', noCache: true },
          hidden: true
        },
        { // 活动配置
          path: 'config',
          name: 'activityCenterConfig',
          component: () => import('@/views/activityCenter/index/configure'),
          meta: { title: 'activityCenterConfig', noCache: true },
          hidden: true
        },
        { // 报名管理
          path: 'signUp/:id',
          component: () => import('@/views/contentPlatform/auxiliary/signUp'),
          name: 'contentSignUp',
          meta: { title: 'userExamine', noCache: true },
          hidden: true
        },
        { // 标签管理
          path: 'label',
          component: () => import('@/views/contentPlatform/auxiliary/label'),
          name: 'contentLabel',
          meta: { title: 'label', noCache: true, roles: ['11_4_3', 'admin'] },
          hidden: true
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
    {
      path: 'column',
      component: blankLayout,
      meta: {
        title: 'activityColumnList'
      },
      children: [
        {
          path: 'list',
          name: 'activityColumnList',
          component: () => import('@/views/activityCenter/column/index'),
          meta: { title: 'activityColumnList', noCache: true }
        },
        {
          path: 'weight:id',
          name: 'columnActivityWeight',
          component: () => import('@/views/activityCenter/column/activityWeight'),
          meta: { title: 'columnActivityWeight', noCache: true },
          hidden: true
        },
        {
          path: 'create',
          name: 'activityColumnCreate',
          component: () => import('@/views/activityCenter/column/editor'),
          meta: { title: 'activityColumnCreate', noCache: true },
          hidden: true
        },
        {
          path: ':id',
          name: 'activityColumnModify',
          component: () => import('@/views/activityCenter/column/editor'),
          meta: { title: 'activityColumnModify', noCache: true },
          hidden: true
        }
      ]
    },
    {
      path: 'matchSolicitation', // 赛事征集
      component: blankLayout,
      alwaysShow: true,
      meta: {title: 'matchSolicitation'},
      name: 'matchSolicitation',
      children: [
        // {
        //   path: 'sloganList', // 口号征集
        //   component: () => import('@/views/activityCenter/matchSolicitation/list.vue'),
        //   meta: { title: 'matchSloganList', noCache: true, type: 0 },
        //   name: 'matchSloganList'
        // },
        // {
        //   path: 'emblemList', // 会徽征集
        //   component: () => import('@/views/activityCenter/matchSolicitation/list.vue'),
        //   meta: { title: 'matchEmblemList', noCache: true, type: 1 },
        //   name: 'matchEmblemList'
        // },
        // {
        //   path: 'mascotList', // 吉祥物征集
        //   component: () => import('@/views/activityCenter/matchSolicitation/list.vue'),
        //   meta: { title: 'matchMascotList', noCache: true, type: 2 },
        //   name: 'matchMascotList'
        // },
        // {
        //   path: 'blessingList', // 祝福征集
        //   component: () => import('@/views/activityCenter/matchSolicitation/list.vue'),
        //   meta: { title: 'matchBlessingList', noCache: true, type: 3 },
        //   name: 'matchBlessingList'
        // },
        {
          path: 'officialList', // 开闭幕式文案征集
          component: () => import('@/views/activityCenter/matchSolicitation/matchOfficialList.vue'),
          meta: { title: 'matchOfficialList', noCache: true, type: 4 },
          name: 'matchOfficialList'
        },
        {
          path: 'details', // 征集详情
          component: () => import('@/views/activityCenter/matchSolicitation/details.vue'),
          meta: { title: 'matchSolicitationDetails', noCache: true },
          name: 'matchSolicitationDetails',
          hidden: true
        },
        {
          path: 'matchOfficialDetails', // 开闭幕式文案征集--征集详情
          component: () => import('@/views/activityCenter/matchSolicitation/matchOfficialDetails.vue'),
          meta: { title: 'matchOfficialDetails', noCache: true },
          name: 'matchOfficialDetails',
          hidden: true
        }
      ]
    },
    {
      path: 'matchCooperation', // 赛事合作审核
      component: blankLayout,
      meta: {title: 'matchCooperation'},
      children: [
        {
          path: 'list',
          component: () => import('@/views/activityCenter/matchCooperation/list.vue'),
          meta: { title: 'matchCooperation', noCache: true },
          name: 'matchCooperation'
        },
        {
          path: 'details',
          component: () => import('@/views/activityCenter/matchCooperation/details.vue'),
          meta: { title: 'matchCooperationDetails', noCache: true },
          name: 'matchCooperationDetails',
          hidden: true
        }
      ]
    }
  ]
};
