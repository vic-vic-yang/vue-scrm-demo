import { asyncRouterMap, constantRouterMap } from '@/router/routes';
import { getUserRoles } from '@/api/login';
import columnsApi from '@/api/contentPlatform/columns';
import MININAVIGATION from '@/api/contentPlatform/miniNavigation';
import { appendContentColumnMenu } from '@/router/columnRoutes';
import { appendMiniNavMenu } from '@/router/miniNav';
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
    const has = Object.keys(roles).some(key => route.meta.title === key);
    if (has) {
      return true;
    }
  }
  if (route.name) {
    return Object.keys(roles).some(key => route.name === key);
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles, operates) {
  const leafAuditMap = getOperatePermissionMap(operates);
  const filterAsyncRouterRec = function(asyncRouterMap, roles) {
    return asyncRouterMap.filter(route => {
      if (hasPermission(roles, route)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouterRec(route.children, roles);
        } else {
          // 根节点
          if (route.name) {
            // 用户有叶子节点权限，但没有操作项说明没有增加更细的权限管理，使用全部权限
            if (!leafAuditMap[route.name]) {
              leafAuditMap[route.name] = {
                all: true
              };
            }
          }
        }
        return true;
      }
      return false;
    });
  };
  const accessedRouters = filterAsyncRouterRec(asyncRouterMap, roles);
  return {
    accessedRouters: accessedRouters,
    leafAuditMap: leafAuditMap
  };
}

/**
 * 获取所有节点操作表
 * @returns {[]}
 */
function getOperatePermissionMap(operates) {
  // 叶子节点权限信息
  const permissionMap = {};
  for (const key in operates) {
    if (operates.hasOwnProperty(key)) {
      permissionMap[key] = {};
      const menuOperates = operates[key].split(',');
      for (let i = 0; i <= menuOperates.length; i++) {
        permissionMap[key][menuOperates[i]] = true;
      }
    }
  }

  return permissionMap;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    leafAuditMap: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers.accessedRouters;
      state.routers = constantRouterMap.concat(routers.accessedRouters);
      state.leafAuditMap = routers.leafAuditMap;
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      const p1 = new Promise((resolve, reject) => {
        columnsApi.list().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
      const p2 = new Promise((resolve, reject) => {
        getUserRoles(state.token).then(res => {
          if (!res || !res.data) {
            reject('error');
          }
          if (!res.data.menu || res.data.menu.length <= 0) {
            reject('该账户没有访问权限，请联系管理员配置权限');
          }
          resolve(res.data);
        }).catch(err => {
          reject(err);
        });
      });
      const p3 = new Promise((resolve, reject) => {
        MININAVIGATION.getNavigation().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
      return Promise.all([p1, p2, p3]).then(res => {
        const columns = res[0];
        const data = res[1];
        const miniNav = res[2];

        let routes = {
          accessedRouters: asyncRouterMap,
          leafAuditMap: {}
        };
        if (data && data.menu) {
          if (data.nodes) {
            data.nodes.filter(node => {
              return node.substr(0, 6) === 'column';
            }).map(node => {
              data.menu[node] = '';
            });
          }
          commit('SET_ROLES', data.nodes);
          routes = filterAsyncRouter(asyncRouterMap, data.menu, data.operates);
          console.log(routes);
        } else if (data['is_super']) {
          commit('SET_ROLES', ['admin']);
        } else {
          console.log('GenerateRoutes no menu');
        }

        appendContentColumnMenu(columns, asyncRouterMap);
        appendMiniNavMenu(miniNav, asyncRouterMap);
        commit('SET_ROUTERS', routes);
      });
    },
    GenerateSupplierRoutes({ commit, state }, data) {
      const menu = {
        fightGroup: '拼团',
        orderManagement: '订单管理',
        orderList: '订单概况',
        deliverGoods: '批量发货'
      };
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', data);
        const routes = filterAsyncRouter(asyncRouterMap, menu);
        commit('SET_ROUTERS', routes);
        resolve();
      });
    }
  }
};

export default permission;
