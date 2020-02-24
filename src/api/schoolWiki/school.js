import Api from '../index';

export default {
  list(params) {
    return Api.get('schoolWiki/v1/schools', {
      params
    }).then(res => res.data);
  },
  get(id) {
    return Api.get(`schoolWiki/v1/schools/${id}`)
      .then(res => res.data);
  },
  partition(id, params) {
    /**
     * @params {object} - {description,location,link,image_url,status}
     * */
    return Api.post(`schoolWiki/v1/schools/${id}/partition`, params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    /**
     * @params {object} - {description,location,link,image_url,status}
     * */
    return Api.put(`/schoolWiki/v1/schools/${params.id}`, params, {
      autoShowMessage: true
    });
  }
};

