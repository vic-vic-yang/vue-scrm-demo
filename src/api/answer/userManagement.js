import Api from '../index';

export default {
  team: {
    list(params) {
      /**
       * @params {Object} - {pageIndex,pageSize,teamName,memberCountLow,memberCountHigh,matchCountLow,matchCountHigh,teamScoreLow,teamScoreHigh}
       * @pageIndex {number} 页码
       * @pageSize {number} 页长度
       * @teamName {string} 团队名称
       * @memberCountLow {string} 团队人数下限，包含，无限制为空或者-1
       * @memberCountHigh {string} 团队人数上限，不包含，无限制为空或者-1
       * @matchCountLow {string} 比赛次数下限，包含，无限制为空或者-1
       * @matchCountHigh {string} 比赛次数上限，不包含，无限制为空或者-1
       * @teamScoreLow {string} 团队积分下限，包含，无限制为空或者-1
       * @teamScoreHigh {string} 团队积分上限，不包含，无限制为空或者-1
       * */
      return Api.get('/v1/quiz/match/teams', {
        params
      })
        .then(res => res.data);
    },
    detail(id) {
      return Api.get(`/v1/quiz/match/teams/${id}`)
        .then(res => res.data);
    },
    member(id, params) {
      /**
       * @params {Object} - {pageIndex,pageSize,status}
       * @pageIndex {number} 页码
       * @pageSize {number} 页长度
       * */
      return Api.get(`/v1/quiz/match/teams/${id}/members`, {
        params
      })
        .then(res => res.data);
    },
    del(info) {
      return Api.delete(`/v1/quiz/match/teams/${info.id}`, {
        autoShowMessage: true
      });
    },
    delMember(teamId, info) {
      return Api.delete(`/v1/quiz/match/teams/${teamId}/members/${info.userId}`, {
        autoShowMessage: true
      });
    }
  },
  user: {
    list(params) {
      /**
       * @params {Object} - {pageIndex,pageSize,userName,matchCountLow,matchCountHigh,teamName}
       * @pageIndex {number} 页码
       * @pageSize {number} 页长度
       * @userName {string} 用户名称
       * @matchCountLow {string} 比赛次数下限，包含，无限制为空或者-1
       * @matchCountHigh {string} 比赛次数上限，不包含，无限制为空或者-1
       * @teamName {string} 团队名称
       * */
      return Api.get(`/v1/quiz/match/users`, {
        params
      })
        .then(res => res.data);
    },
    get(id) {
      return Api.get(`/v1/quiz/match/users/${id}`)
        .then(res => res.data);
    },
    playList(id, params) {
      /**
       * @id {number} - 用户id
       * @params {Object} - {pageIndex,pageSize,userName,matchCountLow,matchCountHigh,teamName}
       * @pageIndex {number} 页码
       * @pageSize {number} 页长度
       * */
      return Api.get(`/v1/quiz/match/users/${id}/user-play-records`, {
        params
      }).then(res => res.data);
    }
  }
};
