const { contextBridge, ipcRenderer } = require('electron');

// Minimal, explicit API
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
  getAppPath: (name) => ipcRenderer.invoke('app:get-path', name)
});