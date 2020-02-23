import Api from '../index';

export default {
  works: {
    list(params) {
      return Api.get('/workFlow/v1/workFlow/work-flows', {params}).then(res => {
        return res.data;
      });
    },
    status(params) {
      return Api.put(`/workFlow/v1/workFlow/work-flows/${params.id}/status`, params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    del(params) {
      return Api.delete(`/workFlow/v1/workFlow/work-flows/${params.id}`, { autoShowMessage: true, ...params }).then(res => {
        return res.data;
      });
    },
    get(id) {
      return Api.get(`/workFlow/v1/workFlow/work-flows/${id}`).then(res => {
        return res.data;
      });
    },
    add(params) {
      return Api.post('/workFlow/v1/workFlow/work-flows', params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    edit(params) {
      return Api.put(`/workFlow/v1/workFlow/work-flows/${params.id}`, params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    }
  },
  step: {
    get(id) {
      return Api.get(`/workFlow/v1/workFlow/steps/${id}`).then(res => {
        return res.data;
      });
    },
    add(params) {
      return Api.post('/workFlow/v1/workFlow/steps', params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    edit(params) {
      return Api.put(`/workFlow/v1/workFlow/steps/${params.id}`, params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    del(params) {
      return Api.delete(`/workFlow/v1/workFlow/steps/${params.id}`, { autoShowMessage: true, ...params }).then(res => {
        return res.data;
      });
    }
  },
  state: {
    list(params) {
      return Api.get('/workFlow/v1/workFlow/states', {params}).then(res => {
        return res.data;
      });
    },
    status(params) {
      return Api.put(`/workFlow/v1/workFlow/states/${params.id}/status`, params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    },
    del(params) {
      return Api.delete(`/workFlow/v1/workFlow/states/${params.id}`, { autoShowMessage: true, ...params }).then(res => {
        return res.data;
      });
    },
    get(id) {
      return Api.get(`/workFlow/v1/workFlow/states/${id}`).then(res => {
        return res.data;
      });
    },
    add(params) {
      return Api.post('/workFlow/v1/workFlow/states/states', params, {autoShowMessage: true}).then(res => {
        return res.data;
      });
    }
  },
  account: {
    list(params) {
      return Api.get(`/v1/userManage/users`, {params}).then(res => {
        return res.data;
      });
    }
  }
};
