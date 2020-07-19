<template>
  <div class="page" key="music">
    <context-menu
      :items="items"
      :posx="posx"
      :posy="posy"
      @reset="reset"
      @play="playSong"
      @addtoalbum="addToAlbum"
      @toggleLike="toggleLike"
      @delete="deleteSong"
    />
    <header>
      <h1 class="header">My Music</h1>
      <search-bar v-if="allSongs !== null" placeholder="Filter" @search="searchQuery = $event" />
    </header>
    <div class="button-bar">
      <button class="btn">Play All</button>
      <button class="btn">Play Random</button>
    </div>
    <p v-if="songs === null || songs.length === 0" class="nothing">No Songs</p>
    <template v-else>
      <song-item
        v-for="(song, index) of songs"
        :key="song.title"
        :song="song"
        @right-click="openContextMenu($event, index)"
        @left-click="playSong(index)"
      >
        <dots-horizontal-icon title="Options" @click.stop="openContextMenu($event, index)" />
      </song-item>
    </template>
  </div>
</template>

<script>
import DotsHorizontalIcon from 'vue-material-design-icons/DotsHorizontal';
import SongItem from './shared/SongItem';
import SearchBar from './shared/SearchBar';
import ContextMenu from './shared/ContextMenu';

// TODO implement functionality

export default {
  name: 'music-page',
  data: () => ({
    allSongs: [],
    searchQuery: '',
    items: [
      {
        icon: 'play-icon',
        title: 'Play',
        handler: 'play',
      },
      {
        icon: 'playlist-plus-icon',
        title: 'Add to Album',
        handler: 'addtoalbum',
      },
      {
        icon: 'heart-icon',
        title: 'Unlike',
        handler: 'toggleLike',
      },
      {
        icon: 'delete-icon',
        title: 'Delete',
        colour: 'red',
        handler: 'delete',
      },
    ],
    posx: -200,
    posy: -200,
  }),
  methods: {
    playSong(index) {
      console.log('PLAY', {
        index,
        song: this.songs[index],
      });
      this.reset();
    },
    addToAlbum(index) {
      console.log('ADD', {
        index,
        song: this.songs[index],
      });
      this.reset();
    },
    toggleLike(index) {
      console.log({
        index,
        liked: this.songs[index].liked,
      });
      this.reset();
    },
    deleteSong(index) {
      console.log('DELETE', {
        index,
        song: this.songs[index],
      });
      this.reset();
    },
    openContextMenu(event, index) {
      const { liked } = this.songs[index];

      this.items[2].title = liked ? 'Unlike' : 'Like';
      this.items[2].icon = liked ? 'heart-icon' : 'heart-outline-icon';

      const scrollEl = document.getElementById('scroll-el');

      this.posx = event.pageX + scrollEl.scrollLeft - 50;
      this.posy = event.pageY + scrollEl.scrollTop;

      console.log(this.posx, this.posy);
    },
    reset() {
      this.posx = -200;
      this.posy = -200;
    },
  },
  beforeMount() {
    window.db.getSongs().then(songs => {
      this.allSongs = songs.length ? songs : null;
    });
  },
  computed: {
    songs() {
      return this.allSongs.filter(s => {
        const hay = s.title.toLowerCase();
        let i = 0;
        let n = -1;
        let l;
        const query = this.searchQuery.toLowerCase();
        // eslint-disable-next-line
        for (; (l = query[i++]); ) {
          n = hay.indexOf(l, n + 1);
          if (n < 0) return false;
        }
        return true;
      });
    },
  },
  components: {
    DotsHorizontalIcon,
    SongItem,
    SearchBar,
    ContextMenu,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

header {
  @include flex-box(space-between);
  margin-bottom: 0.5rem;
}

.button-bar {
  @include flex-box(flex-start);

  margin-bottom: 2rem;
}

.btn {
  margin-right: 0.8rem;
}
</style>
