import Api from '../index';

export default {
  get() {
    return Api.get(`/v1/quiz/global-configs`)
      .then(res => res.data);
  },
  add(params) {
    /**
     * @params {object} - {description,location,link,image_url,status}
     * */
    return Api.post('/v1/quiz/global-configs', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    /**
     * @params {object} - {description,location,link,image_url,status}
     * */
    return Api.put(`/v1/quiz/global-configs/${params.id}`, params, {
      autoShowMessage: true
    });
  }
};

