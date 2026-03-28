import { ipcMain, app, dialog, BrowserWindow } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface RunningCommand {
  id: string;
  command: string;
  args: string[];
  process: ChildProcess;
  startTime: number;
}

const runningCommands = new Map<string, RunningCommand>();
let commandIdCounter = 0;

/**
 * Calculate progress percentage based on time elapsed
 * (This is a simplified approach - real progress would need command-specific logic)
 */
function calculateProgress(startTime: number): number {
  const elapsed = Date.now() - startTime;
  // Assume most commands complete within 60 seconds, cap at 95%
  return Math.min((elapsed / 60000) * 100, 95);
}

/**
 * Execute an OpenClaw command via IPC
 */
ipcMain.handle(
  'openclaw:execute',
  async (_event, command: string, args: string[] = []): Promise<{ commandId: string; stdout: string; stderr: string }> => {
    return new Promise((resolve, reject) => {
      const commandId = `cmd-${Date.now()}-${commandIdCounter++}`;
      let stdout = '';
      let stderr = '';

      const childProcess = spawn(command, args, {
        shell: true,
      });

      runningCommands.set(commandId, {
        id: commandId,
        command,
        args,
        process: childProcess,
        startTime: Date.now(),
      });

      childProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
        const runningCmd = runningCommands.get(commandId);
        // Send progress updates to renderer
        _event.sender.send('openclaw:progress', {
          commandId,
          progress: runningCmd ? calculateProgress(runningCmd.startTime) : 0,
          message: 'Running...',
        });
      });

      childProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      childProcess.on('close', (code) => {
        const success = code === 0;
        _event.sender.send('openclaw:complete', {
          commandId,
          success,
          output: stdout,
          error: success ? undefined : stderr || `Process exited with code ${code}`,
        });
        runningCommands.delete(commandId);
        if (success) {
          resolve({ commandId, stdout, stderr });
        } else {
          reject(new Error(stderr || `Command failed with exit code ${code}`));
        }
      });

      childProcess.on('error', (error) => {
        runningCommands.delete(commandId);
        _event.sender.send('openclaw:complete', {
          commandId,
          success: false,
          output: '',
          error: error.message,
        });
        reject(error);
      });

      // Set a timeout for long-running commands (5 minutes)
      const timeout = setTimeout(() => {
        if (childProcess.pid) {
          childProcess.kill();
        }
        runningCommands.delete(commandId);
        _event.sender.send('openclaw:complete', {
          commandId,
          success: false,
          output: '',
          error: 'Command timed out after 5 minutes',
        });
        reject(new Error('Command timed out'));
      }, 5 * 60 * 1000);

      childProcess.on('close', () => {
        clearTimeout(timeout);
      });
    });
  },
);

/**
 * Cancel a running command
 */
ipcMain.handle('openclaw:cancel', (_event, commandId: string): Promise<void> => {
  return new Promise((resolve) => {
    const runningCommand = runningCommands.get(commandId);
    if (runningCommand && runningCommand.process.pid) {
      runningCommand.process.kill('SIGTERM');
      runningCommands.delete(commandId);
    }
    resolve();
  });
});

function getSettingsPath(): string {
  const configDir = app.getPath('userData');
  return join(configDir, 'settings.json');
}

interface AppSettings {
  openclawPath: string;
  theme: 'light' | 'dark' | 'system';
  defaultScanMode: 'quick' | 'full';
  outputFormat: 'text' | 'json' | 'html';
  autoCheckUpdates: boolean;
  showNotifications: boolean;
  minimizeToTray: boolean;
  windowBounds: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  };
}

const defaultSettings: AppSettings = {
  openclawPath: 'openclaw',
  theme: 'system',
  defaultScanMode: 'quick',
  outputFormat: 'text',
  autoCheckUpdates: true,
  showNotifications: true,
  minimizeToTray: false,
  windowBounds: {
    width: 1200,
    height: 800,
  },
};

/**
 * Load application settings
 */
ipcMain.handle('settings:load', async (): Promise<AppSettings | null> => {
  try {
    const settingsPath = getSettingsPath();
    if (existsSync(settingsPath)) {
      const data = readFileSync(settingsPath, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
});

/**
 * Save application settings
 */
ipcMain.handle('settings:save', async (_event, settings: AppSettings): Promise<void> => {
  try {
    const settingsPath = getSettingsPath();
    const configDir = app.getPath('userData');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
});

/**
 * Validate a path
 */
ipcMain.handle('settings:validate-path', async (_event, path: string): Promise<boolean> => {
  try {
    const { accessSync, constants } = await import('fs');
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
});

/**
 * Check if there are running operations
 */
ipcMain.handle('app:check-running', async (): Promise<boolean> => {
  return runningCommands.size > 0;
});

/**
 * Confirm and quit application
 */
ipcMain.handle('app:confirm-quit', async (): Promise<void> => {
  const windows = BrowserWindow.getAllWindows();
  for (const win of windows) {
    win.destroy();
  }
  app.quit();
});

/**
 * Show confirm dialog for closing with running operations
 */
ipcMain.handle('app:show-close-dialog', async (): Promise<boolean> => {
  const result = await dialog.showMessageBox({
    type: 'warning',
    title: 'Operations Running',
    message: 'There are operations currently running.',
    detail: 'Are you sure you want to quit? Running operations will be terminated.',
    buttons: ['Quit', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
  });
  return result.response === 0;
});
