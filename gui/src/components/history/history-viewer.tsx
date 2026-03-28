import { useEffect, useState, type ReactNode } from 'react';
import type { CommandExecution } from '../../types/cli';
import { cliService } from '../../services/cliService';

export function HistoryViewer(): ReactNode {
  const [history, setHistory] = useState<CommandExecution[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      const cmds = cliService.getCommandHistory(50);
      setHistory(cmds);
    };

    loadHistory();
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: CommandExecution['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'cancelled':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const selectedCommand = selectedId ? history.find((c) => c.commandId === selectedId) : null;

  if (history.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Operation History</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>No operations have been run yet.</p>
          <p className="text-sm mt-2">Run an operation from the Dashboard to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Operation History</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {history.map((cmd) => (
            <button
              key={cmd.commandId}
              type="button"
              onClick={() => setSelectedId(cmd.commandId)}
              className={`
                w-full text-left p-4 rounded-lg border transition-colors
                ${selectedId === cmd.commandId
                  ? 'bg-accent border-primary'
                  : 'bg-card border-border hover:bg-accent'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{cmd.command} {cmd.args.join(' ')}</span>
                <span className={`text-sm ${getStatusColor(cmd.status)}`}>{cmd.status}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {formatDate(cmd.startTime)}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          {selectedCommand ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Command</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  {selectedCommand.command} {selectedCommand.args.join(' ')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Status</h3>
                <p className={getStatusColor(selectedCommand.status)}>{selectedCommand.status}</p>
              </div>

              <div>
                <h3 className="font-semibold">Started</h3>
                <p className="text-muted-foreground text-sm">{formatDate(selectedCommand.startTime)}</p>
              </div>

              {selectedCommand.endTime && (
                <div>
                  <h3 className="font-semibold">Ended</h3>
                  <p className="text-muted-foreground text-sm">{formatDate(selectedCommand.endTime)}</p>
                </div>
              )}

              {selectedCommand.error && (
                <div>
                  <h3 className="font-semibold">Error</h3>
                  <p className="text-red-500 text-sm">{selectedCommand.error}</p>
                </div>
              )}

              {selectedCommand.output && (
                <div>
                  <h3 className="font-semibold">Output</h3>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto max-h-64">
                    {selectedCommand.output}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select an operation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
