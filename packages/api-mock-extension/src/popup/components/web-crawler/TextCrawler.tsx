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
  FiCode,
  FiFileText,
} from 'react-icons/fi';
import type {
  TextCrawlOptions,
  TextBlock,
  TextCrawlResult,
  TextCrawlResponse,
  TextCrawlRequest,
} from '@/types';
import classNames from 'classnames';
import { ImageViewer } from './ImageViewer';

// 添加新的导出选项类型
type ExportFormat = 'html' | 'md' | 'png' | 'jpg' | 'pdf' | 'txt' | 'docx';
type ExportTheme = 'default' | 'dark' | 'light' | 'paper';

interface ExportOptions {
  format: ExportFormat;
  theme: ExportTheme;
  scale: number;
  includeTitle: boolean;
  includeMetadata: boolean;
  includeImages: boolean;
  customStyles?: string;
}

// 添加导出进度状态
interface ExportProgress {
  status: 'preparing' | 'processing' | 'finishing' | 'done' | 'error';
  progress: number;
  message: string;
}

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null
  );
  const [exportTheme, setExportTheme] = useState<ExportTheme>('default');
  const [exportScale, setExportScale] = useState<number>(2);

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

      if ('error' in response) {
        throw new Error(response.error);
      }

      if ('result' in response && response.result) {
        console.log('提取结果:', response.result);
        setResults(response.result);
        setSelectedBlocks(
          new Set(response.result.blocks.map((block) => block.id))
        );
      } else {
        throw new Error('未能获取到有效的提取结果');
      }
    } catch (err) {
      console.error('Crawl failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract text');
    } finally {
      setLoading(false);
    }
  }, [options, pattern]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!results) return;

      const selectedBlocksList = results.blocks.filter((block) =>
        selectedBlocks.has(block.id)
      );
      if (selectedBlocksList.length === 0) {
        setError('请先选择要导出的内容');
        return;
      }

      try {
        setExportProgress({
          status: 'preparing',
          progress: 0,
          message: '准备导出...',
        });

        const exportOptions: ExportOptions = {
          format,
          theme: exportTheme,
          scale: exportScale,
          includeTitle: true,
          includeMetadata: true,
          includeImages: options.includeImages,
          customStyles: getThemeStyles(exportTheme),
        };

        switch (format) {
          case 'html':
            setExportProgress({
              status: 'processing',
              progress: 30,
              message: '生成 HTML...',
            });
            const html = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>${results.title}</title>
                  <style>
                    ${exportOptions.customStyles}
                    body {
                      font-family: system-ui;
                      line-height: 1.5;
                      max-width: 800px;
                      margin: 0 auto;
                      padding: 20px;
                    }
                    img { max-width: 100%; height: auto; }
                    .block { margin-bottom: 1.5em; }
                    .block-title { font-size: 1.2em; font-weight: 600; }
                    .block-meta { font-size: 0.9em; color: #666; }
                    .block-content { margin: 1em 0; }
                  </style>
                </head>
                <body class="theme-${exportTheme}">
                  ${selectedBlocksList
                    .map(
                      (block) => `
                    <div class="block block-${block.type}">
                      ${block.type === 'title' ? `<div class="block-title">${block.content}</div>` : ''}
                      <div class="block-content">${options.preserveHtml ? block.html : block.content}</div>
                      ${
                        block.metadata.author || block.metadata.timestamp
                          ? `
                        <div class="block-meta">
                          ${block.metadata.author ? `<span>作者: ${block.metadata.author}</span>` : ''}
                          ${block.metadata.timestamp ? `<span>时间: ${block.metadata.timestamp}</span>` : ''}
                        </div>
                      `
                          : ''
                      }
                    </div>
                  `
                    )
                    .join('\n')}
                </body>
              </html>
            `;
            setExportProgress({
              status: 'finishing',
              progress: 90,
              message: '完成 HTML 导出...',
            });
            downloadFile(html, 'text/html', 'extracted-content.html');
            break;

          case 'md':
            setExportProgress({
              status: 'processing',
              progress: 30,
              message: '生成 Markdown...',
            });
            const markdown = selectedBlocksList
              .map((block) => {
                const content = block.content;
                switch (block.type) {
                  case 'title':
                    return `# ${content}\n`;
                  case 'quote':
                    return `> ${content}\n`;
                  case 'code':
                    return `\`\`\`\n${content}\n\`\`\`\n`;
                  default:
                    return `${content}\n\n`;
                }
              })
              .join('\n');
            setExportProgress({
              status: 'finishing',
              progress: 90,
              message: '完成 Markdown 导出...',
            });
            downloadFile(markdown, 'text/markdown', 'extracted-content.md');
            break;

          case 'png':
          case 'jpg':
            setExportProgress({
              status: 'processing',
              progress: 30,
              message: `生成${format.toUpperCase()}图片...`,
            });
            try {
              const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
              });

              if (!tab?.id) {
                throw new Error('No active tab found');
              }

              const response = await chrome.tabs.sendMessage(tab.id, {
                type: 'EXPORT_AS_IMAGE',
                data: {
                  blocks: selectedBlocksList,
                  format,
                  theme: exportTheme,
                  scale: exportScale,
                  includeTitle: true,
                  includeMetadata: true,
                  metadata: results.metadata,
                  options: {
                    ...options,
                    customStyles: exportOptions.customStyles,
                  },
                },
              });

              if ('error' in response) {
                throw new Error(response.error);
              }

              if ('dataUrl' in response) {
                setExportProgress({
                  status: 'finishing',
                  progress: 90,
                  message: '处理图片数据...',
                });
                const link = document.createElement('a');
                link.href = response.dataUrl;
                link.download = `extracted-content.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            } catch (error) {
              console.error('Export failed:', error);
              setError(
                error instanceof Error
                  ? error.message
                  : 'Failed to export image'
              );
              setExportProgress({
                status: 'error',
                progress: 100,
                message: '导出失败',
              });
              return;
            }
            break;

          case 'pdf':
            setError('PDF导出功能即将推出');
            return;

          case 'txt':
            setExportProgress({
              status: 'processing',
              progress: 30,
              message: '生成纯文本...',
            });
            const plainText = selectedBlocksList
              .map((block) => block.content)
              .join('\n\n');
            setExportProgress({
              status: 'finishing',
              progress: 90,
              message: '完成纯文本导出...',
            });
            downloadFile(plainText, 'text/plain', 'extracted-content.txt');
            break;

          case 'docx':
            setError('Word文档导出功能即将推出');
            return;
        }

        setExportProgress({
          status: 'done',
          progress: 100,
          message: '导出完成',
        });

        // 3秒后清除进度状态
        setTimeout(() => {
          setExportProgress(null);
        }, 3000);
      } catch (err) {
        console.error('Export failed:', err);
        setError('导出失败');
        setExportProgress({
          status: 'error',
          progress: 100,
          message: '导出失败',
        });
      }
    },
    [results, options, exportTheme, exportScale, selectedBlocks]
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
      const selectedContent = [
        // Include title if selected
        selectedBlocks.has('title') ? results.title : '',
        // Include selected blocks
        ...results.blocks
          .filter((block) => selectedBlocks.has(block.id))
          .map((block) => (options.preserveHtml ? block.html : block.content)),
      ]
        .filter(Boolean)
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

  const handleReset = useCallback(() => {
    handleClear();
    setPattern('');
    setOptions({
      useRegex: false,
      preserveHtml: false,
      preserveFormat: false,
      includeImages: false,
      autoFormat: false,
      extractComments: false,
      extractForumPosts: false,
    });
  }, [handleClear]);

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
            className={classNames(styles.selectButton, {
              [styles.selected]: isSelected,
            })}
            onClick={() => toggleBlockSelection(block.id)}
          >
            {isSelected ? <FiCheckSquare /> : <FiSquare />}
          </button>
          <span className={styles.blockType}>{block.type}</span>
          <span className={styles.blockStats}>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>词数：</span>
              <span className={styles.statsValue}>
                {block.metadata.wordCount}
              </span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>字数：</span>
              <span className={styles.statsValue}>
                {block.metadata.charCount}
              </span>
            </div>
          </span>
          <button
            className={classNames(styles.expandButton, {
              [styles.expanded]: isExpanded,
            })}
            onClick={() => toggleBlockExpansion(block.id)}
          >
            <FiMaximize2 />
          </button>
        </div>
        <div
          className={classNames(styles.blockContent, {
            [styles.expanded]: isExpanded,
            [styles.htmlView]: previewMode === 'html',
          })}
        >
          {previewMode === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: block.html }} />
          ) : (
            <div>{block.content}</div>
          )}
        </div>
        {block.images.length > 0 && (
          <div className={styles.imageList}>
            {block.images.map((img, index) => (
              <div key={index} className={styles.imageItem}>
                <img
                  src={img.url}
                  alt={img.alt || '图片'}
                  onClick={() => setSelectedImage(img.url)}
                />
                <div className={styles.imageOverlay}>
                  <button onClick={() => setSelectedImage(img.url)}>
                    放大查看
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {(block.metadata.author || block.metadata.timestamp) && (
          <div className={styles.blockMeta}>
            {block.metadata.author && (
              <span>作者: {block.metadata.author}</span>
            )}
            {block.metadata.timestamp && (
              <span>时间: {block.metadata.timestamp}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // 添加主题样式函数
  const getThemeStyles = (theme: ExportTheme): string => {
    switch (theme) {
      case 'dark':
        return `
          body { background: #1a1a1a; color: #ffffff; }
          .block { background: #2d2d2d; padding: 20px; border-radius: 8px; }
          .block-title { color: #ffffff; }
          .block-meta { color: #888888; }
        `;
      case 'light':
        return `
          body { background: #ffffff; color: #333333; }
          .block { background: #f8f9fa; padding: 20px; border-radius: 8px; }
          .block-title { color: #000000; }
          .block-meta { color: #666666; }
        `;
      case 'paper':
        return `
          body { background: #f4f1ea; color: #2c2c2c; font-family: Georgia, serif; }
          .block { background: #ffffff; padding: 20px; border-radius: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .block-title { color: #2c2c2c; font-family: 'Times New Roman', serif; }
          .block-meta { color: #666666; font-style: italic; }
        `;
      default:
        return '';
    }
  };

  // 在 JSX 中添加导出选项面板
  const renderExportOptions = () => (
    <div className={styles.exportOptions}>
      <div className={styles.exportThemes}>
        <label>导出主题</label>
        <div className={styles.themeButtons}>
          {(['default', 'dark', 'light', 'paper'] as ExportTheme[]).map(
            (theme) => (
              <button
                key={theme}
                className={classNames(styles.themeButton, {
                  [styles.active]: exportTheme === theme,
                })}
                onClick={() => setExportTheme(theme)}
              >
                {theme === 'default'
                  ? '默认'
                  : theme === 'dark'
                    ? '深色'
                    : theme === 'light'
                      ? '浅色'
                      : '纸张'}
              </button>
            )
          )}
        </div>
      </div>
      <div className={styles.exportScale}>
        <label>图片缩放</label>
        <input
          type="range"
          min="1"
          max="4"
          step="0.5"
          value={exportScale}
          onChange={(e) => setExportScale(Number(e.target.value))}
        />
        <span>{exportScale}x</span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.leftGroup}>
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
            className={classNames(styles.toolButton, {
              [styles.active]: showOptions,
            })}
            onClick={() => setShowOptions(!showOptions)}
            title="选项设置"
          >
            <FiSettings />
          </button>
          {results && (
            <button
              className={styles.toolButton}
              onClick={handleReset}
              title="重置"
            >
              <FiRotateCcw />
            </button>
          )}
        </div>
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
          {results && (
            <div className={styles.rightGroup}>
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
                <button
                  className={styles.toolButton}
                  disabled={selectedBlocks.size === 0}
                >
                  <FiDownload />
                </button>
                <div className={styles.exportMenu}>
                  <button onClick={() => handleExport('html')}>
                    <FiCode />
                    导出 HTML
                  </button>
                  <button onClick={() => handleExport('md')}>
                    <FiFileText />
                    导出 Markdown
                  </button>
                  <button onClick={() => handleExport('txt')}>
                    <FiFileText />
                    导出纯文本
                  </button>
                  <button onClick={() => handleExport('png')}>
                    <FiImage />
                    导出 PNG
                  </button>
                  <button onClick={() => handleExport('jpg')}>
                    <FiImage />
                    导出 JPG
                  </button>
                  <button onClick={() => handleExport('pdf')} disabled>
                    <FiFileText />
                    导出 PDF (即将推出)
                  </button>
                  <button onClick={() => handleExport('docx')} disabled>
                    <FiFileText />
                    导出 Word (即将推出)
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className={styles.resultHeader}>
            <div className={styles.titleSection}>
              <div className={styles.titleWrapper}>
                <button
                  className={classNames(styles.selectButton, {
                    [styles.selected]: selectedBlocks.has('title'),
                  })}
                  onClick={() => toggleBlockSelection('title')}
                >
                  {selectedBlocks.has('title') ? (
                    <FiCheckSquare />
                  ) : (
                    <FiSquare />
                  )}
                </button>
                <h2 className={styles.resultTitle}>{results.title}</h2>
              </div>
              <div className={styles.metaInfo}>
                <div className={classNames(styles.metaItem, styles.langBadge)}>
                  {results.metadata.lang}
                </div>
                <div className={classNames(styles.metaItem, styles.langBadge)}>
                  {results.metadata.charset}
                </div>
                {results.metadata.description && (
                  <div className={styles.metaItem}>
                    <span className={styles.label}>描述:</span>
                    <span>{results.metadata.description}</span>
                  </div>
                )}
                {results.metadata.keywords && (
                  <div className={styles.metaItem}>
                    <span className={styles.label}>关键词:</span>
                    <span>{results.metadata.keywords}</span>
                  </div>
                )}
                {results.metadata.author && (
                  <div className={styles.metaItem}>
                    <span className={styles.label}>作者:</span>
                    <span>{results.metadata.author}</span>
                  </div>
                )}
                {results.title && (
                  <div className={styles.metaItem}>
                    <span className={styles.label}>标题:</span>
                    <span>{results.title}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <span className={styles.label}>URL:</span>
                  <span>{results.url}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>时间:</span>
                  <span>{new Date(results.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className={styles.resultStats}>
              <div className={styles.statsGroup}>
                <div className={styles.statsItem}>
                  <span className={styles.statsLabel}>文本块数：</span>
                  <span className={styles.statsValue}>
                    {results.stats.totalBlocks}
                  </span>
                </div>
                <div className={styles.statsItem}>
                  <span className={styles.statsLabel}>总词数：</span>
                  <span className={styles.statsValue}>
                    {results.stats.totalWords}
                  </span>
                </div>
                <div className={styles.statsItem}>
                  <span className={styles.statsLabel}>总字数：</span>
                  <span className={styles.statsValue}>
                    {results.stats.totalChars}
                  </span>
                </div>
                <div className={styles.statsItem}>
                  <span className={styles.statsLabel}>图片数：</span>
                  <span className={styles.statsValue}>
                    {results.stats.totalImages}
                  </span>
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

      {selectedImage && (
        <ImageViewer
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
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

      {exportProgress && (
        <div className={styles.exportProgress}>
          <div
            className={classNames(styles.progressBar, {
              [styles.error]: exportProgress.status === 'error',
            })}
            style={{ width: `${exportProgress.progress}%` }}
          />
          <div className={styles.progressMessage}>{exportProgress.message}</div>
        </div>
      )}
    </div>
  );
};

export default TextCrawler;
