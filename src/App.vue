<template>
  <div id="app">
    <main>
      <side-bar />
      <header v-if="apiKeysValid" :style="{ opacity: headerOpacity }">
        <div></div>
        <div :style="{ opacity: titleOpacity }">
          <h3>{{ pageTitle }}</h3>
        </div>
        <div>
          <search-bar placeholder="Download" @search="handleSearch" />
        </div>
      </header>
      <div>
        <transition :name="transitionName">
          <router-view></router-view>
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';

import SideBar from './components/SideBar.vue';
import SearchBar from './components/shared/SearchBar.vue';

const paths = {
  '/': [0, 0, 0],
  '/home': [0, 1, 0],
  '/music': [0, 2, 0],
  '/albums/album': [0, 3, 1],
  '/albums/liked': [0, 3, 1],
  '/albums': [0, 3, 0],
  '/artists/artist': [0, 4, 1],
  '/artists': [0, 4, 0],
  '/settings': [0, 5, 0],
  '/search': [1, 0, 0],
  '/register-keys': [2, 0, 0],
};

export default {
  name: 'Music',
  data: () => ({
    transitionName: '',
    titleOpacity: 0,
    headerOpacity: 1,
  }),
  mounted() {
    this.$store.dispatch('settings/load');
    window.store = this.$store;
    document.getElementById('scroll-el').addEventListener('scroll', this.onScroll);
    if (!this.apiKeysValid && this.$route.path !== '/register-keys') {
      this.$router.push('/register-keys');
    }
  },
  methods: {
    onScroll(event) {
      const opacity = event.target.scrollTop > 80 ? 1 : 0;
      if (opacity !== this.titleOpacity) this.titleOpacity = opacity;
    },
    getTransitionName(to, from) {
      let transitionName = 'page-transition';

      const [xto, yto, zto] = paths[to.path];
      const [xfrom, yfrom, zfrom] = paths[from.path];

      if (xto > xfrom) {
        transitionName += '-right';
      } else if (xto < xfrom) {
        transitionName += '-left';
      } else if (yto > yfrom) {
        transitionName += '-bottom';
      } else if (yto < yfrom) {
        transitionName += '-top';
      } else if (zto > zfrom) {
        transitionName += '-above';
      } else if (zto < zfrom) {
        transitionName += '-below';
      }

      return transitionName;
    },
    search: debounce(function(query) {
      this.$store.dispatch('searchResults/search', query);
    }, 700),
    handleSearch(query) {
      if (this.$route.name !== 'Download') this.$router.push('/search');
      this.search(query);
    },
  },
  computed: {
    pageTitle() {
      return this.$route.name[0] === '\\' ? '' : this.$route.name;
    },
    ...mapGetters('apiKeys', {
      apiKeysValid: 'valid',
    }),
  },
  components: {
    SideBar,
    SearchBar,
  },
  watch: {
    $route(to, from) {
      this.transitionName = this.getTransitionName(to, from);
      this.headerOpacity = to.name[0] === '\\' ? 0 : 1;
      this.titleOpacity = 0;
      if (to.name === 'Download') this.$store.commit('searchResults/clear');
      setTimeout(() => {
        const [prevScreen, nextScreen] = document.querySelectorAll('#scroll-el');
        prevScreen.removeEventListener('scroll', this.onScroll);
        nextScreen.addEventListener('scroll', this.onScroll);
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './vars.scss';
@import './pageAnimations.scss';

main {
  @include flex-box;
  width: 100vw;

  > div {
    flex: 1;
  }
}

header {
  @include flex-box(space-between);

  position: fixed;
  left: 0;
  top: 0;
  width: calc(100vw - 0.8rem);
  height: 4.5rem;
  backdrop-filter: blur(20px);
  z-index: 1;
  transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  padding-right: calc(5vw + 1.3rem);
  padding-left: calc(5vw + 2.1rem);

  > div {
    @include flex-box;

    transition: 0.2s;
    flex: 1;

    &:nth-child(3) {
      justify-content: flex-end;
    }
  }

  h3 {
    font-size: 1.4rem;
  }
}

.sidebar:hover + header {
  padding-right: calc(5vw + 1.3rem - 10px);
  padding-left: calc(5vw + 2.1rem - 10px);
}
</style>

<style lang="scss" src="./global.scss"></style>
