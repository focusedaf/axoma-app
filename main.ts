import electron from "electron";
import path from "path";
import { fileURLToPath } from "url";

const { app, BrowserWindow } = electron;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: Electron.BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const port = process.env.NEXT_PORT || 3000;
  mainWindow.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(createWindow);
