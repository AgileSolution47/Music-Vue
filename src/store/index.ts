import Vue from 'vue';
import Vuex from 'vuex';
import { createPersistedState } from 'vuex-electron';
// import { promises as fs } from 'fs';

import { Tables } from '@/helpers/database_functions';

import modules from './modules';
import { RootState } from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  actions: {
    async deleteSong({ commit }, song: SongData) {
      // TODO uncomment delete file code
      // const data = { numSongs: await window.db.getNumSongs(song.albumId) - 1};

      // await Promise.all([
      //   fs.unlink(song.filePath);
      //   window.db.deleteSong(song.title),
      //   window.db.update(
      //     Tables.Albums,
      //     data,
      //     'id LIKE ?',
      //     [song.albumId],
      //   ),
      // ]);

      // await window.db.deleteEmptyAlbums();

      commit('queue/removeSong', song);
      commit('data/update', undefined, { root: true });
    },
    async toggleLiked({ commit }, song: SongData) {
      await window.db.update(
        Tables.Songs,
        { liked: song.liked ? 0 : 1 }, // invert liked
        'title LIKE ?',
        [song.title]
      );

      commit('queue/toggleLiked', song);
      commit('data/update', undefined, { root: true });
    },
  },
  modules,
  plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== 'production',
});
