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
  FiTable,
  FiCode,
  FiDatabase,
} from 'react-icons/fi';

interface DataResult {
  type: 'table' | 'json' | 'api';
  selector?: string;
  endpoint?: string;
  data: any;
  format: string;
  size: string;
  rows?: number;
  columns?: number;
}

interface CrawlOptions {
  types: ('table' | 'json' | 'api')[];
  format: 'json' | 'csv' | 'excel';
  includeHeaders: boolean;
  followPagination: boolean;
  maxPages: number;
  delay: number;
}

export const DataCrawler: React.FC = () => {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [results, setResults] = useState<DataResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<CrawlOptions>({
    types: ['table', 'json', 'api'],
    format: 'json',
    includeHeaders: true,
    followPagination: false,
    maxPages: 1,
    delay: 1000,
  });

  const handleCrawl = useCallback(async () => {
    if (!url) {
      setError('请输入网址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 发送消息给 background script 执行爬取
      const response = await chrome.runtime.sendMessage({
        type: 'CRAWL_DATA',
        payload: {
          url,
          selector,
          options,
        },
      });

      if (response.error) {
        setError(response.error);
      } else {
        setResults(response.results);
      }
    } catch (err) {
      setError('爬取失败，请检查网址是否正确');
    } finally {
      setLoading(false);
    }
  }, [url, selector, options]);

  const handleDownload = useCallback(
    async (result: DataResult) => {
      try {
        let content = '';
        let type = '';
        let filename = '';

        switch (options.format) {
          case 'json':
            content = JSON.stringify(result.data, null, 2);
            type = 'application/json';
            filename = 'data.json';
            break;
          case 'csv':
            // 简单的 CSV 转换
            if (Array.isArray(result.data)) {
              const headers = Object.keys(result.data[0]);
              content = headers.join(',') + '\n';
              content += result.data
                .map((row) => headers.map((key) => row[key]).join(','))
                .join('\n');
            }
            type = 'text/csv';
            filename = 'data.csv';
            break;
          case 'excel':
            // 这里需要添加 Excel 转换逻辑
            content = JSON.stringify(result.data);
            type = 'application/vnd.ms-excel';
            filename = 'data.xlsx';
            break;
        }

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError('下载失败');
      }
    },
    [options.format]
  );

  const handleClear = useCallback(() => {
    setUrl('');
    setSelector('');
    setResults([]);
    setError('');
  }, []);

  const getDataIcon = (type: DataResult['type']) => {
    switch (type) {
      case 'table':
        return <FiTable />;
      case 'json':
        return <FiCode />;
      case 'api':
        return <FiDatabase />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.input}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="输入网址，例如: https://example.com"
        />
        <input
          type="text"
          className={styles.input}
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="输入选择器（可选），例如: table, .data-grid"
        />
        <button
          className={styles.toolButton}
          onClick={() => setShowOptions(!showOptions)}
        >
          <FiSettings />
          选项
        </button>
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={loading}
        >
          <FiSearch />
          {loading ? '爬取中...' : '开始爬取'}
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!url && !results.length}
        >
          <FiRotateCcw />
          清空
        </button>
      </div>

      {showOptions && (
        <div className={styles.options}>
          <div className={styles.optionGroup}>
            <h4>数据类型</h4>
            {(['table', 'json', 'api'] as const).map((type) => (
              <label key={type} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={options.types.includes(type)}
                  onChange={(e) => {
                    const types = e.target.checked
                      ? [...options.types, type]
                      : options.types.filter((t) => t !== type);
                    setOptions({ ...options, types });
                  }}
                />
                {type === 'table' && '表格数据'}
                {type === 'json' && 'JSON 数据'}
                {type === 'api' && 'API 数据'}
              </label>
            ))}
          </div>
          <div className={styles.optionGroup}>
            <h4>导出格式</h4>
            <select
              value={options.format}
              onChange={(e) =>
                setOptions({
                  ...options,
                  format: e.target.value as CrawlOptions['format'],
                })
              }
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className={styles.optionGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={options.includeHeaders}
                onChange={(e) =>
                  setOptions({ ...options, includeHeaders: e.target.checked })
                }
              />
              包含表头
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={options.followPagination}
                onChange={(e) =>
                  setOptions({ ...options, followPagination: e.target.checked })
                }
              />
              跟随分页
            </label>
          </div>
          {options.followPagination && (
            <div className={styles.optionGroup}>
              <label>
                最大页数：
                <input
                  type="number"
                  min="1"
                  value={options.maxPages}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      maxPages: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </label>
              <label>
                页面延迟（毫秒）：
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={options.delay}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      delay: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </label>
            </div>
          )}
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
          <div className={styles.resultsHeader}>
            <h3>爬取结果</h3>
          </div>
          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultType}>
                    {getDataIcon(result.type)}
                    <span>
                      {result.type === 'table' && '表格数据'}
                      {result.type === 'json' && 'JSON 数据'}
                      {result.type === 'api' && 'API 数据'}
                    </span>
                  </div>
                  <div className={styles.resultInfo}>
                    {result.selector && <code>{result.selector}</code>}
                    {result.endpoint && <code>{result.endpoint}</code>}
                    <span>{result.format}</span>
                    <span>{result.size}</span>
                    {result.rows && (
                      <span>
                        {result.rows} 行 × {result.columns} 列
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.resultPreview}>
                  <pre>
                    {typeof result.data === 'string'
                      ? result.data
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
                <div className={styles.resultActions}>
                  <button
                    className={styles.toolButton}
                    onClick={() => handleDownload(result)}
                    title="下载数据"
                  >
                    <FiDownload />
                    下载
                  </button>
                  <button
                    className={styles.toolButton}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(result.data, null, 2)
                      );
                    }}
                    title="复制数据"
                  >
                    <FiCopy />
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
          <li>输入要爬取的网页地址</li>
          <li>可选择性输入数据元素的选择器</li>
          <li>支持表格、JSON 和 API 数据的提取</li>
          <li>可以设置是否跟随分页和最大页数</li>
          <li>支持导出为 JSON、CSV 和 Excel 格式</li>
          <li>自动识别数据结构和类型</li>
        </ul>
      </div>
    </div>
  );
};

export default DataCrawler;
