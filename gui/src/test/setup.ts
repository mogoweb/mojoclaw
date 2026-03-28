import '@testing-library/jest-dom';

// Mock window.electron for tests
Object.defineProperty(window, 'electron', {
  value: {
    executeCommand: vi.fn(),
    cancelCommand: vi.fn(),
    loadSettings: vi.fn().mockResolvedValue({}),
    saveSettings: vi.fn().mockResolvedValue(undefined),
    validatePath: vi.fn().mockResolvedValue(true),
    checkRunningOperations: vi.fn().mockResolvedValue(false),
    confirmQuit: vi.fn().mockResolvedValue(undefined),
    showCloseDialog: vi.fn().mockResolvedValue(true),
    onCommandProgress: vi.fn().mockReturnValue(() => {}),
    onCommandComplete: vi.fn().mockReturnValue(() => {}),
    onCheckRunningOperations: vi.fn().mockReturnValue(() => {}),
    onOpenSettings: vi.fn().mockReturnValue(() => {}),
  },
  writable: true,
});
