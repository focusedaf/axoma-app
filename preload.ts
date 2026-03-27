console.log("✅ PRELOAD LOADED");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("axoma", {
  version: "1.0.0",
  enterExamMode: () => ipcRenderer.invoke("enter-exam-mode"),
  exitExamMode: () => ipcRenderer.invoke("exit-exam-mode"),
  checkDisplays: () => ipcRenderer.invoke("check-displays"),
  checkVM: () => ipcRenderer.invoke("check-vm"),
  scanProcesses: () => ipcRenderer.invoke("scan-processes"),
  getDeviceFingerprint: () => ipcRenderer.invoke("get-device-fingerprint"),
  getNetworkState: () => ipcRenderer.invoke("get-network-state"),
  getUsbDevices: () => ipcRenderer.invoke("get-usb-devices"),
  checkOpenPorts: () => ipcRenderer.invoke("check-open-ports"),
});
