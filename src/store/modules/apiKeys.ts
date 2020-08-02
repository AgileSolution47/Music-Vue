import { ApiKeysState } from '../types';

const state: ApiKeysState = {
  napster: null,
  firestoreApiKey: null,
  firestoreProjectId: null,
  firestoreAppId: null,
};

const mutations = {
  setKeys(state: ApiKeysState, keys: ApiKeysState) {
    keys = {
      ...keys,
      firestoreApiKey: null,
      firestoreProjectId: null,
      firestoreAppId: null,
    };

    state.napster = keys.napster;
    state.firestoreApiKey = keys.firestoreApiKey;
    state.firestoreProjectId = keys.firestoreProjectId;
    state.firestoreAppId = keys.firestoreAppId;
  },
};

const getters = {
  valid(state: ApiKeysState) {
    return state.napster !== null;
  },
  syncable(state: ApiKeysState) {
    return (
      state.firestoreApiKey !== null
      && state.firestoreProjectId !== null
      && state.firestoreAppId !== null
    );
  },
};

export default {
  state,
  mutations,
  getters,
  namespaced: true,
};
