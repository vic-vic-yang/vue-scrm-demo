import Api from '../index';

export default {
  getTop10(params) { // 获取Top10栏目数据
    return Api.get('/content/content/article/dashboard-top', {params}).then(res => res.data);
  },
  getNewsData(params) { // 获取内容发布趋势
    return Api.get('/content/content/article/dashboard', {params}).then(res => res.data);
  }
};

