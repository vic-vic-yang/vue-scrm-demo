import Api from '../index';
import { Message } from 'element-ui';

export default {
  list(params) {
    return Api.get('/groupBuy/v1/order/import-log', {
      params
    })
      .then(res => res.data);
  },
  upload(file) {
    if (!file) {
      Message({
        message: '上传文件不能为空',
        type: 'error',
        duration: 3000
      });
      return Promise.reject(false);
    }
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    return Api.post('/groupBuy/v1/order/import-log/import', uploadFormData, {
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

