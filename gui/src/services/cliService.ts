import type { CommandExecution, CommandProgressCallback, CommandCompleteCallback } from '../types/cli';

/**
 * Service for executing OpenClaw commands via Electron IPC
 */
class CliService {
  private runningCommands = new Map<string, CommandExecution>();
  private progressSubscribers: CommandProgressCallback[] = [];
  private completeSubscribers: CommandCompleteCallback[] = [];

  /**
   * Execute an OpenClaw command
   */
  async executeCommand(command: string, args: string[] = []): Promise<CommandExecution> {
    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const execution: CommandExecution = {
      commandId,
      command,
      args,
      status: 'running',
      startTime: Date.now(),
    };

    this.runningCommands.set(commandId, execution);

    try {
      const result = await window.electron.executeCommand(command, args);
      const completedExecution: CommandExecution = {
        ...execution,
        status: 'completed',
        endTime: Date.now(),
        output: result.stdout,
      };

      this.runningCommands.set(commandId, completedExecution);
      return completedExecution;
    } catch (error) {
      const failedExecution: CommandExecution = {
        ...execution,
        status: 'failed',
        endTime: Date.now(),
        error: error instanceof Error ? error.message : String(error),
      };

      this.runningCommands.set(commandId, failedExecution);
      return failedExecution;
    }
  }

  /**
   * Cancel a running command
   */
  async cancelCommand(commandId: string): Promise<void> {
    const command = this.runningCommands.get(commandId);
    if (command && command.status === 'running') {
      command.status = 'cancelled';
      command.endTime = Date.now();
      await window.electron.cancelCommand(commandId);
    }
  }

  /**
   * Get command status
   */
  getCommand(commandId: string): CommandExecution | undefined {
    return this.runningCommands.get(commandId);
  }

  /**
   * Get all running commands
   */
  getRunningCommands(): CommandExecution[] {
    return Array.from(this.runningCommands.values()).filter((cmd) => cmd.status === 'running');
  }

  /**
   * Get command history
   */
  getCommandHistory(limit = 50): CommandExecution[] {
    return Array.from(this.runningCommands.values())
      .filter((cmd) => cmd.status !== 'running')
      .sort((a, b) => {
        const aTime = a.endTime || a.startTime || 0;
        const bTime = b.endTime || b.startTime || 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  /**
   * Subscribe to progress updates
   */
  onProgress(callback: CommandProgressCallback): () => void {
    this.progressSubscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.progressSubscribers.indexOf(callback);
      if (index > -1) {
        this.progressSubscribers.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to command completion
   */
  onComplete(callback: CommandCompleteCallback): () => void {
    this.completeSubscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.completeSubscribers.indexOf(callback);
      if (index > -1) {
        this.completeSubscribers.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to Electron IPC events
   */
  subscribeToElectronIPC(): void {
    // Subscribe to progress events
    window.electron.onCommandProgress((data) => {
      const command = this.runningCommands.get(data.commandId);
      if (command) {
        command.progress = data.progress;
      }
      this.progressSubscribers.forEach((callback) => callback(data));
    });

    // Subscribe to completion events
    window.electron.onCommandComplete((data) => {
      const command = this.runningCommands.get(data.commandId);
      if (command) {
        command.status = data.success ? 'completed' : 'failed';
        command.endTime = Date.now();
        command.output = data.output;
        command.error = data.error;
      }
      this.completeSubscribers.forEach((callback) => callback(data));
    });
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    const idsToRemove = Array.from(this.runningCommands.entries())
      .filter(([_, cmd]) => cmd.status !== 'running')
      .map(([id]) => id);

    idsToRemove.forEach((id) => this.runningCommands.delete(id));
  }

  /**
   * Clean up old commands (keep last N)
   */
  cleanOldCommands(keepLast = 100): void {
    const nonRunningCommands = Array.from(this.runningCommands.entries())
      .filter(([_, cmd]) => cmd.status !== 'running')
      .sort(([, a], [, b]) => {
        const aTime = a.endTime || a.startTime || 0;
        const bTime = b.endTime || b.startTime || 0;
        return aTime - bTime;
      });

    const toRemove = nonRunningCommands.slice(0, -keepLast);
    toRemove.forEach(([id]) => this.runningCommands.delete(id));
  }
}

// Create singleton instance
export const cliService = new CliService();
