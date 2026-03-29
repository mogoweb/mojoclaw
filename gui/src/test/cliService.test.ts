import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cliService } from '../services/cliService';

vi.mock('../types/cli', () => ({}));

describe('CliService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeCommand', () => {
    it('should create a command with a unique ID', async () => {
      const result = await cliService.executeCommand('echo', ['hello']);
      expect(result.commandId).toBeDefined();
      expect(result.command).toBe('echo');
      expect(result.args).toEqual(['hello']);
    });

    it('should set status to running initially', async () => {
      const result = await cliService.executeCommand('echo', ['hello']);
      expect(result.status).toBe('running');
    });
  });

  describe('cancelCommand', () => {
    it('should handle cancellation of non-existent command', async () => {
      await expect(cliService.cancelCommand('non-existent')).resolves.not.toThrow();
    });
  });

  describe('getCommandHistory', () => {
    it('should return empty array when no commands run', () => {
      const history = cliService.getCommandHistory();
      expect(history).toEqual([]);
    });
  });

  describe('getRunningCommands', () => {
    it('should return empty array initially', () => {
      const running = cliService.getRunningCommands();
      expect(running).toEqual([]);
    });
  });
});
