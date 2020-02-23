import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/base/v1/user/c-user/get-list', {
      params
    })
      .then(res => res.data);
  },
  details(id) {
    return Api.get(`/base/v1/user/c-users/${id}`).then(res => res.data);
  },
  common_list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/base/v1/user/c-user/common-list', {
      params
    })
      .then(res => res.data);
  },
  common_details(params) {
    return Api.get('/base/v1/user/c-user/common-view', { params }).then(res => res.data);
  },
  changePassword(params) {
    return Api.post('/v1/userManage/user/reset', params).then(res => res.data);
  }
};
