import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import axios from 'axios';

export const downloadImage = async id => {
  try {
    const downloadPath = path.join(app.getPath('userData'), 'album_images', `${id}.jpg`);

    if (fs.existsSync(downloadPath)) return null;

    const url = `https://api.napster.com/imageserver/v2/albums/${id}/images/500x500.jpg`;
    const writer = fs.createWriteStream(downloadPath);

    const response = await axios.get(url, { responseType: 'stream' });

    if (response.status !== 200) throw response.status;

    response.data.pipe(writer);

    return new Promise((res, rej) => {
      writer.on('finish', res);
      writer.on('error', rej);
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const downloadSong = async () => {};
