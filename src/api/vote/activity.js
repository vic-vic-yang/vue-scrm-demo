/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-20 10:22:49
 * @LastEditTime: 2019-08-30 10:00:41
 * @LastEditors: Please set LastEditors
 */
import Api from '../index';

export default {
  activity: {
    list(params) {
      return Api.get('/ugc/v1/activities', {
        params
      }).then(res => res.data);
    },
    get(id) { // 活动详情
      return Api.get(`/ugc/v1/activities/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/ugc/v1/activities`, params, {
        autoShowMessage: true
      });
    },
    edit(info) {
      return Api.put(`/ugc/v1/activities/${info.id}`, info, {
        autoShowMessage: true
      });
    },
    status(id) {
      return Api.put(`/ugc/v1/activities/${id}/status`, {
        autoShowMessage: true
      });
    },
    del(id) {
      return Api.delete(`/ugc/v1/activities/${id}`, {
        autoShowMessage: true
      });
    }
  },
  stage: {
    list(id, params) {
      return Api.get(`/ugc/v1/activity/${id}/stages`, params).then(res => res.data);
    },
    get(params) { // 活动详情
      return Api.get(`/ugc/v1/activity/${params.activity_id}/stages/${params.id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/ugc/v1/activity/${params.activity_id}/stages`, params, {
        autoShowMessage: true
      });
    },
    edit(params) {
      return Api.put(`/ugc/v1/activity/${params.activity_id}/stages/${params.id}`, params, {
        autoShowMessage: true
      });
    },
    status(activityId, id) {
      return Api.put(`/ugc/v1/activity/${activityId}/stages/${id}/status`, {
        autoShowMessage: true
      });
    },
    del(activityId, id) {
      return Api.delete(`/ugc/v1/activity/${activityId}/stages/${id}`, {
        autoShowMessage: true
      });
    }
  },
  rank: {
    list(params) {
      return Api.get(`/ugc/v1/activity/vote-rank`, { params }).then(res => res.data);
    },
    activeRankList(params) {
      return Api.get(`/ugc/v1/compositions/ranking`, { params }).then(res => res.data);
    }
  },
  task: {
    list(stageId, params) {
      return Api.get(`/ugc/v1/stage/${stageId}/missions`, params).then(res => res.data);
    },
    get(stageId, id) { // 任务详情
      return Api.get(`/ugc/v1/stage/${stageId}/missions/${id}`).then(res => res.data);
    },
    add(params) {
      return Api.post(`/ugc/v1/stage/${params.stage_id}/missions`, params, {
        autoShowMessage: true
      });
    },
    edit(params) {
      return Api.put(`/ugc/v1/stage/${params.stageId}/missions/${params.id}`, params, {
        autoShowMessage: true
      });
    },
    status(stageId, id) {
      return Api.put(`/ugc/v1/stage/${stageId}/missions/${id}/status`, {
        autoShowMessage: true
      });
    },
    del(stageId, id) {
      return Api.delete(`/ugc/v1/stage/${stageId}/missions/${id}`, {
        autoShowMessage: true
      });
    },
    sort(stageId, id, type) {
      return Api.put(`/ugc/v1/stage/${stageId}/missions/${id}/sort`, { type }, {
        autoShowMessage: true
      });
    },
    addPlayerWork(params) {
      return Api.post(`/ugc/v1/compositions`, params, {
        autoShowMessage: true
      });
    }
  },
  judges: {
    user(params) {
      return Api.get(`/ugc/v1/judge-list/get-user-list`, { params }).then(res => res.data);
    },
    list(params) {
      return Api.get(`/ugc/v1/judge-list/get-judge-list`, { params }).then(res => res.data);
    },
    add(params) {
      return Api.post(`/ugc/v1/judge-list/add-judge`, params, {
        autoShowMessage: true
      });
    },
    del(params) {
      return Api.delete(`/ugc/v1/judge-lists/${params.id}/judge`, {
        autoShowMessage: true
      });
    },
    judges_score(params) {
      return Api.get(`/ugc/v1/activity/get-extend`, { params }).then(res => res.data);
    },
    edit_judges_score(params) {
      return Api.post(`/ugc/v1/activity/update-extend`, params);
    },
    editJudge(params) { // 活动中心配置评委可配置的排名
      return Api.post('/ugc/v1/judge-list/edit-judge', params).then(res => res.data);
    },
    mini() {
      return Api.get(`/ugc/v1/activity/get-mini-list`);
    },
    code(params) {
      return Api.post('/ugc/v1/activity/get-qr-code', params);
    },
    // 获取公众号列表
    getMp() {
      return Api.get(`/mission/v1/mission/commons/mp`).then(res => res.data);
    }
  }
};
