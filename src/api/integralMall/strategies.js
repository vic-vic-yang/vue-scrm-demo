/*
 * @Description: 奖品策略
 * @Autor: shao bo
 * @Date: 2019-10-16 20:47:01
 * @LastEditors: shao bo
 * @LastEditTime: 2019-10-16 21:08:12
 */
import Api from '../index';

export default {
  list(params) {
    return Api.get('/prizeCenter/v1/prize/prize-strategies', {
      params
    })
      .then(res => res.data);
  },
  get(params) {
    return Api.get(`/prizeCenter/v1/prize/prize-strategies/${params.id}`);
  },
  add(params) {
    return Api.post('/prizeCenter/v1/prize/prize-strategies', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/prizeCenter/v1/prize/prize-strategies/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  del(params) {
    return Api.delete(`/prizeCenter/v1/prize/prize-strategies/${params.id}`, {
      autoShowMessage: true
    });
  },
  status(params) {
    return Api.put(`/prizeCenter/v1/prize/prize-strategies/${params.id}/status/${params.status}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  city() {
    return Api.get('/base/v1/district/districts', {}).then(res => res.data);
  }
};

