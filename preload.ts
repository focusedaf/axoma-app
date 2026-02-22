import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("axoma", {
  version: "1.0.0",

  enterExamMode: () => ipcRenderer.invoke("enter-exam-mode"),
  exitExamMode: () => ipcRenderer.invoke("exit-exam-mode"),
});
