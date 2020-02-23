import Api from '../index';

export default {
  list(params) {
    return Api.get('/groupBuy/v1/order/order/get-list', {
      params
    })
      .then(res => res.data);
  },
  supplier_list(params) {
    return Api.get('/groupBuy/v1/supplier/order/get-list', {
      params
    })
      .then(res => res.data);
  },
  team(params) {
    return Api.get(`/groupBuy/v1/order/order/get-order-group-list`, {
      params
    })
      .then(res => res.data);
  },
  management() {
    return Api.get(`/groupBuy/v1/order/order`)
      .then(res => res.data);
  },
  refund_list(params) {
    return Api.get(`/groupBuy/v1/order/refunds`, { params })
      .then(res => res.data);
  },
  refund(params) {
    return Api.put(`/groupBuy/v1/order/refund/refund`, params, {
      autoShowMessage: false,
      showMessageType: 'put'
    })
      .then(res => res.data);
  },
  detail(params) {
    return Api.get('/groupBuy/v1/order/order/get-one', { params }).then(res => res.data);
  },
  supplierDetail(params) {
    return Api.get('/groupBuy/v1/supplier/order/get-one', { params }).then(res => res.data);
  },
  express(params) {
    return Api.get('/base/v1/express/express', { params }).then(res => res.data);
  },
  supplierExpress(params) {
    return Api.get('/base/v1/express/supplier-express', { params }).then(res => res.data);
  },
  addExpress(params) {
    return Api.post('/groupBuy/v1/order/order/express', params, {
      autoShowMessage: true
    });
  },
  addSupplierExpress(params) {
    return Api.post('/groupBuy/v1/supplier/order/express', params, {
      autoShowMessage: true
    });
  }
};

