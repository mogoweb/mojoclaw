import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
  openclawPath: string;
  theme: 'light' | 'dark' | 'system';
  defaultScanMode: 'quick' | 'full';
  outputFormat: 'text' | 'json' | 'html';
  autoCheckUpdates: boolean;
  showNotifications: boolean;
  minimizeToTray: boolean;
  windowBounds: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  };
}

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  openclawPath: 'openclaw',
  theme: 'system',
  defaultScanMode: 'quick',
  outputFormat: 'text',
  autoCheckUpdates: true,
  showNotifications: true,
  minimizeToTray: false,
  windowBounds: {
    width: 1200,
    height: 800,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,

      setSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      loadSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          if (window.electron) {
            const loaded = await window.electron.loadSettings();
            if (loaded) {
              set({ settings: loaded as unknown as AppSettings, isLoading: false });
              return;
            }
          }
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load settings',
            isLoading: false,
          });
        }
      },

      saveSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          if (window.electron) {
            await window.electron.saveSettings(get().settings as unknown as Record<string, unknown>);
          }
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to save settings',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'openclaw-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
