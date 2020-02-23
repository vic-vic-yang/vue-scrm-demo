const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userInfo: state => state.user.userInfo,
  token: state => state.user.token,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  routes: state => state.permission.routers,
  leafAuditMap: state => state.permission.leafAuditMap,
  errorLogs: state => state.errorLog.logs,
  prizeTypeOptions: state => state.prize.prizeTypeOptions,
  prizeTypeFilterOptions: state => {
    const prizeTypeOptions = state.prize.prizeTypeOptions;
    const resultOptions = prizeTypeOptions.filter((opt) => {
      return opt.value !== 101;
    });
    resultOptions.unshift({
      label: '全部',
      value: 0
    });
    return resultOptions;
  },
  getPrizeType: state => id => {
    const prizeTypes = state.prize.prizeTypeOptions;
    for (const prizeType of prizeTypes) {
      if (prizeType.value === id * 1) return prizeType;
    }
  }
};
export default getters;
