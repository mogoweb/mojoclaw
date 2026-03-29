import { useEffect, useState, type ReactNode } from 'react';
import type { CommandExecution } from '../../types/cli';
import { cliService } from '../../services/cliService';

export function StatusBar(): ReactNode {
  const [runningOperations, setRunningOperations] = useState<CommandExecution[]>([]);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    command: string;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const checkRunning = () => {
      const running = cliService.getRunningCommands();
      setRunningOperations(running);
    };

    checkRunning();
    const interval = setInterval(checkRunning, 500);

    const unsubscribe = cliService.onComplete((data) => {
      const commands = cliService.getRunningCommands();
      const cmd = commands.find(c => c.commandId === data.commandId);
      setLastResult({
        success: data.success,
        command: cmd?.command || 'Unknown',
        timestamp: Date.now(),
      });
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const getStatusIcon = () => {
    if (runningOperations.length > 0) {
      return <span className="animate-pulse">⚡</span>;
    }
    if (lastResult) {
      return lastResult.success ? <span className="text-green-500">✓</span> : <span className="text-red-500">✕</span>;
    }
    return <span className="text-muted-foreground">○</span>;
  };

  const getStatusText = () => {
    if (runningOperations.length > 0) {
      const op = runningOperations[0];
      return `Running: ${op.command} ${op.args.join(' ')}`;
    }
    if (lastResult && Date.now() - lastResult.timestamp < 5000) {
      return `Last: ${lastResult.command} ${lastResult.success ? 'succeeded' : 'failed'}`;
    }
    return 'Ready';
  };

  return (
    <footer className="h-8 bg-card border-t border-border flex items-center px-4 text-sm">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-muted-foreground">{getStatusText()}</span>
      </div>
      <div className="flex-1" />
      {runningOperations.length > 0 && (
        <span className="text-xs text-muted-foreground">
          {runningOperations.length} operation{runningOperations.length > 1 ? 's' : ''} running
        </span>
      )}
    </footer>
  );
}
