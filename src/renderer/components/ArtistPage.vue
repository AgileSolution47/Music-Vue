<template>
  <div class="scroll-el" id="scroll-el" key="artist">
    <div class="page">
      <section class="artist-details">
        <mozaic-image :images="artist.images" :title="artist.name" />
        <h3>{{ artist.name }}</h3>
        <p class="subtext">{{ subtext }}</p>

        <div class="button-bar">
          <button class="btn">Play All</button>
          <button class="btn">Play Random</button>
        </div>
      </section>
      <section class="songs">
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

import generateSubtitle from '@/helpers/generateSubtitle';

import MozaicImage from './shared/MozaicImage';
import SongItem from './shared/SongItem';

export default {
  name: 'artist-page',
  data() {
    return {
      songs: [],
    };
  },
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
    openContextMenu(event, index) {
      console.log({ event, index });
    },
    playSongs(index) {
      console.log({ index });
    },
  },
  beforeMount() {
    window.db.getSongs('artist LIKE ?', [this.artist.name]).then(songs => {
      this.songs = songs;
    });
  },
  components: {
    DotsHorizontalIcon,
    MozaicImage,
    SongItem,
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

.artist-details {
  @include flex-box($direction: column);

  flex-basis: 400px;
  position: sticky;
  top: 50%;
  right: calc(95% - 400px - 1.5rem);
  transform: translateY(-50%);
  bottom: auto;

  .mozaic {
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

.songs {
  width: calc(95% - 400px - 1.5rem);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

@media screen and (max-width: 1000px) {
  .page {
    flex-direction: column;

    .artist-details {
      position: static;
      transform: translateY(0);
      width: 100%;
    }

    .songs {
      width: 100%;
    }
  }
}
</style>