import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/integral/v1/mission/missions', {
      params
    })
      .then(res => res.data);
  },
  overView() {
    return Api.get('/integral/v1/mission/mission-log/board');
  },
  journalDetails(params) {
    return Api.get(`/integral/v1/mission/mission-log`, {
      params
    }).then(res => res.data);
  },
  details(id) {
    return Api.get(`integral/v1/mission/missions/${id}`).then(res => res.data);
  },
  status(info) {
    return Api.put(`/integral/v1/mission/missions/${info.id}/status/${info.status}`, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get(id) {
    /**
     * @id {string|number} -
     * */
    return Api.get(`/integral/v1/mission/missions/${id}`)
      .then(res => res.data);
  },
  add(params) {
    return Api.post('/integral/v1/goods/goods', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/integral/v1/mission/missions/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  // 有奖任务
  awardDetails() {
    return Api.get('/integral/v1/mission/missions/view-reward/200').then(res => res.data);
  },
  get_reply(params) {
    return Api.get(`/integral/v1/mission/missions/${params.mission_id}/reply/${params.type}`);
  },
  edit_reply(params) {
    return Api.put(`/integral/v1/mission/missions/edit-reply/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  reply_status(params) {
    return Api.put(`/integral/v1/mission/missions/reply-status/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  // 阅读文章
  article_list(params) {
    return Api.get('/integral/v1/article/articles', {
      params
    })
      .then(res => res.data);
  },
  article_add(params) {
    return Api.post('/integral/v1/article/articles', params, {
      autoShowMessage: true
    });
  },
  article_edit(params) {
    return Api.put(`/integral/v1/article/articles/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  article_get(id) {
    /**
     * @id {string|number} -
     * */
    return Api.get(`/integral/v1/article/articles/${id}`)
      .then(res => res.data);
  },
  article_status(params) {
    return Api.put(`/integral/v1/article/articles/${params.id}/status/${params.status}`, {}, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  article_del(params) {
    return Api.delete(`/integral/v1/article/articles/${params.id}`, {
      autoShowMessage: true
    });
  }
};

