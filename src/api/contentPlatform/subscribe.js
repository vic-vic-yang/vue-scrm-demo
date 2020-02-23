import Api from '../index';

export default {
  // 已订阅列表
  subscribed(params) {
    return Api.get('/content/content/content-subscribe', { params }).then(res => res.data);
  },
  // 未订阅列表
  unsubscribed(params) {
    return Api.get(`/content/content/gather-missions`, { params }).then(res => res.data);
  },
  delete(params) {
    return Api.post(`/content/content/content-subscribe/delete`, params).then(res => res.data);
  },
  // 订阅
  add(params) {
    return Api.post(`/content/content/content-subscribe/subscribe`, params).then(res => res.data);
  },
  // 获取频道列表
  getChannels(params) {
    return Api.get(`/content/content/channels`, { params }).then(res => res.data);
  },
  // 获取订阅详情
  detail(params) {
    return Api.get(`/content/content/content-subscribe/detail`, { params }).then(res => res.data);
  },
  update(params) {
    return Api.post(`/content/content/content-subscribe/update`, params).then(res => res.data);
  }
};

