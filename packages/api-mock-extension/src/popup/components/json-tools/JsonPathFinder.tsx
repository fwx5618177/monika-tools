import React, { useState } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import { findJsonPath, validateJson } from '@/utils/jsonUtils';

export const JsonPathFinder: React.FC = () => {
  const [input, setInput] = useState('');
  const [path, setPath] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFind = () => {
    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    if (!path.trim()) {
      setError('请输入 JSONPath 表达式');
      return;
    }

    try {
      const value = findJsonPath(input, path);
      setResult(JSON.stringify(value, null, 2));
      setError('');
    } catch (err) {
      setError('查找过程中发生错误，请检查 JSONPath 表达式是否正确');
    }
  };

  const handleClear = () => {
    setInput('');
    setPath('');
    setResult('');
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.pathInput}
          value={path}
          onChange={(e) => {
            setPath(e.target.value);
            setError('');
            setResult('');
          }}
          placeholder="输入 JSONPath 表达式 (例如: $.store.book[0].title)"
        />
        <button
          className={styles.toolButton}
          onClick={handleFind}
          title="查找值"
        >
          查找
        </button>
        <button
          className={styles.toolButton}
          onClick={handleCopy}
          title="复制结果"
          disabled={!result}
        >
          复制
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          title="清空内容"
        >
          清空
        </button>
      </div>

      <div className={styles.pathFinderContainer}>
        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
              setResult('');
            }}
            placeholder="在此输入 JSON..."
            spellCheck={false}
          />
        </div>

        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={result}
            readOnly
            placeholder="查找结果将显示在这里..."
            spellCheck={false}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.helpText}>
        <h4>JSONPath 语法说明：</h4>
        <ul>
          <li>
            <code>$</code> - 根对象
          </li>
          <li>
            <code>.</code> - 子元素
          </li>
          <li>
            <code>[]</code> - 数组索引
          </li>
          <li>
            <code>[*]</code> - 所有数组元素
          </li>
          <li>
            <code>..</code> - 递归查找
          </li>
          <li>
            <code>[?(@.price{'>'} 10)]</code> - 过滤表达式
          </li>
        </ul>
      </div>
    </div>
  );
};
