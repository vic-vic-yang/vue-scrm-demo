import Api from './index';

export function loginByUsername(params) {
  return Api.post('/v1/userManage/user/login', params);
}

export function getUserInfo() {
  return Api.get('/v1/userManage/user/get-user-info');
}

export function getVerifyCode() {
  return Api.get('/v1/userManage/user/verify-code').then(res => res.data);
}

export function getPhoneVerifyCode(params) {
  return Api.get('/readingClub/v1/readingClub/phone-code/phone-code', { params }).then(res => res.data);
}

export function getUserRoles() {
  return Api.get('/content/user/normal/menu');
}
// 获取授权地址
export function getAuthUrl() {
  return Api.get('/v1/cloud/q-cloud/q-cloud-auth-url');
}
// 授权登录
export function loginByAuth(params) {
  return Api.get('/v1/cloud/q-cloud-auth/auth', { params });
}

// 供应商登录登录
export function loginBySupplier(params) {
  return Api.post('/v1/userManage/supplier/login', params);
}
export function getSupplierVerifyCode() {
  return Api.get('/v1/userManage/supplier/verify-code').then(res => res.data);
}
