import { contextBridge, ipcRenderer } from 'electron';

/**
 * Expose protected methods that allow the renderer process to use
 * the ipcRenderer without exposing the entire object.
 */
contextBridge.exposeInMainWorld('electron', {
  executeCommand: (command: string, args?: string[]): Promise<{ stdout: string; stderr: string }> => {
    return ipcRenderer.invoke('openclaw:execute', command, args);
  },
  cancelCommand: (commandId: string): Promise<void> => {
    return ipcRenderer.invoke('openclaw:cancel', commandId);
  },
  loadSettings: (): Promise<Record<string, unknown>> => {
    return ipcRenderer.invoke('settings:load');
  },
  saveSettings: (settings: Record<string, unknown>): Promise<void> => {
    return ipcRenderer.invoke('settings:save', settings);
  },
  validatePath: (path: string): Promise<boolean> => {
    return ipcRenderer.invoke('settings:validate-path', path);
  },
  checkRunningOperations: (): Promise<boolean> => {
    return ipcRenderer.invoke('app:check-running');
  },
  confirmQuit: (): Promise<void> => {
    return ipcRenderer.invoke('app:confirm-quit');
  },
  showCloseDialog: (): Promise<boolean> => {
    return ipcRenderer.invoke('app:show-close-dialog');
  },
  onCommandProgress: (callback: (data: { commandId: string; progress: number }) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: { commandId: string; progress: number }) => {
      callback(data);
    };
    ipcRenderer.on('openclaw:progress', subscription);
    return () => {
      ipcRenderer.removeListener('openclaw:progress', subscription);
    };
  },
  onCommandComplete: (callback: (data: { commandId: string; success: boolean; output: string; error?: string }) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: { commandId: string; success: boolean; output: string; error?: string }) => {
      callback(data);
    };
    ipcRenderer.on('openclaw:complete', subscription);
    return () => {
      ipcRenderer.removeListener('openclaw:complete', subscription);
    };
  },
  onCheckRunningOperations: (callback: () => void) => {
    const subscription = () => {
      callback();
    };
    ipcRenderer.on('check-running-operations', subscription);
    return () => {
      ipcRenderer.removeListener('check-running-operations', subscription);
    };
  },
  onOpenSettings: (callback: () => void) => {
    const subscription = () => {
      callback();
    };
    ipcRenderer.on('open-settings', subscription);
    return () => {
      ipcRenderer.removeListener('open-settings', subscription);
    };
  },
});

// Type declarations
declare global {
  interface Window {
    electron: {
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
    };
  }
}

export {};
