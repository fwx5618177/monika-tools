import React, { useState, useCallback } from 'react';
import styles from '../../styles/components/WebCrawler.module.scss';
import {
  FiSearch,
  FiDownload,
  FiCopy,
  FiCheck,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiSettings,
  FiImage,
  FiMaximize2,
  FiCheckSquare,
  FiSquare,
} from 'react-icons/fi';
import type {
  TextCrawlOptions,
  TextBlock,
  TextCrawlResult,
  TextCrawlResponse,
  TextCrawlRequest,
} from '@/types';
import classNames from 'classnames';

export const TextCrawler: React.FC = () => {
  const [options, setOptions] = useState<TextCrawlOptions>({
    useRegex: false,
    preserveHtml: false,
    preserveFormat: false,
    includeImages: false,
    autoFormat: false,
    extractComments: false,
    extractForumPosts: false,
  });

  const [pattern, setPattern] = useState<string>('');
  const [results, setResults] = useState<TextCrawlResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<'text' | 'html'>('text');

  const handleCrawl = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      // 检查是否是受限制的页面
      if (
        !tab.url ||
        tab.url.startsWith('chrome://') ||
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('https://chrome.google.com/webstore/')
      ) {
        throw new Error('此页面不支持文本提取。请在普通网页上使用此功能。');
      }

      // 先检查 content script 是否已加载
      try {
        const isLoaded = await chrome.tabs.sendMessage(tab.id, {
          type: 'PING',
        });
        if (!isLoaded) {
          console.log('Not loaded content script 未加载，重新注入');
          // 如果没有加载，重新注入 content script
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
          });
        }
      } catch (e) {
        console.log('报错: content script 未加载，重新注入');
        // 如果出错，可能是 content script 未注入，尝试注入
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        });
      }

      console.log('content script 已加载，发送爬取文本的消息');

      // 发送爬取文本的消息
      const response = await chrome.tabs.sendMessage<
        TextCrawlRequest,
        TextCrawlResponse
      >(tab.id, {
        type: 'CRAWL_TEXT',
        data: {
          options: {
            ...options,
            pattern: options.useRegex ? pattern : undefined,
          },
        },
      });

      console.log(response);

      if ('error' in response) {
        throw new Error(response.error);
      }

      console.log('爬取文本的消息发送成功');

      if ('result' in response) {
        setResults(response.result);
        setSelectedBlocks(
          new Set(response.result.blocks.map((block) => block.id))
        );
      }
    } catch (err) {
      console.error('Crawl failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract text');
    } finally {
      setLoading(false);
    }
  }, [options, pattern]);

  const handleExport = useCallback(
    async (format: 'html' | 'md' | 'png' | 'jpg') => {
      if (!results) return;

      const selectedContent = results.blocks
        .filter((block) => selectedBlocks.has(block.id))
        .map((block) => (options.preserveHtml ? block.html : block.content))
        .join('\n\n');

      switch (format) {
        case 'html':
          const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${results.title}</title>
              <style>
                body { font-family: system-ui; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>${selectedContent}</body>
          </html>
        `;
          downloadFile(html, 'text/html', 'extracted-content.html');
          break;

        case 'md':
          // 这里需要添加 HTML 到 Markdown 的转换逻辑
          downloadFile(
            selectedContent,
            'text/markdown',
            'extracted-content.md'
          );
          break;

        case 'png':
        case 'jpg':
          // 这里需要添加将内容转换为图片的逻辑
          // 可以使用 html2canvas 或其他库
          break;
      }
    },
    [results, selectedBlocks, options.preserveHtml]
  );

  const downloadFile = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = useCallback(async () => {
    if (!results) return;

    try {
      const selectedContent = results.blocks
        .filter((block) => selectedBlocks.has(block.id))
        .map((block) => (options.preserveHtml ? block.html : block.content))
        .join('\n\n');

      await navigator.clipboard.writeText(selectedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, [results, selectedBlocks, options.preserveHtml]);

  const handleClear = useCallback(() => {
    setResults(null);
    setError('');
    setSelectedBlocks(new Set());
    setExpandedBlocks(new Set());
  }, []);

  const toggleBlockSelection = useCallback((blockId: string) => {
    setSelectedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  }, []);

  const toggleBlockExpansion = useCallback((blockId: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  }, []);

  const toggleAllBlocks = useCallback(() => {
    if (!results) return;

    if (selectedBlocks.size === results.blocks.length) {
      setSelectedBlocks(new Set());
    } else {
      setSelectedBlocks(new Set(results.blocks.map((block) => block.id)));
    }
  }, [results, selectedBlocks]);

  const renderBlock = (block: TextBlock): JSX.Element => {
    const isExpanded = expandedBlocks.has(block.id);
    const isSelected = selectedBlocks.has(block.id);

    return (
      <div key={block.id} className={styles.block}>
        <div className={styles.blockHeader}>
          <button
            className={styles.selectButton}
            onClick={() => toggleBlockSelection(block.id)}
          >
            {isSelected ? <FiCheckSquare /> : <FiSquare />}
          </button>
          <span className={styles.blockType}>{block.type}</span>
          <span className={styles.blockStats}>
            {block.metadata.wordCount} 词 / {block.metadata.charCount} 字
          </span>
          <button
            className={styles.expandButton}
            onClick={() => toggleBlockExpansion(block.id)}
          >
            <FiMaximize2 />
          </button>
        </div>
        <div
          className={classNames(styles.blockContent, {
            [styles.expanded]: isExpanded,
          })}
        >
          {previewMode === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: block.html }} />
          ) : (
            <div>{block.content}</div>
          )}
          {block.images.length > 0 && (
            <div className={styles.imageList}>
              {block.images.map((img, index) => (
                <div key={index} className={styles.imageItem}>
                  <FiImage />
                  <a href={img.url} target="_blank" rel="noopener noreferrer">
                    {img.alt || '查看图片'}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        {block.metadata.author && (
          <div className={styles.blockMeta}>
            作者: {block.metadata.author}
            {block.metadata.timestamp && ` • ${block.metadata.timestamp}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        {options.useRegex && (
          <input
            type="text"
            className={styles.input}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式..."
          />
        )}
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={loading}
        >
          <FiSearch />
          {loading ? '提取中...' : '提取文本'}
        </button>
        <button
          className={`${styles.toolButton} ${showOptions ? styles.active : ''}`}
          onClick={() => setShowOptions(!showOptions)}
          title="选项设置"
        >
          <FiSettings />
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!results}
          title="清空"
        >
          <FiRotateCcw />
        </button>
      </div>

      {showOptions && (
        <div className={styles.optionsPanel}>
          <h4>提取选项</h4>
          <div className={styles.optionRow}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.useRegex}
                onChange={(e) =>
                  setOptions({ ...options, useRegex: e.target.checked })
                }
              />
              使用正则表达式
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.preserveHtml}
                onChange={(e) =>
                  setOptions({ ...options, preserveHtml: e.target.checked })
                }
              />
              保留HTML标签
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.preserveFormat}
                onChange={(e) =>
                  setOptions({ ...options, preserveFormat: e.target.checked })
                }
              />
              保留文本格式
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeImages}
                onChange={(e) =>
                  setOptions({ ...options, includeImages: e.target.checked })
                }
              />
              包含图片链接
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.autoFormat}
                onChange={(e) =>
                  setOptions({ ...options, autoFormat: e.target.checked })
                }
              />
              自动格式化
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.extractForumPosts}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    extractForumPosts: e.target.checked,
                  })
                }
              />
              提取论坛帖子
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <FiAlertCircle /> {error}
        </div>
      )}

      {results && (
        <div className={styles.results}>
          <div className={styles.resultHeader}>
            <div className={styles.resultInfo}>
              <h3>{results.title}</h3>
              <p className={styles.resultStats}>
                共 {results.stats.totalBlocks} 个文本块，
                {results.stats.totalWords} 词，
                {results.stats.totalChars} 字，
                {results.stats.totalImages} 张图片
              </p>
            </div>
            <div className={styles.resultActions}>
              <button
                className={styles.toolButton}
                onClick={toggleAllBlocks}
                title={
                  selectedBlocks.size === results.blocks.length
                    ? '取消全选'
                    : '全选'
                }
              >
                {selectedBlocks.size === results.blocks.length ? (
                  <FiCheckSquare />
                ) : (
                  <FiSquare />
                )}
              </button>
              <button
                className={styles.toolButton}
                onClick={handleCopy}
                disabled={selectedBlocks.size === 0}
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
              <div className={styles.exportDropdown}>
                <button className={styles.toolButton}>
                  <FiDownload />
                </button>
                <div className={styles.exportMenu}>
                  <button onClick={() => handleExport('html')}>
                    导出 HTML
                  </button>
                  <button onClick={() => handleExport('md')}>
                    导出 Markdown
                  </button>
                  <button onClick={() => handleExport('png')}>导出 PNG</button>
                  <button onClick={() => handleExport('jpg')}>导出 JPG</button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.viewModeSwitch}>
            <button
              className={classNames(styles.viewModeButton, {
                [styles.active]: previewMode === 'text',
              })}
              onClick={() => setPreviewMode('text')}
            >
              文本视图
            </button>
            <button
              className={classNames(styles.viewModeButton, {
                [styles.active]: previewMode === 'html',
              })}
              onClick={() => setPreviewMode('html')}
            >
              HTML视图
            </button>
          </div>

          <div className={styles.blockList}>
            {results.blocks.map(renderBlock)}
          </div>
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 使用说明
        </h4>
        <ul>
          <li>自动提取当前页面的所有文本内容，并智能分块整理</li>
          <li>支持使用正则表达式精确提取特定内容</li>
          <li>可以选择保留HTML标签和文本格式</li>
          <li>支持提取和显示图片链接</li>
          <li>可以导出为HTML、Markdown、PNG或JPG格式</li>
          <li>支持论坛形式的多帖子提取</li>
          <li>点击文本块右上角按钮可以展开查看完整内容</li>
          <li>可以选择多个文本块进行批量操作</li>
        </ul>
      </div>
    </div>
  );
};

export default TextCrawler;
