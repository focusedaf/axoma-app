export {};

declare global {
  interface Window {
    axoma: {
      version: string;
      enterExamMode: () => Promise<void>;
      exitExamMode: () => Promise<void>;
      checkDisplays: () => Promise<number>;
      checkVM: () => Promise<boolean>;
      scanProcesses: () => Promise<string[]>;
      getDeviceFingerprint: () => Promise<string | null>;
      getNetworkState: () => Promise<
        { iface: string; ip4: string; mac: string; type: string }[]
      >;
      getUsbDevices: () => Promise<
        { id: string; name: string; vendor: string }[]
      >;
      checkOpenPorts: () => Promise<{ port: number; pid: number }[]>;
    };
  }
}
