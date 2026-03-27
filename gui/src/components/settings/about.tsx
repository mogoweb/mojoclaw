import type { ReactNode } from 'react';

interface AboutProps {
  onBack?: () => void;
}

/**
 * About view component
 */
export function About({ onBack }: AboutProps): ReactNode {
  return (
    <div className="p-6 max-w-2xl mx-auto">
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
          <h2 className="text-3xl font-bold">About OpenClaw GUI</h2>
        </div>
      </header>

      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="text-6xl mb-6">🦀</div>
        <h3 className="text-2xl font-bold mb-2">OpenClaw GUI</h3>
        <p className="text-muted-foreground mb-6">Desktop graphical interface for OpenClaw</p>

        <div className="border-t border-border pt-6 mt-6">
          <dl className="space-y-3 text-left max-w-sm mx-auto">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Version</dt>
              <dd className="text-sm font-medium">0.1.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Electron</dt>
              <dd className="text-sm font-medium">34.x</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">React</dt>
              <dd className="text-sm font-medium">19.x</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">License</dt>
              <dd className="text-sm font-medium">MIT</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-border pt-6 mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            OpenClaw GUI is a user-friendly desktop application that provides a graphical
            interface for the OpenClaw command-line tool.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/mogoweb/mojoclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              GitHub Repository
            </a>
            <a
              href="https://github.com/mogoweb/mojoclaw/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © 2026 OpenClaw Contributors. All rights reserved.
      </footer>
    </div>
  );
}
