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

ipcMain.handle('download:song', async (_, song) => {
  const details = await downloader.download(song.title, song.artist, song.albumId);
  await details.download;

  delete details.download;

  return details;
});

ipcMain.on('download:init', (_, path) => {
  downloader = new YtDownloader(path);

  downloader.onProgress(progress => {
    mainWindow.webContents.send('download:progress', progress);
  });
});

ipcMain.on('download:update-base-path', (_, path) => {
  downloader.updateBasePath(path);
});

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
