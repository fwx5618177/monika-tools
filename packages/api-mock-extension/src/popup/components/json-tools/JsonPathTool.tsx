import React, { useState, useCallback } from 'react';
import styles from '../styles/components/JsonTools.module.scss';
import {
  FiSearch,
  FiCopy,
  FiCheck,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { validateJson } from '@/utils/jsonUtils';
import jsonpath from 'jsonpath';

const examples = [
  {
    path: '$.store.book[*].author',
    description: '获取所有书籍的作者',
  },
  {
    path: '$.store.book[?(@.price < 10)]',
    description: '获取价格小于 10 的书籍',
  },
  {
    path: '$.store.book[-1:]',
    description: '获取最后一本书',
  },
  {
    path: '$.store.book[0,1]',
    description: '获取前两本书',
  },
];

export const JsonPathTool: React.FC = () => {
  const [json, setJson] = useState('');
  const [path, setPath] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleQuery = useCallback(() => {
    if (!validateJson(json)) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    try {
      const parsedJson = JSON.parse(json);
      const queryResult = jsonpath.query(parsedJson, path);
      setResult(JSON.stringify(queryResult, null, 2));
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('JSONPath 查询失败，请检查路径格式是否正确');
      setResult('');
    }
  }, [json, path]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setJson('');
    setPath('');
    setResult('');
    setError('');
    setSuccess(false);
  }, []);

  const handleExampleClick = useCallback((examplePath: string) => {
    setPath(examplePath);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.pathInput}
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="输入 JSONPath 表达式，例如: $.store.book[*].author"
        />
        <button
          className={styles.primaryButton}
          onClick={handleQuery}
          disabled={!json || !path}
        >
          <FiSearch />
          查询
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!json && !path && !result}
        >
          <FiRotateCcw />
          清空
        </button>
      </div>

      <div className={styles.splitView}>
        <div className={styles.editorContainer}>
          <textarea
            className={`${styles.editor} ${error ? styles.error : ''}`}
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setError('');
              setSuccess(false);
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
            placeholder="查询结果将显示在这里..."
            spellCheck={false}
          />
          {result && (
            <button
              className={`${styles.copyButton} ${copied ? styles.success : ''}`}
              onClick={handleCopy}
              title="复制到剪贴板"
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle /> {error}
        </div>
      )}

      {success && !error && (
        <div className={styles.success}>
          <FiCheckCircle /> 查询成功
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 常用示例
        </h4>
        <ul>
          {examples.map((example, index) => (
            <li
              key={index}
              onClick={() => handleExampleClick(example.path)}
              style={{ cursor: 'pointer' }}
            >
              <code>{example.path}</code>
              {example.description}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 语法说明
        </h4>
        <ul>
          <li>
            <code>$</code> 根节点
          </li>
          <li>
            <code>.</code> 子节点
          </li>
          <li>
            <code>[]</code> 数组下标
          </li>
          <li>
            <code>[*]</code> 所有数组元素
          </li>
          <li>
            <code>[start:end]</code> 数组切片
          </li>
          <li>
            <code>[?(@.key)]</code> 过滤表达式
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JsonPathTool;
