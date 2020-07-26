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
  beforeMount() {
    window.db.getSongs('liked').then(songs => {
      console.log({ songs });
      this.songs = songs;
    });
  },
  components: {
    SongPage,
  },
};
</script>
