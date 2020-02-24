import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 8,
  orderName: 'setting',
  path: '/setting',
  component: Layout,
  meta: {
    title: 'setting',
    icon: 'setting'
  },
  children: [
    {
      path: 'wechat',
      component: blankLayout,
      meta: {
        title: 'wechatAuth',
        icon: 'auth'
      },
      children: [
        { path: 'public',
          component: blankLayout,
          redirect: 'index',
          meta: { title: 'publicAddressManagement', icon: 'star' },
          children: [
            {
              path: 'index',
              component: () => import('@/views/authorize/publicAddress/index'),
              name: 'publicAddress',
              meta: { title: 'publicAddressManagement', icon: 'star', noCache: true }
            }
          ]
        },
        { path: 'program',
          component: blankLayout,
          redirect: 'index',
          meta: {
            title: 'miniProgramManagement',
            icon: 'wechat'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/authorize/miniProgram/index'),
              name: 'miniProgram',
              meta: { title: 'miniProgramManagement', icon: 'wechat', noCache: true }
            }
          ]
        }
      ]
    },
    {
      path: 'configure',
      component: blankLayout,
      meta: {
        title: 'configure',
        icon: 'edit',
        roles: ['11_5', 'admin']
      },
      children: [
        { // 角色管理
          path: 'role',
          component: () => import('@/views/configure/role'),
          name: 'contRole',
          meta: { title: 'role', noCache: true, roles: ['11_5_1', 'admin'] }
        },
        { // 账号管理
          path: 'accountNumber',
          component: () => import('@/views/configure/accountNumber'),
          name: 'contAccountNumber',
          meta: { title: 'accountNumber', noCache: true, roles: ['11_5_2', 'admin'] }
        },
        { // 新建角色
          path: 'addRole',
          component: () => import('@/views/configure/editorRole'),
          name: 'contentAddRole',
          meta: { title: 'addRole', noCache: true },
          hidden: true
        },
        { // 编辑角色
          path: 'editorRole/:id',
          component: () => import('@/views/configure/editorRole'),
          name: 'contentEditorRole',
          meta: { title: 'editRole', noCache: true },
          hidden: true
        },
        { // 新建账号
          path: 'addAccountNumber',
          component: () => import('@/views/configure/editorAccount'),
          name: 'contentAddAccount',
          meta: { title: 'addAccountNumber', noCache: true },
          hidden: true
        },
        { // 编辑账号
          path: 'editAccountNumber/:id',
          component: () => import('@/views/configure/editorAccount'),
          name: 'contentEditorAccount',
          meta: { title: 'editAccountNumber', noCache: true },
          hidden: true
        }
      ]
    }
  ]
};
