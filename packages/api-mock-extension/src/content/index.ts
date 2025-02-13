import { InjectionIndicator } from './components/InjectionIndicator';

// 创建一个显示注入成功的对话框
function showInjectionDialog() {
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 999999;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  dialog.textContent = 'Content Script Injected! 🚀';
  document.body.appendChild(dialog);

  // 3秒后移除对话框
  setTimeout(() => {
    dialog.style.transition = 'opacity 0.5s';
    dialog.style.opacity = '0';
    setTimeout(() => dialog.remove(), 500);
  }, 3000);
}

// 立即执行的初始化函数
(async function initialize() {
  const url = window.location.href;
  console.log('Content script starting initialization in:', url);

  try {
    // 设置一个标记表示 content script 已加载
    (window as any).__CONTENT_SCRIPT_LOADED__ = true;
    console.log('Content script initialized and ready in:', url);

    // 创建并挂载注入指示器
    const indicator = new InjectionIndicator();

    // 确保DOM加载后再显示指示器
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => indicator.mount());
    } else {
      indicator.mount();
    }
  } catch (error) {
    console.error('Failed to initialize content script:', error);
  }
})();

// 添加消息监听器
chrome.runtime.onMessage.addListener(
  (message: any, sender, sendResponse: (response: any) => void) => {
    const tabId = sender.tab?.id;
    const url = window.location.href;
    console.log(
      `Content script received message in tab ${tabId}:`,
      message,
      'URL:',
      url
    );

    // 处理 PING 消息
    if (message.type === 'PING') {
      console.log(`Responding to PING message in tab ${tabId}`);
      sendResponse(true);
      return true;
    }

    // 处理文本爬取消息
    if (message.type === 'CRAWL_TEXT') {
      try {
        console.log(
          `Processing CRAWL_TEXT message in tab ${tabId} with options:`,
          message.data.options
        );
        // 这里我们直接实现文本提取逻辑，而不是导入
        const result = {
          title: document.title,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          blocks: Array.from(
            document.querySelectorAll('p, article, section, div > p')
          )
            .filter((el) => {
              const text = el.textContent?.trim();
              return text && text.length > 50; // 只提取有意义的文本块
            })
            .map((el, index) => ({
              id: `block-${index}`,
              type: el.tagName.toLowerCase(),
              content: el.textContent?.trim() || '',
              html: el.innerHTML,
              metadata: {
                wordCount: el.textContent?.trim().split(/\s+/).length || 0,
                charCount: el.textContent?.trim().length || 0,
              },
              images: Array.from(el.querySelectorAll('img')).map((img) => ({
                url: img.src,
                alt: img.alt,
              })),
            })),
          stats: {
            totalBlocks: 0,
            totalWords: 0,
            totalChars: 0,
            totalImages: 0,
          },
        };

        // 计算统计信息
        result.stats.totalBlocks = result.blocks.length;
        result.stats.totalWords = result.blocks.reduce(
          (sum, block) => sum + block.metadata.wordCount,
          0
        );
        result.stats.totalChars = result.blocks.reduce(
          (sum, block) => sum + block.metadata.charCount,
          0
        );
        result.stats.totalImages = result.blocks.reduce(
          (sum, block) => sum + block.images.length,
          0
        );

        console.log(`Text extraction successful in tab ${tabId}`);
        sendResponse({ result });
      } catch (error) {
        console.error(`Text extraction failed in tab ${tabId}:`, error);
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        });
      }
      return true;
    }

    // 对于未知消息类型，返回 false
    console.warn(`Unknown message type in tab ${tabId}:`, message.type);
    return false;
  }
);
