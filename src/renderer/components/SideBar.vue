<template>
  <nav class="sidebar">
    <div>
      <div class="item no-hover">
        <div class="first">
          <img src="../../resources/logo.png" alt="Music Logo" />
        </div>
        <div class="second">
          <h5>Music</h5>
        </div>
      </div>
      <div class="item">
        <div class="first">
          <home-icon title="Home" />
        </div>
        <div class="second">
          <h6>Home</h6>
        </div>
      </div>
      <div class="item">
        <div class="first">
          <music-note-icon title="My Music" />
        </div>
        <div class="second">
          <h6>My Music</h6>
        </div>
      </div>
      <div class="item">
        <div class="first">
          <music-box-multiple-icon title="Albums" />
        </div>
        <div class="second">
          <h6>Albums</h6>
        </div>
      </div>
      <div class="item">
        <div class="first">
          <account-multiple-icon title="Artists" />
        </div>
        <div class="second">
          <h6>Artists</h6>
        </div>
      </div>
    </div>
    <div class="item sel">
      <div class="first">
        <cog-icon title="Settings" />
      </div>
      <div class="second">
        <h6>Settings</h6>
      </div>
    </div>
  </nav>
</template>

<script>
import MusicNoteIcon from 'vue-material-design-icons/MusicNote';
import MusicBoxMultipleIcon from 'vue-material-design-icons/MusicBoxMultiple';
import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple';
import HomeIcon from 'vue-material-design-icons/Home';
import CogIcon from 'vue-material-design-icons/Cog';

export default {
  name: 'side-bar',
  components: {
    MusicNoteIcon,
    MusicBoxMultipleIcon,
    AccountMultipleIcon,
    HomeIcon,
    CogIcon,
  },
};
</script>

<style lang="scss" scoped>
@import '@/vars.scss';

.sidebar {
  @include flex-box(space-between, flex-start, column);

  transition: width 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  width: 4rem;
  height: 100vh;
  // position: fixed;
  background: $secondary;
  overflow: hidden;

  .item {
    @include flex-box;

    transition: 0.2s;
    margin: 0.5rem 0;
    padding: 0.5rem 0;
    min-height: 2.5rem;
    width: calc(4rem + 150px);

    &.sel {
      color: $accent;
    }

    .first {
      @include flex-box;

      width: 4rem;

      .material-design-icon {
        height: 24px;
      }

      img {
        height: 3rem;
        user-select: none;
      }
    }

    .second {
      transition: 0.2s;

      width: 150px;
      padding: 0 0.4rem;
      transform: translateX(-0.6rem);
      opacity: 0;

      h5 {
        font-size: 1.4rem;
        user-select: none;
      }
      h6 {
        font-size: 1.2rem;
        user-select: none;
      }
    }

    &:hover {
      background: $primary;
      cursor: pointer;
    }

    &.no-hover:hover {
      background: $secondary;
      cursor: auto;
    }
  }

  &:hover {
    width: calc(4rem + 150px);

    .second {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

@media screen and (min-width: 1400px) {
  .sidebar {
    width: calc(4rem + 150px);

    .item .second {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>
