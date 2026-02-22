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
    };
  }
}
