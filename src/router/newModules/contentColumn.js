/*
 * @Description: 内容栏目 children 动态配置
 * @Autor: shao bo
 * @Date: 2019-12-04 14:34:08
 */
import Layout from '@/views/layout/Layout';
export default {
  order: 1.5,
  orderName: 'contentColumn',
  path: '/contentColumn',
  component: Layout,
  name: 'contentColumn',
  meta: { title: 'contentColumn', icon: 'content' },
  children: [
    { // 栏目导入内容
      path: 'contentCenter/:id',
      component: () => import('@/views/contentPlatform/content/autoAddContNew'),
      name: 'contentCenterNew',
      meta: { title: 'contentCenterNew', noCache: true },
      hidden: true // 是否不在侧边栏显示
    },
    { // 编辑内容
      path: 'editorContent/:id/:column',
      component: () => import('@/views/contentPlatform/content/manualAddContNew'),
      name: 'addContentNew',
      meta: { title: 'addContentNew', noCache: true },
      hidden: true // 是否不在侧边栏显示
    }
  ]
};
