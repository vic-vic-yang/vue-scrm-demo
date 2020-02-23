import Api from '../index';
// import { Message } from 'element-ui';

// 部门管理
const API_SECTION = {
  // 添加部门
  add(params) {
    return Api.post(`/base/v1/user/departments`, params);
  },
  // 修改部门
  modify(params) {
    return Api.put(`/base/v1/user/departments/${params.id}`, params);
  },
  del(id) {
    return Api.delete(`/base/v1/user/departments/${id}`);
  },
  getDetail(id = 1) {
    return Api.get(`/base/v1/user/departments/${id}`);
  },
  getList(params) {
    return Api.get(`/base/v1/user/departments`, { params });
  },
  // 获取部门的子部门
  getChild(id = '0') {
    return Api.get(`/base/v1/user/departments/${id}/child`);
  },
  setUser(id, params) {
    return Api.put(`/base/v1/user/departments/${id}/set-users`, params, {autoShowMessage: true});
  },
  getMerber(id, params) {
    return Api.get(`/base/v1/user/departments/${id}/get-users`, { params });
  },
  delUser(id, params) {
    return Api.put(`/base/v1/user/departments/${id}/del-users`, params, {autoShowMessage: true});
  },
  addUser(id, params) {
    return Api.put(`/base/v1/user/departments/${id}/add-users`, params, {autoShowMessage: true});
  }
};

// 角色管理
const API_ROLE = {
  getList(params) {
    return Api.get(`/base/v1/user/roles`, { params });
  },
  getFirst(id = 0) {
    return Api.get(`/base/v1/user/roles/${id}`);
  },
  add(params) {
    return Api.post(`/base/v1/user/roles`, params);
  },
  modify(params) {
    return Api.put(`/base/v1/user/roles/${params.id}`, params);
  },
  modifyPermission(params) {
    return Api.put(`/base/v1/user/roles/${params.id}/permissions`, params);
  },
  del(id) {
    return Api.delete(`/base/v1/user/roles/${id}`);
  },
  permissions(id) {
    return Api.get(`/base/v1/user/roles/${id}/permissions`);
  }
};

// 账户管理
const API_USER = {
  // 用户列表
  getList(params) {
    return Api.get(`/v1/userManage/users`, { params });
  },
  getFirst(id) {
    return Api.get(`/v1/userManage/users/${id}`);
  },
  add(params) {
    return Api.post(`/v1/userManage/users`, params, {autoShowMessage: true});
  },
  modify(params) {
    return Api.put(`/v1/userManage/users/${params.id}`, params);
  },
  modifyStatus(id, status) {
    return Api.put(`/v1/userManage/users/${id}/status/${status}`);
  },
  del(id) {
    return Api.delete(`/v1/userManage/users/${id}`);
  },
  // 修改用户角色
  modifyRole(id, params) {
    return Api.put(`/v1/userManage/users/${id}/roles`, params, {autoShowMessage: true});
  },
  // 修改用户部门
  modifySection(params) {
    return Api.put(`/v1/userManage/users/${params.id}/department/${params.department_id}`, params);
  },
  // 获取用户角色
  getRole(id) {
    return Api.get(`/v1/userManage/users/${id}/get-roles`);
  },
  // 获取用户部门
  getSection(id) {
    return Api.get(`/v1/userManage/users/${id}/department`);
  },
  modifyPermission(id, params) {
    return Api.put(`/base/v1/user/roles/${id}/permissions`, params);
  }
};

export {
  API_SECTION,
  API_ROLE,
  API_USER
};
