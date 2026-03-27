import { contextBridge, ipcRenderer } from 'electron';

/**
 * Expose protected methods that allow the renderer process to use
 * the ipcRenderer without exposing the entire object.
 */
contextBridge.exposeInMainWorld(' electron', {
  executeCommand: (command: string, args?: string[]): Promise<{ stdout: string; stderr: string }> => {
    return ipcRenderer.invoke('openclaw:execute', command, args);
  },
  cancelCommand: (commandId: string): Promise<void> => {
    return ipcRenderer.invoke('openclaw:cancel', commandId);
  },
  getSettings: (): Promise<Record<string, unknown>> => {
    return ipcRenderer.invoke('settings:get');
  },
  saveSettings: (settings: Record<string, unknown>): Promise<void> => {
    return ipcRenderer.invoke('settings:save', settings);
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
});

// Type declarations
declare global {
  interface Window {
    electron: {
      executeCommand: (command: string, args?: string[]) => Promise<{ stdout: string; stderr: string }>;
      cancelCommand: (commandId: string) => Promise<void>;
      getSettings: () => Promise<Record<string, unknown>>;
      saveSettings: (settings: Record<string, unknown>) => Promise<void>;
      onCommandProgress: (callback: (data: { commandId: string; progress: number }) => void) => () => void;
      onCommandComplete: (callback: (data: { commandId: string; success: boolean; output: string; error?: string }) => void) => () => void;
    };
  }
}

export {};
