import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

/**
 * Dashboard view with quick action cards
 */
export function Dashboard({ onNavigate }: DashboardProps): ReactNode {
  const quickActions = [
    {
      id: 'quick-scan',
      title: 'Quick Scan',
      description: 'Run a quick analysis scan',
      icon: '🔍',
      action: () => onNavigate?.('quick-scan'),
    },
    {
      id: 'full-analysis',
      title: 'Full Analysis',
      description: 'Complete in-depth analysis',
      icon: '📊',
      action: () => onNavigate?.('full-analysis'),
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create a detailed report',
      icon: '📝',
      action: () => onNavigate?.('generate-report'),
    },
    {
      id: 'view-history',
      title: 'View History',
      description: 'Past operations and results',
      icon: '🕐',
      action: () => onNavigate?.('history'),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Welcome to OpenClaw GUI. Quick actions below.</p>
      </header>

      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.action}
              className="p-6 bg-card border border-border rounded-lg hover:border-accent hover:bg-accent/50 transition-all text-left"
            >
              <div className="text-3xl mb-4">{action.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <p className="text-muted-foreground text-sm mb-4">Your recent operations will appear here.</p>
          <Button variant="outline" onClick={() => onNavigate?.('history')}>
            View All History
          </Button>
        </div>
      </section>
    </div>
  );
}
