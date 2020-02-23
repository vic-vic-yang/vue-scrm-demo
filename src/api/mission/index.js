import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/mission/v1/mission/missions', {
      params
    })
      .then(res => res.data);
  },
  status(info) {
    return Api.put(`/mission/v1/mission/missions/${info.id}/status/${info.status}`, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  // 有奖任务
  awardDetails(params) {
    return Api.get(`/mission/v1/mission/missions/view-reward/${params.type}`).then(res => res.data);
  },
  awardAdd(params) {
    return Api.post('/mission/v1/goods/goods', params, {
      autoShowMessage: true
    });
  },
  awardEdit(params) {
    return Api.put(`/mission/v1/mission/missions/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get_reply(params) {
    return Api.get(`/mission/v1/mission/missions/${params.mission_id}/reply/${params.type}`);
  },
  edit_reply(params) {
    return Api.post(`/mission/v1/mission/missions/edit-reply/${params.id}`, params, {
      autoShowMessage: true
    });
  },
  reply_status(params) {
    return Api.put(`/mission/v1/mission/missions/reply-status/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};

