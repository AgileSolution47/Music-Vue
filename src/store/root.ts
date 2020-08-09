import { ipcRenderer, remote } from 'electron';
import { ActionTree, MutationTree } from 'vuex';
import path from 'path';
// import { promises as fs } from 'fs';

import logo from '@/assets/logo.png';
import updateAlbum from '@/helpers/updateAlbum';
import { Tables } from '@/helpers/database_functions';

import { RootState } from './types';

const { app } = remote;

interface AddCustomAlbumPayload {
  name: string;
  songs: string[];
}

interface AddSongToAlbumPayload {
  album: CustomAlbumData;
  song: SongData;
}

// Rerender data when db data changes
const state = {
  updater: false,
};

const mutations: MutationTree<RootState> = {
  update(state) {
    state.updater = !state.updater;
  },
};

const actions: ActionTree<RootState, RootState> = {
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
    commit('update', undefined, { root: true });
  },
  async toggleLiked({ commit }, song: SongData) {
    await window.db.update(
      Tables.Songs,
      { liked: song.liked ? 0 : 1 }, // invert liked
      'title LIKE ?',
      [song.title]
    );

    commit('queue/toggleLiked', song);
    commit('update', undefined, { root: true });
  },
  async addCustomAlbum({ commit }, { name, songs }: AddCustomAlbumPayload) {
    const album: CustomAlbumData = {
      name,
      songs,
      id: await window.db.nextCustomAlbumId(),
    };

    await window.db.insertCustomAlbum(album);

    commit('update');
  },
  async editCustomAlbum({ commit }, album: CustomAlbumData) {
    await window.db.updateCustomAlbum(album);
    commit('update');
  },
  async addSongToAlbum({ commit }, { album, song }: AddSongToAlbumPayload) {
    if (album.songs.includes(song.title)) return;

    album.songs.push(song.title);

    await window.db.updateCustomAlbum(album);
    commit('update');
  },
  async deleteCustomAlbum({ commit }, id: string) {
    await window.db.deleteCustomAlbum(id);
    commit('update');
  },
};

export default {
  state,
  mutations,
  actions,
};
