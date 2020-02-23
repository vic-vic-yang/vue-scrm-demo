import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/integral/v1/order/order', {
      params
    })
      .then(res => res.data);
  }
};
