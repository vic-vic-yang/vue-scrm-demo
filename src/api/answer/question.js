import Api from '../index';
import { Message } from 'element-ui';

export default {
  group: {
    list(params) {
      /**
       * @params {Object} - {pageIndex,pageSize,status}
       * @pageIndex {number} 页码
       * @pageSize {number} 列表长度，默认20
       * @title {string} 题库标题
       * @status {string} 题库状态：enable 启用；disable 禁用
       * @earliestCreated {string} 最早创建日期，筛选这个日期后创建的题库
       * @lastCreated {string} 最晚创建日期，筛选这个日期前创建的题库
       * */
      return Api.get('/v1/quiz/question/groups', {
        params
      })
        .then(res => res.data);
    },
    status(info) {
      return Api.put(`/v1/quiz/question/groups/${info.id}/status`, {
        status: info.status === 1 ? 'disable' : 'enable'
      }, {
        autoShowMessage: true
      });
    },
    get(id, params) {
      return Api.get(`/v1/quiz/question/groups/${id}`, params)
        .then(res => res.data);
    },
    add(params) {
      /**
       * @params {object} - {title,desc}
       * @title {string} 库存名称
       * @desc {string} 库存描述
       * */
      return Api.post('/v1/quiz/question/groups', params, {
        autoShowMessage: true
      });
    },
    edit(params) {
      /**
       * @params {object} - {id,title,desc}
       * @id {string} 库存id
       * @title {string} 库存名称
       * @desc {string} 库存描述
       * */
      return Api.put(`/v1/quiz/question/groups/${params.id}`, params, {
        autoShowMessage: true
      });
    },
    del(info) {
      return Api.delete(`/v1/quiz/question/groups/${info.id}`, {
        autoShowMessage: true
      });
    }
  },
  topic: {
    list(params) {
      /**
       * @params {Object} - {groupId,title,status,earliestCreated,lastCreated}
       * @groupId {number} 要获取题目所属题库id
       * @title {string} 题目标题
       * @status {string} 题目状态：enable 启用，disable 禁用
       * @earliestCreated {string} 2018-09-20 最早创建日期，筛选这个日期后创建的题目
       * @lastCreated {string} 2018-09-20 最晚创建日期，筛选这个日期前创建的题目
       * */
      return Api.get(`/v1/quiz/question/items`, {
        params
      })
        .then(res => res.data);
    },
    status(info) {
      return Api.put(`/v1/quiz/question/items/${info.id}/status`, {
        status: info.status === 1 ? 'disable' : 'enable'
      }, {
        autoShowMessage: true
      });
    },
    get(id) {
      return Api.get(`/v1/quiz/question/items/${id}`);
    },
    add(params) {
      return Api.post(`/v1/quiz/question/items`, params, {
        autoShowMessage: true
      });
    },
    edit(params) {
      return Api.put(`/v1/quiz/question/items/${params.id}`, params, {
        autoShowMessage: true
      });
    },
    del(info) {
      return Api.delete(`/v1/quiz/question/items/${info.id}`, {
        autoShowMessage: true
      });
    },
    upload(groupId, file) {
      if (!file) {
        Message({
          message: '上传文件不能为空',
          type: 'error',
          duration: 3000
        });
        return Promise.reject(false);
      }
      const uploadFormData = new FormData();
      uploadFormData.append('groupId', groupId);
      uploadFormData.append('qsFile', file);
      return Api.post('/v1/quiz/question/item/import', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      })
        .then(res => {
          if (res.code === 200) {
            return res.data;
          }
          return Promise.reject(res);
        });
    },
    imageClass(params) {
      return Api.post('v1/quiz/question/item/item-images', params);
    }
  }
};

