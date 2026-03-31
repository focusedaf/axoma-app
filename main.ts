import electron from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { screen, globalShortcut } from "electron";
import si from "systeminformation";
import crypto from "crypto";

const { app, BrowserWindow, ipcMain } = electron;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: Electron.BrowserWindow | null = null;
let isExamMode = false;

const NEXT_PORT = 3000;
const isDev = !app.isPackaged;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: isDev,
    },
  });

  mainWindow.loadURL(`http://localhost:${NEXT_PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  /* DEV ESCAPE */

  if (isDev) {
    globalShortcut.register("Escape", () => {
      if (isExamMode) {
        console.log("🧪 ESC pressed → exiting kiosk");
        exitKiosk();
      }
    });

    globalShortcut.register("CommandOrControl+Shift+I", () => {
      mainWindow?.webContents.openDevTools({ mode: "detach" });
    });
  }

  /* BLOCK COMMON CHEAT SHORTCUTS */

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (!isExamMode) return;

    const blocked =
      input.key === "Tab" ||
      input.key === "Escape" ||
      input.key === "F11" ||
      input.key === "F12" ||
      (input.control && input.key.toLowerCase() === "w") ||
      (input.control && input.key.toLowerCase() === "r") ||
      (input.alt && input.key === "Tab");

    if (blocked) {
      event.preventDefault();
    }
  });

  /* ROUTE DETECTION */

  const handleNavigation = (url: string) => {
    console.log("Navigation:", url);

    const examFlow =
      url.includes("/dashboard/exams/") &&
      (url.includes("/guidelines") ||
        url.includes("/system-check") ||
        url.includes("/attempt"));

    const examFinished =
      url.includes("/dashboard/exams/") &&
      (url.includes("/results") || url.includes("/violations"));

    if (examFlow) enterKiosk();
    if (examFinished) exitKiosk();
  };

  mainWindow.webContents.on("did-navigate", (_e, url) => handleNavigation(url));
  mainWindow.webContents.on("did-navigate-in-page", (_e, url) =>
    handleNavigation(url),
  );

  /* SECURITY */

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  mainWindow.on("close", (e) => {
    if (isExamMode) {
      e.preventDefault();
      console.warn("Blocked close during exam");
    }
  });

  mainWindow.on("blur", () => {
    if (isExamMode) {
      mainWindow?.focus();
    }
  });
}



function enterKiosk() {
  if (!mainWindow || isExamMode) return;

  console.log("ENTERING KIOSK");

  isExamMode = true;

  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setKiosk(true);
  mainWindow.setMenuBarVisibility(false);
}

function exitKiosk() {
  if (!mainWindow || !isExamMode) return;

  console.log("EXITING KIOSK");

  isExamMode = false;

  mainWindow.setKiosk(false);
  mainWindow.setFullScreen(false);
  mainWindow.setAlwaysOnTop(false);
  mainWindow.setVisibleOnAllWorkspaces(false);
}



app.whenReady().then(createWindow);

app.on("will-quit", () => globalShortcut.unregisterAll());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});



ipcMain.handle("enter-exam-mode", () => enterKiosk());
ipcMain.handle("exit-exam-mode", () => exitKiosk());


ipcMain.handle("check-displays", () => screen.getAllDisplays().length);

ipcMain.handle("check-vm", async () => {
  const sys = await si.system();
  const model = sys.model?.toLowerCase() || "";

  const keywords = ["virtual", "vmware", "virtualbox", "kvm", "xen", "qemu"];

  return keywords.some((k) => model.includes(k));
});

ipcMain.handle("scan-processes", async () => {
  const processes = await si.processes();
  const list = processes.list.map((p) => p.name.toLowerCase());

  const blacklist = [
    "obs",
    "bandicam",
    "xsplit",
    "camtasia",
    "anydesk",
    "teamviewer",
    "vnc",
    "vmware",
    "virtualbox",
  ];

  return blacklist.filter((b) => list.some((p) => p.includes(b)));
});


ipcMain.handle("get-device-fingerprint", async () => {
  try {
    const sys = await si.system();
    const board = await si.baseboard();
    const cpu = await si.cpu();
    const disks = await si.diskLayout();
    const nets = await si.networkInterfaces();

    const mac =
      nets.find((n) => !n.internal && n.mac)?.mac ||
      nets[0]?.mac ||
      crypto.randomUUID();

    const disk = disks[0]?.serialNum || disks[0]?.device || "disk";

    const raw = `${sys.manufacturer}-${sys.model}-${board.serial}-${cpu.brand}-${disk}-${mac}`;

    return crypto.createHash("sha256").update(raw).digest("hex");
  } catch {
    return crypto.randomUUID();
  }
});


ipcMain.handle("get-usb-devices", async () => {
  const usb = await si.usb();
  return usb;
});

ipcMain.handle("get-network-state", async () => {
  const nets = await si.networkInterfaces();
  return nets.filter((n) => n.operstate === "up" && !n.internal);
});

ipcMain.handle("check-open-ports", async () => {
  const conns = await si.networkConnections();

  const suspicious = [3389, 5900, 4444];

  return conns.filter(
    (c: any) =>
      c.state === "LISTEN" && suspicious.includes(Number(c.localPort)),
  );
});
