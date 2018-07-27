import { app, BrowserWindow, shell } from 'electron';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { resolve } from 'path';
import { initMenu } from './menu';
import * as Promise from 'bluebird';

const windowStateKeeper = require('electron-window-state');

let mainWindow = null;
const shutDown = Promise.coroutine(function* () {
  yield GethConnector.getInstance().stop();
  yield IpfsConnector.getInstance().stop();
  return true;
});

const stopServices = () => {
  mainWindow.hide();
  shutDown().delay(800).finally(() => process.exit(0));
};

const bootstrap = function () {
  const viewHtml = resolve(__dirname, '../..');

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')({ showDevTools: true });
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  // prevent multiple instances of AKASHA
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  if (shouldQuit) {
    app.quit();
  }

  app.on('ready', () => {
    console.time('total');
    console.time('buildWindow');
    const mainWindowState = windowStateKeeper({
      defaultWidth: 1280,
      defaultHeight: 720,
    });
    mainWindow = new BrowserWindow({
      minHeight: 720,
      minWidth: 1280,
      resizable: true,
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      show: false,
      webPreferences: {
        // nodeIntegration: false,
        preload: resolve(__dirname, 'preloader.js'),
        scrollBounce: true,
      },
    });
    mainWindowState.manage(mainWindow);
    console.timeEnd('buildWindow');
    mainWindow.loadURL(
      process.env.HOT ? `http://localhost:3000/dist/index.html` :
        `file://${viewHtml}/dist/index.html`,
    );
    mainWindow.once('close', (ev: Event) => {
      ev.preventDefault();
      stopServices();
    });
    // Init browserWindow menu
    initMenu(mainWindow)
    .then(() => console.info('Menu init -> done.'))
    .catch(error => console.error(error));
    // until all resources are loaded the renderer browser is hidden
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      mainWindow.focus();
      console.timeEnd('total');
    });
    mainWindow.webContents.on('crashed', (e) => {
      stopServices();
    });
    // prevent href link being opened inside app
    const openDefault = (e, url) => {
      e.preventDefault();
      shell.openExternal(url);
    };

    mainWindow.webContents.on('will-navigate', openDefault);
    mainWindow.webContents.on('new-window', openDefault);

    mainWindow.on('unresponsive', () => {
      console.error('APP is unresponsive');
    });
    process.on('uncaughtException', (err: Error) => {
      console.error(`uncaughtException ${err.message} ${err.stack}`);
    });
    process.on('warning', (warning) => {
      console.warn(warning);
    });
    process.on('SIGINT', stopServices);
    process.on('SIGTERM', stopServices);
  });
};

export default bootstrap;
