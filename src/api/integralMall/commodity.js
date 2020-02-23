/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-25 15:14:39
 * @LastEditTime: 2019-08-27 15:19:35
 * @LastEditors: Please set LastEditors
 */
import { Message } from 'element-ui';
import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {page_index,page_size}
     * @page_index {number} 页码
     * @page_size {number} 列表长度，默认20
     * */
    return Api.get('/integral/v1/goods/goods', {
      params
    })
      .then(res => res.data);
  },
  del(id) {
    return Api.delete(`/integral/v1/goods/goods/${id}`, {
      autoShowMessage: true
    });
  },
  status(info) {
    return Api.put(`/integral/v1/goods/goods/${info.id}/status/${info.status}`, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  get(id) {
    /**
     * @id {string|number} - 比赛id
     * */
    return Api.get(`/integral/v1/goods/goods/${id}`)
      .then(res => res.data);
  },
  add(params) {
    return Api.post('/integral/v1/goods/goods', params, {
      autoShowMessage: true
    });
  },
  edit(params) {
    return Api.put(`/integral/v1/goods/goods/${params.id}`, params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  import_list(params) {
    return Api.get(`/integral/v1/goods/goods/import-list`, { params }).then(res => {
      return res.data;
    });
  },
  upload(id, file, remark) {
    if (!file) {
      Message({
        message: '上传文件不能为空',
        type: 'error',
        duration: 3000
      });
      return Promise.reject(false);
    }
    const uploadFormData = new FormData();
    uploadFormData.append('goods_id', id);
    uploadFormData.append('file', file);
    if (remark) {
      uploadFormData.append('remark', remark);
    }
    return Api.post('/integral/v1/goods/goods/import-card-number', uploadFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    })
      .then(res => {
        if (res.code === 200) {
          return res.data;
        }
        return Promise.reject(res);
      });
  }
};

