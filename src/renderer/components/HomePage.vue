<template>
  <div class="page" key="home">
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
        />
      </transition-group>
    </template>
  </div>
</template>

<script>
import generateSubtitle from '@/helpers/generateSubtitle';

import CoverImage from './shared/CoverImage';

export default {
  name: 'home-page',
  data: () => ({
    topSongs: [],
    topAlbums: [],
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
          numSongs: a.numSongs,
        })
      );
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
  height: 14rem;

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
