import { Message } from 'element-ui';
import Api from '../index';

export default {
  getThirdAuthInfo(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/info-list', { params })
      .then(res => res.data);
  },
  getAuthUrl(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/get-third-auth-url', { params })
      .then(res => res.data);
  },
  authCallback(params) {
    /**
     * @params {object} - {code,v}
     * @code  微信回调获得的code
     * @v  微信回调传的参数
     * */
    return Api.post('/v1/wxThirdAuth/wx-third-auth/auth-callback', params, {
      autoShowMessage: false
    })
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
  },
  selectFeatures(params) {
    /**
     * @提交所选功能
     * */
    return Api.post(`/v1/wxThirdAuth/wx-third-auth/choose-app-type`, params);
  },
  getTemplate() {
    /**
     * @获取功能分类
     * */
    return Api.get('/v1/wxThirdAuth/wx-third-auth/app-template');
  },
  setAutoRelease(params) {
    /**
     * @设置是否自动更新
     * */
    return Api.put('/v1/wxThirdAuth/wx-third-auth/auto-release', params, {
      autoShowMessage: true,
      showMessageType: 'put'
    });
  },
  getAppJumpList(params) {
    /**
     * @获取小程序跳转连接
     * */
    return Api.get('/v1/wxThirdAuth/wx-third-auth/get-app-jump', { params });
  },
  setAppJumpList(params) {
    /**
     * @设置小程序跳转连接
     * */
    return Api.put('/v1/wxThirdAuth/wx-third-auth/edit-app-jump', params);
  },
  release(params) {
    /**
     * @发布
     * */
    return Api.post('/v1/wxThirdAuth/wx-third-auth/release', params);
  },
  auditStatus(params) {
    /**
     * 查询审核状态
     * */
    return Api.get('/v1/wxThirdAuth/wx-third-auth/audit-status', params);
  },
  roolBack(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/revert', {params});
  },
  upgrade(params) {
    return Api.post('/v1/wxThirdAuth/wx-third-auth/release', params);
  },
  cancleaudit(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/undo-audit', { params });
    // return Api.get('/v1/wxThirdAuth/wx-third-auth/cancle-audit', {params});
  },
  qrcode(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/get-qrcode', {params});
  },
  updatelog(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/update-log', {params});
  },
  getnoticeconfig(params) {
    return Api.get('/v1/wxThirdAuth/wx-third-auth/get-notice-config', {params});
  },
  setnoticeconfig(params) {
    return Api.post('/v1/wxThirdAuth/wx-third-auth/set-notice-config', params);
  }
};

