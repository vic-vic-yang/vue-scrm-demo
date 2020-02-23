import Api from '../index';

export default {
  list(params) {
    return Api.get('/groupBuy/v1/goods/category/get-list', {
      params
    })
      .then(res => res.data);
  },
  del(info) {
    return Api.delete(`/groupBuy/v1/goods/categories/${info.id}`, {
      autoShowMessage: true
    });
  },
  get(id) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/groupBuy/v1/goods/category/get-one?id=${id}`).then(res => res.data);
  },
  add(params) {
    return Api.post('/groupBuy/v1/goods/category/add', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/groupBuy/v1/goods/category/add`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  setWeight(params) {
    return Api.post('/groupBuy/v1/goods/category/change-weight', params, {
      autoShowMessage: false
    })
      .then(res => res.data);
  }
};

