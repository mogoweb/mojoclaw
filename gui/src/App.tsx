import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Settings } from './components/settings/settings';
import { About } from './components/settings/about';
import { OperationDialog } from './components/operations/operation-dialog';
import { HistoryViewer } from './components/history/history-viewer';
import { HelpDialog } from './components/help/help-dialog';
import { StatusBar } from './components/status-bar/status-bar';
import { ToastProvider, useToast } from './components/ui/toast';
import { cliService } from './services/cliService';

type View = 'dashboard' | 'operations' | 'history' | 'settings' | 'about' | 'help';

function AppContent(): ReactNode {
  const [currentView, setCurrentView] = React.useState<View>('dashboard');
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [operationDialog, setOperationDialog] = React.useState({
    isOpen: false,
    title: '',
    command: '',
    args: [] as string[],
    status: 'idle' as 'idle' | 'running' | 'completed' | 'failed' | 'cancelled',
    output: '',
    progress: 0,
  });
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setHelpOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    cliService.subscribeToElectronIPC();
  }, []);

  useEffect(() => {
    const unsubscribe = cliService.onComplete((data) => {
      if (data.success) {
        toast.success('Operation completed', 'Operation finished successfully');
      } else {
        toast.error('Operation failed', data.error || 'An error occurred');
      }
    });
    return unsubscribe;
  }, [toast]);

  const handleNavigate = (view: string): void => {
    if (view === 'quick-scan' || view === 'full-analysis' || view === 'generate-report') {
      const commands = {
        'quick-scan': ['health'],
        'full-analysis': ['status'],
        'generate-report': ['models', 'status'],
      };
      const titles = {
        'quick-scan': 'Health Check',
        'full-analysis': 'System Status',
        'generate-report': 'Models Info',
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
    cliService.cancelCommand('');
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
        {currentView === 'history' && <HistoryViewer />}
        <StatusBar />
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

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}

function App(): ReactNode {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
