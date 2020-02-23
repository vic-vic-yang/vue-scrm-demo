import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import user from './modules/user';
import game from './modules/game';
import prize from './modules/prize';
import getters from './getters';
import templateMsg from './modules/templateMsg';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    uploadImgUrl: '/api/v1/fileUpload/file-upload/upload',
    uploadFileUrl: '/api/v1/fileUpload/file-upload/file-upload'
  },
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    game,
    prize,
    templateMsg
  },
  getters
});

export default store;
