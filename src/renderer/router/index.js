import Vue from 'vue';
import Router from 'vue-router';

import AlbumPage from '@/components/AlbumPage';
import AlbumsPage from '@/components/AlbumsPage';
import ArtistPage from '@/components/ArtistPage';
import ArtistsPage from '@/components/ArtistsPage';
import HomePage from '@/components/HomePage';
import LikedPage from '@/components/LikedPage';
import MusicPage from '@/components/MusicPage';
import SearchPage from '@/components/SearchPage';
import SettingsPage from '@/components/SettingsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/albums/album',
      name: '\\album-page',
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
