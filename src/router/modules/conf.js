import Layout from '@/views/layout/Layout';
export default {
  order: 1,
  path: '/configure',
  component: Layout,
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
};

