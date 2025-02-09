import { LinkOptions, LinkResult } from '../types';

// 判断链接类型
function getLinkType(url: string, baseUrl: string): LinkResult['type'] {
  try {
    const urlObj = new URL(url);
    const baseUrlObj = new URL(baseUrl);

    // 检查是否是社交媒体链接
    if (isSocialMediaLink(urlObj.hostname)) {
      return 'social';
    }

    // 检查是否是资源链接
    if (isResourceLink(url)) {
      return 'resource';
    }

    // 检查是否是内部链接
    if (urlObj.hostname === baseUrlObj.hostname) {
      return 'internal';
    }

    return 'external';
  } catch {
    return 'internal'; // 相对路径视为内部链接
  }
}

// 检查是否是社交媒体链接
function isSocialMediaLink(hostname: string): boolean {
  const socialDomains = [
    'twitter.com',
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'youtube.com',
    'weibo.com',
    'github.com',
  ];
  return socialDomains.some((domain) => hostname.includes(domain));
}

// 检查是否是资源链接
function isResourceLink(url: string): boolean {
  const resourceExtensions = [
    // 图片
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.ico',
    // 文档
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    // 压缩包
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz',
    // 音视频
    '.mp3',
    '.mp4',
    '.avi',
    '.mov',
    '.wmv',
    '.flv',
    // 其他
    '.txt',
    '.csv',
    '.json',
    '.xml',
  ];
  return resourceExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

// 获取文件类型
function getFileType(url: string): string | undefined {
  const extension = url.split('.').pop()?.toLowerCase();
  if (!extension) return undefined;

  const typeMap: { [key: string]: string } = {
    // 图片
    jpg: '图片 (JPG)',
    jpeg: '图片 (JPEG)',
    png: '图片 (PNG)',
    gif: '图片 (GIF)',
    webp: '图片 (WebP)',
    svg: '图片 (SVG)',
    // 文档
    pdf: 'PDF 文档',
    doc: 'Word 文档',
    docx: 'Word 文档',
    xls: 'Excel 表格',
    xlsx: 'Excel 表格',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    // 压缩包
    zip: 'ZIP 压缩包',
    rar: 'RAR 压缩包',
    '7z': '7Z 压缩包',
    // 音视频
    mp3: '音频 (MP3)',
    mp4: '视频 (MP4)',
    avi: '视频 (AVI)',
    mov: '视频 (MOV)',
    // 其他
    txt: '文本文件',
    csv: 'CSV 文件',
    json: 'JSON 文件',
    xml: 'XML 文件',
  };

  return typeMap[extension];
}

// 提取链接
async function extractLinks(options: LinkOptions): Promise<LinkResult[]> {
  const results: LinkResult[] = [];
  const baseUrl = window.location.href;
  const processedUrls = new Set<string>();

  // 获取所有链接元素
  const links = Array.from(document.links);

  for (const link of links) {
    const url = link.href;
    if (processedUrls.has(url)) continue;
    processedUrls.add(url);

    const type = getLinkType(url, baseUrl);

    // 根据选项过滤链接
    if (!shouldIncludeLink(type, options)) continue;

    // 如果设置了模式匹配，检查URL是否匹配
    if (options.pattern && !new RegExp(options.pattern).test(url)) continue;

    const result: LinkResult = {
      url,
      text: link.textContent?.trim() || url,
      type,
      title: link.title || undefined,
    };

    // 如果是资源链接，获取更多信息
    if (type === 'resource') {
      result.fileType = getFileType(url);
      // 尝试获取文件大小（如果可能的话）
      try {
        const size = await getFileSize(url);
        if (size) {
          result.fileSize = formatFileSize(size);
        }
      } catch {
        // 忽略错误
      }
    }

    results.push(result);
  }

  return results;
}

// 检查是否应该包含该类型的链接
function shouldIncludeLink(
  type: LinkResult['type'],
  options: LinkOptions
): boolean {
  switch (type) {
    case 'external':
      return options.includeExternal;
    case 'resource':
      return options.includeResources;
    case 'social':
      return options.includeSocial;
    case 'internal':
      return true;
    default:
      return false;
  }
}

// 获取文件大小
async function getFileSize(url: string): Promise<number | undefined> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const size = response.headers.get('content-length');
    return size ? parseInt(size, 10) : undefined;
  } catch {
    return undefined;
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export async function crawlLinks(options: LinkOptions): Promise<LinkResult[]> {
  return await extractLinks(options);
}
