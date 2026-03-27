import { ipcMain } from 'electron';
import { spawn, ChildProcess } from 'child_process';

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

/**
 * Get application settings
 */
ipcMain.handle('settings:get', (): Promise<Record<string, unknown>> => {
  return Promise.resolve({
    // Default settings
    openclawPath: '',
    theme: 'dark',
  });
});

/**
 * Save application settings
 */
ipcMain.handle('settings:save', (_event, settings: Record<string, unknown>): Promise<void> => {
  // TODO: Implement actual settings persistence
  return Promise.resolve();
});
