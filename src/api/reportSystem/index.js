import Api from '../index';

export default {
  rewardRecords(params) { // 奖励记录列表
    return Api.get('/base/v1/statistics/statistics/award-log', {
      params
    }).then(res => res.data);
  },
  redPacketRecords(params) { // 红包列表
    return Api.get('/base/v1/statistics/statistics/red-pack-log', {
      params
    }).then(res => res.data);
  }
};
