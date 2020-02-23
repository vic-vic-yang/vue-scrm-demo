import Api from '../index';

export default {
  list(params) {
    return Api.get('/groupBuy/v1/card/card-check/get-list', {
      params
    })
      .then(res => res.data);
  },
  search(cardNumber) {
    return Api.get(`/groupBuy/v1/card/card-check/get-one?card_number=${cardNumber}`)
      .then(res => res.data);
  },
  check(cardNumber) {
    return Api.get(`/groupBuy/v1/card/card-check/check?card_number=${cardNumber}`, {
      autoShowMessage: true,
      showMessageType: 'put'
    })
      .then(res => res.data);
  },
  personnel_list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/groupBuy/v1/card/card-check-users', {
      params
    })
      .then(res => res.data);
  },
  personnel_del(params) {
    return Api.delete(`/groupBuy/v1/card/card-check-users/${params.id}`, {
      autoShowMessage: true
    });
  },
  personnel_status(params) {
    return Api.put(`/groupBuy/v1/card/card-check-users/${params.id}/status/${params.status}`, {}, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  personnel_get(params) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/groupBuy/v1/card/card-check-users/${params.id}`)
      .then(res => res.data);
  },
  personnel_add(params) {
    return Api.post('/groupBuy/v1/card/card-check-users', params, {
      autoShowMessage: true
    });
  },
  personnel_edit(params) {
    return Api.put(`/groupBuy/v1/card/card-check-users/{id}`, params, {
      autoShowMessage: true
    });
  }
};

