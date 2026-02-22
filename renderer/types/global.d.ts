export {};

declare global {
  interface Window {
    axoma: {
      version: string;
      enterExamMode: () => Promise<void>;
      exitExamMode: () => Promise<void>;
    };
  }
}
