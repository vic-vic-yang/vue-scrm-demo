/*
 * @Description: 奖品中心接口文件
 * @Author: haorun
 * @Date: 2019-08-21 10:13:12
 * @LastEditTime: 2019-08-22 11:26:47
 * @LastEditors: Please set LastEditors
 */
import { Message } from 'element-ui';
import Api from '../index';

export default {
  // 获取奖品列表
  list(params) {
    return Api.get('/prizeCenter/v1/prize/prizes', {
      params
    })
      .then(res => res.data);
  },
  // 新增奖品
  add(params) {
    return Api.post('/prizeCenter/v1/prize/prizes', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    })
      .then(res => res.data);
  },
  // 修改奖品
  edit(id, params) {
    return Api.put(`/prizeCenter/v1/prize/prizes/${id}`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    })
      .then(res => res.data);
  },
  // 禁用奖品
  forbid(id, status) {
    return Api.put('/prizeCenter/v1/prize/prizes/' + id + '/status/' + status, {}, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    })
      .then(res => res.data);
  },
  // 根据奖品id获取奖品信息
  getOneById(id) {
    return Api.get('/prizeCenter/v1/prize/prizes/' + id)
      .then(res => res.data);
  },
  // 根据奖品id删除指定奖品
  delete(id) {
    return Api.delete('/prizeCenter/v1/prize/prizes/' + id)
      .then(res => res.data);
  },
  // 奖品流水
  plot(params) {
    return Api.get('/prizeCenter/v1/prize/prize/record', { params })
      .then(res => res.data);
  },
  awardPrizes(params) {
    return Api.get('/prizeCenter/v1/prize/prize/record', { params })
      .then(res => res.data);
  },
  upload(prize_id, file, remark) {
    if (!file) {
      Message({
        message: '上传文件不能为空',
        type: 'error',
        duration: 3000
      });
      return Promise.reject(false);
    }
    const uploadFormData = new FormData();
    uploadFormData.append('prize_id', prize_id);
    uploadFormData.append('file', file);
    if (remark) {
      uploadFormData.append('remark', remark);
    }
    return Api.post('/prizeCenter/v1/prize/prize/import-card-number', uploadFormData, {
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
  resend(prize_record_id) {
    return Api.put(`/prizeCenter/v1/prize/prizes/${prize_record_id}/resend`);
  },
  WriteCodeList(prize_id, params) {
    return Api.get(`/prizeCenter/v1/prize/prize/import-list?prize_id=${prize_id}`, { params }).then(res => {
      return res.data;
    });
  }
};

