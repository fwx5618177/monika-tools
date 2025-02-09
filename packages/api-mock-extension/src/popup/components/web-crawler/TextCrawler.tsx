import React, { useState, useCallback } from 'react';
import styles from '../../styles/components/WebCrawler.module.scss';
import {
  FiCopy,
  FiCheck,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
  FiType,
} from 'react-icons/fi';
import type { CrawlOptions, CrawlResult } from '@/types';

export const TextCrawler: React.FC = () => {
  const [selector, setSelector] = useState('');
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<CrawlOptions>({
    useRegex: false,
    pattern: '',
    preserveFormat: true,
    includeImages: false,
    followLinks: false,
    maxDepth: 1,
  });

  const handleCrawl = useCallback(async () => {
    try {
      // 发送消息到当前活动标签页的content script
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'CRAWL_TEXT',
        payload: {
          selector,
          options,
        },
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      setResults(Array.isArray(response) ? response : [response]);
      setError('');
    } catch (err) {
      setError('内容提取失败，请检查页面是否加载完成');
    }
  }, [selector, options]);

  const handleCopy = useCallback(async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, []);

  const handleClear = useCallback(() => {
    setSelector('');
    setResults([]);
    setError('');
    setCopied({});
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
          placeholder="输入CSS选择器，例如: article, .content, #main"
        />
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={!selector}
        >
          <FiType />
          提取文本
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!selector && results.length === 0}
        >
          <FiRotateCcw />
          清空
        </button>
        <button
          className={`${styles.toolButton} ${showOptions ? styles.active : ''}`}
          onClick={toggleOptions}
        >
          <FiSettings />
          选项
        </button>
      </div>

      {showOptions && (
        <div className={styles.optionsPanel}>
          <div className={styles.optionGroup}>
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
            {options.useRegex && (
              <input
                type="text"
                className={styles.input}
                value={options.pattern}
                onChange={(e) =>
                  setOptions({ ...options, pattern: e.target.value })
                }
                placeholder="输入正则表达式"
              />
            )}
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.preserveFormat}
                onChange={(e) =>
                  setOptions({ ...options, preserveFormat: e.target.checked })
                }
              />
              保留格式
            </label>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeImages}
                onChange={(e) =>
                  setOptions({ ...options, includeImages: e.target.checked })
                }
              />
              包含图片
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
          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                <div className={styles.resultContent}>
                  <div className={styles.content}>{result.content}</div>
                  {result.images && result.images.length > 0 && (
                    <div className={styles.imageGrid}>
                      {result.images.map((image, imgIndex) => (
                        <img key={imgIndex} src={image} alt="" />
                      ))}
                    </div>
                  )}
                  <button
                    className={`${styles.copyButton} ${
                      copied[index] ? styles.success : ''
                    }`}
                    onClick={() => handleCopy(result.content, index)}
                    title="复制到剪贴板"
                  >
                    {copied[index] ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
                {(result.title || result.sourceUrl || result.timestamp) && (
                  <div className={styles.resultMeta}>
                    {result.title && <div>标题: {result.title}</div>}
                    {result.sourceUrl && <div>来源: {result.sourceUrl}</div>}
                    {result.timestamp && <div>时间: {result.timestamp}</div>}
                  </div>
                )}
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
          <li>输入CSS选择器来定位要提取的文本内容</li>
          <li>支持常见的选择器语法，如 .class, #id, tag 等</li>
          <li>可以使用正则表达式进行更精确的内容匹配</li>
          <li>选择是否保留原始格式或仅提取纯文本</li>
          <li>可以选择是否包含相关的图片内容</li>
        </ul>
      </div>
    </div>
  );
};

export default TextCrawler;
