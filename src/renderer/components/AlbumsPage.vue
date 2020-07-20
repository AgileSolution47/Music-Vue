<template>
  <div class="page" key="albums">
    <h1 class="header">Custom Albums</h1>
    <ul class="albums">
      <cover-image title="Liked" :subtitle="likedSubtitle" :image="likedImage" />
      <cover-image
        v-for="(album, index) in customAlbums"
        :key="album.id"
        :title="album.name"
        :subtitle="customAlbumSubtitles[index]"
        :image="musicSymbol"
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
      />
    </ul>
  </div>
</template>

<script>
import PlusIcon from 'vue-material-design-icons/Plus';

import generateSubtitle from '@/helpers/generateSubtitle';
import musicSymbol from '@/assets/music_symbol.png';
import likedImage from '@/assets/liked.png';

import CoverImage from './shared/CoverImage';

export default {
  name: 'albums-page',
  data: () => ({
    musicSymbol,
    likedImage,
    likedSubtitle: '',
    albums: [],
    customAlbums: [],
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
  beforeMount() {
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
  components: {
    PlusIcon,
    CoverImage,
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