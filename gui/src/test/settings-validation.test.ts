import { describe, it, expect } from 'vitest';
import { validateSettings } from '../lib/settings-validation';
import type { AppSettings } from '../stores/settingsStore';

describe('validateSettings', () => {
  it('should return valid for correct settings', () => {
    const settings: Partial<AppSettings> = {
      openclawPath: '/usr/bin/openclaw',
      theme: 'dark',
      defaultScanMode: 'quick',
      outputFormat: 'text',
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return error for empty openclawPath', () => {
    const settings: Partial<AppSettings> = {
      openclawPath: '',
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(false);
    expect(result.errors.openclawPath).toBeDefined();
  });

  it('should return error for invalid theme', () => {
    const settings: Partial<AppSettings> = {
      theme: 'invalid' as 'light' | 'dark' | 'system',
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(false);
    expect(result.errors.theme).toBeDefined();
  });

  it('should return error for invalid scan mode', () => {
    const settings: Partial<AppSettings> = {
      defaultScanMode: 'invalid' as 'quick' | 'full',
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(false);
    expect(result.errors.defaultScanMode).toBeDefined();
  });

  it('should return error for invalid output format', () => {
    const settings: Partial<AppSettings> = {
      outputFormat: 'invalid' as 'text' | 'json' | 'html',
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(false);
    expect(result.errors.outputFormat).toBeDefined();
  });

  it('should return error for window width below minimum', () => {
    const settings: Partial<AppSettings> = {
      windowBounds: {
        width: 300,
        height: 600,
      },
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(false);
    expect(result.errors['windowBounds.width']).toBeDefined();
  });

  it('should return error for window height below minimum', () => {
    const settings: Partial<AppSettings> = {
      windowBounds: {
        width: 800,
        height: 200,
      },
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(false);
    expect(result.errors['windowBounds.height']).toBeDefined();
  });

  it('should pass for valid window bounds', () => {
    const settings: Partial<AppSettings> = {
      windowBounds: {
        width: 1200,
        height: 800,
      },
    };

    const result = validateSettings(settings);
    expect(result.isValid).toBe(true);
  });
});
