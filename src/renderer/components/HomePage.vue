<template>
  <div class="scroll-el" id="scroll-el" key="home">
    <div class="page">
      <context-menu
        :items="items"
        :posx="posx"
        :posy="posy"
        @reset="reset"
        @playAlbum="playAlbum"
        @play="playSong"
        @addtoalbum="addToAlbum"
        @toggleLike="toggleLike"
        @delete="deleteSong"
      />
      <p v-if="topSongs === null" class="nothing">No Songs</p>
      <template v-else>
        <h1 class="header">Top Albums</h1>
        <transition-group tag="ul" name="cover-image" class="cover-images">
          <cover-image
            v-for="(album, index) in topAlbums"
            :key="album.id"
            :title="album.name"
            :subtitle="albumSubtitles[index]"
            :image="album.imagePath"
            @right-click="openContextMenu($event, index, false)"
            @left-click="$router.push({ name: 'album-page', query: album })"
          />
        </transition-group>
        <h1 class="header">Top Songs</h1>
        <transition-group tag="ul" name="cover-image" class="cover-images">
          <cover-image
            v-for="(song, index) in topSongs"
            :key="song.title"
            :title="song.title"
            :subtitle="songSubtitles[index]"
            :image="song.thumbnail"
            @right-click="openContextMenu($event, index, true)"
            @left-click="playSong(index)"
          />
        </transition-group>
      </template>
    </div>
  </div>
</template>

<script>
import generateSubtitle from '@/helpers/generateSubtitle';

import CoverImage from './shared/CoverImage';
import ContextMenu from './shared/ContextMenu';

export default {
  name: 'home-page',
  data: () => ({
    topSongs: [],
    topAlbums: [],
    posx: -200,
    posy: -200,
    songItems: [
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
    albumItems: [
      {
        icon: 'playlist-play-icon',
        title: 'Play',
        handler: 'playAlbum',
      },
    ],
    items: [],
    index: 0,
  }),
  computed: {
    songSubtitles() {
      return this.topSongs.map(s =>
        generateSubtitle({
          type: 'Song',
          artist: s.artist,
        })
      );
    },
    albumSubtitles() {
      return this.topAlbums.map(a =>
        generateSubtitle({
          type: 'Album',
          artist: a.artist,
        })
      );
    },
  },
  methods: {
    playAlbum() {
      console.log('PLAY ALBUM', {
        index: this.index,
        album: this.topAlbums[this.index],
      });
      this.reset();
    },
    playSong() {
      console.log('PLAY', {
        index: this.index,
        song: this.topSongs[this.index],
      });
      this.reset();
    },
    addToAlbum() {
      console.log('ADD', {
        index: this.index,
        song: this.topSongs[this.index],
      });
      this.reset();
    },
    toggleLike() {
      console.log({
        index: this.index,
        liked: this.topSongs[this.index].liked,
      });
      this.reset();
    },
    deleteSong() {
      console.log('DELETE', {
        index: this.index,
        song: this.topSongs[this.index],
      });
      this.reset();
    },
    openContextMenu(event, index, isSong) {
      if (isSong) {
        const { liked } = this.topSongs[index];

        this.songItems[2].title = liked ? 'Unlike' : 'Like';
        this.songItems[2].icon = liked ? 'heart-icon' : 'heart-outline-icon';

        this.items = this.songItems;
      } else {
        this.items = this.albumItems;
      }

      this.index = index;

      const scrollEl = document.getElementById('scroll-el');

      this.posx = event.pageX + scrollEl.scrollLeft - 50;
      this.posy = event.pageY + scrollEl.scrollTop;
    },
    reset() {
      this.posx = -200;
      this.posy = -200;
    },
  },
  beforeMount() {
    window.db.getTop().then(({ songs, albums }) => {
      this.topSongs = songs.length ? songs : null;
      this.topAlbums = albums.length ? albums : null;
    });
  },
  components: {
    CoverImage,
    ContextMenu,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.cover-images {
  @include flex-box(space-between);

  flex-wrap: wrap;
  margin-top: 1rem;
  margin-bottom: 2.5rem;
  min-height: 14rem;

  .cover-image {
    &-move {
      transition: 1s;
    }

    margin-right: 1rem;
    transition: 1s;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
