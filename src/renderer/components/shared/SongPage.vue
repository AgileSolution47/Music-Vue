<template>
  <div class="scroll-el" id="scroll-el" key="album">
    <div class="page">
      <context-menu
        :items="items"
        :posx="posx"
        :posy="posy"
        @reset="reset"
        @play="playSong"
        @addtoalbum="addToAlbum"
        @toggleLike="toggleLike"
        @delete="deleteSong"
      />
      <section class="details">
        <mozaic-image :images="mozaicImages" :title="title" />
        <h3>{{ title }}</h3>
        <p v-if="subtext !== null" class="subtext">{{ subtext }}</p>
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
          @left-click="playSongIndex(index)"
        >
          <dots-horizontal-icon title="Options" @click.stop="openContextMenu($event, index)" />
        </song-item>
      </section>
    </div>
  </div>
</template>

<script>
import DotsHorizontalIcon from 'vue-material-design-icons/DotsHorizontal';

import SongItem from './SongItem';
import MozaicImage from './MozaicImage';
import ContextMenu from './ContextMenu';

export default {
  name: 'album-page',
  data() {
    return {
      items: [
        {
          icon: 'play-icon',
          title: 'Play',
          handler: 'play',
        },
        {
          icon: 'playlist-plus-icon',
          title: 'Add to Album',
          handler: 'addtoalbum',
        },
        {
          icon: 'heart-icon',
          title: 'Unlike',
          handler: 'toggleLike',
        },
        {
          icon: 'delete-icon',
          title: 'Delete',
          colour: 'red',
          handler: 'delete',
        },
      ],
      posx: -200,
      posy: -200,
      index: -1,
    };
  },
  props: {
    subtext: { type: String, default: null },
    title: { type: String, required: true },
    songs: { type: Array, required: true },
    image: { type: String },
    images: { type: Array },
  },
  computed: {
    mozaicImages() {
      return this.images || [this.image];
    },
  },
  methods: {
    playSongIndex(index) {
      console.log('PLAY', {
        index,
        song: this.songs[index],
      });
    },
    playSong() {
      this.playSongIndex(this.index);
      this.reset();
    },
    addToAlbum() {
      console.log('ADD', {
        index: this.index,
        song: this.songs[this.index],
      });
      this.reset();
    },
    toggleLike() {
      console.log({
        index: this.index,
        liked: this.songs[this.index].liked,
      });
      this.reset();
    },
    deleteSong() {
      console.log('DELETE', {
        index: this.index,
        song: this.songs[this.index],
      });
      this.reset();
    },
    openContextMenu(event, index) {
      const { liked } = this.songs[index];

      this.index = index;

      this.items[2].title = liked ? 'Unlike' : 'Like';
      this.items[2].icon = liked ? 'heart-icon' : 'heart-outline-icon';

      const scrollEl = document.getElementById('scroll-el');

      this.posx = event.pageX + scrollEl.scrollLeft - 50;
      this.posy = event.pageY + scrollEl.scrollTop;
    },
    reset() {
      this.posx = -200;
      this.posy = -200;
    },
  },
  components: {
    SongItem,
    DotsHorizontalIcon,
    MozaicImage,
    ContextMenu,
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

.details {
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

    .details {
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