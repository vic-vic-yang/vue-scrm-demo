import Api from '../index';
export default {
  clear(params) {
    return Api.get('/content/content/articles/clear-cache', { params })
      .then(res => res.data);
  },
  getBindUrl(){
    return Api.get('/content/user/users/bind').then(res => res.data);
  }
};
