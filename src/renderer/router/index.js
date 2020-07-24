import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '@/components/HomePage';
import MusicPage from '@/components/MusicPage';
import AlbumPage from '@/components/AlbumPage';
import AlbumsPage from '@/components/AlbumsPage';
import ArtistsPage from '@/components/ArtistsPage';
import SettingsPage from '@/components/SettingsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
    },
    {
      path: '/music',
      name: 'music-page',
      component: MusicPage,
    },
    {
      path: '/albums/album',
      name: 'album-page',
      component: AlbumPage,
      props: options => {
        const album = {
          id: options.query.id,
          name: options.query.name,
        };
        const isCustom = album.id.substr(0, 3) !== 'alb';

        if (isCustom) {
          album.songs = options.query.songs;
        } else {
          album.imagePath = options.query.imagePath;
          album.artist = options.query.artist;
          album.numSongs = parseInt(options.query.numSongs, 10);
        }

        return {
          isCustom,
          album,
        };
      },
    },
    {
      path: '/albums',
      name: 'albums-page',
      component: AlbumsPage,
    },
    {
      path: '/artists',
      name: 'artists-page',
      component: ArtistsPage,
    },
    {
      path: '/settings',
      name: 'settings-page',
      component: SettingsPage,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
