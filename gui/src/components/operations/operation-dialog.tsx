import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface OperationDialogProps {
  isOpen: boolean;
  title: string;
  command: string;
  args?: string[];
  output?: string;
  progress?: number;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  onCancel?: () => void;
  onClose?: () => void;
}

/**
 * Operation execution dialog component
 */
export function OperationDialog({
  isOpen,
  title,
  command,
  args = [],
  output,
  progress,
  status,
  onCancel,
  onClose,
}: OperationDialogProps): ReactNode {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col m-4">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 min-h-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Command:</p>
            <code className="text-sm bg-muted px-2 py-1 rounded block overflow-x-auto">
              {command} {args.join(' ')}
            </code>
          </div>

          {status !== 'idle' && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-medium ${
                      status === 'completed'
                        ? 'text-green-500'
                        : status === 'failed'
                          ? 'text-red-500'
                          : status === 'cancelled'
                            ? 'text-yellow-500'
                            : 'text-blue-500'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                {progress !== undefined && progress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</p>
                  </div>
                )}
              </div>

              {status !== 'running' && output && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Output:</p>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto max-h-60 overflow-y-auto">
                    {output}
                  </pre>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="flex items-center justify-end gap-2 p-4 border-t border-border">
          {status === 'running' && onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {(status === 'completed' || status === 'failed' || status === 'cancelled') && (
            <Button onClick={onClose}>Close</Button>
          )}
        </footer>
      </div>
    </div>
  );
}
