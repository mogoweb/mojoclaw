import { describe, it, expect } from 'vitest';
import { useSettingsStore } from '../stores/settingsStore';

describe('Settings Store', () => {
  it('should have default settings', () => {
    const { settings } = useSettingsStore.getState();
    expect(settings.openclawPath).toBe('openclaw');
    expect(settings.theme).toBe('system');
    expect(settings.defaultScanMode).toBe('quick');
    expect(settings.outputFormat).toBe('text');
  });

  it('should update settings partially', () => {
    const { setSettings } = useSettingsStore.getState();
    setSettings({ theme: 'dark' });

    const { settings } = useSettingsStore.getState();
    expect(settings.theme).toBe('dark');
    expect(settings.openclawPath).toBe('openclaw');
  });

  it('should reset settings to defaults', () => {
    const { setSettings, resetSettings } = useSettingsStore.getState();
    setSettings({ theme: 'dark', openclawPath: '/custom/path' });
    resetSettings();

    const { settings } = useSettingsStore.getState();
    expect(settings.theme).toBe('system');
    expect(settings.openclawPath).toBe('openclaw');
  });
});
