import electron from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { screen } from "electron";
import si from "systeminformation";
import crypto from "crypto";

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
    "camtasia",
    "screenrec",
    "shadowplay",
    "nvidia share",
    "xboxgamebar",
    "anydesk",
    "teamviewer",
    "mstsc",
    "vnc",
    "vmware",
    "virtualbox",
    "cmd",
    "powershell",
    "pwsh",
    "wt",
    "bash",
    "sh",
    "zsh",
    "git-bash",
  ];

  const detected = blacklisted.filter((b) =>
    list.some((proc) => proc.includes(b)),
  );

  return detected;
});

ipcMain.handle("get-device-fingerprint", async () => {
  try {
    const system = await si.system();
    const baseboard = await si.baseboard();
    const cpu = await si.cpu();
    const disk = await si.diskLayout();
    const network = await si.networkInterfaces();

    const uuid = system.uuid || "";
    const boardSerial = baseboard.serial || "";
    const cpuBrand = cpu.brand || "";
    const diskSerial = disk[0]?.serialNum || "";

    const primaryInterface = network.find(
      (n) => !n.internal && n.mac && n.mac !== "00:00:00:00:00:00",
    );

    const mac = primaryInterface?.mac || "";

    const raw = `${uuid}-${boardSerial}-${diskSerial}-${cpuBrand}-${mac}`;

    const hash = crypto.createHash("sha256").update(raw).digest("hex");

    return hash;
  } catch (err) {
    console.error("Fingerprint generation failed:", err);
    return null;
  }
});

ipcMain.handle("get-network-state", async () => {
  try {
    const interfaces = await si.networkInterfaces();
    const active = interfaces.filter(
      (n) => n.operstate === "up" && !n.internal,
    );

    return active.map((n) => ({
      iface: n.iface,
      ip4: n.ip4,
      mac: n.mac,
      type: n.type,
    }));
  } catch (err) {
    console.error("Network check failed:", err);
    return [];
  }
});

ipcMain.handle("get-usb-devices", async () => {
  try {
    const devices = await si.usb();
    return devices.map((d) => ({
      id: d.id,
      name: d.name,
      vendor: d.vendor,
    }));
  } catch (err) {
    console.error("USB check failed:", err);
    return [];
  }
});

ipcMain.handle("check-open-ports", async () => {
  try {
    const connections = await si.networkConnections();

    const suspiciousPorts = [3389, 5900, 4444];

    const suspicious = connections.filter((c: any) => {
      return (
        c.state === "LISTEN" && suspiciousPorts.includes(Number(c.localPort))
      );
    });

    return suspicious.map((c: any) => ({
      port: Number(c.localPort),
      pid: c.pid,
    }));
  } catch (err) {
    console.error("Port check failed:", err);
    return [];
  }
});
