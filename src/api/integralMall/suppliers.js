import Api from '../index';
// import axios from 'axios';
//
// const Api = axios.create({
//   baseURL: 'http://yapi.scrm.buerkongjian.com/mock/19',
//   timeout: 60 * 1000
// });
export default {
  list(params) {
    return Api.get('/groupBuy/v1/supplier/suppliers', {
      params
    })
      .then(res => res.data);
  },
  get(id) {
    return Api.get(`/groupBuy/v1/supplier/suppliers/${id}`);
  },
  add(params) {
    return Api.post('/groupBuy/v1/supplier/suppliers', params, {
      autoShowMessage: true
    });
  },
  edit(params, id) {
    return Api.put(`/groupBuy/v1/supplier/suppliers/${id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  del(id) {
    return Api.delete(`/groupBuy/v1/supplier/suppliers/${id}`, {
      autoShowMessage: true
    });
  }
};
