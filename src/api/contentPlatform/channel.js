import Api from '../index';

export default {
  applet: { // 小程序
    list(params) {
      return Api.get('/content/content/channels', { params }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/content/channels/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/content/channels`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/content/channels/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    status(params) {
      return Api.put(`/content/content/channels/${params.id}/sort`, { type: params.type }, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/content/content/channels/${id}`, {
        autoShowMessage: true
      });
    }
  }
};
