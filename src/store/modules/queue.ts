import { ActionTree, MutationTree } from 'vuex';
// import { promises as fs } from 'fs';

import { Tables } from '@/helpers/database_functions';
import shuffleArray from '@/helpers/shuffleArray';

import { RootState, QueueState } from '../types';

const state: QueueState = {
  queue: [],
  allSongs: [],
  loop: false,
  shuffle: false,
  index: -1,
};

interface EnqueueEvent {
  songs: SongData[];
  shuffle?: boolean;
}

const mutations: MutationTree<QueueState> = {
  enqueue(state, { songs, shuffle }: EnqueueEvent) {
    shuffle = shuffle ?? false;

    state.index = 0;
    state.shuffle = shuffle;
    state.allSongs = [...songs];

    if (shuffle) {
      state.queue = shuffleArray([...songs], 0);
    } else {
      state.queue = [...songs];
    }
  },
  dequeue(state) {
    state.allSongs = [];
    state.queue = [];
  },
  gotoSong(state, index: number) {
    state.index = index;
  },
  nextSong(state) {
    if (!state.loop) {
      state.index += 1;
    }
  },
  prevSong(state) {
    if (!state.loop) {
      state.index -= 1;
    }
  },
  toggleShuffle(state) {
    state.shuffle = !state.shuffle;

    if (state.shuffle) {
      state.queue = shuffleArray([...state.allSongs], state.index);
      state.index;
    } else {
      state.queue = [...state.allSongs];
    }
  },
  toggleLoop(state) {
    state.loop = !state.loop;
  },
  toggleLiked(state, song: SongData) {
    var liked = !song.liked;

    var allSongsIndex = state.allSongs.findIndex(s => s.title === song.title);
    if (allSongsIndex >= 0) {
      state.allSongs[allSongsIndex].liked = liked;
    }

    var songsIndex = state.queue.findIndex(s => s.title === song.title);
    if (songsIndex >= 0) {
      state.queue[songsIndex].liked = liked;
    }
  },
  removeSong(state, song: SongData) {
    const allSongsIndex = state.queue.findIndex(s => s.title === song.title);
    if (allSongsIndex >= 0) {
      state.allSongs.splice(allSongsIndex, 1);
    }

    const songsIndex = state.queue.findIndex(s => s.title === song.title);
    if (songsIndex >= 0) {
      state.queue.splice(songsIndex, 1);
      if (songsIndex === state.queue.length) {
        state.index = 0;
      }
    }
  },
};

const actions: ActionTree<QueueState, RootState> = {
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

    commit('removeSong', song);
  },
  async toggleLiked({ commit }, song: SongData) {
    await window.db.update(
      Tables.Songs,
      { liked: song.liked ? 0 : 1 }, // invert liked
      'title LIKE ?',
      [song.title]
    );

    commit('toggleLike', song);
  },
};

export default {
  state,
  mutations,
  actions,
  namespaced: true,
};
