import Api from '../index';

export default {
  list(params) {
    return Api.get(`/base/v1/third/template-settings`, { params }).then(res => {
      return res.data;
    });
  },
  template_list(params) {
    return Api.get(`/base/v1/third/template-settings/list?appid=${params.appid}`).then(res => {
      return res.data;
    });
  },
  add(params) {
    return Api.post(`/base/v1/third/template-settings`, params).then(res => {
      return res.data;
    });
  },
  status(params) {
    return Api.put(`/base/v1/third/template-settings/${params.id}/status`, params, {
      autoShowMessage: true
    });
  },
  del(params) {
    return Api.delete(`/base/v1/third/template-settings/${params.id}`, params, {
      autoShowMessage: true
    }).then(res => {
      return res.data;
    });
  },
  details(params) {
    return Api.get(`/base/v1/third/template-settings/${params.id}`).then(res => {
      return res.data;
    });
  },
  edit(params) {
    return Api.put(`/base/v1/third/template-settings/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  trigger() {
    return Api.get(`/base/v1/third/template-settings/event`).then(res => {
      return res.data;
    });
  },
  send_user() {
    return Api.get(`/base/v1/third/template-settings/send-user`).then(res => {
      return res.data;
    });
  },
  variable(params) {
    return Api.get(`/base/v1/third/template-settings/variable`, { params }).then(res => {
      return res.data;
    });
  }
};
