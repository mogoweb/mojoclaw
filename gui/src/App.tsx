import type { ReactNode } from 'react';
import React from 'react';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Settings } from './components/settings/settings';
import { About } from './components/settings/about';
import { OperationDialog } from './components/operations/operation-dialog';
import { cliService } from './services/cliService';

type View = 'dashboard' | 'operations' | 'history' | 'settings' | 'about' | 'help';

function App(): ReactNode {
  const [currentView, setCurrentView] = React.useState<View>('dashboard');
  const [operationDialog, setOperationDialog] = React.useState({
    isOpen: false,
    title: '',
    command: '',
    args: [] as string[],
    status: 'idle' as 'idle' | 'running' | 'completed' | 'failed' | 'cancelled',
    output: '',
    progress: 0,
  });

  const handleNavigate = (view: string): void => {
    if (view === 'quick-scan' || view === 'full-analysis' || view === 'generate-report') {
      const commands = {
        'quick-scan': ['scan', '--quick'],
        'full-analysis': ['analyze'],
        'generate-report': ['report', '--output', 'report.json'],
      };
      const titles = {
        'quick-scan': 'Quick Scan',
        'full-analysis': 'Full Analysis',
        'generate-report': 'Generate Report',
      };

      setOperationDialog({
        isOpen: true,
        title: titles[view as keyof typeof titles] || view,
        command: 'openclaw',
        args: commands[view as keyof typeof commands] || [],
        status: 'running',
        output: '',
        progress: 0,
      });

      cliService
        .executeCommand('openclaw', commands[view as keyof typeof commands])
        .then((result) => {
          setOperationDialog((prev) => ({
            ...prev,
            status: result.status,
            output: result.output || '',
            progress: 100,
          }));
        })
        .catch(() => {
          setOperationDialog((prev) => ({ ...prev, status: 'failed', progress: 0 }));
        });
    } else {
      setCurrentView(view as View);
    }
  };

  const handleCloseDialog = (): void => {
    setOperationDialog({
      isOpen: false,
      title: '',
      command: '',
      args: [],
      status: 'idle',
      output: '',
      progress: 0,
    });
  };

  const handleCancelOperation = (): void => {
    setOperationDialog((prev) => ({
      ...prev,
      status: 'cancelled',
    }));
    cliService.cancelCommand(''); // Will need actual commandId
  };

  return (
    <>
      <Layout onNavigate={handleNavigate} currentView={currentView}>
        {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {currentView === 'settings' && <Settings onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'about' && <About onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'operations' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Operations</h2>
            <p className="text-muted-foreground">
              Operation execution interface will be implemented here.
            </p>
          </div>
        )}
        {currentView === 'history' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">History</h2>
            <p className="text-muted-foreground">
              Operation history will be displayed here.
            </p>
          </div>
        )}
        {currentView === 'help' && (
          <div className="p-6 max-w-4xl">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Help & Documentation</h2>
              <p className="text-muted-foreground mb-4">
                Use the sidebar to navigate between Dashboard, Operations, History, and Settings.
              </p>
              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Quick Scan:</strong> Fast analysis of current project</li>
                    <li><strong>Full Analysis:</strong> Comprehensive in-depth analysis</li>
                    <li><strong>Generate Report:</strong> Create detailed reports</li>
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold mb-2">Getting Help</h3>
                  <p className="text-sm text-muted-foreground">
                    For more information, visit the{' '}
                    <a
                      href="https://github.com/mogoweb/mojoclaw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      OpenClaw GitHub repository
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}
      </Layout>

      <OperationDialog
        isOpen={operationDialog.isOpen}
        title={operationDialog.title}
        command={operationDialog.command}
        args={operationDialog.args}
        output={operationDialog.output}
        progress={operationDialog.status === 'completed' ? 100 : operationDialog.progress}
        status={operationDialog.status}
        onCancel={handleCancelOperation}
        onClose={handleCloseDialog}
      />
    </>
  );
}

export default App;
