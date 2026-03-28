import type { AppSettings } from '../stores/settingsStore';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateSettings(settings: Partial<AppSettings>): ValidationResult {
  const errors: Record<string, string> = {};

  if (settings.openclawPath !== undefined) {
    if (!settings.openclawPath || settings.openclawPath.trim() === '') {
      errors.openclawPath = 'OpenClaw path is required';
    }
  }

  if (settings.theme !== undefined) {
    const validThemes = ['light', 'dark', 'system'];
    if (!validThemes.includes(settings.theme)) {
      errors.theme = 'Invalid theme selection';
    }
  }

  if (settings.defaultScanMode !== undefined) {
    const validModes = ['quick', 'full'];
    if (!validModes.includes(settings.defaultScanMode)) {
      errors.defaultScanMode = 'Invalid scan mode';
    }
  }

  if (settings.outputFormat !== undefined) {
    const validFormats = ['text', 'json', 'html'];
    if (!validFormats.includes(settings.outputFormat)) {
      errors.outputFormat = 'Invalid output format';
    }
  }

  if (settings.windowBounds !== undefined) {
    const bounds = settings.windowBounds;
    if (bounds.width < 400) {
      errors['windowBounds.width'] = 'Width must be at least 400px';
    }
    if (bounds.height < 300) {
      errors['windowBounds.height'] = 'Height must be at least 300px';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateOpenclawPath(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.electron) {
      resolve(false);
      return;
    }
    window.electron.validatePath(path).then(resolve);
  });
}
