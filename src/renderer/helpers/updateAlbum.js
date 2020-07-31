import { remote } from 'electron';
import path from 'path';
import axios from 'axios';

const { app } = remote;

const getAlbumInfo = async albumId => {
  try {
    const response = await axios.get(`https://api.napster.com/v2.2/albums/${albumId}`, {
      params: {
        apikey: window.store.state.apiKeys.napster,
      },
    });

    if (response.status !== 200) throw response.headers.status;

    const { id, name, artistName: artist } = response.data.albums[0];

    return { id, name, artist };
  } catch (error) {
    console.error(error);
    return {
      id: '',
      name: '',
      artist: '',
    };
  }
};

const updateAlbum = async albumId => {
  const imagePath = `file://${path.join(
    app.getPath('userData'),
    'album_images',
    `${albumId}.jpg`
  )}`;

  let numSongs = await window.db.getNumSongs(albumId);

  if (numSongs++ > 0) {
    await window.db.updateAlbum({
      id: albumId,
      numSongs,
    });

    return;
  }

  const { id, name, artist } = await getAlbumInfo(albumId);

  if (albumId !== id) {
    throw new Error(`Failed album ${albumId}`);
  }

  console.log(`Adding album ${name}.`);

  const album = {
    id,
    name,
    imagePath,
    numSongs,
    artist,
  };

  window.db.addAlbum(album);
};

export default updateAlbum;
