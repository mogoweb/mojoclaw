/**
 * Types for the CLI service
 */
export interface CommandExecution {
  commandId: string;
  command: string;
  args: string[];
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime?: number;
  endTime?: number;
  output?: string;
  error?: string;
  progress?: number;
}

export interface CommandResult {
  commandId: string;
  success: boolean;
  output: string;
  error?: string;
  duration: number;
}

export type CommandProgressCallback = (data: { commandId: string; progress: number; message?: string }) => void;
export type CommandCompleteCallback = (data: { commandId: string; success: boolean; output: string; error?: string }) => void;
