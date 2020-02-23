/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 10:09:11
 * @LastEditTime: 2019-08-30 15:05:45
 * @LastEditors: Please set LastEditors
 */
import Api from '../index';

export default {
  list(params) {
    return Api.get('/ugc/v1/prize-tasks', {
      params
    })
      .then(res => res.data);
  },
  del(params) {
    return Api.delete(`/ugc/v1/prize-tasks/${params.id}`, {
      autoShowMessage: true
    });
  },
  status(params) {
    return Api.put(`/ugc/v1/prize-tasks/${params.id}/status`, {}, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get(id) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/ugc/v1/prize-tasks/${id}`)
      .then(res => res.data);
  },
  add(params) {
    return Api.post('/ugc/v1/prize-tasks', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/ugc/v1/prize-tasks/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};
