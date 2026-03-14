// Preload script runs in a privileged context before the renderer.
// Use contextBridge.exposeInMainWorld() here to safely expose Node/Electron
// APIs to the renderer process if needed in the future.
//
// Example:
// import { contextBridge, ipcRenderer } from 'electron';
// contextBridge.exposeInMainWorld('electronAPI', {
//   onUpdateAvailable: (cb) => ipcRenderer.on('update-available', cb),
// });
