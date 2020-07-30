import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { downloadImage, YtDownloader } from './downloader';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let downloader;

const dev = !app.isPackaged;

let mainWindow;
const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    darkTheme: true,
    width: 1260,
    height: 875,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !dev,
    },
    icon: path.join(app.getAppPath(), 'resources', 'logo.png'),
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('download:image', (_, albumId) => downloadImage(albumId));

ipcMain.handle('download:song', (_, song) => downloader.download(song.title, song.artist));

ipcMain.on('download:init', (_, path) => {
  downloader = new YtDownloader(path);

  downloader.onProgress(progress => {
    mainWindow.webContents.send('download:progress', progress);
  });
});

ipcMain.on('download:update-base-path', (_, path) => {
  downloader.updateBasePath(path);
});

console.log('test');

/* eslint-disable */
ipcMain.on('test', async (_, title) => {
  let percent = 0;
  await sleep(700 + Math.random() * 100);
  while (percent < 1) {
    percent += Math.random() / 10;
    mainWindow.webContents.send('download:progress', {
      title,
      artist: 'Queen',
      percent,
    });
    await sleep(700 + Math.random() * 100);
  }

  mainWindow.webContents.send('download:complete', {
    title,
    artist: 'Queen',
  });
});

const sleep = async time => new Promise(res => setTimeout(res, time));

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
