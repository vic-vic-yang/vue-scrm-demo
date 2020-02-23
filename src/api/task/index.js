/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:36:22
 * @LastEditTime: 2019-08-28 14:37:48
 * @LastEditors: Please set LastEditors
 */
import Api from '../index';

export default {
  // 获取小程序列表
  getMiniAppids() {
    return Api.get(`/mission/v1/mission/commons/mini`).then(res => res.data);
  },
  // 获取公众号列表
  getGZHAppids() {
    return Api.get(`/mission/v1/mission/commons/mp`).then(res => res.data);
  },
  // 获取奖品列表
  getAwards() {
    return Api.get(`/mission/v1/mission/awards/list`).then(res => res.data);
  },
  // 获取奖品列表
  getGiftList(params) {
    return Api.get('/prizeCenter/v1/prize/prizes', { params })
      .then(res => res.data);
  },
  // 添加任务
  addTask(params) {
    const url = `/missionCenter/v1/mission/missions`;
    return Api.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000,
      autoShowMessage: true
    }).then(res => res.data);
  },
  // /修改任务
  editTask(id, params) {
    const url = `/missionCenter/v1/mission/missions/${id}`;
    return Api.put(url, params, {autoShowMessage: true});
  },
  // 获取任务列表
  getTasks(params) {
    return Api.get(`/missionCenter/v1/mission/missions`, {params}).then(res => res.data);
  },
  // 获取任务详情，用于在修改的时候回显数据
  getTaskDetails(id) {
    return Api.get(`/missionCenter/v1/mission/missions/${id}`).then(res => res.data);
  },
  // 获取日志总览
  getLogsAbove() {
    return Api.get(`/missionCenter/v1/mission/mission/mission-count`).then(res => res.data);
  },
  // 获取日志详情
  getLogsDetails(params) {
    return Api.get(`/missionCenter/v1/mission/mission/record`, { params }).then(res => res.data);
  },
  // 获取文章参数列表
  getReadingList(params) {
    return Api.get(`/missionCenter/v1/mission/mission-reading-codes`, { params }).then(res => res.data);
  },
  // 新增文章参数
  getReadingPara(params) {
    return Api.post(`/missionCenter/v1/mission/mission-reading-codes`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    }).then(res => res.data);
  },
  // 编辑文章参数
  editReadingPara(id, params) {
    return Api.put(`/missionCenter/v1/mission/mission-reading-codes/${id}`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    }).then(res => res.data);
  },
  // 获取公众号文章列表
  getArticleList(params) {
    return Api.get(`/missionCenter/v1/article/articles`, { params }).then(res => res.data);
  },
  // 添加公众号文章
  addAriticle(params) {
    return Api.post(`/missionCenter/v1/article/articles`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    }).then(res => res.data);
  },
  // 编辑公众号文章
  editAriticle(id, params) {
    return Api.put(`/missionCenter/v1/article/articles/${id}`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    }).then(res => res.data);
  },
  // 修改阅读公众号文章状态
  statusArticle(params) {
    return Api.put(`/missionCenter/v1/article/articles/${params.id}/status/${params.status}`).then(res => res.data);
  },
  // 删除阅读公众号文章
  delArticle(id) {
    return Api.delete(`/missionCenter/v1/article/articles/${id}`).then(res => res.data);
  },
  // 任务状态
  status(params) {
    return Api.put(`/missionCenter/v1/mission/missions/${params.id}/status/${params.status}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  // 任务删除
  del(params) {
    return Api.delete(`/missionCenter/v1/mission/missions/${params.id}`, {
      autoShowMessage: true
    });
  },
  // 自动回复
  get_reply(params) {
    return Api.get(`/missionCenter/v1/mission/mission/pull-reply`, { params });
  },
  edit_reply(params) {
    return Api.put(`/missionCenter/v1/mission/mission/edit-pull-reply`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  reply_status(params) {
    return Api.put(`/missionCenter/v1/mission/mission/pull-reply-status`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  prize_rate_list(params) {
    return Api.get(`/prizeCenter/v1/prize/prize/get-prize-rate-list`, { params }).then(res => {
      return res.data;
    });
  },
  set_store(params) {
    return Api.post(`/prizeCenter/v1/prize/prize/change-store`, params);
  }
};

