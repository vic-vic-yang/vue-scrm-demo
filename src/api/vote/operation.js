import Api from '../index';

export default {
  get() {
    return Api.get('/ugc/v1/red-pack/get-config').then(res => res.data);
  },
  update(params) {
    return Api.put(`/ugc/v1/red-pack/update`, params, {
      autoShowMessage: true
    });
  }
};
