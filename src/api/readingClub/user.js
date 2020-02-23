import Api from '../index';

export default {
  list(params) {
    return Api.get('/readingClub/v1/readingClub/user-manage/user-manage', { params }).then(res => {
      return res.data;
    });
  },
  reading_plan(params) {
    return Api.get('/readingClub/v1/readingClub/user-manage/reading-plan', { params });
  },
  reading_record(params) {
    return Api.get('/readingClub/v1/readingClub/user-manage/reading-record', { params });
  },
  reading_club(params) {
    return Api.get('/readingClub/v1/readingClub/user-manage/reading-club', { params });
  },
  punch_card_record(params) {
    return Api.get('/readingClub/v1/readingClub/user-manage/hit-c-record', { params });
  }
};
