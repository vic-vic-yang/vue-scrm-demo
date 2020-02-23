import Api from '../index';
import { Message } from 'element-ui';

export default {
  getThirdAuthInfo() {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/info-list')
      .then(res => res.data);
  },
  getAuthUrl() {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/get-third-auth-url')
      .then(res => res.data);
  },
  authCallback(params) {
    /**
     * @params {object} - {code,v}
     * @code  微信回调获得的code
     * @v  微信回调传的参数
     * */
    return Api.post('/v1/wxThirdAuth/wx-third-auth/auth-callback', params)
      .then(res => res.data);
  },
  unbind(params = {}) {
    /**
     * @params {object} - {code,v}
     * @code  微信回调获得的code
     * @v  微信回调传的参数
     * */
    return Api.post(`/v1/wxThirdAuth/wx-third-auth/unbind?id=${params.id}`)
      .then(res => {
        if (res.data.success === true) {
          Message({
            message: '解绑成功',
            type: 'success',
            duration: 3000
          });
          return res;
        } else {
          Message({
            message: '解绑失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
      });
  }
};

