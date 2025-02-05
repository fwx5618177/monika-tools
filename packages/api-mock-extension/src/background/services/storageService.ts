import type { MockConfig, RequestLog } from '../interfaces/types';
import { STORAGE_KEYS } from '@/common/constants';

const defaultConfig: MockConfig = {
  rules: [],
  enabled: false,
  globalDelay: 0,
};

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getConfig(): Promise<MockConfig> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.CONFIG);
      return result[STORAGE_KEYS.CONFIG] || defaultConfig;
    } catch (error) {
      console.error('Failed to get config:', error);
      return defaultConfig;
    }
  }

  async setConfig(config: MockConfig): Promise<void> {
    try {
      await chrome.storage.local.set({ [STORAGE_KEYS.CONFIG]: config });
    } catch (error) {
      console.error('Failed to set config:', error);
      throw error;
    }
  }

  async getLogs(): Promise<RequestLog[]> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.LOGS);
      return result[STORAGE_KEYS.LOGS] || [];
    } catch (error) {
      console.error('Failed to get logs:', error);
      return [];
    }
  }

  async addLog(log: RequestLog): Promise<void> {
    try {
      const logs = await this.getLogs();
      logs.unshift(log);
      // 只保留最近 1000 条日志
      if (logs.length > 1000) {
        logs.pop();
      }
      await chrome.storage.local.set({ [STORAGE_KEYS.LOGS]: logs });
    } catch (error) {
      console.error('Failed to add log:', error);
      throw error;
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await chrome.storage.local.remove(STORAGE_KEYS.LOGS);
    } catch (error) {
      console.error('Failed to clear logs:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
}
