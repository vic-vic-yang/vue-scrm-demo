import Api from '../index';

export default {
  clockList(params) {
    return Api.get(`/base/v1/activity/activity-centers/record`, { params }).then(res => {
      return res.data;
    });
  },
  deleteClock(params) {
    return Api.delete(`/base/v1/activity/activity-centers/${params.id}/delete`).then(res => {
      return res.data;
    });
  }
};
