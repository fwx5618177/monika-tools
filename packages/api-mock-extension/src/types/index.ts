export interface CrawlOptions {
  selector: string;
  useRegex: boolean;
  pattern: string;
  preserveFormat: boolean;
  includeImages: boolean;
  followLinks: boolean;
  maxDepth: number;
  linkPattern?: string;
}

export interface CrawlResult {
  content: string;
  images?: string[];
  sourceUrl?: string;
  title?: string;
  timestamp?: string;
}

export interface ExtractedContent {
  content: string;
  images?: string[];
  title?: string;
  sourceUrl: string;
  timestamp?: string;
}

export interface LinkOptions {
  includeExternal: boolean;
  includeResources: boolean;
  includeSocial: boolean;
  pattern?: string;
  maxDepth: number;
  filterByType?: string[];
}

export interface LinkResult {
  url: string;
  text: string;
  type: 'internal' | 'external' | 'resource' | 'social' | 'download';
  title?: string;
  icon?: string;
  fileType?: string;
  fileSize?: string;
}

export interface FilterOptions {
  minWidth: number;
  minHeight: number;
  types: string[];
  excludeBase64: boolean;
}

export interface ImageResult {
  url: string;
  alt: string;
  size: string;
  type: string;
  filename: string;
}

export interface RichTextOptions extends CrawlOptions {
  preserveStyles: boolean;
  preserveLinks: boolean;
  preserveImages: boolean;
  preserveTables: boolean;
  cleanupWhitespace: boolean;
  removeScripts: boolean;
  removeComments: boolean;
}

export interface RichTextResult {
  selector: string;
  content: string;
  html: string;
  structure: {
    headings: number;
    paragraphs: number;
    lists: number;
    tables: number;
  };
}

export interface VideoOptions {
  includeEmbedded: boolean;
  includeHLS: boolean;
  includeDash: boolean;
  minDuration: number;
  maxDuration: number;
  minWidth: number;
  minHeight: number;
  formats: string[];
}

export interface VideoResult {
  url: string;
  format: string;
  size: string;
  duration: number;
  resolution: string;
  thumbnail?: string;
  filename?: string;
  title?: string;
  description?: string;
}

export interface TextCrawlOptions {
  useRegex: boolean;
  pattern?: string;
  preserveHtml: boolean;
  preserveFormat: boolean;
  includeImages: boolean;
  autoFormat: boolean;
  extractComments: boolean;
  extractForumPosts: boolean;
}

export interface TextBlock {
  id: string;
  content: string;
  html: string;
  type: 'text' | 'title' | 'quote' | 'list' | 'code' | 'forum-post';
  images: Array<{
    url: string;
    alt: string;
  }>;
  metadata: {
    selector: string;
    position: number;
    wordCount: number;
    charCount: number;
    author?: string;
    timestamp?: string;
    level?: number;
  };
  selected: boolean;
}

export interface TextCrawlResult {
  title: string;
  url: string;
  timestamp: string;
  blocks: TextBlock[];
  stats: {
    totalBlocks: number;
    totalWords: number;
    totalChars: number;
    totalImages: number;
  };
}

// 消息响应类型
export interface TextCrawlResponse {
  result?: TextCrawlResult;
  error?: string;
}

// 消息请求类型
export interface TextCrawlRequest {
  type: 'CRAWL_TEXT' | 'PING';
  data?: {
    options: TextCrawlOptions;
  };
}
