import Api from '../index';

export default {
  list(params) {
    return Api.get('/groupBuy/v1/active/active/get-list', {
      params
    })
      .then(res => res.data);
  },
  del(info) {
    return Api.delete(`/groupBuy/v1/active/active/del`, {
      params: {
        id: info.id
      },
      autoShowMessage: true
    });
  },
  status(info) {
    return Api.post(`/groupBuy/v1/active/active/change-status`, {
      id: info.id,
      status: (!(info.status * 1)) * 1
    }, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get(id) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/groupBuy/v1/active/active/get-one?id=${id}`)
      .then(res => res.data);
  },
  add(params) {
    return Api.post('/groupBuy/v1/active/active/add', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/groupBuy/v1/active/active/edit`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  goods(params) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/groupBuy/v1/goods/goods/get-active-choose-goods`, {
      params
    })
      .then(res => res.data);
  }
};

