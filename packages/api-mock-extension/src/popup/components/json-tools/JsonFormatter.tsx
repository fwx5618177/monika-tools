import React, { useState, useCallback, useMemo } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import { formatJson, minifyJson, validateJson } from '@/utils/jsonUtils';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface JsonStats {
  totalKeys: number;
  totalObjects: number;
  totalArrays: number;
  totalStrings: number;
  totalNumbers: number;
  totalBooleans: number;
  totalNull: number;
  maxDepth: number;
  uniqueKeys: Map<string, { type: string; count: number }>;
}

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<JsonStats | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const analyzeJson = useCallback((obj: any, depth = 0, stats: JsonStats) => {
    if (Array.isArray(obj)) {
      stats.totalArrays++;
      obj.forEach((item) => analyzeJson(item, depth + 1, stats));
    } else if (typeof obj === 'object' && obj !== null) {
      stats.totalObjects++;
      Object.entries(obj).forEach(([key, value]) => {
        stats.totalKeys++;
        const type = Array.isArray(value) ? 'array' : typeof value;
        const keyStats = stats.uniqueKeys.get(key) || { type, count: 0 };
        keyStats.count++;
        stats.uniqueKeys.set(key, keyStats);
        analyzeJson(value, depth + 1, stats);
      });
    } else {
      switch (typeof obj) {
        case 'string':
          stats.totalStrings++;
          break;
        case 'number':
          stats.totalNumbers++;
          break;
        case 'boolean':
          stats.totalBooleans++;
          break;
      }
      if (obj === null) stats.totalNull++;
    }
    stats.maxDepth = Math.max(stats.maxDepth, depth);
  }, []);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      setOutput('');
      setStats(null);
      return;
    }

    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      setOutput('');
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');

      const newStats: JsonStats = {
        totalKeys: 0,
        totalObjects: 0,
        totalArrays: 0,
        totalStrings: 0,
        totalNumbers: 0,
        totalBooleans: 0,
        totalNull: 0,
        maxDepth: 0,
        uniqueKeys: new Map(),
      };
      analyzeJson(parsed, 0, newStats);
      setStats(newStats);
    } catch (e) {
      setError('无效的 JSON 格式');
      setOutput('');
      setStats(null);
    }
  }, [input, analyzeJson]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      setOutput('');
      setStats(null);
      return;
    }

    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      setOutput('');
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (e) {
      setError('无效的 JSON 格式');
      setOutput('');
      setStats(null);
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
  }, []);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error('复制失败:', e);
    }
  }, []);

  const handleCopyKey = useCallback(
    async (key: string) => {
      try {
        const parsed = JSON.parse(input);
        const value = JSON.stringify(parsed[key], null, 2);
        await navigator.clipboard.writeText(value);
      } catch (e) {
        console.error('复制失败:', e);
      }
    },
    [input]
  );

  return (
    <div>
      <div className={styles.toolbar}>
        <button className={styles.toolButton} onClick={handleFormat}>
          格式化
        </button>
        <button className={styles.toolButton} onClick={handleMinify}>
          压缩
        </button>
        <button className={styles.toolButton} onClick={handleClear}>
          清空
        </button>
      </div>

      <div className={styles.editorContainer}>
        <textarea
          className={styles.editor}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入 JSON 数据..."
          spellCheck={false}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {stats && (
        <div className={styles.jsonStats}>
          <h3>JSON 统计信息</h3>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <div className={styles.label}>总键值对数量</div>
              <div className={styles.value}>{stats.totalKeys}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>对象数量</div>
              <div className={styles.value}>{stats.totalObjects}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>数组数量</div>
              <div className={styles.value}>{stats.totalArrays}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>字符串数量</div>
              <div className={styles.value}>{stats.totalStrings}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>数字数量</div>
              <div className={styles.value}>{stats.totalNumbers}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>布尔值数量</div>
              <div className={styles.value}>{stats.totalBooleans}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>null 值数量</div>
              <div className={styles.value}>{stats.totalNull}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.label}>最大嵌套深度</div>
              <div className={styles.value}>{stats.maxDepth}</div>
            </div>
          </div>

          <div className={styles.keyList}>
            <h3>键值列表</h3>
            {Array.from(stats.uniqueKeys.entries()).map(
              ([key, { type, count }]) => (
                <div key={key} className={styles.keyItem}>
                  <span className={styles.keyName}>{key}</span>
                  <span className={styles.keyType}>
                    {type} ({count})
                  </span>
                  <button
                    className={styles.copyButton}
                    onClick={() => handleCopyKey(key)}
                    title="复制该键的值"
                  >
                    <FiCopy size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {output && (
        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={output}
            readOnly
            placeholder="格式化结果..."
            spellCheck={false}
          />
          <button
            className={`${styles.copyButton} ${copySuccess ? styles.success : ''}`}
            onClick={() => handleCopy(output)}
            title="复制到剪贴板"
          >
            {copySuccess ? <FiCheck size={16} /> : <FiCopy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};
