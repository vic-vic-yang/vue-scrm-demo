import Api from '../index';
import { Message } from 'element-ui';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * @status {number} 是否启用（留空为全部，0：未启用，1：启用）
     * */
    return Api.get('/v1/codeManage/code-segment/get-list', {
      params
    })
      .then(res => res.data);
  },
  selectList() {
    return Api.get('/v1/codeManage/code-segment/get-select-list')
      .then(res => res.data);
  },
  get(id) {
    /**
     * @id {string|number} - 码段id
     * */
    return Api.get('/v1/codeManage/code-segment/get-by-id', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  add(params) {
    /**
     * @params {object} - {name,totalCount,status,enabledTime,remark}
     * @status 状态（0：未启用，1：启用，2：定时启用）
     * */
    return Api.post('/v1/codeManage/code-segment/add', params)
      .then(res => {
        if (res.data !== true) {
          Message({
            message: res.message || '添加失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: '添加成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  edit(params) {
    /**
     * @params {object} - {name,status,enabledTime,remark}
     * @status 状态（0：未启用，1：启用，2：定时启用）
     * */
    return Api.put('/v1/codeManage/code-segment/edit', params)
      .then(res => {
        if (res.data !== true) {
          Message({
            message: res.message || '修改失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: '修改成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  statics(params) {
    /**
     * @params {Object} - {pageIndex,pageSize}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/codeManage/code-scan-count/get-list', { params })
      .then(res => res.data);
  }
};

