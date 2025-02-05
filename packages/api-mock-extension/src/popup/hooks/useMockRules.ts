import { useState, useEffect, useCallback } from 'react';
import type { MockRule, MockConfig } from '../../background/interfaces/types';

const MESSAGE_TYPES = {
  GET_CONFIG: 'GET_CONFIG',
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  ADD_RULE: 'ADD_RULE',
  DELETE_RULE: 'DELETE_RULE',
  TOGGLE_RULE: 'TOGGLE_RULE',
} as const;

// 开发环境下的模拟数据
const mockConfig: MockConfig = {
  rules: [],
  enabled: false,
  globalDelay: 0,
};

const isExtensionEnvironment = !!chrome?.runtime?.id;

export const useMockRules = () => {
  const [config, setConfig] = useState<MockConfig>(mockConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (type: string, payload?: any) => {
    // 检查是否在扩展环境中
    if (!isExtensionEnvironment) {
      console.warn('Running in development environment, using mock data');
      return mockConfig;
    }

    if (!chrome?.runtime?.sendMessage) {
      setError('Chrome API not available');
      return null;
    }

    try {
      return await chrome.runtime.sendMessage({ type, payload });
    } catch (error) {
      console.error('Message sending failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const config = await sendMessage(MESSAGE_TYPES.GET_CONFIG);
      if (config) {
        setConfig(config);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  }, [sendMessage]);

  useEffect(() => {
    fetchConfig();

    // 只在扩展环境中设置存储监听器
    if (!isExtensionEnvironment) {
      return;
    }

    // 检查 Chrome API 是否可用
    if (!chrome?.storage?.onChanged) {
      setError('Chrome storage API not available');
      return;
    }

    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.mock_config) {
        setConfig(changes.mock_config.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      if (chrome?.storage?.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, [fetchConfig]);

  const toggleEnabled = useCallback(async () => {
    try {
      const newConfig = await sendMessage(MESSAGE_TYPES.UPDATE_CONFIG, {
        ...config,
        enabled: !config.enabled,
      });
      if (newConfig) {
        setConfig(newConfig);
      }
    } catch (error) {
      console.error('Failed to toggle enabled state:', error);
    }
  }, [config, sendMessage]);

  const addRule = useCallback(
    async (rule: MockRule) => {
      try {
        const newConfig = await sendMessage(MESSAGE_TYPES.ADD_RULE, rule);
        if (newConfig) {
          setConfig(newConfig);
        }
      } catch (error) {
        console.error('Failed to add rule:', error);
      }
    },
    [sendMessage]
  );

  const deleteRule = useCallback(
    async (ruleId: string) => {
      try {
        const newConfig = await sendMessage(MESSAGE_TYPES.DELETE_RULE, ruleId);
        if (newConfig) {
          setConfig(newConfig);
        }
      } catch (error) {
        console.error('Failed to delete rule:', error);
      }
    },
    [sendMessage]
  );

  const toggleRule = useCallback(
    async (ruleId: string) => {
      try {
        const newConfig = await sendMessage(MESSAGE_TYPES.TOGGLE_RULE, ruleId);
        if (newConfig) {
          setConfig(newConfig);
        }
      } catch (error) {
        console.error('Failed to toggle rule:', error);
      }
    },
    [sendMessage]
  );

  return {
    config,
    loading,
    error,
    toggleEnabled,
    addRule,
    deleteRule,
    toggleRule,
    refresh: fetchConfig,
  };
};
