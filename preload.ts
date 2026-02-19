import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("axoma", {
  version: "1.0.0",
});
