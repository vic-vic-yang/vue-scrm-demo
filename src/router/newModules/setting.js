import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
// 账号管理
const accountManage = {
  path: 'accountManage',
  component: blankLayout,
  meta: {
    title: 'accountManage'
  },
  children: [
    {
      path: 'list',
      name: 'accountManageList',
      component: () => import('@/views/configure/accountManageList.vue'),
      meta: {
        title: 'accountManage'
      }
    },
    {
      path: 'edit/:id',
      name: 'accountManageEdit',
      component: () => import('@/views/configure/accountManageEdit.vue'),
      meta: {
        title: 'accountManageEdit'
      },
      hidden: true
    },
    {
      path: 'section/:id',
      name: 'accountSection',
      component: () => import('@/views/configure/accountManage/section.vue'),
      meta: {
        title: 'accountSection'
      },
      hidden: true
    },
    {
      path: 'merber/:id',
      name: 'accountMerber',
      component: () => import('@/views/configure/accountManage/merber.vue'),
      meta: {
        title: 'accountMerber'
      },
      hidden: true
    }
  ]
};
// 系统配置
const systemConfig = {
  path: 'systemConfig',
  name: 'systemConfig',
  component: () => import('@/views/configure/systemSetting/index.vue'),
  meta: { title: 'systemConfig' }
};
// 栏目设置
const columnMange = {
  path: 'column',
  component: blankLayout,
  meta: { title: 'columnMange' },
  children: [
    {
      path: 'index',
      name: 'columnMange',
      component: () => import('@/views/configure/columnMange/index.vue'),
      meta: { title: 'columnMange' }
    },
    {
      path: 'create',
      name: 'createColumnMange',
      component: () => import('@/views/configure/columnMange/editor.vue'),
      meta: { title: 'createColumnMange' },
      hidden: true
    },
    {
      path: ':id',
      name: 'modifyColumnMange',
      component: () => import('@/views/configure/columnMange/editor.vue'),
      meta: { title: 'modifyColumnMange' },
      hidden: true
    }
  ]
};

// 工作流设置
const workflowMange = {
  path: 'workflow',
  component: blankLayout,
  meta: { title: 'workflowMange' },
  children: [
    // {
    //   path: 'index',
    //   component: blankLayout,
    //   meta: { title: 'workflowMange' },
    //   children: [
    {
      path: 'workflow',
      name: 'workflowMange',
      component: () => import('@/views/configure/workflowMange/workflow.vue'),
      meta: { title: 'workflowMange' }
    },
    {
      path: 'list/:id',
      name: 'workflowTemplateMange',
      component: () => import('@/views/configure/workflowMange/index.vue'),
      meta: { title: 'workflowMange' },
      hidden: true
    },
    {
      path: 'create',
      name: 'createWorkflow',
      component: () => import('@/views/configure/workflowMange/editor.vue'),
      meta: { title: 'createWorkflow' },
      hidden: true
    },
    {
      path: ':id',
      name: 'modifyWorkflow',
      component: () => import('@/views/configure/workflowMange/editor.vue'),
      meta: { title: 'modifyWorkflow' },
      hidden: true
    },
    //   ]
    // },
    {
      path: 'state',
      component: blankLayout,
      meta: { title: 'workflowStateMange' },
      hidden: true,
      children: [
        {
          path: 'index',
          name: 'workflowStateMange',
          component: () => import('@/views/configure/workflowMange/state/index.vue'),
          meta: { title: 'workflowStateMange' },
          hidden: true
        },
        {
          path: 'create',
          name: 'createWorkflowState',
          component: () => import('@/views/configure/workflowMange/state/editor.vue'),
          meta: { title: 'createWorkflowState' },
          hidden: true
        },
        {
          path: ':id',
          name: 'modifyWorkflowState',
          component: () => import('@/views/configure/workflowMange/state/editor.vue'),
          meta: { title: 'modifyWorkflowState' },
          hidden: true
        }
      ]
    }
  ]
};

// 系统参数面板
const systemParameter = {
  path: 'systemParameter',
  name: 'systemParameter',
  component: () => import('@/views/configure/systemParameter/index.vue'),
  meta: { title: 'systemParameter' }
};

// 角色管理
const roleManage = {
  path: 'workflow',
  component: blankLayout,
  meta: { title: 'roleManageList' },
  children: [{
    path: 'roleManage',
    name: 'roleManage',
    component: () => import('@/views/configure/roleManageList.vue'),
    meta: {
      title: 'roleManageList'
    }
  }, {
    path: 'roleManageEdit',
    name: 'roleManageEdit',
    component: () => import('@/views/configure/roleManageEdit.vue'),
    meta: {
      title: 'roleManageEdit'
    },
    hidden: true
  }]
};
// 部门管理
const sectionManage = {
  path: 'workflow',
  component: blankLayout,
  meta: { title: 'sectionManage' },
  children: [{
    path: 'sectionManage',
    name: 'sectionManage',
    component: () => import('@/views/configure/sectionManageList.vue'),
    meta: {
      title: 'sectionManage'
    }
  }, {
    path: 'sectionManageEdit',
    name: 'sectionManageEdit',
    component: () => import('@/views/configure/sectionManageEdit.vue'),
    meta: {
      title: 'sectionManageEdit'
    },
    hidden: true
  }]
};

const childrenRoutes = [accountManage, roleManage, sectionManage, columnMange, workflowMange, systemConfig, systemParameter];

export default {
  order: -1,
  // order: 8,
  orderName: 'setting',
  path: '/setting',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: 'setting',
    icon: 'setting'
  },
  children: [
    ...childrenRoutes,
    {
      path: 'wechat',
      component: blankLayout,
      alwaysShow: true,
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
