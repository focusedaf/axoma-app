import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("axoma", {
  version: "1.0.0",
  checkDisplays: () => ipcRenderer.invoke("check-displays"),
  checkVM: () => ipcRenderer.invoke("check-vm"),
  scanProcesses: () => ipcRenderer.invoke("scan-processes"),
  enterExamMode: () => ipcRenderer.invoke("enter-exam-mode"),
  exitExamMode: () => ipcRenderer.invoke("exit-exam-mode"),
});
