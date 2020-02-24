import blankLayout from '@/views/layout/blankLayout';

export default {
  component: blankLayout,
  path: 'schoolWiki',
  meta: {
    title: 'schoolWiki',
    icon: 'quiz'
  },
  children: [
    {
      path: 'schoolList',
      component: () => import('@/views/schoolWiki/schoolList'),
      name: 'schoolList',
      meta: {title: 'schoolList', noCache: true}
    },
    {
      path: 'schoolDetail',
      component: () => import('@/views/schoolWiki/schoolDetail'),
      name: 'schoolDetail',
      meta: {title: 'schoolDetail', noCache: true},
      hidden: true
    },
    {
      path: 'schoolPartition',
      component: () => import('@/views/schoolWiki/schoolPartition'),
      name: 'schoolPartition',
      meta: {title: 'schoolPartition', noCache: true},
      hidden: true
    },
    {
      path: 'houseList',
      component: () => import('@/views/schoolWiki/houseList'),
      name: 'houseList',
      meta: {title: 'houseList', noCache: true}
    }
  ]
};
