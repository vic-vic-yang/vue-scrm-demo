/*
 * @Description: 动态路由
 * @Autor: shao bo
 * @Date: 2019-12-09 10:27:23
 */
import columnPage from '@/views/contentPlatform/column/index';
import blankLayout from '@/views/layout/blankLayout';

let columnFlat = [];

function generateColumnContentMenu(tData, resData, pid) {
  if (Array.isArray(tData) && tData.length > 0) {
    tData.forEach(function a(v, i) {
      const id = -Math.floor(Math.random() * 1000000) - 100000;
      resData[i] = v;
      const name = 'column_menu_' + resData[i].id;
      if (v.children && v.children.length > 0) {
        resData[i] = {
          path: 'topic',
          id: id,
          pid: pid,
          name: name,
          position: name,
          title: resData[i].name,
          component: blankLayout,
          is_menu: 1,
          meta: { title: resData[i].name, noCache: true }
        };
      } else {
        resData[i] = {
          path: 'list/' + resData[i].id,
          id: id,
          pid: pid,
          name: name,
          position: name,
          title: resData[i].name,
          component: columnPage,
          is_menu: 1,
          operates: 'view,create,update,delete', // 栏目内容操作类型
          meta: { title: resData[i].name, noCache: true, id: resData[i].id }
        };
      }
      columnFlat.push(resData[i]);
      const arr = [];
      generateColumnContentMenu(v.children, arr, id);
      resData[i].children = arr;
    });
  }
}

export function getContentColumnMenuFlat(columns, pid) {
  // 动态添加内容栏目作为菜单
  const resArr = [];
  columnFlat = [];
  generateColumnContentMenu(columns, resArr, pid);
  return columnFlat;
}

export function appendContentColumnMenu(columns, asyncRouterMap) {
  // 动态添加内容栏目作为菜单
  const resArr = [];
  generateColumnContentMenu(columns, resArr);
  for (const item of asyncRouterMap) {
    if (item.name === 'contentColumn') {
      item.children = item.children.concat(resArr);
      break;
    }
  }
}
