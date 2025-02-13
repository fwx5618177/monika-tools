import type {
  CrawlOptions,
  ExtractedContent,
  FilterOptions,
  ImageResult,
  RichTextOptions,
  RichTextResult,
  VideoOptions,
  VideoResult,
  TextCrawlOptions,
  TextCrawlResult,
  TextBlock,
} from '@/types';
import { crawlLinks } from './linkCrawler';

// 提取主要内容
function extractMainContent(
  selector: string,
  options: CrawlOptions
): ExtractedContent {
  let content = '';
  let images: string[] = [];
  let title = document.title;

  try {
    // 使用选择器查找元素
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error('未找到匹配的元素');
    }

    elements.forEach((element) => {
      // 如果使用正则表达式
      if (options.useRegex && options.pattern) {
        const regex = new RegExp(options.pattern, 'g');
        const text = element.textContent || '';
        const matches = text.match(regex);
        if (matches) {
          content += matches.join('\n') + '\n';
        }
      } else {
        // 根据是否保留格式处理内容
        if (options.preserveFormat) {
          content += element.innerHTML + '\n';
        } else {
          content += (element.textContent || '').trim() + '\n';
        }
      }

      // 如果需要包含图片
      if (options.includeImages) {
        const imgElements = element.getElementsByTagName('img');
        Array.from(imgElements).forEach((img) => {
          const src = img.src;
          if (src && !images.includes(src)) {
            images.push(src);
          }
        });
      }
    });

    return {
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      title,
      sourceUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(
      '内容提取失败: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

// 查找页面中的主要文章内容
function findMainArticle(): Element | null {
  // 常见的文章容器选择器
  const selectors = [
    'article',
    '[role="article"]',
    '.article',
    '.post',
    '.content',
    '#content',
    '.entry',
    '.entry-content',
    '.post-content',
    'main',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && isContentElement(element)) {
      return element;
    }
  }

  // 如果找不到明确的文章容器，尝试启发式查找
  return findContentByHeuristics();
}

// 使用启发式方法查找内容
function findContentByHeuristics(): Element | null {
  const elements = Array.from(document.body.getElementsByTagName('*'));
  let bestElement = null;
  let maxScore = 0;

  for (const element of elements) {
    const score = calculateContentScore(element);
    if (score > maxScore) {
      maxScore = score;
      bestElement = element;
    }
  }

  return bestElement;
}

// 计算元素的内容分数
function calculateContentScore(element: Element): number {
  const text = element.textContent || '';
  const words = text.trim().split(/\s+/).length;

  let score = words;

  // 减分项
  if (element.matches('header, footer, nav, aside, .sidebar, .menu, .ad')) {
    score *= 0.1;
  }

  // 加分项
  if (element.matches('article, .article, .content, .post')) {
    score *= 2;
  }

  // 段落密度加分
  const paragraphs = element.getElementsByTagName('p').length;
  score += paragraphs * 20;

  return score;
}

// 判断元素是否为内容元素
function isContentElement(element: Element): boolean {
  const text = element.textContent || '';
  const words = text.trim().split(/\s+/).length;
  return words > 100; // 内容应该至少包含100个词
}

// 清理内容
function cleanupContent(element: Element): string {
  const clone = element.cloneNode(true) as Element;

  // 移除无关元素
  const removeSelectors = [
    'script',
    'style',
    'iframe',
    'form',
    '.ad',
    '.advertisement',
    '.social-share',
    '.comment',
    '.related',
    '.recommended',
  ];

  removeSelectors.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // 保留格式化的HTML
  return clone.innerHTML;
}

// 提取图片
async function extractImages(
  selector: string,
  options: FilterOptions
): Promise<ImageResult[]> {
  const results: ImageResult[] = [];
  const processedUrls = new Set<string>();

  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error('未找到匹配的图片元素');
    }

    for (const element of elements) {
      let url = '';
      if (element instanceof HTMLImageElement) {
        url = element.src;
      } else if (element instanceof HTMLElement) {
        // 检查背景图片
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          url = bgImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
        }
      }

      if (!url || processedUrls.has(url)) continue;
      if (options.excludeBase64 && url.startsWith('data:')) continue;

      // 检查图片类型
      const extension = url.split('.').pop()?.toLowerCase();
      if (!extension || !options.types.includes(extension)) continue;

      try {
        // 获取图片信息
        const response = await fetch(url, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        const type = response.headers.get('content-type');

        // 获取图片尺寸
        const img = new Image();
        img.src = url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // 检查尺寸限制
        if (img.width < options.minWidth || img.height < options.minHeight)
          continue;

        processedUrls.add(url);
        results.push({
          url,
          alt: element instanceof HTMLImageElement ? element.alt : '',
          size: formatFileSize(parseInt(size || '0')),
          type: type?.split('/')[1] || extension,
          filename: url.split('/').pop() || 'image.' + extension,
        });
      } catch {
        // 忽略加载失败的图片
        continue;
      }
    }

    return results;
  } catch (error) {
    throw new Error(
      '图片提取失败: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// 查找时间戳
function findTimestamp(): string | undefined {
  // 常见的时间元素选择器
  const selectors = [
    'time',
    '[datetime]',
    '.date',
    '.time',
    '.timestamp',
    '.published',
    '.post-date',
    '.article-date',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const timestamp = element.getAttribute('datetime') || element.textContent;
      if (timestamp) {
        return timestamp.trim();
      }
    }
  }

  return undefined;
}

// 使用正则表达式提取内容
function extractByRegex(pattern: string): ExtractedContent[] {
  const content = document.body.innerHTML;
  const regex = new RegExp(pattern, 'g');
  const matches = Array.from(content.matchAll(regex));

  return matches.map((match) => ({
    content: match[0],
    sourceUrl: window.location.href,
  }));
}

// 获取链接
function getLinks(pattern?: string): string[] {
  const links = Array.from(document.links)
    .map((link) => link.href)
    .filter((href) => {
      if (!pattern) return true;
      try {
        return new RegExp(pattern).test(href);
      } catch {
        return false;
      }
    });

  return Array.from(new Set(links)); // 去重
}

// 提取富文本内容
async function extractRichText(
  selector: string,
  options: RichTextOptions
): Promise<RichTextResult> {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error('未找到匹配的元素');
    }

    const results: RichTextResult[] = [];

    for (const element of elements) {
      // 克隆节点以避免修改原始DOM
      const clone = element.cloneNode(true) as HTMLElement;

      // 根据选项处理内容
      if (!options.preserveStyles) {
        // 移除所有样式
        clone
          .querySelectorAll('[style]')
          .forEach((el) => el.removeAttribute('style'));
        clone.querySelectorAll('style').forEach((el) => el.remove());
      }

      if (!options.preserveLinks) {
        // 将链接转换为纯文本
        clone.querySelectorAll('a').forEach((el) => {
          const text = document.createTextNode(el.textContent || '');
          el.parentNode?.replaceChild(text, el);
        });
      }

      if (!options.preserveImages) {
        // 移除所有图片
        clone.querySelectorAll('img').forEach((el) => el.remove());
      }

      if (!options.preserveTables) {
        // 将表格转换为文本
        clone.querySelectorAll('table').forEach((el) => {
          const text = el.textContent || '';
          const p = document.createElement('p');
          p.textContent = text;
          el.parentNode?.replaceChild(p, el);
        });
      }

      if (options.removeScripts) {
        // 移除所有脚本
        clone.querySelectorAll('script, noscript').forEach((el) => el.remove());
      }

      if (options.cleanupWhitespace) {
        // 清理空白字符
        const cleaned = clone.innerHTML
          .replace(/[\n\r]+/g, '\n')
          .replace(/\s+/g, ' ')
          .trim();
        clone.innerHTML = cleaned;
      }

      // 分析内容结构
      const structure = {
        headings: clone.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        paragraphs: clone.querySelectorAll('p').length,
        lists: clone.querySelectorAll('ul, ol').length,
        tables: clone.querySelectorAll('table').length,
      };

      results.push({
        selector,
        content: clone.textContent || '',
        html: clone.innerHTML,
        structure,
      });
    }

    return results[0]; // 返回第一个匹配结果
  } catch (error) {
    throw new Error(
      '富文本提取失败: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

// 提取视频
async function extractVideos(
  selector: string,
  options: VideoOptions
): Promise<VideoResult[]> {
  const results: VideoResult[] = [];
  const processedUrls = new Set<string>();

  try {
    // 查找视频元素
    const videoElements = document.querySelectorAll(selector);
    if (videoElements.length === 0) {
      throw new Error('未找到匹配的视频元素');
    }

    for (const element of videoElements) {
      // 处理 <video> 标签
      if (element instanceof HTMLVideoElement) {
        const video = element;
        const url = video.src;

        if (!url || processedUrls.has(url)) continue;

        // 检查格式
        const format = url.split('.').pop()?.toLowerCase() || '';
        if (!options.formats.includes(format)) continue;

        // 获取视频信息
        try {
          const response = await fetch(url, { method: 'HEAD' });
          const size = response.headers.get('content-length');
          const contentType = response.headers.get('content-type');

          // 检查视频时长
          if (video.duration) {
            if (options.minDuration > 0 && video.duration < options.minDuration)
              continue;
            if (options.maxDuration > 0 && video.duration > options.maxDuration)
              continue;
          }

          // 检查视频尺寸
          if (options.minWidth > 0 && video.videoWidth < options.minWidth)
            continue;
          if (options.minHeight > 0 && video.videoHeight < options.minHeight)
            continue;

          processedUrls.add(url);
          results.push({
            url,
            format,
            size: formatFileSize(parseInt(size || '0')),
            duration: Math.round(video.duration),
            resolution: `${video.videoWidth}x${video.videoHeight}`,
            thumbnail: video.poster,
            filename: url.split('/').pop() || `video.${format}`,
            title: video.title || undefined,
          });
        } catch {
          // 忽略加载失败的视频
          continue;
        }
      }

      // 处理嵌入式视频
      if (options.includeEmbedded) {
        // 处理 iframe 中的视频
        const iframes = element.querySelectorAll('iframe');
        for (const iframe of iframes) {
          const src = (iframe as HTMLIFrameElement).src;
          if (!src || processedUrls.has(src)) continue;

          // 检查是否是常见的视频平台
          if (isVideoPlatformUrl(src)) {
            processedUrls.add(src);
            results.push({
              url: src,
              format: 'embedded',
              size: 'N/A',
              duration: 0,
              resolution: 'N/A',
              title: (iframe as HTMLIFrameElement).title || undefined,
            });
          }
        }

        // 处理 embed 标签
        const embeds = element.querySelectorAll('embed');
        for (const embed of embeds) {
          const src = (embed as HTMLEmbedElement).src;
          if (!src || processedUrls.has(src)) continue;

          if (isVideoType((embed as HTMLEmbedElement).type)) {
            processedUrls.add(src);
            results.push({
              url: src,
              format:
                (embed as HTMLEmbedElement).type.split('/')[1] || 'unknown',
              size: 'N/A',
              duration: 0,
              resolution: 'N/A',
            });
          }
        }
      }

      // 处理 HLS 流
      if (options.includeHLS) {
        const hlsSources = element.querySelectorAll(
          'source[type="application/x-mpegURL"], source[type="application/vnd.apple.mpegurl"]'
        );
        for (const source of hlsSources) {
          const url = (source as HTMLSourceElement).src;
          if (!url || processedUrls.has(url)) continue;

          processedUrls.add(url);
          results.push({
            url,
            format: 'm3u8',
            size: 'N/A',
            duration: 0,
            resolution: 'N/A',
          });
        }
      }

      // 处理 DASH 流
      if (options.includeDash) {
        const dashSources = element.querySelectorAll(
          'source[type="application/dash+xml"]'
        );
        for (const source of dashSources) {
          const url = (source as HTMLSourceElement).src;
          if (!url || processedUrls.has(url)) continue;

          processedUrls.add(url);
          results.push({
            url,
            format: 'mpd',
            size: 'N/A',
            duration: 0,
            resolution: 'N/A',
          });
        }
      }
    }

    return results;
  } catch (error) {
    throw new Error(
      '视频提取失败: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

// 检查是否是视频平台的URL
function isVideoPlatformUrl(url: string): boolean {
  const platforms = [
    'youtube.com/embed',
    'player.vimeo.com',
    'dailymotion.com/embed',
    'youku.com/embed',
    'v.qq.com',
  ];
  return platforms.some((platform) => url.includes(platform));
}

// 检查是否是视频类型
function isVideoType(type: string): boolean {
  return type.startsWith('video/') || type.includes('shockwave-flash');
}

// 监听来自插件的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CRAWL_CONTENT') {
    const options: CrawlOptions = request.options;
    let results = [];

    try {
      if (options.useRegex && options.pattern) {
        results = extractByRegex(options.pattern);
      } else {
        results = [extractMainContent(options.selector, options)];
      }

      if (options.followLinks) {
        const links = getLinks(options.linkPattern);
        // 将链接信息添加到结果中
        results.push({
          content:
            '## 相关链接\n\n' + links.map((link) => `- ${link}`).join('\n'),
          sourceUrl: window.location.href,
        });
      }

      sendResponse({ results });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : '未知错误';
      sendResponse({ error });
    }
  } else if (request.type === 'CRAWL_LINKS') {
    crawlLinks(request.options)
      .then((results) => sendResponse({ results }))
      .catch((err: unknown) => {
        const error = err instanceof Error ? err.message : '未知错误';
        sendResponse({ error });
      });
    return true;
  } else if (request.type === 'CRAWL_TEXT') {
    const { options } = request.data;
    try {
      const result = extractText(options);
      sendResponse(result);
    } catch (error: unknown) {
      sendResponse({
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return true;
  } else if (request.type === 'CRAWL_IMAGES') {
    extractImages(request.payload.selector, request.payload.options)
      .then((results) => sendResponse(results))
      .catch((error: unknown) =>
        sendResponse({
          error: error instanceof Error ? error.message : '图片提取失败',
        })
      );
    return true;
  } else if (request.type === 'CRAWL_RICH_TEXT') {
    extractRichText(request.data.selector, request.data.options)
      .then((result) => sendResponse(result))
      .catch((error: unknown) =>
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        })
      );
    return true;
  } else if (request.type === 'CRAWL_VIDEOS') {
    extractVideos(request.data.selector, request.data.options)
      .then((results) => sendResponse(results))
      .catch((error: unknown) =>
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        })
      );
    return true;
  } else if (request.type === 'extractText') {
    try {
      const result = extractText(request.options);
      sendResponse({ success: true, data: result });
    } catch (error: unknown) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return true;
  }
  return true;
});

// 提取文本内容
export function extractText(options: TextCrawlOptions): TextCrawlResult {
  const mainElement = findMainArticle();
  if (!mainElement) {
    throw new Error('无法找到主要内容区域');
  }

  const blocks: TextBlock[] = [];
  let totalWords = 0;
  let totalChars = 0;
  let totalImages = 0;

  // 处理文本块
  const textElements = mainElement.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li'
  );
  textElements.forEach((element, index) => {
    const text = options.preserveFormat
      ? element.innerHTML
      : element.textContent || '';
    if (!text.trim()) return;

    // 应用正则过滤
    if (options.useRegex && options.pattern) {
      const regex = new RegExp(options.pattern);
      if (!regex.test(text)) return;
    }

    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    totalWords += words;
    totalChars += chars;

    // 确定文本块类型
    let type: TextBlock['type'] = 'text';
    const tagName = element.tagName.toLowerCase();
    if (tagName.startsWith('h')) {
      type = 'title';
    } else if (element.closest('blockquote')) {
      type = 'quote';
    } else if (element.closest('ul, ol')) {
      type = 'list';
    } else if (element.closest('pre, code')) {
      type = 'code';
    } else if (
      options.extractForumPosts &&
      element.closest('.post, .forum-post, .comment')
    ) {
      type = 'forum-post';
    }

    // 提取图片
    const images = options.includeImages
      ? Array.from(element.querySelectorAll('img')).map((img) => ({
          url: img.src,
          alt: img.alt || '',
        }))
      : [];
    totalImages += images.length;

    blocks.push({
      id: `block-${index}`,
      content: text,
      html: options.preserveHtml ? element.innerHTML : text,
      type,
      images,
      metadata: {
        selector: getSelector(element),
        position: index,
        wordCount: words,
        charCount: chars,
        author: element.closest('[data-author], .author')?.textContent?.trim(),
        timestamp: element
          .closest('[data-time], .time, .date')
          ?.textContent?.trim(),
        level: type === 'title' ? parseInt(tagName[1]) : undefined,
      },
      selected: false,
    });
  });

  return {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    blocks,
    metadata: {
      lang: document.documentElement.lang || 'unknown',
      description: '',
      keywords: '',
      author: '',
      charset: document.charset,
    },
    stats: {
      totalBlocks: blocks.length,
      totalWords,
      totalChars,
      totalImages,
    },
  };
}

// 获取元素的选择器
function getSelector(element: Element): string {
  const path: string[] = [];
  let current = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    }
    if (current.className) {
      selector += `.${current.className.split(' ').join('.')}`;
    }
    path.unshift(selector);
    current = current.parentElement as Element;
  }

  return path.join(' > ');
}

// 确保 content script 已加载的标记
window.addEventListener('load', () => {
  (window as any).__CONTENT_SCRIPT_LOADED__ = true;
});
