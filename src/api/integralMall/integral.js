import Api from '../index';

export default {
  index() {
    return Api.get(`/integral/v1/integral/integral-config`);
  },
  overView() {
    return Api.get(`/integral/v1/integral/integral-log/data`);
  },
  details(params) {
    return Api.get(`/integral/v1/integral/integral-log`, { params }).then(res => res.data);
  },
  validate(params) {
    return Api.put(`/integral/v1/integral/integral-configs/${params.id}/validate`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  limit(params) {
    return Api.put(`/integral/v1/integral/integral-configs/${params.id}/limit`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get_rule() {
    return Api.get('/integral/v1/integral/integral-descs');
  },
  edit_rule(params) {
    return Api.put(`/integral/v1/integral/integral-descs/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};
