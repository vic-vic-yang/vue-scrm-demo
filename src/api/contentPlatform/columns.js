/*
 * @Description: 栏目内容
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
    return Api.get('/content/content/columns', {
      params
    }).then(res => res.data);
  },
  articles(params) {
    return Api.get('/content/content/articles', {
      params
    }).then(res => res.data);
  },
  get(id) {
    return Api.get(`/content/content/articles/${id}`, {}, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  audit(params) {
    return Api.post(`/content/content/audits/${params.id}`, params, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  publish(params) { // 发布
    return Api.post(`/content/content/articles/publish`, params, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  import(params) {
    return Api.post(`/content/content/articles/import`, params, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  content(params) {
    return Api.get(`/content/content/articles/list`, {params}, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  articlesAdd(params) {
    return Api.post(`/content/content/articles`, params, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  articlesEdit(params) {
    return Api.put(`/content/content/articles/${params.id}`, params, {
      autoShowMessage: true
    }).then(res => res.data);
  },
  submit(params) {
    return Api.post(`/content/content/articles/submit-audit`, params).then(res => res.data);
  },
  cancel(id) { // 取消推荐
    return Api.put(`/content/content/articles/cancel`, { id }, {
      autoShowMessage: true
    });
  },
  del(params) { // 删除
    return Api.delete(`/content/content/articles/delete-all`, params, {
      autoShowMessage: true
    });
  },
  weight(params) { // 设置权重
    return Api.post('/content/content/articles/weight', params).then(res => res.data);
  },
  exceptArticle(params) {
    return Api.post('/content/content/articles/except-article', params).then(res => res.data);
  },
  workFlow(params) {
    return Api.get('/content/content/articles/work-flow', {params}).then(res => res.data);
  },
  cancelAudit(params) {
    return Api.post('/content/content/articles/cancel-audit', params).then(res => res.data);
  },
  draft(params) {
    return Api.get('/content/content/drafts', {params}).then(res => res.data);
  },
  draftDetail(params) {
    return Api.get(`/content/content/drafts/${params.id}`, {params}).then(res => res.data);
  },
  editDrafts(params) {
    return Api.post('/content/content/drafts', params).then(res => res.data);
  },
  preDetail(params) { // 预览
    return Api.post('content/content/previews/article-list', params).then(res => res.data);
  }
};
