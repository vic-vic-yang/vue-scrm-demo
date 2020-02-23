import Api from '../index';

export default {
  list(params) {
    return Api.get('/base/v1/site/columns', {params}).then(res => {
      return res.data;
    });
  },
  status(params) {
    return Api.put(`/base/v1/site/columns/${params.id}/status`, params, {autoShowMessage: true}).then(res => {
      return res.data;
    });
  },
  del(params) {
    return Api.delete(`/base/v1/site/columns/${params.id}`, { autoShowMessage: true, ...params }).then(res => {
      return res.data;
    });
  },
  get(id, params) {
    return Api.get(`/base/v1/site/columns/${id}`, {params}).then(res => {
      return res.data;
    });
  },
  add(params) {
    return Api.post('/base/v1/site/columns', params, {autoShowMessage: true}).then(res => {
      return res.data;
    });
  },
  edit(params) {
    return Api.put(`/base/v1/site/columns/${params.id}`, params, {autoShowMessage: true}).then(res => {
      return res.data;
    });
  },
  setWeight(params) {
    return Api.put(`/base/v1/site/columns/${params.id}/weight`, params, {autoShowMessage: true}).then(res => {
      return res.data;
    });
  }
};

