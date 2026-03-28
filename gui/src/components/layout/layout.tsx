import { useState, useEffect, type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  onNavigate?: (view: string) => void;
  currentView?: string;
}

/**
 * Main application layout component
 */
export function Layout({ children, onNavigate, currentView }: LayoutProps): ReactNode {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {(!isMobile || sidebarOpen) && (
        <div
          className={`
            ${isMobile ? 'fixed inset-0 z-40' : ''}
            ${isMobile ? 'bg-black/50' : ''}
          `}
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <Sidebar
            onNavigate={(view) => {
              onNavigate?.(view);
              if (isMobile) setSidebarOpen(false);
            }}
            currentView={currentView}
            isMobile={isMobile}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}
      <main className="flex-1 overflow-auto">
        {isMobile && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 p-2 bg-card border border-border rounded-md shadow-md"
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
        {children}
      </main>
    </div>
  );
}

interface SidebarProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar navigation component
 */
function Sidebar({ onNavigate, currentView = 'dashboard', isMobile, onClose }: SidebarProps): ReactNode {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'operations', label: 'Operations', icon: '⚡' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className={`
      w-64 bg-card border-r border-border flex flex-col
      ${isMobile ? 'w-72 h-full' : ''}
    `}>
      <header className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">OpenClaw</h1>
          <p className="text-sm text-muted-foreground mt-1">Desktop GUI</p>
        </div>
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </header>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate?.(item.id)}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                  currentView === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="p-4 border-t border-border">
        <button
          type="button"
          onClick={() => onNavigate?.('about')}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm text-muted-foreground"
        >
          <span className="mr-2">❓</span>
          About OpenClaw
        </button>
      </footer>
    </aside>
  );
}
