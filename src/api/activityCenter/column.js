import Api from '../index';

export default {
  list(params) {
    return Api.get('/base/v1/style/columns', {
      params
    })
      .then(res => res.data);
  },
  get(id) {
    return Api.get(`/base/v1/style/columns/${id}`);
  },
  add(params) {
    return Api.post('/base/v1/style/columns', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/base/v1/style/columns`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  del(params) {
    return Api.delete(`/integral/v1/lottery/actives/${params.id}`, {
      autoShowMessage: true
    });
  },
  change_status(params) {
    return Api.post(`/base/v1/style/column/change-status`, params, {
      autoShowMessage: false
    });
  },
  weight(params) {
    return Api.post(`/base/v1/style/column/change-weight`, params, {
      autoShowMessage: false
    }).then(res => res.data);
  },
  activity_list(params) {
    return Api.get(`/base/v1/style/column/get-list`, { params }).then(res => res.data);
  }
};
