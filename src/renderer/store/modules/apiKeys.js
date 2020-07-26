const state = {
  napster: null,
  firstoreApiKey: null,
  firstoreProjectId: null,
  firestoreAppId: null,
};

const mutations = {
  setKeys(state, keys) {
    keys = {
      ...keys,
      firstoreApiKey: null,
      firstoreProjectId: null,
      firestoreAppId: null,
    };

    state.napster = keys.napster;
    state.firstoreApiKey = keys.firstoreApiKey;
    state.firstoreProjectId = keys.firstoreProjectId;
    state.firestoreAppId = keys.firestoreAppId;
  },
};

const getters = {
  valid(state) {
    return state.napster !== null;
  },
  syncable(state) {
    return (
      state.firestoreApyKey !== null &&
      state.firestoreProjectId !== null &&
      state.firestoreAppId !== null
    );
  },
};

export default {
  state,
  mutations,
  getters,
  namespaced: true,
};
