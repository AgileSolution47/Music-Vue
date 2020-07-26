<template>
  <div class="scroll-el" id="scroll-el">
    <div class="page">
      <h1 class="header">Download</h1>
      <loading-icon v-if="loading" />
      <p v-if="errored" class="error"><alert-circle-icon title="Error" />Error</p>
      <pre v-if="error !== null">{{ error }}</pre>
      <template v-if="!errored && !loading">
        <song-item
          v-for="(song, index) of results"
          :key="song.title + song.albumId"
          :song="song"
          @left-click="downloadSong(index)"
        >
          <img src="@/assets/download.png" alt="Download" class="download" />
        </song-item>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AlertCircleIcon from 'vue-material-design-icons/AlertCircle';

import SongItem from './shared/SongItem';
import LoadingIcon from './shared/LoadingIcon';

export default {
  name: 'search-page',
  computed: {
    ...mapState('searchResults', ['results', 'error']),
    loading() {
      return this.results !== null && this.results.length === 0;
    },
    errored() {
      return this.results === null || this.error !== null;
    },
  },
  methods: {
    downloadImage(index) {
      console.log('DOWNLOAD SONG', {
        index,
        song: this.results[index],
      });
    },
  },
  components: {
    AlertCircleIcon,
    SongItem,
    LoadingIcon,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.download {
  max-height: 1.5rem;
  margin-left: 0.6rem;
  margin-bottom: 0.2rem;
}

.error {
  @include flex-box(flex-start);

  color: #d02a2a;
  font-size: 1.3rem;
  margin-top: 30vh;

  .material-design-icon {
    margin-right: 0.5ch;
    display: inline-flex;
  }
}
</style>
