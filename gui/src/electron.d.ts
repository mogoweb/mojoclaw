export interface ElectronAPI {
  executeCommand: (command: string, args?: string[]) => Promise<{ stdout: string; stderr: string }>;
  cancelCommand: (commandId: string) => Promise<void>;
  getSettings: () => Promise<Record<string, unknown>>;
  saveSettings: (settings: Record<string, unknown>) => Promise<void>;
  onCommandProgress: (callback: (data: { commandId: string; progress: number; message?: string }) => void) => () => void;
  onCommandComplete: (callback: (data: { commandId: string; success: boolean; output: string; error?: string }) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};