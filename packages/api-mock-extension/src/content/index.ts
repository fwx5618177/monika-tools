import { InjectionIndicator } from './components/InjectionIndicator';
import type { TextCrawlResult, TextBlock, PageMetadata } from '@/types';
import html2canvas from 'html2canvas';

// 文本清理和格式化函数
function cleanAndFormatText(
  text: string,
  preserveFormat: boolean = false
): string {
  if (preserveFormat) {
    return text
      .replace(/[\n\r]+/g, '\n') // 保留单个换行
      .replace(/[^\S\r\n]+/g, ' ') // 规范化空白字符（保留换行）
      .replace(/\n\s+/g, '\n') // 清理每行开头的空白
      .replace(/\s+\n/g, '\n') // 清理每行结尾的空白
      .trim();
  }
  return text
    .replace(/[\n\r]+/g, ' ') // 替换换行为空格
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim();
}

// HTML 清理函数
function cleanHtml(html: string, preserveFormat: boolean = false): string {
  if (preserveFormat) {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除脚本
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // 移除样式
      .replace(/<\/?(?!br|p|div|h[1-6])[^>]+(>|$)/g, '') // 只保留换行相关的标签
      .replace(/(<br\s*\/?>)/gi, '\n') // 转换<br>为换行
      .replace(/<\/(p|div|h[1-6])>/gi, '\n\n') // 段落结束添加双换行
      .replace(/<[^>]+>/g, '') // 移除剩余标签
      .replace(/&nbsp;/g, ' ') // 替换HTML空格
      .replace(/&[a-z]+;/gi, '') // 移除其他HTML实体
      .replace(/\n\s+/g, '\n') // 清理每行开头的空白
      .replace(/\s+\n/g, '\n') // 清理每行结尾的空白
      .replace(/\n{3,}/g, '\n\n') // 最多保留两个连续换行
      .trim();
  }
  return html
    .replace(/<[^>]+>/g, '') // 移除所有HTML标签
    .replace(/&nbsp;/g, ' ') // 替换HTML空格
    .replace(/&[a-z]+;/gi, '') // 移除其他HTML实体
    .trim();
}

// 规范化图片URL
function normalizeImageUrl(url: string): string {
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

// 检查文本块是否有意义
function isSignificantText(text: string): boolean {
  const cleanText = cleanAndFormatText(text);
  // 检查文本长度和内容质量
  return (
    cleanText.length >= 50 && // 最小长度
    cleanText.split(/\s+/).length >= 5 && // 最少词数
    !/^\d+$/.test(cleanText) && // 不全是数字
    !/^[^a-zA-Z]+$/.test(cleanText) // 包含一些字母
  );
}

// 获取元素的语言
function getElementLang(el: Element): string {
  let current = el as HTMLElement;
  while (current) {
    if (current.lang) {
      return current.lang;
    }
    current = current.parentElement as HTMLElement;
  }
  return document.documentElement.lang || 'unknown';
}

// 提取文本块的作者信息
function extractAuthorInfo(el: Element): string | undefined {
  // 查找可能包含作者信息的元素
  const authorEl = el.querySelector(
    '[rel="author"], [class*="author"], [class*="byline"]'
  );
  if (authorEl) {
    return cleanAndFormatText(authorEl.textContent || '');
  }
  return undefined;
}

// 提取发布时间
function extractTimestamp(el: Element): string | undefined {
  const timeEl = el.querySelector(
    'time, [datetime], [class*="date"], [class*="time"]'
  );
  if (timeEl) {
    const datetime = timeEl.getAttribute('datetime');
    if (datetime) {
      try {
        return new Date(datetime).toISOString();
      } catch {
        // 如果datetime解析失败，使用文本内容
        return cleanAndFormatText(timeEl.textContent || '');
      }
    }
    return cleanAndFormatText(timeEl.textContent || '');
  }
  return undefined;
}

// 创建一个显示注入成功的对话框

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

// 添加辅助函数来映射元素类型到 TextBlock 类型
function mapElementTypeToBlockType(
  tagName: string,
  classList: DOMTokenList
): 'text' | 'title' | 'quote' | 'list' | 'code' | 'forum-post' {
  const tag = tagName.toLowerCase();
  const classes = Array.from(classList).join(' ').toLowerCase();

  // Check for headings
  if (/^h[1-6]$/.test(tag)) {
    return 'title';
  }

  // Check for quotes
  if (tag === 'blockquote' || tag === 'q' || classes.includes('quote')) {
    return 'quote';
  }

  // Check for lists
  if (tag === 'ul' || tag === 'ol' || tag === 'dl') {
    return 'list';
  }

  // Check for code blocks
  if (tag === 'pre' || tag === 'code' || classes.includes('code')) {
    return 'code';
  }

  // Check for forum posts
  if (
    classes.includes('post') ||
    classes.includes('comment') ||
    classes.includes('forum')
  ) {
    return 'forum-post';
  }

  // Default to text
  return 'text';
}

// 获取标题级别
function getHeadingLevel(tagName: string): number | undefined {
  const match = tagName.match(/h(\d)/i);
  return match ? parseInt(match[1]) : undefined;
}

// 提取公共的文本提取逻辑
function extractTextContent(
  options: {
    preserveHtml?: boolean;
    preserveFormat?: boolean;
    selector?: string;
  } = {}
): {
  blocks: TextBlock[];
  metadata: PageMetadata;
  stats: {
    totalBlocks: number;
    totalWords: number;
    totalChars: number;
    totalImages: number;
  };
} {
  // 首先提取标题
  const titleSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(',');
  const titleElements = Array.from(
    document.querySelectorAll(titleSelectors)
  ).filter((el) => {
    // 过滤掉导航、页脚等区域的标题
    const isNavOrFooter = el.closest(
      'nav, footer, header, [role="navigation"]'
    );
    return !isNavOrFooter;
  });

  // 定义要提取的正文选择器
  const contentSelectors = options.selector
    ? [options.selector]
    : [
        'article',
        'main',
        'section',
        '.content',
        '.article',
        '.post',
        'p',
        'div > p',
      ];

  // 提取正文块
  const contentElements = Array.from(
    document.querySelectorAll(contentSelectors.join(','))
  ).filter((el) => {
    // 过滤掉导航、页脚等区域
    const isNavOrFooter = el.closest(
      'nav, footer, header, [role="navigation"]'
    );
    if (isNavOrFooter) return false;

    const text = el.textContent?.trim();
    return text && isSignificantText(text);
  });

  // 合并标题和正文，并保持它们的相对位置
  const allElements = [...titleElements, ...contentElements].sort((a, b) => {
    const posA = a.compareDocumentPosition(b);
    const posB = b.compareDocumentPosition(a);
    if (posA & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (posB & Node.DOCUMENT_POSITION_FOLLOWING) return 1;
    return 0;
  });

  // 处理所有元素
  const blocks = allElements.map((el, index) => {
    const text = cleanAndFormatText(
      el.textContent || '',
      options.preserveFormat
    );
    const html = el.innerHTML;
    const cleanedHtml = options.preserveHtml
      ? html
      : cleanHtml(html, options.preserveFormat);

    return {
      id: `block-${index}`,
      type: mapElementTypeToBlockType(el.tagName, el.classList),
      content: text,
      html: cleanedHtml,
      metadata: {
        selector: el.tagName.toLowerCase(),
        position: index,
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
        author: extractAuthorInfo(el),
        timestamp: extractTimestamp(el),
        level: getHeadingLevel(el.tagName),
      },
      images: Array.from(el.querySelectorAll('img')).map((img) => ({
        url: normalizeImageUrl(img.src),
        alt: img.alt,
        title: img.title || null,
        width: img.width || null,
        height: img.height || null,
      })),
      selected: false,
    };
  });

  const metadata: PageMetadata = {
    lang: document.documentElement.lang || 'unknown',
    description:
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || '',
    keywords:
      document
        .querySelector('meta[name="keywords"]')
        ?.getAttribute('content') || '',
    author:
      document.querySelector('meta[name="author"]')?.getAttribute('content') ||
      '',
    charset: document.charset,
  };

  const stats = {
    totalBlocks: blocks.length,
    totalWords: blocks.reduce(
      (sum, block) => sum + block.metadata.wordCount,
      0
    ),
    totalChars: blocks.reduce(
      (sum, block) => sum + block.metadata.charCount,
      0
    ),
    totalImages: blocks.reduce((sum, block) => sum + block.images.length, 0),
  };

  return { blocks, metadata, stats };
}

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

        const { blocks, metadata, stats } = extractTextContent({
          preserveHtml: message.data.options.preserveHtml,
          preserveFormat: message.data.options.preserveFormat,
        });

        const result = {
          title: document.title,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          metadata,
          blocks,
          stats,
        };

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

    // 处理导出为图片的消息
    if (message.type === 'EXPORT_AS_IMAGE') {
      try {
        console.log(
          `Processing EXPORT_AS_IMAGE message in tab ${tabId}:`,
          message.data
        );

        // 创建一个临时容器来渲染内容
        const container = document.createElement('div');
        container.style.cssText = `
          position: fixed;
          left: -9999px;
          top: -9999px;
          width: 800px;
          background: white;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          color: #333;
        `;

        // 添加标题
        if (message.data.includeTitle) {
          const titleEl = document.createElement('h1');
          titleEl.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 24px;
            font-weight: 600;
            color: #000;
          `;
          titleEl.textContent = document.title;
          container.appendChild(titleEl);
        }

        // 添加元数据
        if (message.data.includeMetadata) {
          const metaContainer = document.createElement('div');
          metaContainer.style.cssText = `
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
          `;

          const metadata = {
            URL: window.location.href,
            Time: new Date().toLocaleString(),
            Author: message.data.metadata.author || 'Unknown',
            Language: message.data.metadata.lang || 'Unknown',
          };

          Object.entries(metadata).forEach(([key, value]) => {
            const row = document.createElement('div');
            row.style.marginBottom = '5px';
            row.innerHTML = `<strong>${key}:</strong> ${value}`;
            metaContainer.appendChild(row);
          });

          container.appendChild(metaContainer);
        }

        // 添加选中的文本块
        message.data.blocks.forEach((block: TextBlock) => {
          const blockEl = document.createElement('div');
          blockEl.style.cssText = `
            margin-bottom: 20px;
            padding: ${block.type === 'quote' ? '10px 20px' : '0'};
            border-left: ${block.type === 'quote' ? '4px solid #ddd' : 'none'};
          `;

          if (block.type === 'title') {
            const level = block.metadata.level || 2;
            const heading = document.createElement(`h${level}`);
            heading.style.cssText = `
              margin: 0 0 10px 0;
              font-size: ${24 - (level - 1) * 2}px;
              font-weight: 600;
              color: #000;
            `;
            heading.textContent = block.content;
            blockEl.appendChild(heading);
          } else if (block.type === 'code') {
            const pre = document.createElement('pre');
            pre.style.cssText = `
              margin: 0;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 4px;
              font-family: monospace;
              font-size: 14px;
              overflow-x: auto;
            `;
            pre.textContent = block.content;
            blockEl.appendChild(pre);
          } else {
            blockEl.innerHTML = message.data.options.preserveHtml
              ? block.html
              : block.content.replace(/\n/g, '<br>');
          }

          container.appendChild(blockEl);

          // 添加图片（如果有）
          if (block.images.length > 0 && message.data.options.includeImages) {
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 10px;
            `;

            block.images.forEach((img) => {
              const imgEl = document.createElement('img');
              imgEl.src = img.url;
              imgEl.alt = img.alt;
              imgEl.style.cssText = `
                max-width: 200px;
                max-height: 200px;
                object-fit: contain;
                border-radius: 4px;
              `;
              imageContainer.appendChild(imgEl);
            });

            blockEl.appendChild(imageContainer);
          }
        });

        // 添加到文档中以便渲染
        document.body.appendChild(container);

        // 使用 html2canvas 渲染
        const options = {
          scale: 2, // 2x 分辨率以获得更清晰的图像
          useCORS: true, // 允许加载跨域图片
          backgroundColor: '#ffffff',
          logging: false,
        };

        // 等待所有图片加载完成
        const imagePromises = Array.from(container.querySelectorAll('img')).map(
          (img) =>
            new Promise((resolve, reject) => {
              if (img.complete) {
                resolve(img);
              } else {
                img.onload = () => resolve(img);
                img.onerror = reject;
              }
            })
        );

        Promise.all(imagePromises)
          .then(() => html2canvas(container, options))
          .then((canvas) => {
            // 根据请求的格式转换
            const format = message.data.format.toLowerCase();
            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            const quality = format === 'png' ? undefined : 0.9;

            // 转换为 base64
            const dataUrl = canvas.toDataURL(mimeType, quality);

            // 清理临时元素
            document.body.removeChild(container);

            // 发送结果
            sendResponse({ dataUrl });
          })
          .catch((error) => {
            // 清理临时元素
            document.body.removeChild(container);
            throw error;
          });

        return true;
      } catch (error) {
        console.error(`Image export failed in tab ${tabId}:`, error);
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        });
        return true;
      }
    }

    // 对于未知消息类型，返回 false
    console.warn(`Unknown message type in tab ${tabId}:`, message.type);
    return false;
  }
);

// 提取文本内容
export function extractText(): TextCrawlResult {
  const mainElement = findMainArticle();
  if (!mainElement) {
    throw new Error('无法找到主要内容区域');
  }

  const { blocks, metadata, stats } = extractTextContent({
    selector: mainElement.tagName.toLowerCase(),
  });

  return {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    metadata,
    blocks,
    stats,
  };
}

// 查找主要文章内容区域
function findMainArticle(): Element | null {
  // 常见的主要内容容器选择器
  const selectors = [
    'article',
    'main',
    '[role="main"]',
    '#content',
    '.content',
    '.article',
    '.post',
    '.entry',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }

  // 如果没有找到明确的主要内容容器，返回body
  return document.body;
}
