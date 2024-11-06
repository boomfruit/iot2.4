const topBar = {
    state: {
        currentBarIdx: 1,
    },

    mutations: {
        SET_CurrentBarIdx: (state, idx) => {
            state.currentBarIdx = idx;
        },
    },

    actions: {
        // 登录
        changeCurrentIdx({ commit }, idx) {
            commit('SET_CurrentBarIdx', idx);
        },
    },
};

export default topBar;
