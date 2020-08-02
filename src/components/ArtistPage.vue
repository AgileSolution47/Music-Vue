<template>
  <song-page :songs="songs" :images="artist.images" :title="artist.name" :subtext="subtext" />
</template>

<script>
import generateSubtitle from '@/helpers/generateSubtitle';

import SongPage from './shared/SongPage.vue';

export default {
  name: 'artist-page',
  data: () => ({
    songs: [],
  }),
  props: {
    artist: Object,
  },
  computed: {
    subtext() {
      return generateSubtitle({
        type: 'Artist',
        numSongs: this.songs.length,
      });
    },
  },
  methods: {
    fetchData() {
      window.db.getSongs('artist LIKE ?', [this.artist.name]).then(songs => {
        this.songs = songs;
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
    SongPage,
  },
};
</script>
