<template>
  <div class="scroll-el" id="scroll-el" key="album">
    <div class="page">
      <section class="left">
        <img :src="image" alt="Album Art" />
        <h3>{{ album.name }}</h3>
        <p v-if="!isCustom" class="subtext">{{ album.artist }}</p>

        <div class="button-bar">
          <button class="btn">Play All</button>
          <button class="btn">Play Random</button>
        </div>
      </section>
      <section class="right">
        <song-item
          v-for="(song, index) of songs"
          :key="song.title"
          :song="song"
          @right-click="openContextMenu($event, index)"
          @left-click="playSong(index)"
        >
          <dots-horizontal-icon title="Options" @click.stop="openContextMenu($event, index)" />
        </song-item>
      </section>
    </div>
  </div>
</template>

<script>
import DotsHorizontalIcon from 'vue-material-design-icons/DotsHorizontal';
import musicSymbol from '@/assets/music_symbol.png';

import SongItem from './shared/SongItem';

export default {
  name: 'album-page',
  data() {
    return {
      songs: [],
    };
  },
  props: {
    album: Object,
    isCustom: Boolean,
  },
  computed: {
    image() {
      return this.isCustom ? musicSymbol : this.album.imagePath;
    },
  },
  methods: {
    openContextMenu(event, index) {
      console.log({ event, index });
    },
    playSongs(index) {
      console.log({ index });
    },
  },
  beforeMount() {
    window.db.getSongs('albumId LIKE ?', [this.album.id]).then(songs => {
      this.songs = songs;
    });
  },
  components: {
    SongItem,
    DotsHorizontalIcon,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.page {
  @include flex-box(flex-end, flex-start);

  padding-top: 0;
  padding-bottom: 0;
}

.left {
  @include flex-box($direction: column);

  flex-basis: 400px;
  position: sticky;
  top: 50%;
  right: calc(95% - 400px - 1.5rem);
  transform: translateY(-50%);
  bottom: auto;

  img {
    width: 270px;
    height: 270px;
    border-radius: 10px;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    max-width: 400px;
    text-align: center;
  }

  .subtext {
    color: $subtext;
  }

  .button-bar {
    @include flex-box;

    margin-top: 1.5rem;
    width: 100%;

    button {
      width: 15ch;
      margin: 0.5ch;
    }
  }
}

.right {
  width: calc(95% - 400px - 1.5rem);
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>