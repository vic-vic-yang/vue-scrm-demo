import Api from '../index';

export default {
  event: {
    list(params) {
      return Api.get(`/content/content/events`, { params }).then(res => res.data);
    },
    get(id) {
      return Api.get(`/content/content/events/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post('/content/content/events', params).then(res => res.data);
    },
    edit(params) {
      return Api.put(`/content/content/events/${params.id}`, params).then(res => res.data);
    },
    del(id) {
      return Api.delete(`/content/content/events/${id}`, { autoShowMessage: true }).then(res => res.data);
    }
  },
  collection: {
    list(params) {
      return Api.get(`/content/content/events/collection`, { params }).then(res => res.data);
    },
    get(cid) {
      return Api.get(`/content/content/events/${cid}/collection`).then(res => res.data);
    },
    add(params) {
      return Api.post('/content/content/events/collection', params, { autoShowMessage: true }).then(res => res.data);
    },
    edit(params) {
      return Api.put(`/content/content/events/${params.cid}/collection`, params, {autoShowMessage: true }).then(res => res.data);
    },
    del(params) {
      return Api.delete(`/content/content/events/${params.cid}/collection`, {
        data: params,
        autoShowMessage: true
      }).then(res => res.data);
    },
    status(params) {
      return Api.delete(`/content/content/events/${params.cid}/collection`, {
        data: params
      }).then(res => res.data);
    },
    recommend(params) {
      return Api.post(`/content/content/events/${params.cid}/recommend`, params).then(res => res.data);
    },
    upload(file, path = '/content/content/event/import') {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      return Api.post(path, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      })
        .then(res => {
          if (res.code === 200) {
            return res.data;
          }
          return Promise.reject(res);
        });
    }
  },
  push: {
    list(params) {
      return Api.get(`/content/content/events/push-method`, { params }).then(res => res.data);
    },
    get(pushId) {
      return Api.get(`/content/content/events/${pushId}/push-method`).then(res => res.data);
    },
    add(params) {
      return Api.post('/content/content/events/push-method', params, { autoShowMessage: true }).then(res => res.data);
    },
    edit(params) {
      return Api.put(`/content/content/events/${params.push_id}/push-method`, params, {autoShowMessage: true }).then(res => res.data);
    },
    del(push_id) {
      return Api.delete(`/content/content/events/${push_id}/push-method`, { autoShowMessage: true }).then(res => res.data);
    }
  },
  tag: {
    list(params) {
      return Api.get(`/content/content/events/event-tag`, { params }).then(res => res.data);
    },
    get(tagId) {
      return Api.get(`/content/content/events/${tagId}/event-tag`).then(res => res.data);
    },
    add(params) {
      return Api.post('/content/content/events/event-tag', params, { autoShowMessage: true }).then(res => res.data);
    },
    edit(params) {
      return Api.put(`/content/content/events/${params.tag_id}/event-tag`, params, {autoShowMessage: true }).then(res => res.data);
    },
    del(tag_id) {
      return Api.delete(`/content/content/events/${tag_id}/event-tag`, { autoShowMessage: true }).then(res => res.data);
    }
  }
};
