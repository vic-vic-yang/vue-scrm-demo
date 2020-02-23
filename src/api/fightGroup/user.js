import Api from '../index';

export default {
  list(params) {
    return Api.get('/base/v1/user/c-user/get-list', {
      params
    })
      .then(res => res.data);
  }
};

