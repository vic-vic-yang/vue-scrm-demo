import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认20
     * @matchName {string} 比赛名称
     * @matchMode {string} 游戏模式，1-限时赛，2-PK赛
     * @matchType {string} 比赛模式，1-个人，2-团体
     * @status {string} 状态，1：启用，0：禁用，默认请传-1或者空
     * @startTime {string} 开始时间，时间戳
     * @endTime {string} 结束时间，时间戳
     * */
    return Api.get('/v1/quiz/match/matches', {
      params
    })
      .then(res => res.data);
  },
  del(info) {
    return Api.delete(`/v1/quiz/match/matches/${info.id}`, {
      autoShowMessage: true
    });
  },
  status(info) {
    return Api.put(`/v1/quiz/match/matches/${info.id}/status`, {
      status: (!(info.status * 1)) * 1
    }, {
      autoShowMessage: true
    });
  },
  get(id) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/v1/quiz/match/matches/${id}`)
      .then(res => res.data);
  },
  add(params) {
    /**
     * @params {object} - {name,totalCount,status,enabledTime,remark}
     * @status 状态（0：未启用，1：启用，2：定时启用）
     * */
    return Api.post('/v1/quiz/match/matches', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    /**
     * @params {object} - {name,status,enabledTime,remark}
     * @status 状态（0：未启用，1：启用，2：定时启用）
     * */
    return Api.put(`/v1/quiz/match/matches/${params.id}`, params, {
      autoShowMessage: true
    });
  },
  // 获取比赛配置
  getView(gameId) {
    return Api.get(`/v1/quiz/match/matches/${gameId}/style`);
  },
  // 修改比赛配置
  editView(gameId, params) {
    return Api.put(`/v1/quiz/match/matches/${gameId}/style`, params, {
      autoShowMessage: true
    });
  },
  // 获取比赛奖励
  getReward(gameId) {
    return Api.get(`/v1/quiz/match/matches/${gameId}/award`);
  },
  // 修改比赛奖励
  editReward(gameId, params) {
    return Api.put(`/v1/quiz/match/matches/${gameId}/award`, params, {
      autoShowMessage: true
    });
  },
  rank(gameId, params) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/v1/quiz/match/matches/${gameId}/leaderboard`, {
      params
    })
      .then(res => res.data);
  },
  prizes(params) {
    /**
     * @params {object} - {name,totalCount,status,enabledTime,remark}
     * @status 状态（0：未启用，1：启用，2：定时启用）
     * */
    return Api.post('/v1/quiz/match/matches/bonus', params);
  },
  revise(params) {
    return Api.post('/v1/quiz/match/matches/change-status', params);
  },
  appIdList() {
    return Api.get('/base/v1/third/templates/mini');
  },
  name: {
    list(gameId, params) {
      /**
       * @gameId {string} - 比赛id
       * @params {Object} - {pageIndex,pageSize,status}
       * @pageIndex {number} 页码
       * @pageSize {number} 列表长度，默认20
       * */
      return Api.get(`/v1/quiz/match/matches/${gameId}/titles`, {
        params
      })
        .then(res => res.data);
    },
    del(gameId, nameId) {
      return Api.delete(`/v1/quiz/match/matches/${gameId}/titles/${nameId}`, {
        autoShowMessage: true
      });
    },
    get(gameId, nameId) {
      /**
       * @gameId {string|number} - 比赛id
       * @nameId {string|number} - 称号id
       * */
      return Api.get(`/v1/quiz/match/matches/${gameId}/titles/${nameId}`)
        .then(res => res.data);
    },
    add(gameId, params) {
      /**
       * @params {object} - {name,desc,startPercent,endPercent,imageUrl}
       * */
      return Api.post(`/v1/quiz/match/matches/${gameId}/titles`, params, {
        autoShowMessage: true
      });
    },
    edit(gameId, nameId, params) {
      /**
       * @params {object} - {name,desc,startPercent,endPercent,imageUrl}
       * */
      return Api.put(`/v1/quiz/match/matches/${gameId}/titles/${nameId}`, params, {
        autoShowMessage: true
      });
    }
  },
  preposition: {
    add(options) {
      return Api.post('v1/quiz/match/match/set-from', options);
    }
  }
};

