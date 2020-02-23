import { loginByUsername, getUserInfo, loginBySupplier } from '@/api/login';
import { getToken, setToken, removeToken, setAuthType, removeAuthType } from '@/utils/auth';
import _ from 'lodash';
const defaultUserInfo = {
  avatar: '/static/images/defaultAvatar.jpg'
};

const user = {
  state: {
    userInfo: defaultUserInfo,
    token: getToken(),
    roles: []
  },

  getters: {
    getUserStatusIsNormal: state => {
      return getToken() === state.token;
    }
  },

  mutations: {
    SET_USER_INFO(state, info) {
      state.userInfo = info === false ? defaultUserInfo : _.merge(state.userInfo || {}, info || {});
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          const accessToken = response.data.access_token;
          commit('SET_USER_INFO', response.data);
          commit('SET_TOKEN', accessToken);
          setToken(accessToken);
          setAuthType('');
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 供应商登录
    LoginBySupplier({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginBySupplier(userInfo).then(response => {
          const accessToken = response.data.access_token;
          commit('SET_USER_INFO', response.data);
          commit('SET_TOKEN', accessToken);
          sessionStorage.setItem('user_Info', JSON.stringify(response.data));
          setToken(accessToken);
          setAuthType(true);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          if (!res) {
            reject('error');
          }
          const data = res.data;
          if (data) {
            commit('SET_USER_INFO', data);
            if (data.roles && data.roles.length > 0) {
              commit('SET_ROLES', data.roles);
            } else {
              data.roles = ['admin'];
              commit('SET_ROLES', ['admin']);
            }
            commit('SET_USER_INFO', data);
            commit('SET_TOKEN', data.access_token);
            setToken(data.access_token);
            resolve(data);
          } else {
            reject(res.errmsg);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取供应商信息
    GetSupplierUserInfo({ commit, state }) {
      var data = sessionStorage.getItem('user_Info') ? JSON.parse(sessionStorage.getItem('user_Info')) : {};
      commit('SET_USER_INFO', data);
      commit('SET_TOKEN', data.access_token);
    },

    // 退出登录
    LogOut({ commit }) {
      return new Promise(resolve => {
        removeToken();
        removeAuthType();
        commit('SET_TOKEN', '');
        commit('SET_USER_INFO', false);
        commit('SET_ROLES', []);
        resolve();
      });
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role);
        setToken(role);
        getUserInfo(role).then(response => {
          const data = response.data;
          commit('SET_USER_INFO', data);
          commit('SET_ROLES', data.roles);
          resolve();
        });
      });
    }
  }
};

export default user;
