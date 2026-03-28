export interface ElectronAPI {
  executeCommand: (command: string, args?: string[]) => Promise<{ stdout: string; stderr: string }>;
  cancelCommand: (commandId: string) => Promise<void>;
  loadSettings: () => Promise<Record<string, unknown>>;
  saveSettings: (settings: Record<string, unknown>) => Promise<void>;
  validatePath: (path: string) => Promise<boolean>;
  checkRunningOperations: () => Promise<boolean>;
  confirmQuit: () => Promise<void>;
  showCloseDialog: () => Promise<boolean>;
  onCommandProgress: (callback: (data: { commandId: string; progress: number }) => void) => () => void;
  onCommandComplete: (callback: (data: { commandId: string; success: boolean; output: string; error?: string }) => void) => () => void;
  onCheckRunningOperations: (callback: () => void) => () => void;
  onOpenSettings: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
