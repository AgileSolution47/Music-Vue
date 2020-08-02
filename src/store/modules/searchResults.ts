import axios from 'axios';
import { ActionContext } from 'vuex';

import { SearchResultsState, RootState } from '../types';

const state: SearchResultsState = {
  results: [],
  error: null,
};

const mutations = {
  setResults(state: SearchResultsState, results: NapsterSongData[]) {
    state.results = results;
  },
  setError(state: SearchResultsState, error: any) {
    state.error = error;
  },
  clear(state: SearchResultsState) {
    state.results = [];
    state.error = null;
  },
};

const actions = {
  async search({ commit, rootState }: ActionContext<SearchResultsState, RootState>, query: string) {
    if (query.trim().length === 0) return;
    try {
      const response = await axios.get('https://api.napster.com/v2.2/search', {
        params: {
          apikey: rootState.apiKeys.napster,
          type: 'track',
          per_type_limit: 10, // eslint-disable-line
          query,
        },
      });
      if (response.status !== 200) throw response.headers.status;

      commit(
        'setResults',
        response.data.search.data.tracks.map((track: obj) => ({
          artist: track.artistName,
          title: track.name,
          length: track.playbackSeconds,
          thumbnail: `https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg`,
          albumId: track.albumId,
        }))
      );
    } catch (e) {
      console.error(e);
      commit('setError', e);
    }
  },
};

export default {
  state,
  mutations,
  actions,
  namespaced: true,
};
