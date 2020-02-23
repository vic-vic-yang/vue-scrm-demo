import Api from '../index';

export default {
  list(params) {
    return Api.get('/readingClub/v1/readingClub/book-explain/index', { params }).then(res => {
      return res.data;
    });
  },
  get(params) {
    return Api.get('/readingClub/v1/readingClub/book-explain/get-one', { params });
  },
  status(params) {
    return Api.get('/readingClub/v1/readingClub/book-explain/is-enable', { params });
  },
  del(params) {
    return Api.get('/readingClub/v1/readingClub/book-explain/delete', { params });
  },
  add(params) {
    return Api.post('/readingClub/v1/readingClub/book-explain/create', params).then(res => {
      return res.data;
    });
  },
  editor(params) {
    return Api.post('/readingClub/v1/readingClub/book-explain/update', params).then(res => {
      return res.data;
    });
  },
  mechanism(params) {
    return Api.get('/readingClub/v1/readingClub/merchant/reading-merchant', { params }).then(res => {
      return res.data;
    });
  },
  book_list(params) {
    return Api.get('/readingClub/v1/readingClub/book/index', { params }).then(res => {
      return res.data;
    });
  },
  classify(params) {
    return Api.get('/readingClub/v1/readingClub/book/get-classify', { params }).then(res => {
      return res.data;
    });
  }
};
