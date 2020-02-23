import Api from '../index';

export default {
  // 获取文章列表
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认20
     * @title {string} 题库标题
     * @status {string} 题库状态：enable 启用；disable 禁用
     * @earliestCreated {string} 最早创建日期，筛选这个日期后创建的题库
     * @lastCreated {string} 最晚创建日期，筛选这个日期前创建的题库
     * */
    return Api.get('/v1/quiz/study/articles', {
      params
    })
      .then(res => res.data);
  },
  // 获取比赛
  matchType() {
    return Api.get('/v1/quiz/match/matches')
      .then(res => res.data);
  },
  // 添加文章
  newArticle(params) {
    return Api.post(`/v1/quiz/study/articles`, params, {
      autoShowMessage: true
    });
  },
  // 文章详情
  articleDetails(id) {
    return Api.get(`/v1/quiz/study/articles/${id}`)
      .then(res => res.data);
  },
  // 修改文章
  reviseArticle(id, params) {
    return Api.put(`/v1/quiz/study/articles/${id}`, params, {
      autoShowMessage: true
    });
  },
  // 删除文章
  del(id) {
    return Api.delete(`/v1/quiz/study/articles/${id}`, {
      autoShowMessage: true
    });
  },
  // 修改状态
  revise(id) {
    return Api.put(`/v1/quiz/study/articles/${id}/status`, {
      autoShowMessage: true
    });
  }
};
