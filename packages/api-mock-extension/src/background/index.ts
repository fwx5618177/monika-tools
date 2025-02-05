import { MESSAGE_TYPES } from '@/common/constants';
import { MockService } from './services/mockService';
import { StorageService } from './services/storageService';

const mockService = MockService.getInstance();
const storageService = StorageService.getInstance();

// 处理来自 popup 和 content script 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, payload } = message;

  (async () => {
    try {
      switch (type) {
        case MESSAGE_TYPES.GET_CONFIG:
          sendResponse(await mockService.getConfig());
          break;

        case MESSAGE_TYPES.UPDATE_CONFIG:
          sendResponse(await mockService.updateConfig(payload));
          break;

        case MESSAGE_TYPES.ADD_RULE:
          sendResponse(await mockService.addRule(payload));
          break;

        case MESSAGE_TYPES.DELETE_RULE:
          sendResponse(await mockService.deleteRule(payload));
          break;

        case MESSAGE_TYPES.TOGGLE_RULE:
          sendResponse(await mockService.toggleRule(payload));
          break;

        case MESSAGE_TYPES.GET_MOCK:
          const rule = await mockService.findMatchingRule(
            payload.url,
            payload.method
          );
          sendResponse(rule);
          break;

        case MESSAGE_TYPES.GET_LOGS:
          sendResponse(await storageService.getLogs());
          break;

        case MESSAGE_TYPES.CLEAR_LOGS:
          await storageService.clearLogs();
          sendResponse(true);
          break;

        default:
          console.warn('Unknown message type:', type);
          sendResponse(null);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse(null);
    }
  })();

  // 返回 true 表示会异步发送响应
  return true;
});
