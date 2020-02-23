import Api from '../index';

export default {
  list(params) {
    return Api.get('/integral/v1/lottery/prizes', {
      params
    })
      .then(res => res.data);
  },
  get(params) {
    return Api.get(`/integral/v1/lottery/prizes/${params.id}`);
  },
  add(params) {
    return Api.post('/integral/v1/lottery/prizes', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/integral/v1/lottery/prizes/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  del(params) {
    return Api.delete(`/integral/v1/lottery/prizes/${params.id}`, {
      autoShowMessage: true
    });
  },
  status(params) {
    return Api.put(`/integral/v1/lottery/prizes/${params.id}/status/${params.status}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};

