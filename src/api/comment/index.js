import Api from '../index';

export default {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认20
     * @sourceType 1文章 2作品
     * @commentTitle 评论标题
     * @username
     * @userId
     * */
    return Api.get('/ugc/v1/topic-comment/index', {
      params
    })
      .then(res => res.data);
  },
  // 操作评论
  operate(params) {
    /**
     * @id 评论主键 id
     * @status 评论 状态 0待审核 1通过 2 拒绝 3 删除'
     * */
    return Api.get('/ugc/v1/topic-comment/operate', {
      params
    }).then(res => res.data);
  },
  // 评论配置列表
  configList() {
    return Api.get('/ugc/v1/topic-comment/config').then(res => res.data);
  },
  // 操作评论配置列表
  operateConfigList(params) {
    return Api.get('/ugc/v1/topic-comment/pattern', {params}).then(res => res.data);
  }
};

