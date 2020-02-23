function menuInfo(data) {
  var arr = [];
  data.map(item => {
    var route = {
      path: 'competitionCenter/' + item.id,
      component: () => import('@/views/contentPlatform/miniNavigation/index.vue'),
      name: 'miniNav_' + item.id,
      is_menu: 1,
      meta: { title: item.name, noCache: true, id: item.id }
    };
    arr.push(route);
  });
  return arr;
}

export function appendMiniNavMenu(miniNav, asyncRouterMap) {
  var arr = menuInfo(miniNav);
  for (const item of asyncRouterMap) {
    if (item.name === 'newcontentPlatform') {
      for (const val of item.children) {
        if (val.name === 'miniNavigation') {
          val.children = val.children.concat(arr);
          break;
        }
      }
    }
  }
}
