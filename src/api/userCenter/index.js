import Api from '../index';

export default {
  list(params) {
    return Api.get('/ugc/v1/user-black/index', {
      params
    }).then(res => res.data);
  },
  edit(params) {
    return Api.post('/ugc/v1/user-black/add', params, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.data);
  }
};

