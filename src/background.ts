import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { YtDownloader, downloadImage } from './downloader';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Use correct data path
app.setPath('userData', path.join(app.getPath('appData'), 'Music'));
app.allowRendererProcessReuse = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
let downloader: YtDownloader;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    darkTheme: true,
    width: 1260,
    height: 875,
    icon: path.join(app.getAppPath(), 'resources', 'logo.png'),
    title: 'Music',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See the link for more info
      // nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      webSecurity: !isDevelopment,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`);
  }

  win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.handle('download:image', (_, albumId: string) => downloadImage(albumId));

ipcMain.handle('download:song', async (_, song: NapsterSongData) => {
  const details = await downloader.download(song.title, song.artist, song.albumId);
  await details.download;

  delete details.download;

  return details;
});

ipcMain.on('download:init', (_, path: string) => {
  downloader = new YtDownloader(path);

  downloader.onProgress(progress => {
    win?.webContents.send('download:progress', progress);
  });
});

ipcMain.on('download:update-base-path', (_, path: string) => {
  downloader.changeBasePath(path);
});
