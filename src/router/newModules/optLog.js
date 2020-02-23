/*
 * @Description: 用户操作日志
 * @Autor: shao bo
 * @Date: 2019-12-26 09:51:38
 */
import Layout from '@/views/layout/Layout';
export default {
  order: 4.5,
  path: '/logManage',
  orderName: 'logManage',
  component: Layout,
  meta: { title: 'logManage'},
  children: [
    {
      path: 'list',
      name: 'logManage',
      component: () => import('@/views/operationLog/logList.vue'),
      meta: {
        title: 'logManage',
        icon: 'log'
      }
    }
  ]
};
