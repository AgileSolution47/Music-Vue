<template>
  <div id="app">
    <main>
      <side-bar />

      <div>
        <transition :name="transitionName">
          <router-view></router-view>
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
import SideBar from './components/SideBar';

const paths = {
  '/': [0, 0, 0],
  '/home': [0, 1, 0],
  '/music': [0, 2, 0],
  '/albums/album': [0, 3, 1],
  '/albums/liked': [0, 3, 1],
  '/albums': [0, 3, 0],
  '/artists': [0, 4, 0],
  '/settings': [0, 5, 0],
};

export default {
  name: 'Music',
  data: () => ({
    transitionName: '',
  }),
  mounted() {
    this.$store.dispatch('settings/load');
    window.store = this.$store;
  },
  methods: {
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
  },
  components: {
    SideBar,
  },
  watch: {
    $route(to, from) {
      this.transitionName = this.getTransitionName(to, from);
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
</style>

<style src="./global.scss"></style>
