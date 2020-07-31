import { ipcRenderer, remote } from 'electron';
import path from 'path';

import logo from '@/assets/logo.png';
import updateAlbum from '@/helpers/updateAlbum';

const { app } = remote;

// Rerender data when db data changes
const state = {
  _updater: false,
};

const mutations = {
  update(state) {
    state._updater = !state._updater;
  },
};

const actions = {
  async downloadSong({ rootState, commit }, songData) {
    try {
      console.log('Downloading', songData.title);

      await ipcRenderer.invoke('download:image', songData.albumId);

      const thumbnail = `file://${path.join(
        app.getPath('userData'),
        'album_images',
        `${songData.albumId}.jpg`
      )}`;

      new Notification(songData.title, {
        body: `Downloading ${songData.title} by ${songData.artist}.\nYour download will start shortly.`,
        badge: logo,
        icon: thumbnail,
      });

      const { id: youtubeId, duration, path: filePath } = await ipcRenderer.invoke(
        'download:song',
        songData
      );
      remote.getCurrentWebContents().send('download:complete', songData);

      console.log(`${songData.title}: ${youtubeId}`);

      const song = {
        filePath,
        title: songData.title,
        thumbnail,
        artist: songData.artist,
        length: duration,
        numListens: 0,
        albumId: songData.albumId,
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

      new Notification(songData.title, {
        body: `Couldn't download ${songData.title} by ${songData.artist}. Check ${logPath} for more details.`,
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
