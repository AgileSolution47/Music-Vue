<template>
  <div class="scroll-el" id="scroll-el" key="artists">
    <div class="page">
      <context-menu
        :items="items"
        :posx="posx"
        :posy="posy"
        @reset="reset"
        @playArtist="playArtist"
      />
      <h1 class="header">Artists</h1>
      <ul class="artists">
        <cover-image
          v-for="(artist, index) in artists"
          :key="artist.name"
          :title="artist.name"
          :subtitle="subtitles[index]"
          :images="artist.images"
          @left-click="$router.push({ name: '\\artist-page', query: artist })"
          @right-click="openContextMenu($event, index)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import generateSubtitle from '@/helpers/generateSubtitle';

import CoverImage from './shared/CoverImage';
import ContextMenu from './shared/ContextMenu';

export default {
  name: 'artists-page',
  data: () => ({
    artists: [],
    posx: -200,
    posy: -200,
    items: [
      {
        icon: 'playlist-play-icon',
        title: 'Play',
        handler: 'playArtist',
      },
    ],
    index: -1,
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
  methods: {
    playArtist() {
      console.log('PLAY ARTIST', {
        index: this.index,
        artist: this.artists[this.index],
      });
      this.reset();
    },
    openContextMenu(event, index) {
      const scrollEl = document.getElementById('scroll-el');

      this.index = index;

      this.posx = event.pageX + scrollEl.scrollLeft - 50;
      this.posy = event.pageY + scrollEl.scrollTop;
    },
    reset() {
      this.posx = -200;
      this.posy = -200;
    },
    fetchData() {
      window.db.getArtists().then(artists => {
        this.artists = artists;
      });
    },
  },
  watch: {
    '$store.state.data._updater': function () {
      this.fetchData();
    },
  },
  beforeMount() {
    this.fetchData();
  },
  components: {
    CoverImage,
    ContextMenu,
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