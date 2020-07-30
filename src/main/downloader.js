import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import ffmpeg from 'fluent-ffmpeg';

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

export class YtDownloader {
  _progressHandler = null;

  constructor(basePath) {
    this.basePath = basePath;
  }

  _parseLink(link) {
    return link
      .split('?')[1]
      .split('&')
      .filter(s => s.slice(0, 2) === 'v=')[0]
      .slice(2);
  }

  _parseDur(dur) {
    return Math.floor(
      dur
        .split(':')
        .map(parseFloat)
        .reverse()
        .reduce((sum, time, index) => sum + time * 60 ** index, 0)
    );
  }

  changeBasePath(path) {
    this.basePath = path;
  }

  onProgress(handler) {
    console.assert(typeof handler === 'function', 'onProgress callback must be a function');
    this._progressHandler = handler;
    return this;
  }

  async _getAudioUrl(videoId) {
    const info = await ytdl.getInfo(videoId, {
      quality: 'highestaudio',
      format: {
        hasAudio: true,
        hasVideo: false,
      },
    });

    const formats = ytdl
      .filterFormats(info.formats, 'audioonly')
      .filter(f => f.audioCodec === 'mp4a.40.2');

    if (formats.length) return formats[0].url;

    if (info.formats.length) return info.formats[0].url;

    return null;
  }

  async getYoutubeData(title, artist) {
    const filters = await ytsr.getFilters(`${title} by ${artist} Offical Music Video`);
    const filter = filters.get('Type').filter(f => f.name === 'Video')[0];

    const results = await ytsr(null, { limit: 4, nextpageRef: filter.ref });

    return results.items.map(r => ({
      id: this._parseLink(r.link),
      duration: this._parseDur(r.duration),
      title,
      artist,
    }));
  }

  async downloadWithData(ytData, path, notifyProgress = true) {
    let url = null;

    let i = 0;

    while (url === null && i < ytData.length) {
      url = await this._getAudioUrl(ytData[i].id); // eslint-disable-line no-await-in-loop
      i++;
    }
    i--;

    const data = ytData[i];

    return {
      ...data,
      download: new Promise((res, rej) => {
        ffmpeg(url)
          .noVideo()
          .audioCodec('libmp3lame')
          .saveToFile(path)
          .on('error', rej)
          .on('end', res)
          .on('progress', progress => {
            if (notifyProgress && this._progressHandler) {
              const timestamp = this._parseDur(progress.timemark);

              this._progressHandler({
                timestamp,
                total: data.duration,
                percent: timestamp / data.duration,
                title: data.title,
                artist: data.artist,
              });
            }
          });
      }),
    };
  }

  async download(title, artist, notifyProgress = true) {
    const ytData = await this.getYoutubeData(title, artist);
    return this.downloadWithData(ytData, path.join(this.basePath, `${title}.mp3`), notifyProgress);
  }
}
