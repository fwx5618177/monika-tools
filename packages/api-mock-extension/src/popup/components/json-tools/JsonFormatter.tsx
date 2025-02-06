import React, { useState } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import { formatJson, minifyJson, validateJson } from '@/utils/jsonUtils';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    if (!input.trim()) {
      setError('请输入要格式化的 JSON');
      return;
    }

    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    try {
      const formatted = formatJson(input);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('格式化过程中发生错误');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError('请输入要压缩的 JSON');
      return;
    }

    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError('压缩过程中发生错误');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          className={styles.toolButton}
          onClick={handleFormat}
          title="格式化 JSON"
        >
          格式化
        </button>
        <button
          className={styles.toolButton}
          onClick={handleMinify}
          title="压缩 JSON"
        >
          压缩
        </button>
        <button
          className={styles.toolButton}
          onClick={handleCopy}
          title="复制结果"
          disabled={!output}
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

      <div className={styles.formatterContainer}>
        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
              setOutput('');
            }}
            placeholder="在此输入要格式化的 JSON..."
            spellCheck={false}
          />
        </div>

        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={output}
            readOnly
            placeholder="格式化后的结果将显示在这里..."
            spellCheck={false}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
