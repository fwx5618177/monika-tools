import type { MockRule, MockConfig } from '../interfaces/types';
import { StorageService } from './storageService';

export class MockService {
  private static instance: MockService;
  private storageService: StorageService;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): MockService {
    if (!MockService.instance) {
      MockService.instance = new MockService();
    }
    return MockService.instance;
  }

  async getConfig(): Promise<MockConfig> {
    return await this.storageService.getConfig();
  }

  async updateConfig(config: MockConfig): Promise<MockConfig> {
    await this.storageService.setConfig(config);
    return config;
  }

  async addRule(rule: MockRule): Promise<MockConfig> {
    const config = await this.getConfig();
    config.rules.push(rule);
    await this.storageService.setConfig(config);
    return config;
  }

  async deleteRule(ruleId: string): Promise<MockConfig> {
    const config = await this.getConfig();
    config.rules = config.rules.filter((rule) => rule.id !== ruleId);
    await this.storageService.setConfig(config);
    return config;
  }

  async toggleRule(ruleId: string): Promise<MockConfig> {
    const config = await this.getConfig();
    const rule = config.rules.find((rule) => rule.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      await this.storageService.setConfig(config);
    }
    return config;
  }

  async findMatchingRule(
    url: string,
    method: string
  ): Promise<MockRule | null> {
    const config = await this.getConfig();
    if (!config.enabled) return null;

    return (
      config.rules.find((rule) => {
        if (!rule.enabled) return false;
        if (rule.method !== method) return false;

        try {
          const pattern = new RegExp(rule.url);
          return pattern.test(url);
        } catch (error) {
          console.error('Invalid regex pattern:', rule.url);
          return false;
        }
      }) || null
    );
  }
}
