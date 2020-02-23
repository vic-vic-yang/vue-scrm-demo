
import Api from '../index';

export default {
  list(params) {
    return Api.get('/integral/v1/lottery/rules', {
      params
    })
      .then(res => res.data);
  },
  get(params) {
    return Api.get(`/integral/v1/lottery/rules/${params.id}`);
  },
  add(params) {
    return Api.post('/integral/v1/lottery/rules', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/integral/v1/lottery/rules/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  del(params) {
    return Api.delete(`/integral/v1/lottery/rules/${params.id}`, {
      autoShowMessage: true
    });
  },
  status(params) {
    return Api.put(`/integral/v1/lottery/rules/${params.id}/status/${params.status}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};

