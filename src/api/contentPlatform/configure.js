import Api from '../index';

export default {
  role: { // 角色管理
    list() {
      return Api.get('/content/user/roles').then(res => res.data);
    },
    nodes() {
      return Api.get('/content/user/nodes').then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/user/roles/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/user/roles`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/user/roles/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/content/user/roles/${id}`, {
        autoShowMessage: true
      });
    }
  },
  account: { // 账号管理
    list(params) {
      return Api.get('/content/user/users', {
        params
      }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/user/users/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/user/users`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/user/users/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    status(id) {
      return Api.put(`/content/user/users/${id}/status`, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/content/user/users/${id}`, {
        autoShowMessage: true
      });
    }
  }
};
