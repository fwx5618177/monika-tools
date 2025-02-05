export interface MockRule {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  response: any;
  headers?: Record<string, string>;
  delay?: number;
  enabled: boolean;
}

export interface MockConfig {
  rules: MockRule[];
  enabled: boolean;
  globalDelay: number;
}

export interface RequestLog {
  id: string;
  timestamp: number;
  url: string;
  method: string;
  matched: boolean;
  ruleId?: string;
  statusCode: number;
  duration: number;
}

export interface StorageData {
  mock_config: MockConfig;
  request_logs: RequestLog[];
}
