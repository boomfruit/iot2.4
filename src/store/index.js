import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import dict from './modules/dict';
import topBar from './modules/topBar';

import user from './modules/user';
import tagsView from './modules/tagsView';
import permission from './modules/permission';
import settings from './modules/settings';
import getters from './getters';
import topoEditor from './modules/topo-editor'; // 组态特有

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        dict,
        user,
        topBar,
        tagsView,
        permission,
        settings,
        topoEditor,
    },
    getters,
});

export default store;
