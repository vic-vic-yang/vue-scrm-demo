import Api from '../index';

export default {
  list(params) {
    return Api.get('/integral/v1/lottery/rule-prizes', {
      params
    })
      .then(res => res.data);
  },
  get(params) {
    return Api.get(`/integral/v1/lottery/rule-prizes/${params.id}`);
  },
  add(params) {
    return Api.post('/integral/v1/lottery/rule-prizes', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/integral/v1/lottery/rule-prizes/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  del(params) {
    return Api.delete(`/integral/v1/lottery/rule-prizes/${params.id}`, {
      autoShowMessage: true
    });
  },
  getLevel() {
    return Api.get('/integral/v1/lottery/rule-prize/get-level');
  },
  getWinPercent(params) {
    return Api.get(`/integral/v1/lottery/rule-prizes/${params.id}/rule/${params.rule_id}/win-percent/${params.num}`);
  },
  getUnallocatedNum(params) {
    return Api.get(`/integral/v1/lottery/rule-prizes/${params.id}/unallocated-num/${params.rule_id}`);
  }
};

