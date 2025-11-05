import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { app, BrowserWindow } from 'electron';

const __dirname = path.resolve();

const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_DEV === 'true';
let backendProcess = null;

function startBackend() {
  const backendDir = path.resolve(__dirname, '../backend');
  const backendEntry = path.join(backendDir, 'server.js');

  if (!fs.existsSync(backendEntry)) {
    console.error('Backend entry not found:', backendEntry);
    return;
  }

  // Use the same node executable running electron to avoid mismatched node versions
  const nodeExec = process.execPath;

  backendProcess = spawn(nodeExec, [backendEntry], {
    cwd: backendDir,
    env: { ...process.env, PORT: process.env.PORT || '3000' },
    stdio: 'inherit'
  });

  backendProcess.on('close', (code, signal) => {
    console.log(`Backend process exited with code ${code} signal ${signal}`);
    backendProcess = null;
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Prefer a production build in frontend/dist. If not present fall back to vite dev server URL.
  const indexPath = path.resolve(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    win.loadFile(indexPath).catch((e) => console.error(e));
  } else {
    const devUrl = 'http://localhost:5173';
    console.log('Frontend build not found. Loading dev URL:', devUrl);
    win.loadURL(devUrl).catch((e) => console.error(e));
  }

  // Optional: open DevTools in dev mode
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
  console.log('Electron app ready — starting backend');
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch (e) {
      console.warn('Error killing backend process:', e);
    }
  }
});

// If all windows closed, quit the app (except on macOS where typical behaviour differs)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
