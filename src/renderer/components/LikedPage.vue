<template>
  <song-page :songs="songs" :image="image" title="Liked" :subtext="subtext" />
</template>

<script>
import likedImage from '@/assets/liked.png';
import generateSubtitle from '@/helpers/generateSubtitle';

import SongPage from './shared/SongPage';

export default {
  name: 'album-page',
  data() {
    return {
      songs: [],
      image: likedImage,
    };
  },
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
    '$store.state.data._updater': function () {
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
