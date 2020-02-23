import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认20
     * @title {string} 题库标题
     * @status {string} 题库状态：enable 启用；disable 禁用
     * @earliestCreated {string} 最早创建日期，筛选这个日期后创建的题库
     * @lastCreated {string} 最晚创建日期，筛选这个日期前创建的题库
     * */
    return Api.get('/v1/operation/ads', {
      params
    })
      .then(res => res.data);
  },
  get(id) {
    return Api.get(`/v1/operation/ads/${id}`)
      .then(res => res.data);
  },
  add(params) {
    /**
     * @params {object} - {description,location,link,image_url,status}
     * */
    return Api.post('/v1/operation/ads/create', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    /**
     * @params {object} - {description,location,link,image_url,status}
     * */
    return Api.put(`/v1/operation/ads/${params.id}`, params, {
      autoShowMessage: true
    });
  },
  del(info) {
    return Api.delete(`/v1/operation/ads/${info.id}`, {
      autoShowMessage: true
    });
  }
};

