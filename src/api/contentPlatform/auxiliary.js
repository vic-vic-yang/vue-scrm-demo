import Api from '../index';

export default {
  label: { // 标签管理
    list(params) {
      return Api.get('/content/content/tags', {
        params
      }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/content/tags/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/content/tags`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/content/tags/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/content/content/tags/${id}`, {
        autoShowMessage: true
      });
    }
  },
  activity: { // 活动管理
    list(params) {
      return Api.get('/content/util/activities', {
        params
      }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/util/activities/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/util/activities`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/util/activities/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    status(id) {
      return Api.put(`/content/util/activities/${id}/status`, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/content/util/activities/${id}`, {
        autoShowMessage: true
      });
    }
  },
  comment: {
    list(params) {
      return Api.get(`/content/util/article-comments?articleId=${params.id}`, {
        params
      }).then(res => res.data);
    },
    del(id) {
      return Api.delete(`/content/util/article-comments/${id}`, {
        autoShowMessage: true
      });
    }
  },
  signUp: {
    list(params) {
      return Api.get(`/content/util/apply-infos?activityId=${params.id}`, {
        params
      }).then(res => res.data);
    },
    status(params) {
      return Api.put(`/content/util/apply-infos/${params.id}/status`, {
        autoShowMessage: true,
        ...params
      });
    }
  }
};
