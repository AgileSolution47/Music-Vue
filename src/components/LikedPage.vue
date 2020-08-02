<template>
  <song-page :songs="songs" :image="image" title="Liked" :subtext="subtext" />
</template>

<script>
import generateSubtitle from '@/helpers/generateSubtitle';
import likedImage from '@/assets/liked.png';

import SongPage from './shared/SongPage.vue';

export default {
  name: 'album-page',
  data: () => ({
    songs: [],
    image: likedImage,
  }),
  computed: {
    subtext() {
      return generateSubtitle({
        type: 'Liked',
        numSongs: this.songs.length,
      });
    },
  },
  methods: {
    fetchData() {
      window.db.getSongs('liked').then(songs => {
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
