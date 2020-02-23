/*
 * @Description: 日志api
 * @Autor: shao bo
 * @Date: 2019-12-26 10:00:17
 */
import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/oplog/oplog-manage/get-list', {
      params
    })
      .then(res => res.data);
  }
};
