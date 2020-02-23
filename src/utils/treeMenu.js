class TreeMenu {
  constructor(flat) {
    // flat.forEach(item => {
    //   item.title = item.title + '_' + item.id + item.checked;
    // });
    this.flat = flat;
  }
  // 平级结构转树，pid值为0的视作根节点
  getTree(pid = 0) {
    const items = {};
    for (let i = 0; i < this.flat.length; i++) {
      const key = this.flat[i].pid;
      if (items[key]) {
        items[key].push(this.flat[i]);
      } else {
        items[key] = [];
        items[key].push(this.flat[i]);
      }
    }
    return this.formatTree(items, pid);
  }
  formatTree(items, pid) {
    const result = [];
    if (!items[pid]) {
      return result;
    }
    for (const t of items[pid]) {
      t.children = this.formatTree(items, t.id);
      result.push(t);
    }
    return result;
  }
  // 获取所有被选中节点
  getAllCheckedNode() {
    return this.flat.filter(item => {
      // 如果有子节点则被不被全选
      if (item.children && item.children.length > 0) {
        return false;
      }
      return item.checked;
    }).map(item => item.id);
  }
}
export default TreeMenu;
