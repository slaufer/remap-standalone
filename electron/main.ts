import { app, BrowserWindow, net, protocol, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

// Must be called before app.whenReady() — registers 'app://' as a secure,
// standard scheme so absolute asset paths (/assets/…) resolve correctly
// when loading the Vite-built index.html via file://.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // Load via custom protocol so Vite's absolute asset paths (/assets/…)
    // resolve to app://remap/assets/… instead of file:///assets/…
    win.loadURL('app://remap/index.html');
  }
}

app.whenReady().then(() => {
  // Serve built web assets: app://remap/<path> → build/<path>
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    const filePath = path.join(app.getAppPath(), 'build', url.pathname);
    return net.fetch(`file://${filePath}`);
  });

  // Auto-grant HID device access — no browser permission prompt needed
  session.defaultSession.setDevicePermissionHandler(() => true);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
