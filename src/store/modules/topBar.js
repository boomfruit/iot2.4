const topBar = {
    state: {
        currentBarIdx: 1,
        routerMap: {
            1: 'index',
            2: 'smartAquaculture/iot/device',
            3: 'farmManagement',
            4: 'alarmCenter/alert',
            5: 'resourceManagement/template/protocol',
            6: 'systemManagement/monitor/cacheList',
            7: 'barnsManagement',
        },
    },

    mutations: {
        SET_CurrentBarIdx: (state, idx) => {
            state.currentBarIdx = idx;
        },
        SET_RouterMap: (state, data) => {
            state.routerMap[data.idx] = data.path;
        },
    },

    actions: {
        // 登录
        changeCurrentIdx({ commit }, idx) {
            commit('SET_CurrentBarIdx', idx);
        },
        changeRouter({ commit }, data) {
            commit('SET_RouterMap', data);
        },
    },
};

export default topBar;
