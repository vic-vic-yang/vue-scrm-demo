/*
 * @Description: 审核
 * @Autor: shao bo
 * @Date: 2019-12-04 09:54:42
 */
import Api from '../index';

export default {
  getCoopers(params) { // 赛事合作列表
    return Api.get('/content/util/cooperations', {
      params
    }).then(res => res.data);
  },
  getCooperDetails(params) { // 赛事合作详情
    return Api.get(`/content/util/cooperations/${params.id}`, {
      params
    }).then(res => res.data);
  },
  setCooperExamine(params) { // 赛事合作审核
    return Api.put(`/content/util/cooperations/${params.id}`,
      params
    ).then(res => res.data);
  },
  delCooper(params) { // 赛事合作删除--单条删除
    return Api.delete(`/content/util/cooperations/${params.id}`,
      params
    ).then(res => res.data);
  },
  batchDelCooper(params) { // 赛事合作删除--批量删除
    return Api.post(`/content/util/cooperations/delete-all`, params).then(res => res.data);
  },

  getSolication(params) { // 官方征集列表
    return Api.get('/content/util/official-collects', {
      params
    }).then(res => res.data);
  },
  getSolicationDetails(params) { // 官方征集详情
    return Api.get(`/content/util/official-collects/${params.id}`).then(res => res.data);
  },
  setSolicationExamine(params) { // 官方征集审核
    return Api.put(`/content/util/official-collects/${params.id}`, params).then(res => res.data);
  },
  delSolication(params) { // 官方征集删除--单条删除
    return Api.delete(`/content/util/official-collects/${params.id}`).then(res => res.data);
  },
  batchDelSolication(params) { // 官方征集删除--批量删除
    return Api.post(`/content/util/official-collects/delete-all`, params).then(res => res.data);
  },

  getOfficial(params) { // 开闭幕式文案征集列表
    return Api.get('/content/util/document-collects', {
      params
    }).then(res => res.data);
  },
  getOfficialDetails(params) { // 开闭幕式文案征集详情
    return Api.get(`/content/util/document-collects/${params.id}`).then(res => res.data);
  },
  setOfficialExamine(params) { // 开闭幕式文案征集审核
    return Api.put(`/content/util/document-collects/${params.id}`, params).then(res => res.data);
  },
  delOfficial(params) { // 开闭幕式文案征集删除--单条删除
    return Api.delete(`/content/util/document-collects/${params.id}`).then(res => res.data);
  },
  batchDelOfficial(params) { // 开闭幕式文案征集删除--批量删除
    return Api.post(`/content/util/document-collects/delete-all`, params).then(res => res.data);
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
