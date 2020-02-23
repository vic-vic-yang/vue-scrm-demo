import _ from 'lodash';
const game = {
  state: {
    matchMode: [
      {
        label: '限时赛',
        value: 1
      },
      {
        label: '不限时比赛',
        value: 2
      },
      {
        label: 'PK',
        value: 3
      }
    ],
    matchType: [
      {
        label: '个人',
        value: 1
      },
      {
        label: '团体',
        value: 2
      }
    ],
    status: [
      {
        label: '隐藏',
        value: 2
      },
      {
        label: '启用',
        value: 1
      },
      {
        label: '禁用',
        value: 0
      }
    ]
  },
  getters: {
    getMatchMode: state => mode => {
      return _.find(state.matchMode, (item) => item.value === mode * 1).label;
    },
    getMatchType: state => type => {
      return _.find(state.matchType, (item) => item.value === type * 1).label;
    },
    getStatusTxt: state => status => {
      return _.find(state.status, (item) => item.value === status * 1).label;
    }
  },
  mutations: {
  },
  actions: {
  }
};

export default game;
