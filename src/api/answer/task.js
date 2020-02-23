/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 14:20:38
 * @LastEditTime: 2019-08-28 16:51:57
 * @LastEditors: Please set LastEditors
 */
import Api from '../index';

export default {
  // 获取任务列表
  list(params) {
    return Api.get('/v1/quiz/mission/missions', {
      params
    })
      .then(res => res.data);
  },
  // 获取任务详情
  taskDetails(id) {
    return Api.get(`/v1/quiz/mission/missions/${id}`)
      .then(res => res.data);
  },
  // 修改任务
  reviseTask(id, params) {
    return Api.put(`/v1/quiz/mission/missions/${id}`, params,
      {
        autoShowMessage: true
      });
  },
  // 添加文章
  newTask(params) {
    return Api.post(`/v1/quiz/mission/missions`, params, {
      autoShowMessage: true
    });
  },
  // 修改状态
  revise(id) {
    return Api.put(`/v1/quiz/mission/missions/${id}/status`, {
      autoShowMessage: true
    });
  },
  // 删除任务
  del(id) {
    return Api.delete(`/v1/quiz/mission/missions/${id}`, {
      autoShowMessage: true
    });
  },
  // 添加客服回复
  newService(params) {
    return Api.post(`/base/v1/mini/mini-messages`, params, {
      autoShowMessage: true
    });
  },
  // 获取管理公众号
  getAuthorizer(params) {
    return Api.get(`/v1/quiz/mission/missions/authorizer`, { params });
  }
//   // 获取比赛
//   matchType() {
//     return Api.get('/v1/quiz/match/matches')
//       .then(res => res.data);
//   },
//   // 添加文章
//   newArticle(params) {
//     return Api.post(`/v1/quiz/study/articles`, params, {
//       autoShowMessage: true
//     });
//   },
//   // 文章详情
//   articleDetails(id) {
//     return Api.get(`/v1/quiz/study/articles/${id}`)
//       .then(res => res.data);
//   },
//   // 修改文章
//   reviseArticle(id, params) {
//     return Api.put(`/v1/quiz/study/articles/${id}`, params, {
//       autoShowMessage: true
//     });
//   },
//   // 删除文章
//   del(id) {
//     return Api.delete(`/v1/quiz/study/articles/${id}`, {
//       autoShowMessage: true
//     });
//   },
//   // 修改状态
//   revise(id) {
//     return Api.put(`/v1/quiz/study/articles/${id}/status`, {
//       autoShowMessage: true
//     });
//   }
};
