const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const isDev = process.env.ELECTRON_DEV === '1' || process.env.NODE_ENV === 'development';

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    }
  });

  if (isDev) {
    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
    win.loadURL(startUrl);
  } else {
    win.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
  }

  if (!isDev) win.removeMenu();
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

/*
 * Narrow IPC handlers only — do NOT expose arbitrary exec/spawn.
 */
ipcMain.handle('dialog:select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return (result.filePaths && result.filePaths[0]) || null;
});
ipcMain.handle('app:get-path', (event, name) => {
  return app.getPath(name || 'userData');
});