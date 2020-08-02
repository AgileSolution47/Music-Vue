<template>
  <div class="scroll-el" id="scroll-el" key="albums">
    <div class="page">
      <context-menu
        :items="items"
        :posx="posx"
        :posy="posy"
        @reset="reset"
        @playAlbum="playAlbum"
        @playCustomAlbum="playCustomAlbum"
        @deleteCustomAlbum="deleteCustomAlbum"
      />
      <h1 class="header">Custom Albums</h1>
      <ul class="albums">
        <cover-image
          title="Liked"
          :subtitle="likedSubtitle"
          :image="likedImage"
          @left-click="$router.push({ name: '\\liked-page' })"
          @right-click="openContextMenu($event, -1, false)"
        />
        <cover-image
          v-for="(album, index) in customAlbums"
          :key="album.id"
          :title="album.name"
          :subtitle="customAlbumSubtitles[index]"
          :image="musicSymbol"
          @left-click="$router.push({ name: '\\album-page', query: album })"
          @right-click="openContextMenu($event, index, true)"
        />
        <button class="plus" title="Add Custom Album">
          <plus-icon />
        </button>
      </ul>
      <h1 class="header">Albums</h1>
      <ul class="albums">
        <cover-image
          v-for="(album, index) in albums"
          :key="album.id"
          :title="album.name"
          :subtitle="albumSubtitles[index]"
          :image="album.imagePath"
          @left-click="$router.push({ name: '\\album-page', query: album })"
          @right-click="openContextMenu($event, index, false)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import PlusIcon from 'vue-material-design-icons/Plus.vue';

import generateSubtitle from '@/helpers/generateSubtitle';
import musicSymbol from '@/assets/music_symbol.png';
import likedImage from '@/assets/liked.png';

import CoverImage from './shared/CoverImage.vue';
import ContextMenu from './shared/ContextMenu.vue';

export default {
  name: 'albums-page',
  data: () => ({
    musicSymbol,
    likedImage,
    likedSubtitle: '',
    albums: [],
    customAlbums: [],
    posx: -200,
    posy: -200,
    albumItems: [
      {
        icon: 'playlist-play-icon',
        title: 'Play',
        handler: 'playAlbum',
      },
    ],
    customAlbumItems: [
      {
        icon: 'playlist-play-icon',
        title: 'Play',
        handler: 'playCustomAlbum',
      },
      {
        icon: 'delete-icon',
        title: 'Delete',
        colour: 'red',
        handler: 'deleteCustomAlbum',
      },
    ],
    items: [],
    index: -1,
  }),
  computed: {
    customAlbumSubtitles() {
      return this.customAlbums.map(a =>
        generateSubtitle({
          type: 'Album',
          numSongs: a.songs.length,
        })
      );
    },
    albumSubtitles() {
      return this.albums.map(a =>
        generateSubtitle({
          type: 'Album',
          numSongs: a.numSongs,
        })
      );
    },
  },
  methods: {
    playAlbum() {
      if (this.index === -1) {
        console.log('PLAY LIKED: ', this.likedSubtitle);
      } else {
        console.log('PLAY ALBUM', {
          index: this.index,
          album: this.albums[this.index],
        });
      }
      this.reset();
    },
    playCustomAlbum() {
      console.log('PLAY CUSTOM ALBUM', {
        index: this.index,
        album: this.customAlbums[this.index],
      });
      this.reset();
    },
    deleteCustomAlbum() {
      console.log('DELETE CUSTOM ALBUM', {
        index: this.index,
        album: this.customAlbums[this.index],
      });
      this.reset();
    },
    openContextMenu(event, index, deletable) {
      const scrollEl = document.getElementById('scroll-el');

      if (deletable) {
        this.items = this.customAlbumItems;
      } else {
        this.items = this.albumItems;
      }

      this.index = index;

      if (scrollEl) {
        this.posx = event.pageX + scrollEl.scrollLeft - 50;
        this.posy = event.pageY + scrollEl.scrollTop;
      }
    },
    reset() {
      this.posx = -200;
      this.posy = -200;
    },
    fetchData() {
      window.db.getNumLiked().then(numLiked => {
        this.likedSubtitle = generateSubtitle({ type: 'Album', numSongs: numLiked });
      });
      window.db.getAlbums().then(albums => {
        this.albums = albums;
      });
      window.db.getCustomAlbums().then(albums => {
        this.customAlbums = albums;
      });
    },
  },
  watch: {
    '$store.state.data.updater': function() {
      this.fetchData();
    },
  },
  beforeMount() {
    this.fetchData();
  },
  components: {
    PlusIcon,
    CoverImage,
    ContextMenu,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.albums {
  display: inline-grid;
  grid-template-columns: repeat(auto-fill, 10rem);
  gap: 1.1rem;
  width: 100%;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.plus {
  @include flex-box;

  width: 10rem;
  height: 10rem;
  background: $primary;
  margin-top: (13.3rem - (1.8rem + 10rem))/4;
  border-radius: 5%;
  cursor: pointer;
  transition: 0.2s;

  svg {
    height: 3rem;
    width: 3rem;
  }

  &:hover {
    background: lighten($primary, 10%);
  }
}
</style>
