import Api from '../index';

export default {
  list(params) {
    return Api.get('/ugc/v1/merge-activity/index', {
      params
    })
      .then(res => res.data);
  },
  setStatus(params) {
    return Api.get('/ugc/v1/merge-activity/set-status', {
      params
    })
      .then(res => res.data);
  },
  setWeight(params) {
    return Api.get('/ugc/v1/merge-activity/weight', {
      params
    })
      .then(res => res.data);
  },
  del(params) {
    return Api.get('/ugc/v1/merge-activity/delete', {
      params
    })
      .then(res => res.data);
  },
  getTypes() {
    return Api.get('/ugc/v1/merge-activity/type', {
    })
      .then(res => res.data);
  },
  getConfig(params) {
    return Api.get('/base/v1/style/style-settings', {
      params
    });
  },
  saveConfig(params) {
    return Api.post('/base/v1/style/style-settings', params);
  }
};

