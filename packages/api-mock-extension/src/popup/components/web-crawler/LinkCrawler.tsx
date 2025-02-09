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
  FiLink,
  FiSettings,
  FiExternalLink,
} from 'react-icons/fi';

interface LinkResult {
  url: string;
  text: string;
  type: 'internal' | 'external' | 'resource' | 'social' | 'download';
  title?: string;
  icon?: string;
  fileType?: string;
  fileSize?: string;
}

interface LinkOptions {
  includeExternal: boolean;
  includeResources: boolean;
  includeSocial: boolean;
  pattern?: string;
  maxDepth: number;
  filterByType?: string[];
}

export const LinkCrawler: React.FC = () => {
  const [results, setResults] = useState<LinkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<LinkOptions>({
    includeExternal: true,
    includeResources: true,
    includeSocial: true,
    pattern: '',
    maxDepth: 1,
    filterByType: [],
  });

  const handleCrawl = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await chrome.tabs
        .query({ active: true, currentWindow: true })
        .then(([tab]) => {
          if (!tab.id) throw new Error('No active tab');
          return chrome.tabs.sendMessage(tab.id, {
            type: 'CRAWL_LINKS',
            options,
          });
        });

      if (response.error) {
        setError(response.error);
      } else {
        setResults(response.results);
      }
    } catch (err) {
      setError('链接提取失败，请检查页面是否加载完成');
    } finally {
      setLoading(false);
    }
  }, [options]);

  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('复制失败');
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!results.length) return;

    const content = results
      .map((result) => {
        let text = `${result.url}`;
        if (result.text && result.text !== result.url) {
          text += `\n文本: ${result.text}`;
        }
        if (result.title) {
          text += `\n标题: ${result.title}`;
        }
        if (result.fileType) {
          text += `\n类型: ${result.fileType}`;
        }
        if (result.fileSize) {
          text += `\n大小: ${result.fileSize}`;
        }
        return text;
      })
      .join('\n\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results]);

  const handleClear = useCallback(() => {
    setResults([]);
    setError('');
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const getLinkTypeIcon = (type: LinkResult['type']) => {
    switch (type) {
      case 'internal':
        return <FiLink />;
      case 'external':
        return <FiExternalLink />;
      case 'resource':
        return <FiDownload />;
      case 'social':
        return <FiLink />;
      default:
        return <FiLink />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={loading}
        >
          <FiSearch />
          {loading ? '提取中...' : '提取链接'}
        </button>
        <button
          className={styles.toolButton}
          onClick={toggleOptions}
          title="设置"
        >
          <FiSettings />
          设置
        </button>
        {results.length > 0 && (
          <>
            <button
              className={styles.toolButton}
              onClick={handleDownload}
              title="下载链接"
            >
              <FiDownload />
              下载
            </button>
            <button
              className={styles.toolButton}
              onClick={handleClear}
              title="清空"
            >
              <FiRotateCcw />
              清空
            </button>
          </>
        )}
      </div>

      {showOptions && (
        <div className={styles.optionsPanel}>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeExternal}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    includeExternal: e.target.checked,
                  })
                }
              />
              包含外部链接
            </label>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeResources}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    includeResources: e.target.checked,
                  })
                }
              />
              包含资源链接
            </label>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeSocial}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    includeSocial: e.target.checked,
                  })
                }
              />
              包含社交链接
            </label>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>链接匹配规则（可选）</label>
            <input
              type="text"
              className={styles.input}
              value={options.pattern || ''}
              onChange={(e) =>
                setOptions({
                  ...options,
                  pattern: e.target.value,
                })
              }
              placeholder="输入正则表达式"
            />
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>最大深度：</label>
            <input
              type="number"
              className={styles.input}
              value={options.maxDepth}
              onChange={(e) =>
                setOptions({
                  ...options,
                  maxDepth: parseInt(e.target.value) || 1,
                })
              }
              min="1"
              max="10"
            />
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <FiAlertCircle />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                <div className={styles.resultTitle}>
                  <span className={styles.linkIcon}>
                    {getLinkTypeIcon(result.type)}
                  </span>
                  <h3>{result.title || result.text || result.url}</h3>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkButton}
                  >
                    <FiExternalLink />
                  </a>
                </div>
                <div className={styles.resultContent}>
                  <div className={styles.linkInfo}>
                    <span className={styles.linkType}>{result.type}</span>
                    {result.fileType && (
                      <span className={styles.fileType}>{result.fileType}</span>
                    )}
                    {result.fileSize && (
                      <span className={styles.fileSize}>{result.fileSize}</span>
                    )}
                  </div>
                  <div className={styles.linkUrl}>{result.url}</div>
                  <button
                    className={`${styles.copyButton} ${copied ? styles.success : ''}`}
                    onClick={() => handleCopy(result.url)}
                    title="复制链接"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
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
          <li>直接点击"提取链接"获取当前页面的所有链接</li>
          <li>可以按类型筛选链接（内部链接、外部链接、资源链接等）</li>
          <li>支持使用正则表达式匹配特定链接</li>
          <li>可以递归爬取链接（设置最大深度）</li>
          <li>支持下载所有提取的链接</li>
          <li>自动识别链接类型和资源信息</li>
        </ul>
      </div>
    </div>
  );
};

export default LinkCrawler;
