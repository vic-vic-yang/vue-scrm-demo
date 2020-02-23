import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

const ErrDuration = 3 * 1000;

const api = axios.create({
  // baseURL: 'http://yapi.scrm.buerkongjian.com/mock/101/',
  baseURL: 'http://yapi.scrm.buerkongjian.com/mock/134',
  timeout: 60 * 1000
});

const showResponseMessage = function(res) {
  const resData = res.data;
  const method = res.config.showMessageType || res.config.method.toLowerCase();
  if (res.config.autoShowMessage === true && method !== 'get') {
    let message = null;
    const isSuccess = resData.code === 200;
    const messageType = isSuccess ? 'success' : 'error';
    if (method === 'delete') {
      message = isSuccess ? '删除成功' : '删除失败';
    } else if (method === 'post') {
      message = isSuccess ? '添加成功' : '添加失败';
    } else if (method === 'put') {
      message = isSuccess ? '修改成功' : '修改失败';
    }
    Message({
      message: message,
      type: messageType,
      duration: ErrDuration
    });
    if (!isSuccess) {
      return Promise.reject(resData);
    }
  }
  return resData;
};

// request interceptor
api.interceptors.request.use(config => {
  if (store.getters.token) {
    if (store.getters.token !== getToken()) {
      MessageBox.confirm('登录信息超时', {
        title: '提示',
        type: 'warning',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false
      }).then(() => {
        window.location.reload();
      });
      const tokenError = new Error('登录信息超时');
      tokenError.isTokenError = true;
      return Promise.reject(tokenError);
    }
    config.headers['X-ACCESS-TOKEN'] = getToken();
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// respone interceptor
api.interceptors.response.use(
  response => {
    let message = response.message;
    if (response.status === 200) {
      if (response.data.code && response.data.code !== 200) {
        message = response.data.message || message;
      } else {
        return showResponseMessage(response);
      }
    }
    Message({
      message: message,
      type: 'error',
      duration: ErrDuration
    });
    return Promise.reject(response);
  },
  (error) => {
    let errMsg = error.message;
    const resData = error.response.data;
    if (resData) {
      errMsg = (resData.data && resData.data.errorMessage) || resData.errors[0] || resData.message;
    }
    Message({
      message: errMsg,
      type: 'error',
      duration: ErrDuration
    });
    return Promise.reject(error);
  });

export default api;
