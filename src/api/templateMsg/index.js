import Api from '../index';

export default {
  // 小程序
  mini(params) {
    return Api.get('/base/v1/third/templates/mini', { params }).then(res => {
      return res.data;
    });
  },
  mini_status(params) {
    return Api.put(`/base/v1/third/templates/${params.id}/mini-status`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  // 模板库
  update_library(params) {
    return Api.get('/base/v1/third/templates/library', params, {
      autoShowMessage: true
    });
  },
  templates(params) {
    return Api.get('/base/v1/third/templates', { params }).then(res => {
      return res.data;
    });
  },
  templates_detail(params) {
    return Api.get(`/base/v1/third/templates/${params.id}/detail`).then(res => {
      return res.data;
    });
  },
  // 我的模板
  my_template(params) {
    return Api.get(`/base/v1/third/templates/mine`, { params }).then(res => {
      return res.data;
    });
  },
  pull(params) {
    return Api.get(`/base/v1/third/templates/pull`, { params }).then(res => {
      return res.data;
    });
  },
  add(params) {
    return Api.post(`/base/v1/third/templates`, params).then(res => {
      return res.data;
    });
  },
  status(params) {
    return Api.put(`/base/v1/third/templates/${params.id}/status`, params, {
      autoShowMessage: true
    });
  },
  del(params) {
    return Api.delete(`/base/v1/third/templates/${params.id}`, params, {
      autoShowMessage: true
    }).then(res => {
      return res.data;
    });
  },
  details(params) {
    return Api.get(`/base/v1/third/templates/${params.id}`).then(res => {
      return res.data;
    });
  },
  edit(params) {
    return Api.put(`/base/v1/third/templates/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};
