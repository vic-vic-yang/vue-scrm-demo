import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/groupBuy/v1/goods/goods/get-list', {
      params
    })
      .then(res => res.data);
  },
  del(info) {
    return Api.delete(`/groupBuy/v1/goods/goods/del`, {
      data: {
        id: info.id
      },
      autoShowMessage: true
    });
  },
  status(info) {
    return Api.post(`/groupBuy/v1/goods/goods/sell-status`, {
      id: info.id,
      status: (!(info.sell_status * 1)) * 1
    }, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get(id) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/groupBuy/v1/goods/goods/get-one?id=${id}`)
      .then(res => res.data);
  },
  add(params) {
    return Api.post('/groupBuy/v1/goods/goods/add', params, {
      autoShowMessage: false
    });
  },
  edit(params) {
    return Api.post(`/groupBuy/v1/goods/goods/edit`, params, {
      autoShowMessage: false
    });
  },
  integralProportion(params) {
    return Api.post(`/groupBuy/v1/goods/goods/set-ratio`, params, {
      autoShowMessage: true
    });
  }
};

