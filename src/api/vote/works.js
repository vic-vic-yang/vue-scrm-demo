import Api from '../index';

export default {
  list(params) {
    return Api.get('/ugc/v1/compositions', { params }).then(res => res.data);
  },
  status(id, params) {
    return Api.put(`/ugc/v1/compositions/${id}/audit`, params, {
      autoShowMessage: true
    });
  },
  black(id, params) {
    return Api.put(`/ugc/v1/compositions/${id}/black`, params, {
      autoShowMessage: true
    });
  },
  commentList(params) {
    return Api.get(`/ugc/v1/comments`, { params }).then(res => res.data);
  },
  commentStatus(id, params) {
    return Api.put(`/ugc/v1/comments/${id}/audit`, params, {
      autoShowMessage: true
    });
  },
  commenBlack(id) {
    return Api.put(`/ugc/v1/comments/${id}/black`, {
      autoShowMessage: true
    });
  },
  tags(params) {
    return Api.get(`/ugc/v1/tags`, { params }).then(res => res.data);
  },
  tagAdd(params) {
    return Api.post(`/ugc/v1/tags`, params, {
      autoShowMessage: true
    });
  },
  tagDel(id) {
    return Api.delete(`/ugc/v1/tags/${id}`, {
      autoShowMessage: true
    });
  },
  tagEdit(id, params) {
    return Api.put(`/ugc/v1/tags/${id}`, params, {
      autoShowMessage: true
    });
  },
  tagStatus(id, status) {
    return Api.put(`/ugc/v1/tags/${id}/status/${status}`);
  },
  changeTop(id, top) {
    return Api.put(`/ugc/v1/compositions/${id}/top/${top}`);
  },
  brushTicket(params) {
    return Api.get(`/ugc/v1/composition/add-tickets`, {params});
  },
  judges: {
    list(params) {
      return Api.get(`/ugc/v1/judge-score/score-detail`, { params });
    },
    edit(params) {
      return Api.post(`/ugc/v1/judge-score/change-score`, params, {
        autoShowMessage: true
      });
    },
    del(params) {
      return Api.post(`/ugc/v1/judge-score/delete`, params, {
        autoShowMessage: true
      });
    }
  }
};
