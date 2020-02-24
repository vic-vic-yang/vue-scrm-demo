import { asyncRouterMap, constantRouterMap } from '@/router/routes';
import { getUserRoles } from '@/api/login';

/**
 * 通过meta.title判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // if (route.meta && route.meta.title) {
  //   return Object.keys(roles).some(key => route.meta.title === key);
  // } else {
  //   return true;
  // }
  if (route.hidden) {
    return true;
  }
  if (route.meta && route.meta.title) {
    return Object.keys(roles).some(key => route.meta.title === key);
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        getUserRoles(state.token).then(res => {
          if (!res || !res.data) {
            reject('error');
          }
          if (!res.data.menu || res.data.menu.length <= 0) {
            reject('该账户没有访问权限，请联系管理员配置权限');
          }
          const data = res.data;
          let accessedRouters;
          if (data && data.menu) {
            commit('SET_ROLES', data.nodes);
            accessedRouters = filterAsyncRouter(asyncRouterMap, data.menu);
            // console.log('accessedRouters', accessedRouters);
          } else {
            accessedRouters = asyncRouterMap;
            commit('SET_ROLES', ['admin']);
          }
          commit('SET_ROUTERS', accessedRouters);
          resolve();
        }).catch(error => {
          reject(error);
        });
        // const { roles } = data;
        // let accessedRouters;
        // console.log('admin:', roles.indexOf('admin'));
        // if (roles.indexOf('admin') >= 0) {
        //   accessedRouters = asyncRouterMap;
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        // }
        // commit('SET_ROUTERS', accessedRouters);
        // resolve();
      });
    },
    GenerateSupplierRoutes({ commit, state }, data) {
      var menu = {
        fightGroup: '拼团',
        orderManagement: '订单管理',
        orderList: '订单概况',
        deliverGoods: '批量发货'
      };
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', data);
        var accessedRoutersa;
        accessedRoutersa = filterAsyncRouter(asyncRouterMap, menu);
        console.log(accessedRoutersa);
        commit('SET_ROUTERS', accessedRoutersa);
        resolve();
      });
    }
  }
};

export default permission;
