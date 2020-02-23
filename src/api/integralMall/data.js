
import Api from '../index';

export default {
  activity_data(params) {
    return Api.get('/integral/v1/lottery/actives/log', {
      params
    })
      .then(res => res.data);
  }
};
