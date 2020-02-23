import Api from '../index';
import { Message } from 'element-ui';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/lotteryActivity/activity-manage/get-list', {
      params
    })
      .then(res => res.data);
  },
  typeList() {
    return Api.get('/v1/lotteryActivity/activity-manage/activity-type-list')
      .then(res => res.data);
  },
  get(id) {
    /**
     * @id {string|number} - 抽奖规则ID
     * */
    return Api.get('/v1/lotteryActivity/activity-manage/get-activity', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  operation(params) {
    /**
     * @params {object} - {id,...}
     * @id  规则ID，0-新增，其他-编辑
     * */
    return Api.post('/v1/lotteryActivity/activity-manage/add', params)
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
  preview(id) {
    /**
     * @id  活动ID
     * */
    return Api.get('/v1/lotteryActivity/activity-manage/preview', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  awardRecord(params) {
    /**
     * @params {object}
     *@param pageIndex	页号
     *@param pageSize	 每页数量
     *@param id	活动
     * */
    return Api.get('/v1/prizeRecord/prize-record/get-list', {
      params
    })
      .then(res => res.data);
  },
  selectList() {
    return Api.get('/v1/lotteryActivity/activity-manage/get-act-menu')
      .then(res => res.data);
  },
  deliverManagement(params) {
    /**
     * @params {object} - {prize_record_id,is_send,expressage,expressage_code,send_time}
     * @prize_record_id  中奖记录id
     * */
    return Api.post('/v1/prizeRecord/prize-record/add-deliver-goods', params)
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: res.message || '操作失败',
            type: 'error'
          });
          return Promise.reject(res);
        }
        Message({
          message: '操作成功',
          type: 'success'
        });
        return res;
      });
  }
};

