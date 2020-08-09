<!-- eslint-disable max-len   For the svg paths -->
<template>
  <transition name="player-bar">
    <div v-if="playingSongs" class="player-bar-wrapper">
      <div class="player-bar">
        <div>
          <img :title="current.title" :src="current.thumbnail" :alt="current.title" class="album" />
          <div class="text">
            <p class="song">{{ current.title }}</p>
            <p class="artist">{{ current.artist }}</p>
          </div>
        </div>
        <div>
          <button class="prev" title="Previous" @click="prevSong()" :disabled="queue.length <= 1">
            <rewind-icon :size="24" />
          </button>
          <button class="play-pause" :title="playPauseTitle" @click="togglePlay">
            <play-pause :playing="playing" />
          </button>
          <button class="next" title="Next" @click="nextSong()" :disabled="queue.length <= 1">
            <fast-forward-icon :size="24" />
          </button>
        </div>
        <div class="end">
          <button :title="current.liked ? 'Unlike' : 'Like'" @click="toggleLiked(current)">
            <heart-icon v-if="current.liked" :size="24" fillColor="#ab1313" />
            <heart-outline-icon v-else :size="24" />
          </button>
          <button title="Loop" @click="toggleLoop">
            <svg viewBox="0 0 21.166666 21.166666" :class="['svg', { selected: loop }]">
              <g transform="translate(-137.94318,-128.66028)">
                <path
                  d="m 144.90315,146.32779 c -0.49549,-0.49549 -0.37869,-1.04488 0.39346,-1.85084 l 0.71096,-0.74208 h -1.5973 c -1.34241,0 -1.76622,-0.12236 -2.65582,-0.76678 -3.25769,-2.35986 -2.15888,-7.89437 1.73208,-8.72423 1.53551,-0.32749 2.22188,-0.0129 2.10717,0.96586 -0.0679,0.57896 -0.28743,0.7579 -1.27263,1.03714 -2.33019,0.66046 -3.14139,2.83987 -1.69627,4.5573 0.5815,0.69107 0.86826,0.81405 1.8982,0.81405 h 1.21323 l -0.59708,-0.63557 c -0.81158,-0.86388 -0.66512,-1.84981 0.29117,-1.96023 0.57456,-0.0663 1.08642,0.27611 2.64583,1.77014 l 1.93346,1.85239 -1.97775,2.00018 c -1.96754,1.98984 -2.52287,2.2885 -3.12871,1.68267 z m 6.3954,-3.29554 c -0.20453,-0.81492 0.40043,-1.41404 1.42782,-1.41404 0.34718,0 0.97927,-0.34803 1.40464,-0.7734 1.38978,-1.38978 0.90792,-3.87832 -0.87105,-4.49847 -0.97537,-0.34002 -2.05972,-0.37203 -2.05972,-0.0608 0,0.12297 0.24376,0.44418 0.54169,0.7138 0.74733,0.67633 0.60194,1.80999 -0.24754,1.93009 -0.48936,0.0692 -1.07126,-0.3471 -2.57989,-1.84566 l -1.948,-1.935 1.91843,-1.93433 c 1.5039,-1.51637 2.06136,-1.91795 2.57989,-1.85851 0.90537,0.10379 1.02955,1.11364 0.24026,1.9538 l -0.59708,0.63557 0.77372,0.001 c 2.07024,0.004 4.10247,1.20409 4.77845,2.82194 0.46869,1.12174 0.46221,3.35893 -0.0124,4.26733 -0.42494,0.81341 -1.59926,1.96299 -2.45362,2.40193 -0.31785,0.16329 -1.05972,0.2969 -1.6486,0.2969 -0.93814,0 -1.09252,-0.087 -1.24704,-0.70262 z"
                  style="stroke-width: 0.264583;"
                />
              </g>
            </svg>
          </button>
          <button title="Shuffle" @click="toggleShuffle">
            <svg viewBox="0 0 21.166666 21.166666" :class="['svg', { selected: shuffle }]">
              <g transform="translate(-137.94318,-128.66028)">
                <path
                  d="m 152.65577,147.13414 c -0.21694,-0.40535 -0.13741,-0.67106 0.38757,-1.29497 0.36328,-0.43173 0.66051,-0.85707 0.66051,-0.94521 0,-0.0881 -0.72221,-0.16024 -1.6049,-0.16024 -1.67157,0 -2.36244,-0.23274 -3.34456,-1.12673 -0.55602,-0.50612 -0.56387,-0.57073 -0.16479,-1.356 0.23047,-0.45351 0.44893,-0.85967 0.48546,-0.90258 0.0365,-0.0429 0.42895,0.28451 0.87204,0.7276 0.71101,0.71101 0.98434,0.80563 2.32731,0.80563 h 1.52168 l -0.57529,-0.61237 c -0.31641,-0.3368 -0.57529,-0.84877 -0.57529,-1.13771 0,-0.54785 0.4618,-1.16034 0.87487,-1.16034 0.13192,0 1.12361,0.85692 2.20374,1.90426 l 1.96387,1.90426 -1.91931,1.9322 c -1.98255,1.99587 -2.64413,2.29813 -3.11291,1.4222 z m -11.93491,-2.81947 c -0.66806,-0.80496 0.0237,-1.29261 1.9558,-1.37878 1.52977,-0.0682 1.84763,-0.17582 2.52721,-0.8554 0.42755,-0.42755 1.10401,-1.63219 1.50325,-2.67699 1.23947,-3.24365 3.33777,-4.97064 6.05404,-4.98272 l 1.30627,-0.006 -0.7331,-0.7652 c -0.47521,-0.496 -0.70205,-0.98371 -0.64482,-1.38635 0.17146,-1.20628 0.99,-0.90209 3.03274,1.12702 l 1.95075,1.93772 -1.91181,1.92466 c -1.97939,1.99269 -2.63676,2.29034 -3.10909,1.40779 -0.22627,-0.42278 -0.12666,-0.68765 0.54727,-1.45521 l 0.82388,-0.93835 h -1.09888 c -2.06873,0 -3.62935,1.34505 -4.40103,3.79312 -0.55404,1.75761 -1.5918,3.30068 -2.74034,4.07468 -0.71959,0.48493 -1.25258,0.59887 -2.80151,0.59887 -1.42253,0 -2.002,-0.10742 -2.26063,-0.41905 z m 5.35097,-7.5846 c -0.19225,-0.19295 -1.33265,-0.38584 -2.73748,-0.46302 -1.86058,-0.10222 -2.47085,-0.2325 -2.68462,-0.57313 -0.20014,-0.31892 -0.18047,-0.55675 0.0711,-0.8599 0.55333,-0.66672 4.89476,-0.58963 6.03767,0.10722 0.99217,0.60493 1.01791,0.71843 0.34567,1.52425 -0.57891,0.69394 -0.59937,0.69918 -1.03237,0.26458 z"
                  style="stroke-width: 0.264583;"
                />
              </g>
            </svg>
          </button>
          <button title="Add to Album" @click="addToAlbum">
            <playlist-plus-icon title="Add to Playlist" :size="24" />
          </button>
          <p class="timestamp" :style="{ width: `${timestamp.length - 2.5}ch` }">{{ timestamp }}</p>
        </div>
      </div>
      <button class="close" @click="dequeue">
        ×
      </button>
      <audio
        ref="audio"
        @ended="nextSong"
        :loop="loop"
        @timeupdate="currentTime = Math.round($event.target.currentTime)"
        @error="logError"
        :autoplay="playing"
        :src="`file://${current.filePath}`"
      ></audio>
      <input
        type="range"
        name="timeline"
        class="timeline"
        :value="currentTime"
        :min="0"
        :max="current.length"
        @input="$refs.audio.currentTime = $event.target.valueAsNumber"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import FastForwardIcon from 'vue-material-design-icons/FastForward.vue';
import RewindIcon from 'vue-material-design-icons/Rewind.vue';
import PlaylistPlusIcon from 'vue-material-design-icons/PlaylistPlus.vue';
import HeartIcon from 'vue-material-design-icons/Heart.vue';
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue';

import formatLength from '@/helpers/formatLength';

import PlayPause from './shared/PlayPause.vue';

interface CData {
  playing: boolean;
  currentTime: number;
}

interface CMethods {
  toggleLiked: (song: SongData) => void;
  togglePlay: () => void;
  prevSong: () => void;
  nextSong: () => void;
  dequeue: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  addToAlbum: () => void;
  logError: (error: any) => void;
}

interface CComputed {
  queue: SongData[];
  index: number;
  loop: boolean;
  shuffle: boolean;
  current: SongData;
  playingSongs: boolean;
  playPauseTitle: string;
  timestamp: string;
}

export default Vue.extend<CData, {}, CComputed>({
  name: 'player-bar',
  data: () => ({
    playing: false,
    currentTime: 0,
  }),
  methods: {
    ...mapMutations('queue', ['prevSong', 'nextSong', 'dequeue', 'toggleShuffle', 'toggleLoop']),
    ...mapActions(['toggleLiked']),
    addToAlbum() {
      console.log('ADD TO ALBUM', {
        song: this.current,
      });
    },
    logError(error: any) {
      console.error(error);
    },
    togglePlay() {
      this.playing = !this.playing;
      if (this.playing) {
        (this.$refs.audio as HTMLAudioElement).play();
      } else {
        (this.$refs.audio as HTMLAudioElement).pause();
      }
    },
  },
  computed: {
    ...mapState('queue', ['queue', 'index', 'loop', 'shuffle']),
    current() {
      return this.queue[this.index];
    },
    playingSongs() {
      return this.queue.length > 0;
    },
    playPauseTitle() {
      return this.playing ? 'Pause' : 'Play';
    },
    timestamp() {
      return formatLength(this.currentTime, this.current.length).join(' / ');
    },
  },
  components: {
    PlayPause,
    FastForwardIcon,
    RewindIcon,
    PlaylistPlusIcon,
    HeartIcon,
    HeartOutlineIcon,
  },
});
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.player-bar-wrapper {
  width: 70vw;
  height: 4.8rem;
  border-radius: 0.75rem;
  background: transparentize($color: $secondary, $amount: 0.35);
  backdrop-filter: blur(25px);
  position: fixed;
  bottom: 0.5rem;
  left: 15vw;
  z-index: 2;
  box-shadow: 0 0 20px 7px #00000059;
  overflow: hidden;
}

.player-bar {
  @include flex-box(space-between);

  padding: 0.5rem 1.3rem;
  height: 4.5rem;
  width: 70vw;
  border-radius: 0.75rem;

  * {
    user-select: none;
  }

  > div {
    @include flex-box;

    flex: 1;

    &:nth-of-type(1) {
      justify-content: flex-start;
    }
    &:nth-of-type(3) {
      justify-content: flex-end;
    }
  }

  &-enter-active,
  &-leave-active {
    transition: 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  &-enter,
  &-leave-to {
    transform: translateY(5rem);
  }
}

.close {
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
  position: absolute;
  top: 0.3ch;
  right: 0.7ch;
  font-size: 1.4rem;

  &:hover {
    opacity: 1;
  }
}

.album {
  height: 2.6rem;
  border-radius: 0.3rem;
}

.text {
  padding: 0 1ch;

  .artist {
    color: $subtext;
    font-size: 0.8rem;
  }
}

button:disabled {
  opacity: 0.6;
}

.play-pause {
  height: 18px;
  margin: 0 1ch;

  svg {
    height: 18px;
  }
}

.end {
  button {
    margin-right: 1ch;
    height: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.timestamp {
  text-align: end;
}

.material-design-icon__svg {
  transition: 0.3s;
}

.svg {
  height: 24px;

  path {
    fill: currentColor;
  }

  &.selected {
    path {
      fill: $accent;
    }
  }
}

.timeline {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  -webkit-appearance: none;
  height: 0.3rem;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    height: 0.3rem;
    -webkit-appearance: none;
    color: $accent;
    margin-top: -1px;
  }

  &::-webkit-slider-thumb {
    width: 0px;
    -webkit-appearance: none;
    height: 0.3rem;
    cursor: ew-resize;
    background: transparent;
    box-shadow: -100vh 0 0 100vh $accent;
  }
}
</style>
