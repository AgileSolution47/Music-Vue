import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../components/HomePage';
import MusicPage from '../components/MusicPage';
import AlbumsPage from '../components/AlbumsPage';
import ArtistsPage from '../components/ArtistsPage';
import SettingsPage from '../components/SettingsPage';

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
