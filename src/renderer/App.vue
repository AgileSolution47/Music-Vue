<template>
  <div id="app">
    <main>
      <side-bar />
      <div>
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import SideBar from './components/SideBar';

export default {
  name: 'Music',
  mounted() {
    this.$store.dispatch('settings/load');
    window.store = this.$store;
  },
  components: {
    SideBar,
  },
};
</script>

<style lang="scss" scoped>
@import './vars.scss';

main {
  @include flex-box;
  width: 100vw;

  > div {
    flex: 1;
  }
}
</style>

<style lang="scss">
@import './vars.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;

  &:focus {
    outline: none;
  }

  &::selection {
    background-color: #dfdfdf69;
  }
}

::-webkit-scrollbar {
  position: fixed;
  width: 0.8rem;
}

::-webkit-scrollbar-track {
  background-color: $bg;
}

::-webkit-scrollbar-thumb {
  background-color: $primary;
}

.header {
  font-size: 3.2rem;
  width: 90%;
  margin: 0 auto;
}

.no-results {
  font-size: 1.3rem;
  margin: 2rem;
}

body {
  background: $bg;
  color: white;
}

main > div {
  position: relative;
  transition: 0.2s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  overflow-x: hidden;
  height: 100vh;
  padding: 2rem 0;
}

img {
  max-height: 90%;
  max-width: 90%;
}

a {
  text-decoration: none;
  outline: none;
  border: none;
}

p {
  text-decoration: none;
  outline: none;
  border: none;
}

hr {
  height: 2px;
  width: 80%;
  background-color: #dfdfdf69;
  border: none;
  margin: 3rem auto 4rem auto;
}

button {
  background: none;
  border: none;
  width: auto;
  overflow: visible;

  color: inherit;
  font: inherit;

  line-height: normal;

  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  -webkit-appearance: none;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:hover {
    cursor: pointer;
  }
}

input {
  border: none;
  background: none;
}

li {
  list-style: none;
}
</style>
