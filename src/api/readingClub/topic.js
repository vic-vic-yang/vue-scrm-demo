import Api from '../index';

export default {
  topic: {
    list(params) {
      return Api.get('/base/v1/activity/punch-ins/topic', {params}).then(res => {
        return res.data;
      });
    },
    add(params) {
      return Api.post('/base/v1/activity/punch-ins/topic', params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    get(id) {
      return Api.get(`/base/v1/activity/punch-ins/topic/${id}`, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    status(id) {
      return Api.put(`/base/v1/activity/punch-ins/topic/${id}/status`, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    del(id) {
      return Api.delete(`/base/v1/activity/punch-ins/topic/${id}`, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    edit(params) {
      return Api.put(`/base/v1/activity/punch-ins/topic/${params.id}`, params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    }
  },
  series: {
    list(params) {
      return Api.get('/base/v1/activity/punch-ins/series', {params}).then(res => {
        return res.data;
      });
    },
    get(id) {
      return Api.get(`/base/v1/activity/punch-ins/series/${id}`).then(res => {
        return res.data;
      });
    },
    add(params) {
      return Api.post('/base/v1/activity/punch-ins/series', params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    edit(params) {
      return Api.post(`/base/v1/activity/punch-ins/series/${params.id}`, params).then(res => {
        return res.data;
      });
    },
    del(id) {
      return Api.delete(`/base/v1/activity/punch-ins/series/${id}`, { autoShowMessage: true }).then(res => {
        return res.data;
      });
    }
  }
};
