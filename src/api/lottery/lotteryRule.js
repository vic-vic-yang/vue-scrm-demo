import Api from '../index';
import { Message } from 'element-ui';

export const LotteryRule = {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/lotteryRule/lottery-rule/get-list', {
      params
    })
      .then(res => res.data);
  },
  selectList() {
    return Api.get('/v1/lotteryRule/lottery-rule/get-select-list')
      .then(res => res.data);
  },
  get(id) {
    /**
     * @id {string|number} - 抽奖规则ID
     * */
    return Api.get('/v1/lotteryRule/lottery-rule/get-lottery-rule', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  operation(params) {
    /**
     * @params {object} - {id,prize_type,name,avatar,info,price,deliver_type,status}
     * @id  规则ID，0-新增，其他-编辑
     * @name  抽奖规则名称
     * @algorithm  抽奖算法，1-平均分布，2-绝对随机
     * @filter_user  抽奖用户过滤，0-无，1-黑名单，2-会员组
     * @info  抽奖规则备注
     * */
    return Api.post('/v1/lotteryRule/lottery-rule/add', params)
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: res.message || '操作失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: params.id === 0 ? '添加成功' : '修改成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  del(id) {
    /**
     * @id {string|number} - 抽奖规则ID
     * */
    return Api.delete('/v1/lotteryRule/lottery-rule/delete', {
      data: { id: id }
    })
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: '删除失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: '删除成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  }
};

export const PrizeRule = {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,lotteryRuleId}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * @lotteryRuleId {number} 抽奖规则ID
     * */
    return Api.get('/v1/lotteryRule/prize-rule/get-list', {
      params
    })
      .then(res => res.data);
  },
  get(id) {
    /**
     * @id {string|number} - 抽奖规则ID
     * */
    return Api.get('/v1/lotteryRule/prize-rule/get-prize-rule', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  operation(params) {
    /**
     * @params {object} - {id,prize_type,name,avatar,info,price,deliver_type,status}
     * @id  规则ID，0-新增，其他-编辑
     * @name  抽奖规则名称
     * @algorithm  抽奖算法，1-平均分布，2-绝对随机
     * @filter_user  抽奖用户过滤，0-无，1-黑名单，2-会员组
     * @info  抽奖规则备注
     * */
    return Api.post('/v1/lotteryRule/prize-rule/add', params)
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: res.message || '操作失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: params.id === 0 ? '添加成功' : '修改成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  del(id) {
    /**
     * @id {string|number} - 抽奖规则ID
     * */
    return Api.delete('/v1/lotteryRule/prize-rule/delete', {
      data: { id: id }
    })
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: '删除失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: '删除成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  checkProbability(params) {
    /**
     * @params {object} - {lotteryRuleId,prizeRuleId,probabilitySet}
     * @lotteryRuleId  抽奖规则id
     * @prizeRuleId  奖品规则id
     * @probabilitySet   自定义概率
     * */
    return Api.get('/v1/lotteryRule/prize-rule/check-probability-set', { params })
      .then(res => {
        if (res.data !== true) {
          return Promise.reject(res);
        }
        return res;
      });
  },
  getFinalProbability(params) {
    /**
     * @params {object} - {lotteryRuleId,prizeRuleId,assignNum}
     * @lotteryRuleId  抽奖规则id
     * @prizeRuleId  奖品规则id
     * @assignNum  分配数量
     * */
    return Api.get('/v1/lotteryRule/prize-rule/get-final-probability', { params })
      .then(res => res.data);
  },
  getLevelsList(params) {
    return Api.get('/v1/lotteryRule/prize-rule/prize-levels', {
      params
    })
      .then(res => res.data);
  },
  getPrizesList(params) {
    return Api.get('/v1/lotteryRule/prize-rule/inventory-prizes', {
      params
    })
      .then(res => res.data);
  }
};

