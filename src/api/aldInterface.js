import Api from './index';

export default {
  list(params) { // 列表
    return Api.get('/base/v1/third/alds', {
      params
    })
      .then(res => res.data);
  },
  get(id) { // 获取一条数据
    /**
     * @id {string|number} - 阿拉丁列表id
     * */
    return Api.get(`/base/v1/third/alds/${id}`)
      .then(res => res.data);
  },
  del(id) { // 删除
    return Api.delete(`/base/v1/third/alds/${id}`, {
      autoShowMessage: true
    });
  },
  status(id, status) { // 启用 - 禁用
    return Api.put(`/base/v1/third/alds/${id}/status/${(!(status * 1)) * 1}`, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  add(params) { // 新增
    return Api.post('/base/v1/third/alds', params, {
      autoShowMessage: true
    });
  },
  edit(id, params) { // 编辑
    return Api.put(`/base/v1/third/alds/${id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  }
};
