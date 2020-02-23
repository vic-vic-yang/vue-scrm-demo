const contexts = require.context('.', false, /(?!.*index).js$/);
const routes = [];
contexts.keys().forEach(component => {
  const item = contexts(component).default;
  if (!item) return;
  if (item.path) {
    // 单组件模块
    routes.push(item);
  } else {
    // 导出多个对象
    const objArr = Object.values(item);
    routes.push(...objArr);
  }
});
routes.sort((a, b) => {
  return a.order - b.order;
});
export {
  routes
};
