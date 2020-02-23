import Api from '../index';

export default {
  list(params) {
    return Api.get('/content/content/mini-columns', { params }).then(res => res.data);
  },
  add(params) {
    return Api.post('/content/content/mini-columns', params, {autoShowMessage: true}).then(res => res.data);
  },
  del(params) {
    return Api.delete(`/content/content/mini-columns/${params.id}/${params.columnId}`, { autoShowMessage: true, ...params }).then(res => res.data);
  },
  limit(params) {
    return Api.post(`/content/content/mini-columns/${params.id}/limit`, params).then(res => res.data);
  },
  weight(params) {
    return Api.post(`/content/content/mini-columns/${params.id}/weight`, params).then(res => res.data);
  },
  column(params) {
    return Api.get(`/content/content/mini-columns/column-list`, { params }).then(res => res.data);
  },
  getNavigation() {
    return Api.get(`/content/content/mini-columns/mini-column-list`).then(res => res.data);
  }
};
