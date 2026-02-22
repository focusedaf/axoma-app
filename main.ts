import electron from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { screen } from "electron";
import si from "systeminformation";

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

  const port = 3000;
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
  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow?.webContents.closeDevTools();
  });
});

ipcMain.handle("exit-exam-mode", () => {
  if (!mainWindow) return;

  isExamMode = false;

  mainWindow.setKiosk(false);
  mainWindow.setFullScreen(false);
  mainWindow.setAlwaysOnTop(false);
});

ipcMain.handle("check-displays", () => {
  const displays = screen.getAllDisplays();
  return displays.length;
});

ipcMain.handle("check-vm", async () => {
  const system = await si.system();
  const model = system.model?.toLowerCase() || "";

  const suspiciousKeywords = [
    "virtual",
    "vmware",
    "virtualbox",
    "kvm",
    "xen",
    "qemu",
  ];

  return suspiciousKeywords.some((k) => model.includes(k));
});

ipcMain.handle("scan-processes", async () => {
  const processes = await si.processes();
  const list = processes.list.map((p) => p.name.toLowerCase());

  const blacklisted = [
    "obs",
    "obs64",
    "bandicam",
    "fraps",
    "xsplit",
    "anydesk",
    "teamviewer",
    "vmware",
    "virtualbox",
  ];

  const detected = blacklisted.filter((b) =>
    list.some((proc) => proc.includes(b)),
  );

  return detected;
});