<template>
  <song-page :songs="songs" :image="image" :title="album.name" :subtext="subtext" />
</template>

<script lang="ts">
import Vue from 'vue';

import musicSymbol from '@/assets/music_symbol.png';
import generateSubtitle from '@/helpers/generateSubtitle';

import SongPage from './shared/SongPage.vue';

interface CData {
  songs: SongData[];
}

interface CMethods {
  fetchData: () => void;
}

interface CComputed {
  image: string;
  subtext: string | null;
}

interface CProps {
  album: AlbumData;
  isCustom: boolean;
}

export default Vue.extend<CData, CMethods, CComputed, CProps>({
  name: 'album-page',
  data: () => ({
    songs: [],
  }),
  props: {
    album: Object,
    isCustom: Boolean,
  },
  computed: {
    image() {
      return this.isCustom ? musicSymbol : this.album.imagePath;
    },
    subtext() {
      if (this.isCustom) return null;
      return generateSubtitle({
        type: 'Album',
        artist: this.album.artist,
      });
    },
  },
  methods: {
    fetchData() {
      window.db.getSongs('albumId LIKE ?', [this.album.id]).then(songs => {
        this.songs = songs;
      });
    },
  },
  watch: {
    '$store.state.data.updater': function () {
      this.fetchData();
    },
  },
  beforeMount() {
    this.fetchData();
  },
  components: {
    SongPage,
  },
});
</script>
