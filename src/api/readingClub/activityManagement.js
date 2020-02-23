import Api from '../index';

export default {
  activityList(params) {
    return Api.get('/base/v1/activity/activity-centers', { params }).then(res => {
      return res.data;
    });
  },
  activityDetail(params) {
    return Api.get(`/base/v1/activity/activity-centers/${params.id}`, { params }).then(res => {
      return res.data;
    });
  },
  addActivity(params) {
    return Api.post('/base/v1/activity/activity-centers', params).then(res => {
      return res.data;
    });
  },
  editActivity(params) {
    return Api.put(`/base/v1/activity/activity-centers/${params.queryId}`, params).then(res => {
      return res.data;
    });
  },
  changeStatus(params) {
    return Api.put(`/base/v1/activity/activity-centers/${params.id}/status`).then(res => {
      return res.data;
    });
  },
  deleteActivity(params) {
    return Api.delete(`/base/v1/activity/activity-centers/${params.id}`).then(res => {
      return res.data;
    });
  },
  taskList(params) {
    return Api.get(`/base/v1/activity/punch-ins/activity-topic/${params.id}`, { params }).then(res => {
      return res.data;
    });
  },
  changeTaskStatus(params) {
    return Api.post(`/base/v1/activity/punch-ins/${params.activityId}/delete-activity-topic/${params.id}`, params).then(res => {
      return res.data;
    });
  },
  deleteTask(params) {
    return Api.delete(`/base/v1/activity/punch-ins/${params.activityId}/topic/${params.id}`).then(res => {
      return res.data;
    });
  },
  sortTask(params) {
    return Api.put(`/base/v1/activity/punch-ins/${params.activityId}/topic/${params.id}/sort`, params).then(res => {
      return res.data;
    });
  },
  addTask(params) {
    return Api.post(`/base/v1/activity/punch-ins/${params.activityId}/topic`, params).then(res => {
      return res.data;
    });
  },
  editTask(params) {
    return Api.put(`/base/v1/activity/punch-ins/${params.activityId}/topic/${params.id}`, params).then(res => {
      return res.data;
    });
  },
  taskDetail(params) {
    return Api.get(`/base/v1/activity/punch-ins/${params.activityId}/topic/${params.id}`, { params }).then(res => {
      return res.data;
    });
  },
  taskWeight(params) {
    return Api.post(`/base/v1/activity/punch-ins/${params.activityId}/weight-topic/${params.id}`, params, { autoShowMessage: true }).then(res => {
      return res.data;
    });
  },
  addTopic(params) {
    return Api.post(`/base/v1/activity/punch-ins/add-activity-topic/${params.id}`, params).then(res => {
      return res.data;
    });
  }
};
