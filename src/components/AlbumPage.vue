<template>
  <song-page
    :songs="songs"
    :image="image"
    :title="album.name"
    :subtext="subtext"
    @edit="editAlbum"
    @delete="deleteAlbum"
  />
</template>

<script lang="ts">
import Vue from 'vue';

import musicSymbol from '@/assets/music_symbol.png';
import generateSubtitle from '@/helpers/generateSubtitle';
import { stringifyArr } from '@/helpers/database_functions';

import SongPage from './shared/SongPage.vue';

interface CData {
  songs: SongData[];
}

interface CMethods {
  fetchData: () => void;
  editAlbum: () => void;
  deleteAlbum: () => void;
}

interface CComputed {
  image: string;
  subtext: string | null;
}

interface CADProps {
  isCustom: true;
  album: CustomAlbumData;
}

interface ADProps {
  isCustom: false;
  album: AlbumData;
}

export default Vue.extend<CData, CMethods, CComputed, CADProps | ADProps>({
  name: 'album-page',
  data: () => ({
    songs: [],
  }),
  props: {
    album: Object,
    isCustom: Boolean as any, // TS doesnt like Boolean being converted to true | false
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
      if (this.isCustom) {
        window.db.getSongs(`title IN (${stringifyArr(this.album.songs)})`).then(songs => {
          this.songs = songs;
        });
      } else {
        window.db.getSongs('albumId LIKE ?', [this.album.id]).then(songs => {
          this.songs = songs;
        });
      }
    },
    editAlbum() {
      if (!this.isCustom) throw new Error('Only allowed for custom albums');
      console.log('EDIT ALBUM');
    },
    async deleteAlbum() {
      if (!this.isCustom) throw new Error('Only allowed for custom albums');
      // await this.$store.dispatch('deleteCustomAlbum', this.album.id);
      this.$router.back();
    },
  },
  watch: {
    '$store.state.updater': function () {
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
