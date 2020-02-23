import Api from '../index';

export default {
  operation(params) {
    return Api.get('/groupBuy/v1/operation/operation/view', { params });
  },
  operation_edit(params) {
    return Api.put('/groupBuy/v1/operation/operation/update', params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  list(params) {
    return Api.get('/groupBuy/v1/live/lives', {
      params
    });
  },
  del(params) {
    return Api.delete(`/groupBuy/v1/live/lives/${params.id}`, {
      autoShowMessage: true
    });
  },
  status(params) {
    return Api.put(`/groupBuy/v1/live/lives/${params.id}/status/${params.status}`, {}, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get(params) {
    return Api.get(`/groupBuy/v1/live/lives/${params.id}`);
  },
  add(params) {
    return Api.post('/groupBuy/v1/live/lives', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/groupBuy/v1/live/lives/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};
