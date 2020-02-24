/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 17:42:49
 * @LastEditTime: 2019-11-14 16:32:51
 * @LastEditors: Please set LastEditors
 */
/* Layout */
import Layout from '@/views/layout/Layout';
import { routes } from './newModules';
console.log(routes);
/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
];

// 权限管理
export const asyncRouterMap = [
  ...routes,
  // 内容管理
  // {
  //   path: '/contentManagment',
  //   component: Layout,
  //   hidden: true,
  //   meta: {
  //     title: 'contentManagment',
  //     icon: 'guide'
  //   },
  //   children: [
  //     {
  //       path: 'contentManagment',
  //       name: 'contentManagment',
  //       component: () => import('@/views/contentManagment/index'),
  //       meta: { title: 'contentManagment', icon: 'list', noCache: true }
  //     }
  //   ]
  // },
  // 任务管理
  // {
  //   path: '/task',
  //   component: Layout,
  //   hidden: true,
  //   meta: {
  //     title: 'taskManage',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: '/taskManage',
  //       component: () => import('@/views/taskManage/index'),
  //       name: 'taskManage',
  //       meta: { title: 'taskManage', noCache: true, icon: 'nested' }
  //     },
  //     {
  //       path: ':id',
  //       component: () => import('@/views/taskManage/award_task'),
  //       name: 'missionAwardTaskCreate',
  //       meta: { title: 'missionAwardTaskCreate', noCache: true },
  //       hidden: true
  //     }
  //   ]
  // },
  // 用户管理
  // {
  //   path: '/users',
  //   component: Layout,
  //   meta: {
  //     title: 'usersManage',
  //     icon: 'user'
  //   },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/user/index'),
  //       name: 'usersManage',
  //       // usersManage -- 用户管理 users -- 用户
  //       meta: { title: 'usersManage', noCache: false, icon: 'user' }
  //     },
  //     {
  //       path: ':id',
  //       component: () => import('@/views/user/details'),
  //       name: 'usersManageDetails',
  //       hidden: true,
  //       meta: { title: 'usersDetails', noCache: true }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
];

