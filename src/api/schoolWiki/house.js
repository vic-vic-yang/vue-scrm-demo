import Api from '../index';

export default {
  list(params) {
    return Api.get('schoolWiki/v1/houses', {
      params
    }).then(res => res.data);
  },
  get(id) {
    return Api.get(`schoolWiki/v1/schools/${id}`)
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

