/*
 * @Description: 审核
 * @Autor: shao bo
 * @Date: 2019-12-04 09:54:42
 */
import Api from '../index';
// import axios from 'axios';
// const Api = axios.create({
//   baseURL: 'http://yapi.scrm.buerkongjian.com/mock/134',
//   timeout: 60 * 1000
// });

export default {
  list(params) {
    return Api.get('/content/content/audits', {
      params
    }).then(res => res.data);
  },
  get(id) {
    return Api.get(`/content/content/articles/${id}`).then(res => res.data);
  },
  audit(params) {
    return Api.post(`/content/content/audits`, params).then(res => res.data);
  },
  step(params) {
    return Api.get(`/content/content/audits/step-list`, {params}).then(res => res.data);
  },
  roolback(params) {
    return Api.post(`/content/content/audits/rollback`, params).then(res => res.data);
  }
};
