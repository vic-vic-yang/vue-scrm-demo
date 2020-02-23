import Api from '../index';

export default {
  list(params) {
    return Api.get('/content/util/members', { params }).then(res => res.data);
  },
  get(id) {
    return Api.get(`/content/util/members/${id}`).then(res => res.data);
  }
};
