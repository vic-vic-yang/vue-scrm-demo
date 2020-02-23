import Cookies from 'js-cookie';

const TokenKey = 'access_token';
const AuthType = 'auth_type';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getAuthType() {
  return Cookies.get(AuthType);
}

export function setAuthType(data) {
  return Cookies.set(AuthType, data, { expires: 1 });
}

export function removeAuthType() {
  return Cookies.remove(AuthType);
}
