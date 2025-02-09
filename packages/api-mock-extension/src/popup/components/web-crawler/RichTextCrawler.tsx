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
  FiFileText,
} from 'react-icons/fi';

interface RichTextResult {
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

interface CrawlOptions {
  preserveStyles: boolean;
  preserveLinks: boolean;
  preserveImages: boolean;
  preserveTables: boolean;
  cleanupWhitespace: boolean;
  removeScripts: boolean;
  removeComments: boolean;
}

export const RichTextCrawler: React.FC = () => {
  const [selector, setSelector] = useState('');
  const [results, setResults] = useState<RichTextResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<CrawlOptions>({
    preserveStyles: true,
    preserveLinks: true,
    preserveImages: true,
    preserveTables: true,
    cleanupWhitespace: true,
    removeScripts: true,
    removeComments: true,
  });

  const handleCrawl = useCallback(async () => {
    if (!selector) {
      setError('请输入选择器');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) throw new Error('No active tab');

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'CRAWL_RICH_TEXT',
        data: { selector, options },
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setResults(Array.isArray(response) ? response : [response]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '内容提取失败');
    } finally {
      setLoading(false);
    }
  }, [selector, options]);

  const handleDownload = useCallback(() => {
    if (!results.length) return;

    const content = results.map((result) => ({
      selector: result.selector,
      content: result.content,
      html: result.html,
      structure: result.structure,
    }));

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rich-text-content.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const handleCopy = useCallback(async () => {
    if (!results.length) return;

    try {
      await navigator.clipboard.writeText(
        results.map((r) => r.content).join('\n\n')
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, [results]);

  const handleClear = useCallback(() => {
    setSelector('');
    setResults([]);
    setError('');
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.input}
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="输入 CSS 选择器，例如: article.content"
        />
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={loading || !selector}
        >
          <FiSearch />
          {loading ? '提取中...' : '提取内容'}
        </button>
        <button
          className={styles.toolButton}
          onClick={toggleOptions}
          title="选项设置"
        >
          <FiSettings />
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!selector && !results.length}
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
                checked={options.preserveStyles}
                onChange={(e) =>
                  setOptions({ ...options, preserveStyles: e.target.checked })
                }
              />
              保留样式
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.preserveLinks}
                onChange={(e) =>
                  setOptions({ ...options, preserveLinks: e.target.checked })
                }
              />
              保留链接
            </label>
          </div>
          <div className={styles.optionRow}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.preserveImages}
                onChange={(e) =>
                  setOptions({ ...options, preserveImages: e.target.checked })
                }
              />
              保留图片
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.preserveTables}
                onChange={(e) =>
                  setOptions({ ...options, preserveTables: e.target.checked })
                }
              />
              保留表格
            </label>
          </div>
          <div className={styles.optionRow}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.cleanupWhitespace}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    cleanupWhitespace: e.target.checked,
                  })
                }
              />
              清理空白
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.removeScripts}
                onChange={(e) =>
                  setOptions({ ...options, removeScripts: e.target.checked })
                }
              />
              移除脚本
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <FiAlertCircle /> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultActions}>
            <button className={styles.toolButton} onClick={handleCopy}>
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? '已复制' : '复制内容'}
            </button>
            <button className={styles.toolButton} onClick={handleDownload}>
              <FiDownload />
              下载结果
            </button>
          </div>

          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                <div className={styles.resultHeader}>
                  <FiFileText />
                  <span className={styles.resultTitle}>
                    选择器: {result.selector}
                  </span>
                </div>
                <div className={styles.resultStats}>
                  <span>标题: {result.structure.headings}</span>
                  <span>段落: {result.structure.paragraphs}</span>
                  <span>列表: {result.structure.lists}</span>
                  <span>表格: {result.structure.tables}</span>
                </div>
                <div className={styles.resultContent}>
                  <div
                    dangerouslySetInnerHTML={{ __html: result.html }}
                    className={styles.richContent}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 使用说明
        </h4>
        <ul>
          <li>输入 CSS 选择器来定位要提取的内容区域</li>
          <li>支持保留原始格式，包括样式、链接和图片</li>
          <li>可以通过选项设置来控制提取的内容和格式</li>
          <li>提取结果包含文本内容和HTML源码</li>
          <li>可以下载完整结果或复制纯文本内容</li>
        </ul>
      </div>
    </div>
  );
};

export default RichTextCrawler;
