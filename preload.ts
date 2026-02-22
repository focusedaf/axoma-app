import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("axoma", {
  version: "1.0.0",
  checkDisplays: () => ipcRenderer.invoke("check-displays"),
  checkVM: () => ipcRenderer.invoke("check-vm"),
  scanProcesses: () => ipcRenderer.invoke("scan-processes"),
  enterExamMode: () => ipcRenderer.invoke("enter-exam-mode"),
  exitExamMode: () => ipcRenderer.invoke("exit-exam-mode"),
  getDeviceFingerprint: () => ipcRenderer.invoke("get-device-fingerprint"),
  getNetworkState: () => ipcRenderer.invoke("get-network-state"),
  getUsbDevices: () => ipcRenderer.invoke("get-usb-devices"),
  checkOpenPorts: () => ipcRenderer.invoke("check-open-ports"),
});
