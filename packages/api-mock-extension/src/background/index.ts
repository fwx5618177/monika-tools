import { MESSAGE_TYPES } from '@/common/constants';
import { MockService } from './services/mockService';
import { StorageService } from './services/storageService';

// 初始化服务
const mockService = MockService.getInstance();
const storageService = StorageService.getInstance();

// 保存点击监听器的引用
let actionClickListener: ((tab: chrome.tabs.Tab) => Promise<void>) | null =
  null;

// 确保默认为弹窗模式
const initializePopupMode = async () => {
  await chrome.action.setPopup({ popup: 'index.html' });
  // 禁用侧边栏，确保默认不会打开侧边栏
  await chrome.sidePanel.setOptions({ enabled: false });
  // 移除可能存在的点击监听器
  if (actionClickListener) {
    chrome.action.onClicked.removeListener(actionClickListener);
    actionClickListener = null;
  }
};

// 创建定期运行的 alarm 来保持 service worker 活跃
const createKeepAliveAlarm = () => {
  chrome.alarms.create('keepAlive', {
    periodInMinutes: 1,
  });
};

// 监听 alarm 事件
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Service worker kept alive');
  }
});

// 立即执行初始化
initializePopupMode();
createKeepAliveAlarm();

// 监听安装事件
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // 首次安装时的初始化
    console.log('Extension installed');
    await storageService.clear();
    await initializePopupMode(); // 确保安装时也是弹窗模式
    createKeepAliveAlarm(); // 创建 keepAlive alarm
  } else if (details.reason === 'update') {
    // 更新时的处理
    console.log('Extension updated');
    await initializePopupMode(); // 更新时也重置为弹窗模式
    createKeepAliveAlarm(); // 确保 keepAlive alarm 存在
  }
});

// 监听卸载事件
chrome.runtime.onSuspend.addListener(() => {
  console.log('Extension uninstalled');
  // 清理工作
});

// 处理来自 popup 和 content script 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, payload } = message;

  console.log('background 收到消息:', message);

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

        case 'TOGGLE_VIEW_MODE':
          try {
            const { mode, windowId } = payload;
            if (mode === 'panel') {
              // 切换到侧边栏模式
              console.log('Switching to panel mode for window:', windowId);

              // 移除之前的监听器（如果存在）
              if (actionClickListener) {
                chrome.action.onClicked.removeListener(actionClickListener);
              }

              // 设置新的点击监听器
              actionClickListener = async (tab: chrome.tabs.Tab) => {
                if (tab.windowId) {
                  await chrome.sidePanel.open({ windowId: tab.windowId });
                }
              };
              chrome.action.onClicked.addListener(actionClickListener);

              await chrome.action.setPopup({ popup: '' }); // 禁用弹窗
              await chrome.sidePanel.setOptions({
                enabled: true,
                path: 'index.html',
              }); // 启用侧边栏并设置路径
            } else {
              // 切换到弹窗模式
              console.log('Switching to popup mode');

              // 移除点击监听器
              if (actionClickListener) {
                chrome.action.onClicked.removeListener(actionClickListener);
                actionClickListener = null;
              }

              await chrome.sidePanel.setOptions({ enabled: false }); // 禁用侧边栏
              await chrome.action.setPopup({ popup: 'index.html' }); // 启用弹窗
            }
            sendResponse(true);
          } catch (error) {
            console.error('Error toggling view mode:', error);
            sendResponse(false);
          }
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

// 监听网络请求，用于记录请求日志
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // 记录请求日志
    if (details.type === 'xmlhttprequest') {
      const log = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        url: details.url,
        method: details.method,
        matched: false,
        statusCode: 200,
        duration: 0,
      };
      // 异步记录日志，但不阻塞请求
      storageService.addLog(log).catch(console.error);
    }
  },
  { urls: ['<all_urls>'] }
);

// 确保 content script 已注入
async function ensureContentScriptInjected(tabId: number) {
  try {
    // 先尝试发送 PING 消息检查 content script 是否已加载
    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
      if (response === true) {
        console.log('Content script already loaded in tab:', tabId);
        return; // content script 已加载，不需要重新注入
      }
    } catch (e) {
      // 消息发送失败，说明 content script 未加载
      console.log('Content script not loaded in tab:', tabId, 'injecting...');
    }

    // 注入 content script
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });

    // 等待 content script 完全初始化
    let retries = 0;
    const maxRetries = 15; // 增加重试次数
    const retryInterval = 1000; // 增加重试间隔到 1 秒

    while (retries < maxRetries) {
      try {
        const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
        if (response === true) {
          console.log('Content script successfully initialized in tab:', tabId);
          return;
        }
      } catch (e) {
        console.log(`Retry ${retries + 1}/${maxRetries} for tab:`, tabId);
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retries++;
    }

    throw new Error(
      `Content script initialization timeout after ${maxRetries} retries`
    );
  } catch (error) {
    console.error('Content script injection failed for tab:', tabId, error);
    throw error;
  }
}

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 只在页面完全加载后注入一次
  if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    console.log('Page fully loaded, injecting content script for tab:', tabId);
    ensureContentScriptInjected(tabId).catch((error) => {
      console.error('Failed to inject content script:', error);
    });
  }
});
