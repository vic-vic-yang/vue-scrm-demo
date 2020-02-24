// 内容管理
import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default
{
  order: 12,
  path: '/contentPlatform',
  component: Layout,
  meta: {
    title: 'contentPlatform',
    icon: 'tab',
    roles: ['11', 'admin']
  },
  children: [
    { // 渠道管理
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
    { // banner 管理
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
    { // 内容管理
      path: 'content',
      component: blankLayout,
      meta: {
        title: 'content',
        roles: ['11_2', 'admin']
      },
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
    { // 辅助功能
      path: 'auxiliary',
      component: blankLayout,
      meta: {
        title: 'auxiliary',
        roles: ['11_4', 'admin']
      },
      children: [
        { // 评论管理
          path: 'comment/:id',
          component: () => import('@/views/contentPlatform/auxiliary/comment'),
          name: 'contentComment',
          meta: { title: 'comment', noCache: true, roles: ['11_4_1', 'admin'] }
        },
        // { // 活动列表
        //   path: 'activityList',
        //   component: () => import('@/views/contentPlatform/auxiliary/activityList'),
        //   name: 'contentActivity',
        //   meta: { title: 'activityManagement', noCache: true, roles: ['11_4_2', 'admin'] }
        // },
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
          meta: { title: 'label', noCache: true, roles: ['11_4_3', 'admin'] }
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
    { // 内容-订阅管理
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
    }
  ]
};
