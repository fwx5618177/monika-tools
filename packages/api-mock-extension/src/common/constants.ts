export const MESSAGE_TYPES = {
  GET_MOCK: 'GET_MOCK',
  GET_CONFIG: 'GET_CONFIG',
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  ADD_RULE: 'ADD_RULE',
  DELETE_RULE: 'DELETE_RULE',
  TOGGLE_RULE: 'TOGGLE_RULE',
  GET_LOGS: 'GET_LOGS',
  CLEAR_LOGS: 'CLEAR_LOGS'
} as const;

export const STORAGE_KEYS = {
  CONFIG: 'mock_config',
  LOGS: 'request_logs'
} as const;

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
} as const; 