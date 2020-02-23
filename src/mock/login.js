import { param2Obj } from '@/utils';

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
};

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body);
    return userMap[username];
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url);
    if (userMap[token]) {
      return userMap[token];
    } else {
      return {
        'code': 200,
        'message': 'OK',
        'data': {
          'user_id': 1,
          'user_name': '111',
          'merchant_id': 1,
          'access_token': 'r6zIHH4A3u5AulhZAqiln4fkMYuqaub4'
        }
      };
    }
  },
  logout: () => 'success'
};
