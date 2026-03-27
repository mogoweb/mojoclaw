import type { ReactNode } from 'react';

interface SettingsProps {
  onBack?: () => void;
}

/**
 * Settings view component
 */
export function Settings({ onBack }: SettingsProps): ReactNode {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-sm hover:text-accent-foreground"
            >
              ← Back
            </button>
          )}
          <h2 className="text-3xl font-bold">Settings</h2>
        </div>
        <p className="text-muted-foreground mt-2">Configure OpenClaw GUI preferences</p>
      </header>

      <form className="space-y-6">
        <section className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">OpenClaw Configuration</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="openclaw-path" className="block text-sm font-medium mb-2">
                OpenClaw Binary Path
              </label>
              <div className="flex gap-2">
                <input
                  id="openclaw-path"
                  type="text"
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
                  placeholder="/usr/local/bin/openclaw or C:\\Program Files\\openclaw.exe"
                  defaultValue=""
                />
                <button type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  Browse...
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to use bundled binary or system PATH
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium mb-2">
                Theme
              </label>
              <select
                id="theme"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Advanced</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto-save operation history</p>
                <p className="text-xs text-muted-foreground">Save all operation outputs</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Show notifications</p>
                <p className="text-xs text-muted-foreground">Display toast for operation results</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="history-limit" className="block text-sm font-medium mb-2">
                History Limit
              </label>
              <input
                id="history-limit"
                type="number"
                min="10"
                max="1000"
                defaultValue="100"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="button"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Save Settings
          </button>
          <button type="button" className="px-6 py-2 border border-input rounded-md hover:bg-accent">
            Reset to Defaults
          </button>
        </div>
      </form>
    </div>
  );
}
