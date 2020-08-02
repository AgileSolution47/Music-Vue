import Vue from 'vue';
import Router from 'vue-router';

import AlbumPage from '@/components/AlbumPage.vue';
import AlbumsPage from '@/components/AlbumsPage.vue';
import ArtistPage from '@/components/ArtistPage.vue';
import ArtistsPage from '@/components/ArtistsPage.vue';
import HomePage from '@/components/HomePage.vue';
import LikedPage from '@/components/LikedPage.vue';
import MusicPage from '@/components/MusicPage.vue';
import RegisterApiKeysPage from '@/components/RegisterApiKeysPage.vue';
import SearchPage from '@/components/SearchPage.vue';
import SettingsPage from '@/components/SettingsPage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/albums/album',
      name: '\\album-page',
      component: AlbumPage,
      props: options => {
        const album: AlbumData = {
          id: options.query.id as string,
          name: options.query.name as string,
          imagePath: options.query.imagePath as string,
          artist: options.query.artist as string,
          numSongs: parseInt(options.query.numSongs as string, 10),
        };

        return {
          isCustom: false,
          album,
        };
      },
    },
    {
      path: '/albums/album',
      name: '\\c-album-page',
      component: AlbumPage,
      props: options => {
        const album: CustomAlbumData = {
          id: options.query.id as string,
          name: options.query.name as string,
          songs: options.query.songs as string[],
        };

        return {
          isCustom: true,
          album,
        };
      },
    },
    {
      path: '/albums',
      name: 'Albums',
      component: AlbumsPage,
    },
    {
      path: '/artists',
      name: 'Artists',
      component: ArtistsPage,
    },
    {
      path: '/artists/artist',
      name: '\\artist-page',
      component: ArtistPage,
      props: options => ({
        artist: options.query,
      }),
    },
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/albums/liked',
      name: '\\liked-page',
      component: LikedPage,
    },
    {
      path: '/music',
      name: 'My Music',
      component: MusicPage,
    },
    {
      path: '/register-keys',
      name: 'Register Api Keys',
      component: RegisterApiKeysPage,
    },
    {
      path: '/search',
      name: 'Download',
      component: SearchPage,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsPage,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
