import Api from '../index';

export default {
  list: { // 内容列表
    listB(params) {
      return Api.get('/content/content/merchant-articles', { params }).then(res => res.data);
    },
    weight(params) { // 设置权重
      return Api.get('/content/content/merchant-articles/set-weight', { params }).then(res => res.data);
    },
    listO(params) {
      return Api.get('/content/content/merchant-articles/list', { params }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/content/merchant-articles/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/content/merchant-articles`, params, {
        autoShowMessage: true
      });
    },
    status(id) { // 发布
      return Api.put(`/content/content/merchant-articles/publish`, { id }, {
        autoShowMessage: true
      });
    },
    revoke(id) { // 撤销
      return Api.put(`/content/content/merchant-articles/cancel`, { id }, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/content/merchant-articles/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    del(id) { // 删除
      return Api.delete(`/content/content/merchant-articles/delete-all`, { data: { id }}, {
        autoShowMessage: true
      });
    },
    ipt(id) { // 导入文章
      return Api.put(`/content/content/merchant-articles/import`, { id }, {
        autoShowMessage: true
      });
    },
    top(id) { // 置顶
      return Api.put(`/content/content/merchant-articles/${id}/top`, {
        autoShowMessage: true
      });
    },
    recommend(id) { // 推荐
      return Api.put(`/content/content/merchant-articles/recommend`, { id }, {
        autoShowMessage: true
      });
    },
    cancel(id) { // 取消推荐
      return Api.put(`/content/content/merchant-articles/cancel-recommend`, { id }, {
        autoShowMessage: true
      });
    }
  },
  class: {
    list(params) {
      return Api.get('/content/content/classifies', { params }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/content/classifies/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/content/content/classifies`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/content/content/classifies/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/content/content/classifies/${id}`, {
        autoShowMessage: true
      });
    }
  }
};
