import { remote } from 'electron';
import sqlite3 from 'sqlite3';
import * as path from 'path';
import { open } from 'sqlite';

const Tables = {
  Songs: 'songdata',
  Albums: 'albumdata',
  CustomAlbums: 'customalbums',
};

const { app } = remote;

class DatabaseFunctions {
  constructor() {
    this.ready = false;
    this.promises = [];
    this._init();
  }

  async _init() {
    const dbPath = path.join(app.getPath('userData'), 'song_info.db');

    this._db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await Promise.all([
      this._db.run(
        `CREATE TABLE IF NOT EXISTS ${Tables.Songs} (
          filePath TEXT,
          title TEXT,
          thumbnail TEXT,
          artist TEXT,
          length INT,
          numListens INT,
          liked BOOLEAN,
          albumId TEXT
        )`
      ),
      this._db.run(
        `CREATE TABLE IF NOT EXISTS ${Tables.Albums} (
          id TEXT,
          imagePath TEXT,
          name TEXT,
          numSongs INT,
          artist TEXT
        )`
      ),
      this._db.run(
        `CREATE TABLE IF NOT EXISTS ${Tables.CustomAlbums} (
          id TEXT,
          name TEXT,
          songs TEXT
        )`
      ),
    ]);

    this.ready = true;
    this.promises.forEach(res => res());
  }

  isReady() {
    return new Promise(res => {
      if (this.ready) {
        res();
      } else {
        this.promises.push(res);
      }
    });
  }

  // _stringifyArr(arr) {
  //   return this._escape(JSON.stringify(arr).slice(1, -1), Quotes.Single);
  // }

  // _parseArr(arr) {
  //   return JSON.parse(`[${arr}]`);
  // }

  async getNumLiked() {
    await this.isReady();

    return (await this._db.get(`SELECT COUNT(*) AS cnt FROM ${Tables.Songs} WHERE liked`)).cnt;
  }

  async getTop() {
    await this.isReady();

    return {
      songs: (await this._db.all(`SELECT * FROM ${Tables.Songs} ORDER BY NOT liked, numListens DESC LIMIT 5`)).map(s => ({
        ...s,
        liked: s.liked === 1,
      })),
      albums: await this._db.all(`SELECT * FROM ${Tables.Albums} ORDER BY numSongs DESC LIMIT 5`),
    };
  }

  async getTopSongs() {
    await this.isReady();

    return (await this._db.all(`SELECT * FROM ${Tables.Songs} ORDER BY NOT liked, numListens DESC`)).map(s => ({
      ...s,
      liked: s.liked === 1,
    }));
  }

  async getSongs(where, whereArgs = []) {
    await this.isReady();

    return (
      await this._db.all(
        `SELECT * FROM ${Tables.Songs} ${where ? `${where ? `WHERE ${where}` : ''}` : ''} ORDER BY LOWER(title), title`,
        ...whereArgs
      )
    ).map(s => ({
      ...s,
      liked: s.liked === 1,
    }));
  }

  async getAlbums(where, whereArgs = []) {
    await this.isReady();

    return this._db.all(`SELECT * FROM ${Tables.Albums} ${where ? `WHERE ${where}` : ''} ORDER BY LOWER(name), name`, ...whereArgs);
  }

  async getCustomAlbums(where, whereArgs = []) {
    await this.isReady();

    return this._db.all(`SELECT * FROM ${Tables.CustomAlbums} ${where ? `WHERE ${where}` : ''} ORDER BY LOWER(name), name`, ...whereArgs);
  }

  async getNumSongs(albumId) {
    await this.isReady();

    return (await this._db.get(`SELECT COUNT(*) AS cnt FROM ${Tables.Songs} WHERE albumId LIKE ?`, [albumId])).cnt;
  }

  async getArtists() {
    await this.isReady();

    const preSongs = await this._db.all(`SELECT artist as name, COUNT(*) as numSongs FROM ${Tables.Songs} GROUP BY artist`);

    const artists = preSongs.map(async preSong => {
      const images = await this._db.all(
        `SELECT imagePath FROM ${Tables.Albums} WHERE artist LIKE ? ORDER BY numSongs DESC LIMIT 4`,
        preSong.name
      );

      return {
        ...preSong,
        images: images.length === 4 ? images : [images[0]],
      };
    });

    return artists;
  }

  async insert(table, values) {
    await this.isReady();

    const keys = `(${Object.keys(values).join(',')})`;
    const questionMarks = `(${new Array(keys.length).fill('?').join(',')})`;

    return this._db.exec(`INSERT INTO ${table} ${keys} VALUES ${questionMarks}`, ...Object.values(values));
  }

  async insertSong(song) {
    return this.insert(Tables.Songs, song.toMap());
  }

  async insertAlbum(album) {
    return this.insert(Tables.Albums, album.toMap());
  }

  async insertCustomAlbum(customAlbum) {
    return this.insert(Tables.CustomAlbums, customAlbum.toMap());
  }

  async delete(table, where, whereArgs = []) {
    await this.isReady();

    return (await this._db.run(`DELETE FROM ${table} ${where ? `WHERE ${where}` : ''}`, whereArgs)).changes;
  }

  async deleteSong(title) {
    await this.isReady();

    return this._db.delete(Tables.Songs, 'title LIKE ?', [title]);
  }

  async deleteAlbum(id) {
    await this.isReady();

    return this._db.delete(Tables.Albums, 'id LIKE ?', [id]);
  }

  async deleteEmptyAlbums() {
    await this.isReady();

    return this._db.delete(Tables.Albums, 'numSongs < 1');
  }

  async deleteCustomAlbum(id) {
    await this.isReady();

    return this._db.delete(Tables.CustomAlbums, 'id LIKE ?', [id]);
  }

  async update(table, values, where, whereArgs = []) {
    await this.isReady();

    const keys = `(${Object.keys(values).join(' = ?,')})`;

    return (await this._db.run(`UPDATE ${table} SET ${keys} ${where ? `WHERE ${where}` : ''}`, ...Object.values(values), ...whereArgs))
      .changes;
  }

  async incrementNumListens(song) {
    await this.isReady();

    return (await this._db.run(`UPDATE ${Tables.Songs} SET numListens = numListens + 1 WHERE title LIKE ?`, song.title)).changes;
  }

  async nextCustomAlbumId() {
    await this.isReady();

    const id = await this._db.get(`SELECT * FROM ${Tables.CustomAlbums} ORDER BY id DESC`);

    let num = 0;

    if (id !== undefined) {
      num = parseInt(id.id.substring(4), 10) + 1;
    }
    return `cst.${num}`;
  }

  // async cleanup() {
  //   await this.isReady();

  //   const data = await this._db.rawQuery(
  //       "SELECT COUNT(*) as cnt, albumId as id FROM ${Tables.Songs} GROUP BY albumId;");
  //   const batch = this._db.batch();

  //   // Update numSongs to be correct
  //   data.forEach((element) {
  //     batch.update(Tables.Albums, {"numSongs": element["cnt"]},
  //         where: "id LIKE ?", whereArgs: [element["id"]]);
  //   });

  //   const albumIds = stringifyArr(data.map((e) => e["id"]).toList());

  //   // Delete albums which do not appear in songdata
  //   batch.delete(Tables.Albums, where: "id NOT IN ($albumIds)");

  //   await batch.commit();
  // }
}
export default DatabaseFunctions;
