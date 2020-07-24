<template>
  <div class="scroll-el" id="scroll-el" key="artists">
    <div class="page">
      <h1 class="header">Artists</h1>
      <ul class="artists">
        <cover-image
          v-for="(artist, index) in artists"
          :key="artist.name"
          :title="artist.name"
          :subtitle="subtitles[index]"
          :images="artist.images"
          @click="$router.push({ name: 'artist-page', query: artist })"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import generateSubtitle from '@/helpers/generateSubtitle';

import CoverImage from './shared/CoverImage';

export default {
  name: 'artists-page',
  data: () => ({
    artists: [],
  }),
  computed: {
    subtitles() {
      return this.artists.map(a =>
        generateSubtitle({
          type: 'Artist',
          numSongs: a.numSongs,
        })
      );
    },
  },
  beforeMount() {
    window.db.getArtists().then(artists => {
      this.artists = artists;
    });
  },
  components: {
    CoverImage,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.artists {
  display: inline-grid;
  grid-template-columns: repeat(auto-fill, 10rem);
  gap: 1.1rem;
  width: 100%;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}
</style>