import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps): ReactNode {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-lg shadow-xl max-w-2xl w-[90vw] max-h-[80vh] overflow-y-auto z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold">Help & Documentation</Dialog.Title>
              <Dialog.Close className="text-muted-foreground hover:text-foreground transition-colors">
                ✕
              </Dialog.Close>
            </div>

            <Dialog.Description className="sr-only">
              Help documentation for OpenClaw Desktop GUI
            </Dialog.Description>

            <div className="space-y-6">
              <section>
                <h3 className="font-semibold text-lg mb-3">Getting Started</h3>
                <p className="text-muted-foreground mb-3">
                  OpenClaw Desktop GUI provides an easy way to run OpenClaw analysis on your projects.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Use the <strong>Dashboard</strong> to quickly access common operations</li>
                  <li>Use <strong>Operations</strong> for detailed command execution</li>
                  <li>View past operations in <strong>History</strong></li>
                  <li>Configure settings in <strong>Settings</strong></li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
                <div className="grid gap-3">
                  <div className="bg-muted p-3 rounded-md">
                    <strong>Quick Scan</strong>
                    <p className="text-sm text-muted-foreground">Fast analysis of current project</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <strong>Full Analysis</strong>
                    <p className="text-sm text-muted-foreground">Comprehensive in-depth analysis</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <strong>Generate Report</strong>
                    <p className="text-sm text-muted-foreground">Create detailed reports</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3">Keyboard Shortcuts</h3>
                <div className="bg-muted p-3 rounded-md">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1"><kbd className="bg-background px-2 py-0.5 rounded border">F1</kbd></td>
                        <td>Open Help</td>
                      </tr>
                      <tr>
                        <td className="py-1"><kbd className="bg-background px-2 py-0.5 rounded border">Esc</kbd></td>
                        <td>Close dialogs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3">Common Issues</h3>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">OpenClaw not found</strong>
                    <p className="text-sm text-muted-foreground">
                      Make sure OpenClaw is installed and the path is configured in Settings.
                    </p>
                  </div>
                  <div>
                    <strong className="text-sm">Analysis fails</strong>
                    <p className="text-sm text-muted-foreground">
                      Check that you are running the analysis in a valid project directory.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3">More Information</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  For more information, visit the OpenClaw GitHub repository.
                </p>
                <a
                  href="https://github.com/mogoweb/mojoclaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  OpenClaw Documentation →
                </a>
              </section>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
