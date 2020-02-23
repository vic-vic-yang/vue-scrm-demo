import Api from '../index';

export default {
  list(params) {
    return Api.get('/ugc/v1/players', { params }).then(res => res.data);
  },
  get(id) {
    return Api.get(`/ugc/v1/players/${id}`, {
      autoShowMessage: true
    });
  },
  examine(params) {
    return Api.get('/ugc/v1/qualification-audits', { params }).then(res => res.data);
  },
  audit(id, params) {
    return Api.put(`/ugc/v1/qualification-audits/${id}/audit`, params, {
      autoShowMessage: true
    });
  },
  black(id) {
    return Api.put(`/ugc/v1/qualification-audits/${id}/black`, {
      autoShowMessage: true
    });
  },
  signUp: {
    blackList(params) {
      return Api.get(`/ugc/v1/qualification-audits/black-list`, { params }).then(res => res.data);
    },
    del(id) {
      return Api.put(`/ugc/v1/qualification-audits/${id}/restore`, {
        autoShowMessage: true
      });
    }
  },
  works: {
    blackList(params) {
      return Api.get(`/ugc/v1/compositions/black-list`, { params }).then(res => res.data);
    },
    del(id) {
      return Api.put(`/ugc/v1/compositions/${id}/restore`, {
        autoShowMessage: true
      });
    }
  },
  comment: {
    blackList(params) {
      return Api.get(`/ugc/v1/comments/black-list`, { params }).then(res => res.data);
    },
    del(id) {
      return Api.put(`/ugc/v1/comments/${id}/restore`, {
        autoShowMessage: true
      });
    }
  }
};
