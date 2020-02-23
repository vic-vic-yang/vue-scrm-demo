import Api from '../index';

export default {
  getSettings() {
    return Api.get('/base/v1/site/settings').then(res => {
      return res.data;
    });
  },
  settings(params) {
    return Api.post('/base/v1/site/settings', params, {autoShowMessage: false}).then(res => {
      return res.data;
    });
  },
  parameters() {
    return Api.get('/base/v1/site/settings/parameters').then(res => {
      return res.data;
    });
  }
};
