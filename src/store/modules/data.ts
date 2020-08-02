import { ipcRenderer, remote } from 'electron';
import { ActionTree, MutationTree } from 'vuex';
import path from 'path';

import logo from '@/assets/logo.png';
import updateAlbum from '@/helpers/updateAlbum';

import { RootState, DataState } from '../types';

const { app } = remote;

// Rerender data when db data changes
const state: DataState = {
  updater: false,
};

const mutations: MutationTree<DataState> = {
  update(state) {
    state.updater = !state.updater;
  },
};

const actions: ActionTree<DataState, RootState> = {
  async downloadSong({ rootState, commit }, napsterSong: NapsterSongData) {
    try {
      console.log('Downloading', napsterSong.title);

      await ipcRenderer.invoke('download:image', napsterSong.albumId);

      const thumbnail = `file://${path.join(
        app.getPath('userData'),
        'album_images',
        `${napsterSong.albumId}.jpg`
      )}`;

      new Notification(napsterSong.title, {
        body: `Downloading ${napsterSong.title} by ${napsterSong.artist}.\nYour download will start shortly.`,
        badge: logo,
        icon: thumbnail,
      });

      const { id: youtubeId, duration, path: filePath } = await ipcRenderer.invoke(
        'download:song',
        napsterSong
      );
      remote.getCurrentWebContents().send('download:complete', napsterSong);

      console.log(`${napsterSong.title}: ${youtubeId}`);

      const song = {
        filePath,
        title: napsterSong.title,
        thumbnail,
        artist: napsterSong.artist,
        length: duration,
        numListens: 0,
        albumId: napsterSong.albumId,
        liked: false,
      };

      console.log('Downloaded', song.title);

      await updateAlbum(song.albumId);
      await window.db.insertSong(song);

      new Notification(song.title, {
        body: `Finished Downloading ${song.title} by ${song.artist}.\n It is stored in ${rootState.settings.folderStored}`,
        badge: logo,
        icon: song.thumbnail,
      });

      commit('update');
    } catch (e) {
      console.error(e);

      const logPath =
        process.env.NODE_ENV === 'development'
          ? 'the console'
          : path.join(app.getPath('logs'), 'error.log');

      new Notification(napsterSong.title, {
        body: `Couldn't download ${napsterSong.title} by ${napsterSong.artist}. Check ${logPath} for more details.`,
        badge: logo,
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
  namespaced: true,
};
