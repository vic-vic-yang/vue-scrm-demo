// 内容管理
import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default
{
  order: 0,
  path: '/newcontentPlatform',
  component: Layout,
  meta: {
    title: 'newcontentPlatform',
    icon: 'tab',
    roles: ['11', 'admin']
  },
  children: [
    {
      path: 'calendar',
      component: blankLayout,
      name: 'calendarManage',
      meta: { title: 'calendarManage', icon: 'star', noCache: true },
      children: [
        {
          path: 'eventCollection',
          component: () => import('@/views/contentPlatform/calendar/eventCollection/list.vue'),
          name: 'eventCollectionMagage',
          meta: { title: 'eventCollectionMagage', icon: 'star', noCache: true }
        },
        {
          path: 'event',
          component: () => import('@/views/contentPlatform/calendar/event/list.vue'),
          name: 'eventMagage',
          meta: { title: 'eventMagage', icon: 'star', noCache: true }
        },
        {
          path: 'eventPush',
          component: () => import('@/views/contentPlatform/calendar/event/push.vue'),
          name: 'eventPush',
          meta: { title: 'eventPush', icon: 'star', noCache: true }
        },
        {
          path: 'eventTags',
          component: () => import('@/views/contentPlatform/calendar/eventTags/index.vue'),
          name: 'eventTags',
          meta: { title: 'eventTags', icon: 'star', noCache: true }
        }
      ]
    }
  ]
};
