import React, { useState } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import {
  convertJsonToYaml,
  convertJsonToXml,
  validateJson,
} from '@/utils/jsonUtils';

type ConvertType = 'yaml' | 'xml';

export const JsonConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [convertType, setConvertType] = useState<ConvertType>('yaml');
  const [error, setError] = useState('');

  const handleConvert = () => {
    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    try {
      let result = '';
      if (convertType === 'yaml') {
        result = convertJsonToYaml(input);
      } else {
        result = convertJsonToXml(input);
      }
      setOutput(result);
      setError('');
    } catch (err) {
      setError('转换过程中发生错误');
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
        <select
          className={styles.select}
          value={convertType}
          onChange={(e) => setConvertType(e.target.value as ConvertType)}
        >
          <option value="yaml">转换为 YAML</option>
          <option value="xml">转换为 XML</option>
        </select>
        <button
          className={styles.toolButton}
          onClick={handleConvert}
          title="转换 JSON"
        >
          转换
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

      <div className={styles.convertContainer}>
        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
              setOutput('');
            }}
            placeholder="在此输入 JSON..."
            spellCheck={false}
          />
        </div>

        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={output}
            readOnly
            placeholder={`转换后的 ${convertType.toUpperCase()} 将显示在这里...`}
            spellCheck={false}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
