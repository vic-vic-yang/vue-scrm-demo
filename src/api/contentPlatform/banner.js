/*
 * @Description: banner
 * @Autor: shao bo
 * @Date: 2019-11-14 14:59:12
 */
import Api from '../index';

export default {
  list(params) {
    return Api.get('/content/content/banner-settings', {
      params
    }).then(res => res.data);
  },
  get(id) {
    return Api.get(`/content/content/banner-settings/${id}`).then(res => res.data);
  },
  add(params) {
    return Api.post(`/content/content/banner-settings`, params, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  status(params) {
    return Api.put(`/content/content/banner-settings/${params.id}/status/${params.status}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    }).then(res => res.data);
  },
  weight(params) {
    return Api.post(`/content/content/banner-setting/weight`, params)
      .then(res => res.data);
  }
};
