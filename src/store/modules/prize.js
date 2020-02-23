import { PrizeTemplate } from '@/api/lottery/prize';

const prize = {
  state: {
    prizeTypeOptions: [
      {
        label: '实物',
        value: 1
      },
      {
        label: '微信红包',
        value: 2
      },
      {
        label: '无奖品',
        value: 101
      }
    ],
    templateSelect: null
  },
  mutations: {
    SET_TEMPLATE_SELECT(state, templateSelects) {
      state.templateSelect = templateSelects || null;
    }
  },
  actions: {
    getTemplateSelect({ state, commit }) {
      return new Promise((resolve, reject) => {
        const getActions = [];
        const selectKey = [];
        const tempSelects = {};
        for (const prizeType of state.prizeTypeOptions) {
          selectKey.push('template_' + prizeType.value);
          getActions.push(PrizeTemplate.selectList(prizeType.value));
        }
        Promise.all(getActions).then(res => {
          const len = selectKey.length;
          for (let i = 0; i < len; i++) {
            tempSelects[selectKey[i]] = res[i];
          }
          commit('SET_TEMPLATE_SELECT', tempSelects);
          return resolve(tempSelects);
        });
      });
    }
  }
};
export default prize;
