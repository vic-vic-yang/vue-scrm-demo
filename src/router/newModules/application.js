import Layout from '@/views/layout/Layout';
import {routes} from '@/router/newModules/application/index.js';

console.log(routes);

export default {
  order: 0,
  orderName: 'application',
  path: '/app',
  component: Layout,
  meta: {
    title: 'application',
    icon: 'app',
    roles: ['11', 'admin']
  },
  children: [
    ...routes
  ]
};
