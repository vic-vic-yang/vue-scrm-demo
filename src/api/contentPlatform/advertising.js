/*
 * @Description: 审核
 * @Autor: shao bo
 * @Date: 2019-12-04 09:54:42
 */
import Api from '../index';

export default {
  getPositionList(params) { // 广告位列表
    return Api.get('/content/content/adverts/advert-space-list', {
      params
    }).then(res => res.data);
  },
  positionDetails(params) { // 广告位详情
    return Api.get(`/content/content/adverts/${params.id}/advert-space-detail`).then(res => res.data);
  },
  getColumns() { // 获取关联栏目
    return Api.get('/base/v1/site/columns?pageSize=999').then(res => res.data);
  },
  addPosition(params) { // 新增广告位
    return Api.post('/content/content/adverts/advert-space', params).then(res => res.data);
  },
  editPosition(params) { // 编辑广告位
    return Api.put(`/content/content/adverts/${params.id}/advert-space`, params).then(res => res.data);
  },
  delPosition(params) { // 删除广告位
    return Api.delete(`/content/content/adverts/${params.id}/advert-space`).then(res => res.data);
  },
  getAdvertisingList(params) { // 广告列表
    return Api.get(`/content/content/adverts`, {
      params
    }).then(res => res.data);
  },
  getAdvertisingDetails(params) { // 广告详情
    return Api.get(`/content/content/adverts/${params.id}`).then(res => res.data);
  },
  addAdvertising(params) { // 新增广告
    return Api.post('/content/content/adverts', params).then(res => res.data);
  },
  editAdvertising(params) { // 编辑广告
    return Api.put(`/content/content/adverts/${params.id}`, params).then(res => res.data);
  },
  delAdvertising(params) { // 删除广告
    return Api.delete(`/content/content/adverts/${params.id}`).then(res => res.data);
  },
  setAdvertisingWeight(params) { // 设置广告权重
    return Api.post(`/content/content/adverts/${params.id}/weight`, params).then(res => res.data);
  },
  getAdArticle(params) { // 广告列表
    return Api.get(`/content/content/adverts/article`, {
      params
    }).then(res => res.data);
  },
  preAd(params) { // 预览广告
    return Api.post('/content/content/previews/advert', params).then(res => res.data);
  }
  // list(params) {
  //   return Api.get('/content/content/audits', {
  //     params
  //   }).then(res => res.data);
  // },
  // get(id) {
  //   return Api.get(`/content/content/audits/${id}/audit-detail`).then(res => res.data);
  // },
  // audit(params) {
  //   return Api.post(`/content/content/audits/${params.id}`, params, {
  //     autoShowMessage: true
  //   }).then(res => res.data);
  // }
};
