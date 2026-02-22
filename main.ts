import electron from "electron";
import path from "path";
import { fileURLToPath } from "url";

const { app, BrowserWindow, ipcMain } = electron;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: Electron.BrowserWindow | null = null;
let isExamMode = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  const port = process.env.NEXT_PORT || 3000;
  mainWindow.loadURL(`http://localhost:${port}`);

  mainWindow.on("close", (e) => {
    if (isExamMode) {
      e.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// exam mode

ipcMain.handle("enter-exam-mode", () => {
  if (!mainWindow) return;

  isExamMode = true;

  mainWindow.setFullScreen(true);
  mainWindow.setKiosk(true);
  mainWindow.setAlwaysOnTop(true, "screen-saver");

  mainWindow.webContents.closeDevTools();
});

ipcMain.handle("exit-exam-mode", () => {
  if (!mainWindow) return;

  isExamMode = false;

  mainWindow.setKiosk(false);
  mainWindow.setFullScreen(false);
  mainWindow.setAlwaysOnTop(false);
});
