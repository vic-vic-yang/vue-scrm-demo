const taskType = [
  {
    value: 8,
    label: '自己完成任务',
    content: [
      {
        value: '601',
        label: '答题'
      },
      // {
      //   value: '602',
      //   label: '拼团'
      // },
      {
        value: '603',
        label: '投票'
      },
      // {
      //   value: '604',
      //   label: '阅读'
      // },
      {
        value: '605',
        label: '打卡'
      },
      {
        value: '606',
        label: '上传作品',
        disabled: false
      },
      {
        value: 3,
        label: '关注公众号'
      },
      {
        value: 1,
        label: '公众号内阅读文章签到'
      },
      {
        value: 5,
        label: '小程序内阅读公众号文章'
      },
      {
        value: 7,
        label: '小程序签到任务'
      }
    ]
  },
  {
    value: 6,
    label: '邀请用户完成任务',
    content: [
      {
        value: '601',
        label: '答题'
      },
      // {
      //   value: '602',
      //   label: '拼团'
      // },
      {
        value: '603',
        label: '投票'
      },
      // {
      //   value: '604',
      //   label: '阅读'
      // },
      {
        value: '605',
        label: '打卡'
      },
      {
        value: '606',
        label: '上传作品',
        disabled: true
      },
      {
        value: 4,
        label: '关注公众号'
      }
    ]
  },
  {
    value: 9,
    label: '分享页面任务'
  },
  {
    value: 2,
    label: '公众号裂变涨粉任务'
  }
];

export {
  taskType
};
