import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/member/member-manage/get-list', {
      params
    })
      .then(res => res.data);
  },
  record(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,userId}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * @userId {number|string} 扫码用户id
     * */
    return Api.get('/v1/member/member-manage/get-record-list', {
      params
    })
      .then(res => res.data);
  }
};

