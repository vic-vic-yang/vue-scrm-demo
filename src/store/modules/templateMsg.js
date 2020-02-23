
export default {
  state: {
    appid: '',
    mini_program: null,
    typeOptions: [
      {
        id: 1,
        name: '定时推送消息'
      },
      {
        id: 2,
        name: '触发事件消息'
      }
    ],
    pageOptions: [
      // 投票
      {
        id: 0,
        name: '投票 - 活动详情页',
        page: 'pages-vote/pages-vote/vote-item/index?id={{activityId}}'
      },
      {
        id: 1,
        name: '投票 - 作品详情页',
        page: 'pages-vote/pages-vote/vote-item/workDetails?id={{compositionId}}'
      },
      {
        id: 2,
        name: '投票 - 有奖任务页',
        page: 'pages-vote/pages-vote/task/index?id={{activityId}}'
      },
      {
        id: 3,
        name: '投票 - 我的点赞页',
        page: 'pages-vote/pages-vote/my/my-fabulous'
      },
      // 答题
      {
        id: 4,
        name: '答题 - 活动详情页',
        page: 'pages-quiz/pages-quiz/answerHome/index?id={{matchId}}'
      },
      {
        id: 5,
        name: '答题 - 任务中心页',
        page: 'pages-quiz/pages-quiz/task/index?id={{matchId}}'
      },
      // 拼团
      {
        id: 6,
        name: '商城 - 活动详情页（单独小程序）',
        page: 'pages-pingtuan/pages-pingtuan/index/index?id={{activityId}}'
      },
      {
        id: 7,
        name: '商城 - 团详情页',
        page: 'pages-pingtuan/pages-pingtuan/group/details?id={{groupId}}'
      },
      // 积分
      {
        id: 8,
        name: '积分 - 积分首页',
        page: 'pages-integral/index/index'
      },
      // 发现页、活动列表
      {
        id: 9,
        name: '发现页',
        page: 'pages/pages/index?cur=2'
      },
      // 商城 - 2019-10-12
      {
        id: 10,
        name: '商城 - 商品详情页面(活动详情)',
        page: 'pages-pingtuan/pages-pingtuan/commodity/detail?id={{activityId}}'
      },
      {
        id: 11,
        name: '商城 - 订单详情',
        page: 'pages-pingtuan/pages-pingtuan/order/details?id={{orderId}}'
      },
      {
        id: 12,
        name: '商城 - 物流信息',
        page: 'pages-pingtuan/pages-pingtuan/order/logistics?id={{orderId}}'
      },
      // 打卡 - 2019-10-12
      {
        id: 13,
        name: '打卡- 活动首页',
        page: 'pages-punch/pages/home/index?id={{activityId}}'
      }
    ]
  },
  mutations: {
    SET_MINI_PROGRAM(state, data) {
      state.appid = data.authorizer_appid;
      state.mini_program = data;
    }
  },
  actions: {
  }
};
